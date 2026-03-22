import { useState, useRef } from 'react'
import { useAI } from '../../hooks/useAI'

interface ScriptEditorProps {
  content: string
  onChange: (content: string) => void
  outlineContent?: string
  projectId: string
  projectTitle: string
  onSave: () => void
  saving: boolean
  scripts: Array<{ version: number; word_count: number | null; created_at: string }>
}

type ScriptStep = 'hook' | 'body' | 'full'

interface InlineComment {
  blockIndex: number
  instruction: string
  suggestion?: string
  status: 'pending' | 'generating' | 'ready'
}

export default function ScriptEditor({
  content,
  onChange,
  outlineContent,
  projectId,
  projectTitle,
  onSave,
  saving,
  scripts,
}: ScriptEditorProps) {
  const [scriptStep, setScriptStep] = useState<ScriptStep>('hook')
  const [editingBlock, setEditingBlock] = useState<number | null>(null)
  const [comments, setComments] = useState<InlineComment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [activeCommentBlock, setActiveCommentBlock] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // AI for generating script sections
  const {
    streaming: genStreaming,
    output: genOutput,
    runPhase: runGenPhase,
    reset: resetGen,
  } = useAI({
    onComplete: (fullOutput) => {
      // Append generated content to existing content
      const separator = content.trim() ? '\n\n---CUT---\n\n' : ''
      onChange(content + separator + fullOutput)
    },
  })

  // AI for inline suggestions
  const {
    streaming: sugStreaming,
    output: sugOutput,
    runPhase: runSugPhase,
    reset: resetSug,
  } = useAI({
    onComplete: (fullOutput) => {
      setComments(prev =>
        prev.map(c =>
          c.status === 'generating' ? { ...c, suggestion: fullOutput, status: 'ready' } : c
        )
      )
    },
  })

  // Split content into blocks (paragraphs separated by double newlines)
  const blocks = content ? content.split(/\n\n+/).filter(b => b.trim()) : []

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const estMinutes = Math.round(wordCount / 150)

  // Generate a script section
  const handleGenerate = async () => {
    resetGen()
    const stepPrompts: Record<ScriptStep, string> = {
      hook: `Viết phần HOOK (0:00-0:45, ~280 từ) cho script YouTube HOA Stories:\n\nOutline:\n${outlineContent || projectTitle}\n\nYêu cầu:\n- Mở đầu bằng villain action/quote + con số $ cụ thể\n- Tạo tension ngay câu đầu\n- Kết thúc hook bằng micro-cliffhanger\n- Dùng narrator voice, engaging, conversational`,
      body: `Viết phần BODY (tiếp theo hook) cho script YouTube HOA Stories:\n\nOutline:\n${outlineContent || projectTitle}\n\nHook đã có:\n${content || '(chưa có)'}\n\nYêu cầu:\n- Tiếp nối từ hook\n- Escalation ≥3 vòng\n- Mỗi vòng có mini-climax\n- Power dialogue cho villain\n- Sensory details\n- Kết thúc bằng payoff tương xứng`,
      full: `Viết TOÀN BỘ script cho video YouTube HOA Stories:\n\nOutline:\n${outlineContent || projectTitle}\n\nYêu cầu:\n- Hook mạnh (0:00-0:45)\n- Setup + Escalation (3+ vòng)\n- Climax + Resolution\n- Power Dialogue\n- Narrator voice, engaging\n- ~3000-3500 từ`,
    }
    await runGenPhase('script_vi', projectId, stepPrompts[scriptStep], 'FURY')
  }

  // Handle inline AI comment
  const handleSubmitComment = async (blockIndex: number) => {
    if (!commentInput.trim()) return
    const block = blocks[blockIndex]
    const newComment: InlineComment = {
      blockIndex,
      instruction: commentInput,
      status: 'generating',
    }
    setComments(prev => [...prev.filter(c => c.blockIndex !== blockIndex), newComment])
    setCommentInput('')
    setActiveCommentBlock(null)
    resetSug()

    const prompt = `Chỉnh sửa đoạn văn sau theo yêu cầu của user. CHỈ trả lại đoạn văn đã chỉnh sửa, không giải thích.\n\nĐoạn gốc:\n"${block}"\n\nYêu cầu chỉnh sửa: ${newComment.instruction}\n\nĐoạn đã chỉnh sửa:`
    await runSugPhase('script_vi', projectId, prompt, 'FURY')
  }

  // Accept a suggestion (replace the block)
  const handleAcceptSuggestion = (blockIndex: number) => {
    const comment = comments.find(c => c.blockIndex === blockIndex && c.status === 'ready')
    if (!comment?.suggestion) return
    const newBlocks = [...blocks]
    newBlocks[blockIndex] = comment.suggestion.trim()
    onChange(newBlocks.join('\n\n'))
    setComments(prev => prev.filter(c => c.blockIndex !== blockIndex))
  }

  // Reject a suggestion
  const handleRejectSuggestion = (blockIndex: number) => {
    setComments(prev => prev.filter(c => c.blockIndex !== blockIndex))
  }

  return (
    <div className="space-y-4">
      {/* Script Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Từ</p>
            <p className="text-xl font-bold">{wordCount.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Thời lượng</p>
            <p className="text-xl font-bold">~{estMinutes}m</p>
          </div>
          <div className="text-center">
            <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Blocks</p>
            <p className="text-xl font-bold">{blocks.length}</p>
          </div>
          {scripts.length > 0 && (
            <div className="text-center">
              <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Version</p>
              <p className="text-xl font-bold">V{scripts[0].version}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={saving || !content.trim()}
            className="primary-gradient text-on-primary-container px-5 py-2 rounded-lg font-bold text-sm
                       hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : `Lưu V${scripts.length + 1}`}
          </button>
        </div>
      </div>

      {/* Step Selector for Generation */}
      <div className="flex items-center gap-2">
        {([
          { key: 'hook' as ScriptStep, label: '🎣 Tạo Hook', desc: 'Mở đầu 0:00-0:45' },
          { key: 'body' as ScriptStep, label: '📖 Tạo Body', desc: 'Tiếp nối hook' },
          { key: 'full' as ScriptStep, label: '📝 Tạo Full', desc: 'Toàn bộ script' },
        ]).map(step => (
          <button
            key={step.key}
            onClick={() => setScriptStep(step.key)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
              scriptStep === step.key
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40'
                : 'bg-white/5 text-on-surface-variant hover:bg-white/10 border border-white/5'
            }`}
          >
            <span>{step.label}</span>
            <span className="text-[9px] opacity-60 font-normal">{step.desc}</span>
          </button>
        ))}

        <button
          onClick={handleGenerate}
          disabled={genStreaming}
          className="ml-auto px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all
                     hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#fff' }}
        >
          {genStreaming ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang tạo...
            </>
          ) : (
            <>🤖 AI Tạo</>
          )}
        </button>
      </div>

      {/* Generation Output (streaming) */}
      {genStreaming && genOutput && (
        <div className="rounded-lg p-3 bg-violet-500/5 border border-violet-500/20 max-h-[200px] overflow-y-auto">
          <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400/50 mb-1">AI đang tạo...</p>
          <pre className="text-[11px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-body">
            {genOutput}
            <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm bg-violet-400" />
          </pre>
        </div>
      )}

      {/* Block-based Content Viewer/Editor */}
      <div className="rounded-xl border border-white/10 bg-surface-container-lowest overflow-hidden">
        {blocks.length === 0 ? (
          /* Empty state: full textarea */
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[400px] bg-transparent border-none p-4
                       text-sm text-on-surface leading-relaxed resize-y font-body
                       focus:ring-0 focus:outline-none"
            placeholder="[HOOK: 0:00-0:45]&#10;&#10;Dùng AI để tạo hook phía trên, hoặc viết trực tiếp..."
            autoFocus
          />
        ) : (
          /* Block-based view with inline comment buttons */
          <div className="divide-y divide-white/5">
            {blocks.map((block, i) => {
              const comment = comments.find(c => c.blockIndex === i)
              const isEditing = editingBlock === i
              const isSection = block.startsWith('[') || block.startsWith('---')
              const isQuote = block.startsWith('>') || block.startsWith('"')

              return (
                <div key={i} className="group relative">
                  {/* Comment button (left gutter) */}
                  <button
                    onClick={() => setActiveCommentBlock(activeCommentBlock === i ? null : i)}
                    className="absolute left-1 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                               w-6 h-6 rounded-md bg-white/5 hover:bg-violet-500/20 flex items-center justify-center"
                    title="Đề xuất chỉnh sửa bằng AI"
                  >
                    <span className="text-xs">💬</span>
                  </button>

                  {/* Block content */}
                  <div
                    className={`pl-9 pr-4 py-3 cursor-text transition-colors ${
                      isEditing ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                    } ${comment?.status === 'ready' ? 'border-l-2 border-violet-400' : ''}`}
                    onClick={() => setEditingBlock(i)}
                  >
                    {isEditing ? (
                      <textarea
                        value={block}
                        onChange={(e) => {
                          const newBlocks = [...blocks]
                          newBlocks[i] = e.target.value
                          onChange(newBlocks.join('\n\n'))
                        }}
                        onBlur={() => setEditingBlock(null)}
                        className="w-full bg-transparent border-none text-sm text-on-surface leading-relaxed
                                   resize-none focus:ring-0 focus:outline-none font-body min-h-[60px]"
                        autoFocus
                      />
                    ) : (
                      <p className={`text-sm leading-relaxed ${
                        isSection ? 'text-on-surface font-bold text-base' :
                        isQuote ? 'italic text-on-surface-variant border-l-2 border-primary/30 pl-4' :
                        'text-on-surface-variant'
                      }`}>
                        {block}
                      </p>
                    )}
                  </div>

                  {/* Inline comment input */}
                  {activeCommentBlock === i && (
                    <div className="mx-9 mb-3 p-2 rounded-lg bg-violet-500/5 border border-violet-500/20 animate-fade-in">
                      <div className="flex gap-2">
                        <input
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="VD: thêm chi tiết cảm xúc, viết lại mạnh hơn..."
                          className="flex-1 text-xs bg-transparent border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-on-surface-variant/50"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(i)}
                        />
                        <button
                          onClick={() => handleSubmitComment(i)}
                          disabled={!commentInput.trim() || sugStreaming}
                          className="px-3 py-1 rounded-md text-[10px] font-bold bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-all disabled:opacity-50"
                        >
                          {sugStreaming ? '...' : '🤖 Gợi ý'}
                        </button>
                        <button
                          onClick={() => { setActiveCommentBlock(null); setCommentInput('') }}
                          className="px-2 py-1 rounded-md text-[10px] text-on-surface-variant hover:bg-white/10"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AI Suggestion (ready or generating) */}
                  {comment && (
                    <div className={`mx-9 mb-3 p-3 rounded-lg border animate-fade-in ${
                      comment.status === 'generating' ? 'bg-violet-500/5 border-violet-500/20' : 'bg-emerald-500/5 border-emerald-500/20'
                    }`}>
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-2" style={{
                        color: comment.status === 'generating' ? 'rgb(167,139,250)' : 'rgb(52,211,153)'
                      }}>
                        💬 {comment.instruction}
                        {comment.status === 'generating' && (
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                      </p>
                      {comment.status === 'generating' && sugOutput && (
                        <pre className="text-[11px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-body">
                          {sugOutput}
                          <span className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm bg-violet-400" />
                        </pre>
                      )}
                      {comment.status === 'ready' && comment.suggestion && (
                        <>
                          <pre className="text-[11px] text-on-surface whitespace-pre-wrap leading-relaxed font-body mb-2">
                            {comment.suggestion}
                          </pre>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptSuggestion(i)}
                              className="px-3 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all"
                            >
                              ✅ Chấp nhận
                            </button>
                            <button
                              onClick={() => handleRejectSuggestion(i)}
                              className="px-3 py-1 rounded-md text-[10px] font-bold bg-white/5 text-on-surface-variant hover:bg-white/10 transition-all"
                            >
                              ❌ Bỏ qua
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Add more content at the end */}
            <div className="p-4">
              <textarea
                value=""
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    onChange(content + '\n\n' + e.target.value)
                  }
                }}
                className="w-full bg-transparent border-none text-sm text-on-surface leading-relaxed
                           resize-none focus:ring-0 focus:outline-none font-body min-h-[60px]"
                placeholder="Thêm nội dung..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
