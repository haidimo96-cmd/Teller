/**
 * AiStreamPanel — Reusable AI streaming output component.
 *
 * Shows a "🤖 Chạy AI" trigger button, then renders a streaming output panel
 * with live text, progress indicators, save/retry buttons, and error display.
 */

import { useState } from 'react'
import { useAI } from '../../hooks/useAI'
import type { Stage } from '../../lib/pipelineRegistry'
import { STAGE_LABELS, STAGE_COLORS } from '../../lib/pipelineRegistry'

interface AiStreamPanelProps {
  phase: Stage | string
  projectId: string
  /** Input text to send to AI (e.g., idea text, outline content, script content) */
  inputContent: string
  /** Pattern group for pattern-specific rules */
  patternGroup?: 'FURY' | 'STRATEGY' | 'COMEDY'
  /** Outline step: 1 = Story Prep, 2 = Arc Map + Outline */
  step?: number
  /** Story pattern: heartwarming, moral-dilemma, mystery-suspense, justice */
  storyPattern?: string
  /** Callback after successful save */
  onSaved?: () => void
  /** Callback to advance to next step (e.g., Step 1 → Step 2) */
  onNextStep?: (output: string) => void
}

export default function AiStreamPanel({
  phase,
  projectId,
  inputContent,
  patternGroup = 'FURY',
  step,
  storyPattern,
  onSaved,
  onNextStep,
}: AiStreamPanelProps) {
  const { streaming, output, error, progress, runPhase, reset, saveOutput, abort } = useAI()
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const phaseColor = STAGE_COLORS[phase as Stage] || STAGE_COLORS['idea']
  const phaseLabel = STAGE_LABELS[phase as Stage] || (phase === 'evaluate' ? 'Đánh Giá' : phase)

  const handleRun = async () => {
    if (!inputContent.trim()) {
      return
    }
    setIsOpen(true)
    setSaveMsg(null)
    await runPhase(phase, projectId, inputContent, patternGroup, step, storyPattern)
  }

  const handleSave = async () => {
    if (!output.trim()) return
    setSaving(true)
    const { error: saveError } = await saveOutput(projectId, phase, output)
    setSaving(false)
    if (saveError) {
      setSaveMsg(`❌ Lỗi: ${saveError}`)
    } else {
      setSaveMsg('✅ Đã lưu thành công!')
      onSaved?.()
    }
  }

  const handleRetry = () => {
    reset()
    setSaveMsg(null)
    handleRun()
  }

  const handleClose = () => {
    if (streaming) abort()
    reset()
    setIsOpen(false)
    setSaveMsg(null)
  }

  // Compact trigger button when panel is not open
  if (!isOpen) {
    return (
      <div className="mt-6 pt-6 border-t border-white/5">
        <button
          onClick={handleRun}
          disabled={!inputContent.trim()}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl
                     border-2 border-dashed transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:scale-[1.01] active:scale-[0.99]"
          style={{
            borderColor: `${phaseColor}40`,
            background: `linear-gradient(135deg, ${phaseColor}08, ${phaseColor}03)`,
          }}
        >
          <span className="text-xl">🤖</span>
          <span className="font-bold text-sm" style={{ color: phaseColor }}>
            {step ? `Chạy Step ${step} — ${phaseLabel}` : `Chạy AI — ${phaseLabel}`}
          </span>
          {!inputContent.trim() && (
            <span className="text-xs text-on-surface-variant">(Cần nội dung input)</span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 pt-6 border-t border-white/5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${phaseColor}20` }}
          >
            🤖
          </div>
          <div>
            <h4 className="text-sm font-bold" style={{ color: phaseColor }}>
              {step ? `AI Step ${step} — ${phaseLabel}` : `AI — ${phaseLabel}`}
            </h4>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
              {progress === 'streaming' && '⏳ Đang xử lý...'}
              {progress === 'done' && '✅ Hoàn thành'}
              {progress === 'error' && '❌ Lỗi'}
              {progress === 'idle' && 'Sẵn sàng'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streaming && (
            <button
              onClick={abort}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-error/10 text-error
                         hover:bg-error/20 transition-colors"
            >
              ⏹ Dừng
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-white/10 transition-colors"
          >
            ✕ Đóng
          </button>
        </div>
      </div>

      {/* Streaming progress bar */}
      {streaming && (
        <div className="h-0.5 rounded-full overflow-hidden mb-4" style={{ backgroundColor: `${phaseColor}20` }}>
          <div
            className="h-full rounded-full animate-pulse"
            style={{
              backgroundColor: phaseColor,
              width: '60%',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* Output panel */}
      <div
        className="rounded-xl p-5 min-h-[200px] max-h-[600px] overflow-y-auto
                   bg-surface-container-lowest border border-white/10
                   font-mono text-sm text-on-surface leading-relaxed whitespace-pre-wrap"
      >
        {output ? (
          <>
            {output}
            {streaming && (
              <span
                className="inline-block w-2 h-5 ml-0.5 animate-pulse rounded-sm"
                style={{ backgroundColor: phaseColor }}
              />
            )}
          </>
        ) : error ? (
          <div className="text-center py-8">
            <span className="text-error text-3xl block mb-3">⚠️</span>
            <p className="text-error text-sm font-medium mb-1">Đã xảy ra lỗi</p>
            <p className="text-on-surface-variant text-xs">{error}</p>
          </div>
        ) : streaming ? (
          <div className="flex items-center gap-3 text-on-surface-variant">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs">Đang kết nối AI...</span>
          </div>
        ) : (
          <div className="text-center py-8 text-on-surface-variant/50 text-xs">
            Kết quả AI sẽ hiển thị ở đây.
          </div>
        )}
      </div>

      {/* Action buttons */}
      {(progress === 'done' || progress === 'error') && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {output && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2
                           hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${phaseColor}, ${phaseColor}cc)`,
                  color: '#0c0e12',
                }}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>💾 Lưu kết quả</>
                )}
              </button>
            )}
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10
                         transition-colors flex items-center gap-1.5"
            >
              🔄 Chạy lại
            </button>
          </div>

          {/* Stats */}
          {output && (
            <div className="text-xs text-on-surface-variant">
              {output.trim().split(/\s+/).filter(Boolean).length} từ
            </div>
          )}
        </div>
      )}

      {/* Next Step button (e.g., Step 1 → Step 2) */}
      {step === 1 && progress === 'done' && output && onNextStep && (
        <button
          onClick={() => onNextStep(output)}
          className="w-full mt-3 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2
                     transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff' }}
        >
          ✅ Lưu Step 1 & Sang Step 2 →
        </button>
      )}

      {/* Save message */}
      {saveMsg && (
        <p className={`mt-3 text-xs font-medium ${saveMsg.startsWith('✅') ? 'text-success' : 'text-error'}`}>
          {saveMsg}
        </p>
      )}
    </div>
  )
}
