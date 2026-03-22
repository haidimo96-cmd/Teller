/**
 * ReviewPanel — Pattern-adaptive review scoring UI.
 *
 * 3-phase review with Universal + Pattern-Specific criteria:
 * - Pha 1: Hook Review (Universal A, B)
 * - Pha 2: Body Review (Universal C, D0 + Pattern-Specific D, E, F)
 * - Pha 3: Final Review (Universal G, H)
 *
 * Each criterion gets ⭐1-5 stars + comments.
 * Verdict: ✅ Đạt / ⚠️ Cần sửa / ❌ Viết lại
 */

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { PATTERNS, type PatternGroup } from '../../lib/pipelineRegistry'

// ─── Types ──────────────────────────────────────────────────────────

interface CriterionScore {
  id: string
  score: number        // 0 = not scored, 1-5
  comment: string
}

type Verdict = 'pass' | 'needs_fix' | 'rewrite' | null

// ─── Criteria Definitions ───────────────────────────────────────────

interface CriterionDef {
  id: string
  label: string
  description: string
}

interface SectionDef {
  id: string
  title: string
  emoji: string
  criteria: CriterionDef[]
}

const UNIVERSAL_SECTIONS: SectionDef[] = [
  {
    id: 'hook', title: 'Hook (Mở đầu)', emoji: '🎣',
    criteria: [
      { id: 'a1', label: '3-step structure', description: 'Context Lean → Scroll Stop → Contrarian Snapback' },
      { id: 'a2', label: 'Villain Opening', description: 'Mở bằng xung đột/lời thoại phản diện' },
      { id: 'a3', label: 'Staccato Sentences', description: 'Câu ngắn, đanh trong 30s đầu' },
      { id: 'a4', label: 'Speed to Value', description: 'Không intro dài, vào truyện ngay' },
      { id: 'a5', label: 'Narrator bối cảnh', description: 'Narrator có bối cảnh cá nhân cụ thể' },
    ]
  },
  {
    id: 'macro', title: 'Macro Question', emoji: '❓',
    criteria: [
      { id: 'b1', label: '2 câu hỏi lớn', description: 'HOW + WHAT treo trong 20% đầu' },
      { id: 'b2', label: 'Breadcrumbs', description: 'Nuôi dưỡng câu hỏi xuyên suốt' },
    ]
  },
  {
    id: 'latde', title: 'LATDE', emoji: '🎬',
    criteria: [
      { id: 'c1', label: 'Location', description: 'Mở cảnh bằng vị trí vật lý cụ thể' },
      { id: 'c2', label: 'Action', description: 'Động từ hành động vật lý' },
      { id: 'c3', label: 'Thoughts', description: 'Suy nghĩ nội tâm thô, đời thường' },
      { id: 'c4', label: 'Dialogue', description: '≤15% từ, max 3 câu liên tiếp' },
      { id: 'c5', label: 'Emotion', description: 'Show Don\'t Tell, không tính từ cảm xúc' },
    ]
  },
  {
    id: 'arcs', title: 'Mini Arcs & Therefore', emoji: '📈',
    criteria: [
      { id: 'd0-1', label: 'Mini Arcs rõ ràng', description: 'Mỗi phần có đầu-đỉnh-kết' },
      { id: 'd0-2', label: 'Leo thang dần', description: 'Arc sau > arc trước' },
      { id: 'd0-3', label: 'Therefore/But test', description: 'Transition hợp lý giữa các phần' },
    ]
  },
]

const PATTERN_SECTIONS: Record<PatternGroup, SectionDef[]> = {
  FURY: [
    {
      id: 'fury-d', title: 'Emotional Object (FURY)', emoji: '🔥',
      criteria: [
        { id: 'fd1', label: 'Object Tracking', description: 'Object xuất hiện ≥3 lần, mỗi lần tăng ý nghĩa' },
        { id: 'fd2', label: 'Destruction → Rebirth', description: 'Object bị phá hủy rồi tái sinh ở climax' },
      ]
    },
    {
      id: 'fury-e', title: '6-Layer Climax (FURY)', emoji: '💥',
      criteria: [
        { id: 'fe1', label: '6 Layers', description: 'Public Witness → Legal Checkmate → Community → Villain Self-Destruct → Object Rebirth → Narrator' },
        { id: 'fe2', label: 'Villain tự hủy', description: 'Villain TỰ TIẾT LỘ / TỰ PHÁ HOẠI' },
      ]
    },
    {
      id: 'fury-f', title: 'Tension Cliffhangers (FURY)', emoji: '😰',
      criteria: [
        { id: 'ff1', label: 'Nặng, căng', description: 'Villain có đi xa hơn không?' },
        { id: 'ff2', label: 'Mỗi cuối part', description: 'Cliffhanger ở cuối mỗi phần' },
      ]
    },
  ],
  STRATEGY: [
    {
      id: 'strat-d', title: 'Evidence Trail (STRATEGY)', emoji: '🧠',
      criteria: [
        { id: 'sd1', label: 'Plant Evidence', description: 'Bằng chứng gieo sớm, thu hoạch ở climax' },
        { id: 'sd2', label: 'Hero nghiên cứu', description: 'Hero thể hiện quá trình chuẩn bị chiến lược' },
      ]
    },
    {
      id: 'strat-e', title: 'Checkmate Climax (STRATEGY)', emoji: '♟️',
      criteria: [
        { id: 'se1', label: 'Checkmate moment', description: 'Villain bị kẹt bởi chính luật/hệ thống' },
        { id: 'se2', label: 'Power Shift', description: 'Villain MẤT QUYỀN, hero giành control' },
      ]
    },
    {
      id: 'strat-f', title: 'Info-gap Cliffhangers (STRATEGY)', emoji: '🔎',
      criteria: [
        { id: 'sf1', label: 'Hồi hộp, tò mò', description: 'Checkmate có hoạt động không?' },
        { id: 'sf2', label: 'Reveal dần', description: 'Thông tin tiết lộ từng bước' },
      ]
    },
  ],
  COMEDY: [
    {
      id: 'comedy-d', title: 'Running Gag (COMEDY)', emoji: '😂',
      criteria: [
        { id: 'cd1', label: 'Gag lặp lại', description: 'Running gag xuất hiện ≥3 lần, escalate mỗi lần' },
        { id: 'cd2', label: 'Surprise twist', description: 'Gag cuối có unexpected payoff' },
      ]
    },
    {
      id: 'comedy-e', title: 'Bẽ mặt Climax (COMEDY)', emoji: '🤡',
      criteria: [
        { id: 'ce1', label: 'Public humiliation', description: 'Villain bẽ mặt trước cộng đồng' },
        { id: 'ce2', label: 'Ironic justice', description: 'Villain bị hại bởi chính luật mình đặt ra' },
      ]
    },
    {
      id: 'comedy-f', title: 'Anticipation Cliffhangers (COMEDY)', emoji: '😄',
      criteria: [
        { id: 'cf1', label: 'Nhẹ nhàng, vui', description: 'Hero nghĩ ra gì tiếp theo?' },
        { id: 'cf2', label: 'Setup-Payoff', description: 'Setup joke ở part này, payoff ở part kế' },
      ]
    },
  ],
}

const FINAL_SECTIONS: SectionDef[] = [
  {
    id: 'format', title: 'Format & Consistency', emoji: '📋',
    criteria: [
      { id: 'g1', label: 'Script format', description: 'Part headers, visual notes, timestamps' },
      { id: 'g2', label: 'Transitions', description: 'Mượt mà giữa các parts' },
      { id: 'g3', label: 'Motif & Callbacks', description: 'KT5 Motif, KT14 Dialogue Callback set up & pay off' },
    ]
  },
  {
    id: 'overall', title: 'Tổng Quan', emoji: '🏆',
    criteria: [
      { id: 'h1', label: 'Character Depth', description: 'Villain 3D, không flat/cartoon' },
      { id: 'h2', label: 'Văn phong', description: 'Nhất quán, không sáo rỗng, đời thường' },
      { id: 'h3', label: 'Anti-patterns', description: 'Không có info-dump, purple prose, deus ex machina' },
    ]
  },
]

// ─── Star Rating Component ──────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star === value ? 0 : star)}
          className="text-lg transition-transform hover:scale-125 active:scale-90"
        >
          {star <= value ? '⭐' : '☆'}
        </button>
      ))}
      {value > 0 && (
        <span className={`ml-2 text-xs font-bold ${
          value >= 4 ? 'text-success' : value >= 3 ? 'text-warning' : 'text-error'
        }`}>
          {value}/5
        </span>
      )}
    </div>
  )
}

// ─── Section Component ──────────────────────────────────────────────

function ReviewSection({
  section,
  scores,
  onScoreChange,
  onCommentChange,
}: {
  section: SectionDef
  scores: Record<string, CriterionScore>
  onScoreChange: (id: string, score: number) => void
  onCommentChange: (id: string, comment: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const sectionAvg = (() => {
    const scored = section.criteria.map(c => scores[c.id]?.score || 0).filter(s => s > 0)
    return scored.length > 0 ? (scored.reduce((a, b) => a + b, 0) / scored.length).toFixed(1) : '—'
  })()

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{section.emoji}</span>
          <h4 className="text-sm font-bold">{section.title}</h4>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            sectionAvg === '—' ? 'bg-white/5 text-on-surface-variant'
              : Number(sectionAvg) >= 4 ? 'bg-success/20 text-success'
              : Number(sectionAvg) >= 3 ? 'bg-warning/20 text-warning'
              : 'bg-error/20 text-error'
          }`}>
            {sectionAvg}
          </span>
          <span className="material-symbols-outlined text-sm text-on-surface-variant transition-transform"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            expand_more
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/5 p-4 space-y-4">
          {section.criteria.map(criterion => {
            const score = scores[criterion.id] || { id: criterion.id, score: 0, comment: '' }
            return (
              <div key={criterion.id} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{criterion.label}</p>
                    <p className="text-xs text-on-surface-variant">{criterion.description}</p>
                  </div>
                  <StarRating
                    value={score.score}
                    onChange={(v) => onScoreChange(criterion.id, v)}
                  />
                </div>
                <textarea
                  value={score.comment}
                  onChange={(e) => onCommentChange(criterion.id, e.target.value)}
                  placeholder="Nhận xét..."
                  rows={1}
                  className="w-full bg-surface-container-lowest border border-white/5 rounded-lg px-3 py-2
                             text-xs leading-relaxed resize-none focus:ring-1 focus:ring-primary
                             placeholder:text-on-surface-variant/30"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main ReviewPanel ───────────────────────────────────────────────

interface ReviewPanelProps {
  projectId: string
  scriptContent: string
}

export default function ReviewPanel({ projectId, scriptContent }: ReviewPanelProps) {
  const [patternGroup, setPatternGroup] = useState<PatternGroup>('FURY')
  const [scores, setScores] = useState<Record<string, CriterionScore>>({})
  const [verdict, setVerdict] = useState<Verdict>(null)
  const [overallComment, setOverallComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  // Build all sections based on selected pattern
  const allSections: SectionDef[] = [
    ...UNIVERSAL_SECTIONS,
    ...PATTERN_SECTIONS[patternGroup],
    ...FINAL_SECTIONS,
  ]

  const handleScoreChange = (id: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [id]: { ...prev[id], id, score, comment: prev[id]?.comment || '' }
    }))
  }

  const handleCommentChange = (id: string, comment: string) => {
    setScores(prev => ({
      ...prev,
      [id]: { ...prev[id], id, comment, score: prev[id]?.score || 0 }
    }))
  }

  // Calculate overall average
  const allScored = Object.values(scores).filter(s => s.score > 0)
  const overallAvg = allScored.length > 0
    ? (allScored.reduce((a, b) => a + b.score, 0) / allScored.length).toFixed(1)
    : '—'
  const totalCriteria = allSections.reduce((sum, s) => sum + s.criteria.length, 0)
  const scoredCount = allScored.length

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)

    // Get latest script
    const { data: scripts } = await supabase
      .from('scripts')
      .select('id')
      .eq('project_id', projectId)
      .order('version', { ascending: false })
      .limit(1)

    if (!scripts || scripts.length === 0) {
      setSaveMsg('❌ Chưa có script để review')
      setSaving(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Build review content
    const reviewContent = JSON.stringify({
      patternGroup,
      scores,
      verdict,
      overallComment,
      overallAvg,
      scoredCount,
      totalCriteria,
      timestamp: new Date().toISOString(),
    })

    const { error } = await supabase
      .from('script_reviews')
      .insert({
        script_id: scripts[0].id,
        reviewer_id: user?.id || null,
        status: verdict === 'pass' ? 'approved' : verdict === 'rewrite' ? 'needs_revision' : 'pending',
        comments: reviewContent,
      })

    if (error) {
      setSaveMsg(`❌ Lỗi: ${error.message}`)
    } else {
      setSaveMsg('✅ Đã lưu review!')
    }
    setSaving(false)
  }

  const verdictConfig = {
    pass: { emoji: '✅', label: 'Đạt', color: 'bg-success/20 text-success border-success/30' },
    needs_fix: { emoji: '⚠️', label: 'Cần sửa', color: 'bg-warning/20 text-warning border-warning/30' },
    rewrite: { emoji: '❌', label: 'Viết lại', color: 'bg-error/20 text-error border-error/30' },
  }

  if (!scriptContent) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl mb-3 block">rate_review</span>
        <p className="text-on-surface-variant/50 text-sm mb-2">Cần có kịch bản trước khi review.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header: Pattern Group Selector + Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Review Kịch Bản</h3>
          <div className="flex items-center gap-2">
            {(Object.keys(PATTERNS) as PatternGroup[]).map(pg => {
              const p = PATTERNS[pg]
              const isActive = patternGroup === pg
              return (
                <button
                  key={pg}
                  onClick={() => setPatternGroup(pg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    isActive
                      ? 'border-opacity-50 scale-105'
                      : 'border-transparent bg-white/5 hover:bg-white/10'
                  }`}
                  style={isActive ? {
                    backgroundColor: `${p.color}20`,
                    borderColor: `${p.color}50`,
                    color: p.color,
                  } : undefined}
                >
                  {p.icon} {pg}
                </button>
              )
            })}
          </div>
        </div>

        {/* Score Summary */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Trung bình</p>
            <p className={`text-2xl font-black ${
              overallAvg === '—' ? 'text-on-surface-variant'
                : Number(overallAvg) >= 4 ? 'text-success'
                : Number(overallAvg) >= 3 ? 'text-warning'
                : 'text-error'
            }`}>
              {overallAvg}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Đã chấm</p>
            <p className="text-lg font-bold">{scoredCount}/{totalCriteria}</p>
          </div>
        </div>
      </div>

      {/* Review Phases */}
      <div>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
          Pha 1 — Hook Review (Universal)
        </p>
        <div className="space-y-3">
          {UNIVERSAL_SECTIONS.slice(0, 2).map(section => (
            <ReviewSection
              key={section.id}
              section={section}
              scores={scores}
              onScoreChange={handleScoreChange}
              onCommentChange={handleCommentChange}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
          Pha 2 — Body Review (Universal + {PATTERNS[patternGroup].icon} {patternGroup})
        </p>
        <div className="space-y-3">
          {UNIVERSAL_SECTIONS.slice(2).map(section => (
            <ReviewSection
              key={section.id}
              section={section}
              scores={scores}
              onScoreChange={handleScoreChange}
              onCommentChange={handleCommentChange}
            />
          ))}
          {PATTERN_SECTIONS[patternGroup].map(section => (
            <ReviewSection
              key={section.id}
              section={section}
              scores={scores}
              onScoreChange={handleScoreChange}
              onCommentChange={handleCommentChange}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
          Pha 3 — Final Review
        </p>
        <div className="space-y-3">
          {FINAL_SECTIONS.map(section => (
            <ReviewSection
              key={section.id}
              section={section}
              scores={scores}
              onScoreChange={handleScoreChange}
              onCommentChange={handleCommentChange}
            />
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest">Kết Luận</h4>
        <div className="flex gap-2">
          {(Object.entries(verdictConfig) as [Verdict & string, typeof verdictConfig.pass][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setVerdict(verdict === key ? null : key as Verdict)}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                verdict === key ? cfg.color : 'border-transparent bg-white/5 text-on-surface-variant hover:bg-white/10'
              }`}
            >
              {cfg.emoji} {cfg.label}
            </button>
          ))}
        </div>
        <textarea
          value={overallComment}
          onChange={(e) => setOverallComment(e.target.value)}
          placeholder="Nhận xét tổng quát..."
          rows={3}
          className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-4
                     text-sm leading-relaxed resize-y focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSave}
          disabled={saving || scoredCount === 0}
          className="primary-gradient text-on-primary-container px-6 py-2.5 rounded-lg font-bold text-sm
                     hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50
                     flex items-center gap-2"
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
            <>💾 Lưu Review</>
          )}
        </button>
        {saveMsg && (
          <p className={`text-xs font-medium ${saveMsg.startsWith('✅') ? 'text-success' : 'text-error'}`}>
            {saveMsg}
          </p>
        )}
      </div>
    </div>
  )
}
