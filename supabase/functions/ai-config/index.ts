/**
 * Supabase Edge Function: ai-config
 *
 * Manages AI model configurations, API keys, and usage stats.
 * Actions: get_config, save_config, get_usage, validate_key, get_daily_usage
 *
 * Deploy: supabase functions deploy ai-config
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.99.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Available models catalog
const MODEL_CATALOG = [
  {
    provider: 'google',
    models: [
      { name: 'gemini-3.1-pro', display: 'Gemini 3.1 Pro', description: 'Model mạnh nhất, reasoning tốt nhất', maxTokens: 1048576, tier: 'pro' },
      { name: 'gemini-3.0-flash', display: 'Gemini 3.0 Flash', description: 'Nhanh, phù hợp tác vụ đơn giản', maxTokens: 1048576, tier: 'free' },
      { name: 'gemini-2.0-flash', display: 'Gemini 2.0 Flash', description: 'Phiên bản cũ, ổn định', maxTokens: 1048576, tier: 'free' },
    ]
  },
  {
    provider: 'openai',
    models: [
      { name: 'gpt-4o', display: 'GPT-4o', description: 'Model đa năng của OpenAI', maxTokens: 128000, tier: 'pro' },
      { name: 'gpt-4o-mini', display: 'GPT-4o Mini', description: 'Nhỏ gọn, tiết kiệm', maxTokens: 128000, tier: 'free' },
    ]
  },
  {
    provider: 'anthropic',
    models: [
      { name: 'claude-sonnet-4-20250514', display: 'Claude Sonnet 4', description: 'Cân bằng tốc độ & chất lượng, phù hợp pipeline', maxTokens: 200000, tier: 'pro' },
      { name: 'claude-3-5-haiku-20241022', display: 'Claude 3.5 Haiku', description: 'Nhanh nhất, tiết kiệm chi phí', maxTokens: 200000, tier: 'free' },
      { name: 'claude-3-5-sonnet-20241022', display: 'Claude 3.5 Sonnet', description: 'Thế hệ trước, ổn định', maxTokens: 200000, tier: 'pro' },
    ]
  }
]

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth verification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, ...params } = await req.json()

    switch (action) {
      // ── Get current config ─────────────────────────────────────
      case 'get_config': {
        const { data: config } = await supabase
          .from('ai_configs')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single()

        // Get total usage
        const { data: usageData } = await supabase
          .from('ai_usage_logs')
          .select('total_tokens')
          .eq('user_id', user.id)

        const totalUsed = usageData?.reduce((sum: number, log: { total_tokens: number }) => sum + (log.total_tokens || 0), 0) || 0

        return new Response(
          JSON.stringify({
            config: config || null,
            totalUsedTokens: totalUsed,
            catalog: MODEL_CATALOG,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // ── Save/update config ─────────────────────────────────────
      case 'save_config': {
        const { provider, model_name, display_name, api_key, token_limit } = params

        if (!provider || !model_name || !api_key) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields: provider, model_name, api_key' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Upsert config (one per user per provider)
        const { data, error } = await supabase
          .from('ai_configs')
          .upsert(
            {
              user_id: user.id,
              provider,
              model_name,
              display_name: display_name || model_name,
              api_key,
              token_limit: token_limit || 1000000,
              is_active: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,provider' }
          )
          .select()
          .single()

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Also set as Supabase secret if it's google (for backward compat)
        // This is handled client-side or manually

        return new Response(
          JSON.stringify({ success: true, config: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // ── Get usage stats ────────────────────────────────────────
      case 'get_usage': {
        // Total usage
        const { data: allUsage } = await supabase
          .from('ai_usage_logs')
          .select('input_tokens, output_tokens, total_tokens, phase, model_name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(500)

        // Aggregate stats
        const totalInput = allUsage?.reduce((s: number, l: { input_tokens: number }) => s + (l.input_tokens || 0), 0) || 0
        const totalOutput = allUsage?.reduce((s: number, l: { output_tokens: number }) => s + (l.output_tokens || 0), 0) || 0
        const totalTokens = allUsage?.reduce((s: number, l: { total_tokens: number }) => s + (l.total_tokens || 0), 0) || 0

        // Daily usage for last 7 days
        const dailyUsage: Record<string, number> = {}
        const now = new Date()
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(d.getDate() - i)
          const key = d.toISOString().slice(0, 10)
          dailyUsage[key] = 0
        }
        allUsage?.forEach((log: { total_tokens: number; created_at: string }) => {
          const day = log.created_at.slice(0, 10)
          if (dailyUsage[day] !== undefined) {
            dailyUsage[day] += log.total_tokens || 0
          }
        })

        // Phase breakdown
        const phaseBreakdown: Record<string, number> = {}
        allUsage?.forEach((log: { phase: string; total_tokens: number }) => {
          phaseBreakdown[log.phase] = (phaseBreakdown[log.phase] || 0) + (log.total_tokens || 0)
        })

        return new Response(
          JSON.stringify({
            totalInput,
            totalOutput,
            totalTokens,
            callCount: allUsage?.length || 0,
            dailyUsage,
            phaseBreakdown,
            recentLogs: allUsage?.slice(0, 20) || [],
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // ── Validate API key ───────────────────────────────────────
      case 'validate_key': {
        const { api_key: testKey, provider: testProvider } = params

        if (!testKey) {
          return new Response(
            JSON.stringify({ error: 'Missing api_key' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        try {
          if (testProvider === 'openai') {
            // Test OpenAI key
            const res = await fetch('https://api.openai.com/v1/models', {
              headers: { 'Authorization': `Bearer ${testKey}` },
            })
            const valid = res.ok
            return new Response(
              JSON.stringify({ valid, message: valid ? 'API key hợp lệ!' : 'API key không hợp lệ' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          } else if (testProvider === 'anthropic') {
            // Test Anthropic key
            const res = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': testKey,
                'anthropic-version': '2023-06-01',
              },
              body: JSON.stringify({
                model: 'claude-3-5-haiku-20241022',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'hi' }],
              }),
            })
            // 200 = valid, 401 = invalid key, other = might be valid but rate limited
            const valid = res.ok || res.status === 429
            return new Response(
              JSON.stringify({ valid, message: valid ? 'API key hợp lệ!' : 'API key không hợp lệ' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          } else {
            // Test Google Gemini key
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models?key=${testKey}`
            )
            const valid = res.ok
            return new Response(
              JSON.stringify({ valid, message: valid ? 'API key hợp lệ!' : 'API key không hợp lệ' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        } catch {
          return new Response(
            JSON.stringify({ valid: false, message: 'Không thể kiểm tra API key' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
