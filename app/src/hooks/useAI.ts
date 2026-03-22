/**
 * useAI Hook — Client-side SSE streaming for Gemini AI integration.
 *
 * Connects to Supabase Edge Function `ai-pipeline` via SSE,
 * streams AI-generated content in real-time, and provides save functionality.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Stage } from '../lib/pipelineRegistry'

interface UseAIOptions {
  onChunk?: (chunk: string) => void
  onComplete?: (fullOutput: string) => void
  onError?: (error: string) => void
}

interface UseAIReturn {
  streaming: boolean
  output: string
  error: string | null
  progress: 'idle' | 'streaming' | 'done' | 'error'
  runPhase: (phase: Stage | string, projectId: string, input: string, patternGroup?: string, step?: number, storyPattern?: string) => Promise<void>
  reset: () => void
  saveOutput: (projectId: string, phase: Stage | string, content: string) => Promise<{ error: string | null }>
  abort: () => void
}

export function useAI(options: UseAIOptions = {}): UseAIReturn {
  const [streaming, setStreaming] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<'idle' | 'streaming' | 'done' | 'error'>('idle')
  const abortRef = useRef<AbortController | null>(null)

  // Stable refs for callbacks to avoid re-creating runPhase on every render
  const onChunkRef = useRef(options.onChunk)
  const onCompleteRef = useRef(options.onComplete)
  const onErrorRef = useRef(options.onError)
  useEffect(() => {
    onChunkRef.current = options.onChunk
    onCompleteRef.current = options.onComplete
    onErrorRef.current = options.onError
  }, [options.onChunk, options.onComplete, options.onError])

  const reset = useCallback(() => {
    setOutput('')
    setError(null)
    setProgress('idle')
    setStreaming(false)
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }, [])

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setStreaming(false)
    setProgress('done')
  }, [])

  const runPhase = useCallback(async (
    phase: Stage | string,
    projectId: string,
    input: string,
    patternGroup?: string,
    step?: number,
    storyPattern?: string
  ) => {
    // Reset state
    setOutput('')
    setError(null)
    setStreaming(true)
    setProgress('streaming')

    // Create abort controller
    const controller = new AbortController()
    abortRef.current = controller

    try {
      // Get fresh auth token — refreshSession() ensures we have a valid JWT
      let accessToken = ''
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        accessToken = session.access_token
      }
      // Always try to refresh to avoid stale tokens
      const { data: refreshData } = await supabase.auth.refreshSession()
      if (refreshData?.session?.access_token) {
        accessToken = refreshData.session.access_token
      }
      if (!accessToken) {
        throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.')
      }

      // Get Supabase URL and anon key from the client
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const functionUrl = `${supabaseUrl}/functions/v1/ai-pipeline`

      const requestBody = JSON.stringify({
        phase,
        projectId,
        input,
        patternGroup: patternGroup || 'FURY',
        ...(step !== undefined && { step }),
        ...(storyPattern && { storyPattern }),
      })

      let response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'apikey': supabaseAnonKey,
        },
        body: requestBody,
        signal: controller.signal,
      })

      // Retry once on 401 with a freshly refreshed token
      if (response.status === 401) {
        const { data: retryRefresh } = await supabase.auth.refreshSession()
        const retryToken = retryRefresh?.session?.access_token
        if (!retryToken) {
          throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.')
        }
        response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${retryToken}`,
            'apikey': supabaseAnonKey,
          },
          body: requestBody,
          signal: controller.signal,
        })
      }

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Server error: ${response.status} — ${errText}`)
      }

      // Read SSE stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let fullOutput = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        // Parse SSE events
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              continue
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                fullOutput += parsed.text
                setOutput(prev => prev + parsed.text)
                onChunkRef.current?.(parsed.text)
              }
              if (parsed.error) {
                throw new Error(parsed.error)
              }
            } catch (e) {
              // If not JSON, treat as raw text
              if (!data.startsWith('{')) {
                fullOutput += data
                setOutput(prev => prev + data)
                onChunkRef.current?.(data)
              }
            }
          }
        }
      }

      setProgress('done')
      setStreaming(false)
      onCompleteRef.current?.(fullOutput)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled — not an error
        setProgress('done')
      } else {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        setProgress('error')
        onErrorRef.current?.(message)
      }
      setStreaming(false)
    }
  }, [])

  const saveOutput = useCallback(async (
    projectId: string,
    phase: Stage | string,
    content: string
  ): Promise<{ error: string | null }> => {
    try {
      switch (phase) {
        case 'evaluate':
        case 'idea': {
          // Find the idea_id from the project
          const { data: project } = await supabase
            .from('video_projects')
            .select('idea_id')
            .eq('id', projectId)
            .single()
          const ideaId = project?.idea_id
          if (!ideaId) {
            return { error: 'Project chưa liên kết với idea nào' }
          }

          // ── Parse scores from AI markdown output ──
          let totalScore: number | null = null
          let patternScore: number | null = null
          let redFlags: string | null = null

          // Debug: log content for visibility (will be removed later)
          console.log('[AI Eval] Parsing scores from output, length:', content.length)

          // Try multiple patterns to extract total score
          // Handles: "76.5/100", "**85**/100", "TỔNG ĐIỂM: 85/100", "📊 TỔNG ĐIỂM: **76.5/100**"
          const NUM = '(\\d+\\.?\\d*)'  // matches integers and decimals
          const totalPatterns = [
            new RegExp(`TỔNG\\s*ĐIỂM[^\\d]*${NUM}\\s*/\\s*100`, 'i'),
            new RegExp(`📊[^\\d]*${NUM}\\s*/\\s*100`),
            new RegExp(`total[\\s_]?score[^\\d]*${NUM}`, 'i'),
            new RegExp(`${NUM}\\s*/\\s*100\\s*điểm`, 'i'),
            new RegExp(`\\*\\*${NUM}\\s*/\\s*100\\*\\*`),   // **85/100**
            new RegExp(`${NUM}\\s*/\\s*100`),             // any X/100
            new RegExp(`${NUM}\\s*điểm`, 'i'),           // "89 điểm"
          ]
          for (const pat of totalPatterns) {
            const m = content.match(pat)
            if (m) {
              const n = Math.round(parseFloat(m[1]))
              console.log('[AI Eval] Total score match:', m[0], '→', n)
              if (n >= 0 && n <= 100) { totalScore = n; break }
            }
          }

          // Pattern-specific score: "TỔNG PATTERN-SPECIFIC: 32/40" or "Pattern Score: 32/40"
          const patternPatterns = [
            new RegExp(`PATTERN[\\s-]*SPECIFIC[^\\d]*${NUM}\\s*/\\s*40`, 'i'),
            new RegExp(`pattern\\s*score[^\\d]*${NUM}`, 'i'),
            new RegExp(`FURY[^\\d]*${NUM}\\s*/\\s*40`, 'i'),
            new RegExp(`STRATEGY[^\\d]*${NUM}\\s*/\\s*40`, 'i'),
            new RegExp(`COMEDY[^\\d]*${NUM}\\s*/\\s*40`, 'i'),
            new RegExp(`${NUM}\\s*/\\s*40`, 'i'),  // last resort
          ]
          for (const pat of patternPatterns) {
            const m = content.match(pat)
            if (m) {
              const n = Math.round(parseFloat(m[1]))
              console.log('[AI Eval] Pattern score match:', m[0], '→', n)
              if (n >= 0 && n <= 40) { patternScore = n; break }
            }
          }

          // If we have total but not pattern, try to derive from universal score
          if (totalScore !== null && patternScore === null) {
            const univPatterns = [
              new RegExp(`TỔNG\\s*UNIVERSAL[^\\d]*${NUM}\\s*/\\s*60`, 'i'),
              new RegExp(`universal[^\\d]*${NUM}\\s*/\\s*60`, 'i'),
              new RegExp(`${NUM}\\s*/\\s*60`),
            ]
            for (const pat of univPatterns) {
              const m = content.match(pat)
              if (m) {
                const n = Math.round(parseFloat(m[1]))
                console.log('[AI Eval] Universal score match:', m[0], '→', n, ', deriving pattern:', totalScore - n)
                if (n >= 0 && n <= 60) { patternScore = totalScore - n; break }
              }
            }
          }

          console.log('[AI Eval] Final parsed — total:', totalScore, 'pattern:', patternScore)

          // Extract red flags section
          const rfMatch = content.match(/red\s*flags?\s*(?:phát hiện|detected)?[:\s]*([\s\S]*?)(?=###|##\s+💡|##\s+✅|##\s+GỢI Ý|$)/i)
          if (rfMatch) {
            const flags = rfMatch[1].trim()
            // Only save if there's meaningful content (not just "Không" or empty)
            if (flags && flags.length > 5 && !/^không\s*có/i.test(flags) && !/^none/i.test(flags)) {
              redFlags = flags.slice(0, 1000) // Cap at 1000 chars
            }
          }

          const { data: { user } } = await supabase.auth.getUser()
          const { error } = await supabase
            .from('idea_evaluations')
            .insert({
              idea_id: ideaId,
              total_score: totalScore,
              hoa_pattern_score: patternScore,
              red_flags: redFlags,
              notes: content,
              evaluated_by: user?.id || null,
            })

          // Also update idea status to 'evaluated'
          if (!error) {
            await supabase
              .from('ideas')
              .update({ status: 'evaluated', updated_at: new Date().toISOString() })
              .eq('id', ideaId)
          }

          return { error: error?.message || null }
        }
        case 'improve': {
          // Find the idea_id from the project
          const { data: proj } = await supabase
            .from('video_projects')
            .select('idea_id')
            .eq('id', projectId)
            .single()
          const ideaId = proj?.idea_id
          if (!ideaId) {
            return { error: 'Project chưa liên kết với idea nào' }
          }

          // Parse JSON block from AI output
          let updateData: Record<string, unknown> = {}
          const jsonMatch = content.match(/```json\s*([\s\S]*?)```/)
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[1].trim())
              console.log('[AI Improve] Parsed JSON:', Object.keys(parsed))

              // Build update object
              if (parsed.improved_title) updateData.title = parsed.improved_title
              if (parsed.improved_description) updateData.description = parsed.improved_description

              // Build idea_data from parsed fields
              const ideaData: Record<string, unknown> = {}
              if (parsed.improved_one_liner) ideaData.one_liner = parsed.improved_one_liner
              if (parsed.improved_hero) ideaData.hero = parsed.improved_hero
              if (parsed.improved_villain) ideaData.villain = parsed.improved_villain
              if (parsed.improved_villain_line) ideaData.villain_line = parsed.improved_villain_line
              if (parsed.improved_hook) ideaData.hook = parsed.improved_hook
              if (parsed.improved_wtf_concept) ideaData.wtf_concept = parsed.improved_wtf_concept
              if (parsed.improved_escalation) ideaData.escalation = parsed.improved_escalation
              if (parsed.improved_key_twists) ideaData.key_twists = parsed.improved_key_twists
              if (parsed.improved_payoff) ideaData.payoff = parsed.improved_payoff
              if (parsed.improved_concrete_numbers) ideaData.concrete_numbers = parsed.improved_concrete_numbers
              if (parsed.improved_titles) ideaData.title_suggestions = parsed.improved_titles
              if (parsed.improved_comment_trigger) ideaData.comment_trigger = parsed.improved_comment_trigger
              if (parsed.improved_dual_themes) ideaData.dual_themes = parsed.improved_dual_themes

              if (Object.keys(ideaData).length > 0) {
                // Merge with existing idea_data
                const { data: existingIdea } = await supabase
                  .from('ideas')
                  .select('idea_data')
                  .eq('id', ideaId)
                  .single()
                updateData.idea_data = { ...(existingIdea?.idea_data || {}), ...ideaData }
              }
            } catch (e) {
              console.error('[AI Improve] JSON parse failed:', e)
            }
          }

          // Fallback: try regex parsing if no JSON found
          if (!updateData.title) {
            const titleMatch = content.match(/improved[_ ]?title[:\s]*["']?([^\n"']+)/i)
            if (titleMatch) updateData.title = titleMatch[1].trim()
          }

          if (Object.keys(updateData).length === 0) {
            return { error: 'Không parse được kết quả cải thiện từ AI output' }
          }

          updateData.updated_at = new Date().toISOString()

          const { error } = await supabase
            .from('ideas')
            .update(updateData)
            .eq('id', ideaId)

          console.log('[AI Improve] Updated idea:', ideaId, 'fields:', Object.keys(updateData))
          return { error: error?.message || null }
        }
        case 'outline': {
          const { error } = await supabase
            .from('outlines')
            .upsert(
              { project_id: projectId, content, updated_at: new Date().toISOString() },
              { onConflict: 'project_id' }
            )
          if (error) {
            // Fallback to insert if upsert fails
            const { error: insertError } = await supabase
              .from('outlines')
              .insert({ project_id: projectId, content })
            return { error: insertError?.message || null }
          }
          return { error: null }
        }
        case 'script_vi': {
          const { data: existing } = await supabase
            .from('scripts')
            .select('version')
            .eq('project_id', projectId)
            .order('version', { ascending: false })
            .limit(1)
          const version = (existing && existing.length > 0) ? existing[0].version + 1 : 1
          const wordCount = content.trim().split(/\s+/).filter(Boolean).length
          const { error } = await supabase
            .from('scripts')
            .insert({ project_id: projectId, content, version, word_count: wordCount, status: 'draft' })
          return { error: error?.message || null }
        }
        case 'review': {
          // Fetch latest script to attach review
          const { data: scripts } = await supabase
            .from('scripts')
            .select('id')
            .eq('project_id', projectId)
            .order('version', { ascending: false })
            .limit(1)
          if (!scripts || scripts.length === 0) {
            return { error: 'Chưa có script để review' }
          }
          const { data: { user } } = await supabase.auth.getUser()
          const { error } = await supabase
            .from('script_reviews')
            .insert({
              script_id: scripts[0].id,
              reviewer_id: user?.id || null,
              status: 'pending',
              comments: content,
            })
          return { error: error?.message || null }
        }
        case 'script_en': {
          const { data: existing } = await supabase
            .from('scripts')
            .select('version')
            .eq('project_id', projectId)
            .order('version', { ascending: false })
            .limit(1)
          const version = (existing && existing.length > 0) ? existing[0].version + 1 : 1
          const wordCount = content.trim().split(/\s+/).filter(Boolean).length
          const { error } = await supabase
            .from('scripts')
            .insert({ project_id: projectId, content, version, word_count: wordCount, status: 'translation' })
          return { error: error?.message || null }
        }
        case 'script_vo': {
          const { error } = await supabase
            .from('vo_notes')
            .insert({ project_id: projectId, content, created_at: new Date().toISOString() })
          return { error: error?.message || null }
        }
        case 'title': {
          const { error } = await supabase
            .from('title_packages')
            .insert({ project_id: projectId, content, created_at: new Date().toISOString() })
          return { error: error?.message || null }
        }
        default:
          return { error: `Unknown phase: ${phase}` }
      }
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Save failed' }
    }
  }, [])

  return { streaming, output, error, progress, runPhase, reset, saveOutput, abort }
}
