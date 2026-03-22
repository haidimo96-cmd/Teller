/**
 * AI Settings Page — Manage AI models, API keys, and token usage.
 *
 * Sections:
 * 1. Token Usage Dashboard (circular progress + stats)
 * 2. API Key Management (input + validate)
 * 3. Model Selector (grouped by provider)
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// ── Types ──────────────────────────────────────────────────────────

interface ModelInfo {
  name: string
  display: string
  description: string
  maxTokens: number
  tier: string
}

interface ProviderGroup {
  provider: string
  models: ModelInfo[]
}

interface AIConfig {
  id: string
  provider: string
  model_name: string
  display_name: string
  api_key: string
  is_active: boolean
  token_limit: number
  used_tokens: number
}

interface UsageStats {
  totalInput: number
  totalOutput: number
  totalTokens: number
  callCount: number
  dailyUsage: Record<string, number>
  phaseBreakdown: Record<string, number>
  recentLogs: Array<{
    phase: string
    model_name: string
    input_tokens: number
    output_tokens: number
    total_tokens: number
    created_at: string
  }>
}

// ── Helper: format token count ─────────────────────────────────────

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function maskKey(key: string): string {
  if (!key || key.length < 10) return '••••••••'
  return key.slice(0, 5) + '•'.repeat(20) + key.slice(-4)
}

// ── Phase labels ───────────────────────────────────────────────────

const PHASE_LABELS: Record<string, string> = {
  idea: '💡 Ý tưởng',
  outline: '📋 Dàn ý',
  script_vi: '📝 Script VI',
  review: '🔍 Review',
  script_en: '🇬🇧 Script EN',
  script_vo: '🎙️ Voice-Over',
  title: '🏷️ Tiêu đề',
}

// ── Default model catalog (fallback) ───────────────────────────────

const DEFAULT_CATALOG: ProviderGroup[] = [
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

// ── Circular Progress Component ────────────────────────────────────

function CircularProgress({ percentage, size = 160, strokeWidth = 12 }: {
  percentage: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference
  const color = percentage > 90 ? '#F87171' : percentage > 70 ? '#FBBF24' : '#eafe8e'

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
      />
    </svg>
  )
}

// ── Mini Bar Chart Component ───────────────────────────────────────

function DailyBarChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data)
  const maxVal = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="flex items-end gap-1.5 h-20">
      {entries.map(([date, value]) => (
        <div key={date} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{
              height: `${Math.max((value / maxVal) * 64, 2)}px`,
              background: value > 0
                ? 'linear-gradient(to top, rgba(234,254,142,0.3), rgba(234,254,142,0.8))'
                : 'rgba(255,255,255,0.06)',
            }}
            title={`${date}: ${formatTokens(value)} tokens`}
          />
          <span className="text-[9px] text-on-surface-variant">
            {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' }).slice(0, 2)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Main Page Component ────────────────────────────────────────────

export default function AISettingsPage() {
  const [config, setConfig] = useState<AIConfig | null>(null)
  const [catalog, setCatalog] = useState<ProviderGroup[]>(DEFAULT_CATALOG)
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [selectedProvider, setSelectedProvider] = useState('google')
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-pro')
  const [apiKey, setApiKey] = useState('')
  const [tokenLimit, setTokenLimit] = useState(1000000)
  const [showKey, setShowKey] = useState(false)
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // ── Fetch config & usage ────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

      // Fetch config
      const configRes = await fetch(`${supabaseUrl}/functions/v1/ai-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'get_config' }),
      })
      const configData = await configRes.json()

      if (configData.config) {
        setConfig(configData.config)
        setSelectedProvider(configData.config.provider || 'google')
        setSelectedModel(configData.config.model_name || 'gemini-3.1-pro')
        setApiKey(configData.config.api_key || '')
        setTokenLimit(configData.config.token_limit || 1000000)
      }
      if (configData.catalog && configData.catalog.length > 0) {
        setCatalog(configData.catalog)
      }

      // Fetch usage
      const usageRes = await fetch(`${supabaseUrl}/functions/v1/ai-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'get_usage' }),
      })
      const usageData = await usageRes.json()
      setUsage(usageData)
    } catch (err) {
      console.error('Failed to fetch AI config:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ── Validate API Key ────────────────────────────────────────────

  const handleValidate = async () => {
    if (!apiKey.trim()) return
    setValidating(true)
    setValidationResult(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'validate_key',
          api_key: apiKey,
          provider: selectedProvider,
        }),
      })
      const data = await res.json()
      setValidationResult(data)
    } catch {
      setValidationResult({ valid: false, message: 'Lỗi kết nối' })
    } finally {
      setValidating(false)
    }
  }

  // ── Save Config ─────────────────────────────────────────────────

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setSaveMessage('⚠️ Vui lòng nhập API key')
      return
    }
    setSaving(true)
    setSaveMessage('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const modelInfo = catalog
        .find(g => g.provider === selectedProvider)
        ?.models.find(m => m.name === selectedModel)

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: 'save_config',
          provider: selectedProvider,
          model_name: selectedModel,
          display_name: modelInfo?.display || selectedModel,
          api_key: apiKey,
          token_limit: tokenLimit,
        }),
      })
      const data = await res.json()

      if (data.success) {
        setSaveMessage('✅ Đã lưu cấu hình thành công!')
        setConfig(data.config)
        // Refresh usage data
        fetchData()
      } else {
        setSaveMessage(`❌ Lỗi: ${data.error}`)
      }
    } catch {
      setSaveMessage('❌ Lỗi kết nối server')
    } finally {
      setSaving(false)
    }
  }

  // ── Computed values ─────────────────────────────────────────────

  const usedTokens = usage?.totalTokens || config?.used_tokens || 0
  const limitTokens = tokenLimit || 1000000
  const remainingTokens = Math.max(limitTokens - usedTokens, 0)
  const usagePercent = limitTokens > 0 ? (usedTokens / limitTokens) * 100 : 0

  const selectedProviderModels = catalog.find(g => g.provider === selectedProvider)?.models || []

  // ── Render ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm">Đang tải cấu hình AI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
            Quản lý AI
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Cấu hình model, API key và theo dõi token usage
          </p>
        </div>
        {config && (
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {config.display_name || config.model_name}
            </span>
          </div>
        )}
      </div>

      {/* ── Token Usage Dashboard ──────────────────────────────── */}
      <div className="glass-card rounded-xl p-6 lg:p-8">
        <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">data_usage</span>
          Token Usage
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Circular progress + main stats */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <CircularProgress percentage={usagePercent} size={160} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-on-surface">{usagePercent.toFixed(1)}%</span>
                <span className="text-xs text-on-surface-variant">đã sử dụng</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="text-center">
                <p className="text-xs text-on-surface-variant mb-1">Giới hạn</p>
                <p className="text-sm font-bold text-on-surface">{formatTokens(limitTokens)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-on-surface-variant mb-1">Đã dùng</p>
                <p className="text-sm font-bold text-warning">{formatTokens(usedTokens)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-on-surface-variant mb-1">Còn lại</p>
                <p className="text-sm font-bold text-success">{formatTokens(remainingTokens)}</p>
              </div>
            </div>
          </div>

          {/* Daily usage chart */}
          <div className="lg:col-span-1">
            <p className="text-xs font-medium text-on-surface-variant mb-3 uppercase tracking-wider">
              7 ngày gần nhất
            </p>
            {usage?.dailyUsage ? (
              <DailyBarChart data={usage.dailyUsage} />
            ) : (
              <div className="h-20 flex items-center justify-center text-on-surface-variant text-xs">
                Chưa có dữ liệu
              </div>
            )}
            <div className="mt-3 flex items-center justify-between text-xs text-on-surface-variant">
              <span>{usage?.callCount || 0} lần gọi AI</span>
              <span>
                Input: {formatTokens(usage?.totalInput || 0)} / Output: {formatTokens(usage?.totalOutput || 0)}
              </span>
            </div>
          </div>

          {/* Phase breakdown */}
          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-3 uppercase tracking-wider">
              Token theo Phase
            </p>
            {usage?.phaseBreakdown && Object.keys(usage.phaseBreakdown).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(usage.phaseBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([phase, tokens]) => {
                    const maxPhaseTokens = Math.max(...Object.values(usage.phaseBreakdown))
                    const width = (tokens / maxPhaseTokens) * 100
                    return (
                      <div key={phase} className="flex items-center gap-3">
                        <span className="text-xs w-24 truncate" title={phase}>
                          {PHASE_LABELS[phase] || phase}
                        </span>
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${width}%`,
                              background: 'linear-gradient(90deg, rgba(234,254,142,0.4), rgba(234,254,142,0.9))',
                            }}
                          />
                        </div>
                        <span className="text-xs text-on-surface-variant w-14 text-right">
                          {formatTokens(tokens)}
                        </span>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center text-on-surface-variant text-xs">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── API Key & Model Selection ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Key Section */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">key</span>
            API Key
          </h2>

          {/* Provider selector */}
          <div className="mb-4">
            <label className="text-xs font-medium text-on-surface-variant mb-1.5 block uppercase tracking-wider">
              Provider
            </label>
            <div className="flex gap-2">
              {catalog.map((group) => (
                <button
                  key={group.provider}
                  onClick={() => {
                    setSelectedProvider(group.provider)
                    setSelectedModel(group.models[0]?.name || '')
                    setValidationResult(null)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedProvider === group.provider
                      ? 'bg-primary text-on-primary-container shadow-lg shadow-primary/20'
                      : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
                  }`}
                >
                  {group.provider === 'google' ? '🔷 Google' : group.provider === 'openai' ? '🟢 OpenAI' : group.provider === 'anthropic' ? '🟠 Anthropic' : group.provider}
                </button>
              ))}
            </div>
          </div>

          {/* API Key input */}
          <div className="mb-4">
            <label className="text-xs font-medium text-on-surface-variant mb-1.5 block uppercase tracking-wider">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setValidationResult(null)
                }}
                placeholder="Nhập API key..."
                className="w-full pr-24"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded text-on-surface-variant hover:text-on-surface transition-colors"
                  title={showKey ? 'Ẩn' : 'Hiện'}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
                <button
                  onClick={handleValidate}
                  disabled={validating || !apiKey.trim()}
                  className="px-3 py-1 rounded-md text-xs font-bold bg-primary/20 text-primary 
                             hover:bg-primary/30 disabled:opacity-40 transition-all"
                >
                  {validating ? (
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block" />
                  ) : 'Test'}
                </button>
              </div>
            </div>
            {validationResult && (
              <div className={`mt-2 text-xs font-medium flex items-center gap-1.5 ${
                validationResult.valid ? 'text-success' : 'text-error'
              }`}>
                <span className="material-symbols-outlined text-sm">
                  {validationResult.valid ? 'check_circle' : 'error'}
                </span>
                {validationResult.message}
              </div>
            )}
          </div>

          {/* Token limit */}
          <div className="mb-4">
            <label className="text-xs font-medium text-on-surface-variant mb-1.5 block uppercase tracking-wider">
              Giới hạn Token (tùy chỉnh)
            </label>
            <select
              value={tokenLimit}
              onChange={(e) => setTokenLimit(Number(e.target.value))}
              className="w-full"
            >
              <option value={100000}>100K tokens</option>
              <option value={500000}>500K tokens</option>
              <option value={1000000}>1M tokens</option>
              <option value={5000000}>5M tokens</option>
              <option value={10000000}>10M tokens</option>
              <option value={50000000}>50M tokens</option>
              <option value={100000000}>100M tokens</option>
            </select>
          </div>

          {/* Current key info */}
          {config && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-on-surface-variant">
              <span className="font-medium text-on-surface">Key hiện tại:</span>{' '}
              {maskKey(config.api_key)}
            </div>
          )}
        </div>

        {/* Model Selection Section */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">psychology</span>
            Chọn Model
          </h2>

          <div className="space-y-2">
            {selectedProviderModels.map((model) => {
              const isSelected = selectedModel === model.name
              const isActive = config?.model_name === model.name && config?.provider === selectedProvider

              return (
                <button
                  key={model.name}
                  onClick={() => setSelectedModel(model.name)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                        {model.display}
                      </span>
                      {model.tier === 'pro' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-tertiary/20 text-tertiary">
                          PRO
                        </span>
                      )}
                      {isActive && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-success/20 text-success flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-primary' : 'border-white/20'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant">{model.description}</p>
                  <p className="text-[10px] text-on-surface-variant/60 mt-1">
                    Max tokens: {formatTokens(model.maxTokens)}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Save button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
              className="primary-gradient text-on-primary-container px-6 py-2.5 rounded-lg font-bold text-sm
                         flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all
                         disabled:opacity-40 disabled:hover:scale-100 shadow-lg shadow-primary/20"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  Lưu cấu hình
                </>
              )}
            </button>
            {saveMessage && (
              <span className="text-sm font-medium animate-fade-in">{saveMessage}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent Activity ────────────────────────────────────── */}
      {usage?.recentLogs && usage.recentLogs.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Lịch sử sử dụng gần đây
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-on-surface-variant uppercase tracking-wider border-b border-white/10">
                  <th className="pb-3 pr-4">Thời gian</th>
                  <th className="pb-3 pr-4">Phase</th>
                  <th className="pb-3 pr-4">Model</th>
                  <th className="pb-3 pr-4 text-right">Input</th>
                  <th className="pb-3 pr-4 text-right">Output</th>
                  <th className="pb-3 text-right">Tổng</th>
                </tr>
              </thead>
              <tbody>
                {usage.recentLogs.map((log, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2.5 pr-4 text-on-surface-variant text-xs">
                      {new Date(log.created_at).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs">{PHASE_LABELS[log.phase] || log.phase}</span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-on-surface-variant">
                        {log.model_name}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-right text-xs text-on-surface-variant">
                      {formatTokens(log.input_tokens)}
                    </td>
                    <td className="py-2.5 pr-4 text-right text-xs text-on-surface-variant">
                      {formatTokens(log.output_tokens)}
                    </td>
                    <td className="py-2.5 text-right text-xs font-medium text-on-surface">
                      {formatTokens(log.total_tokens)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
