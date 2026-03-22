import { useState, useEffect, useMemo } from 'react'
import Modal from '../ui/Modal'
import type { Idea, CreateIdeaInput, IdeaData } from '../../hooks/useIdeas'
import {
  HOA_PATTERNS,
  PATTERNS,
  PATTERN_TO_SCORING_GROUP,
  type PatternGroup,
} from '../../lib/pipelineRegistry'
import { useAI } from '../../hooks/useAI'

interface CreateIdeaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateIdeaInput) => Promise<{ error: string | null }>
  editIdea?: Idea | null
  /** Called when user wants to promote idea to video project and go to outline */
  onPromote?: (idea: Idea) => void
}

type CreateTab = 'manual' | 'ai'
type GenerateMode = 'full' | 'partial'
type GenerateTarget = 'description' | 'pattern' | 'scoring'

// 3-step flow
type FlowStep = 'create' | 'evaluate'

const GENERATE_TARGETS: { value: GenerateTarget; label: string; icon: string }[] = [
  { value: 'description', label: 'Mô tả ý tưởng', icon: 'description' },
  { value: 'pattern', label: 'Phân tích Pattern', icon: 'psychology' },
  { value: 'scoring', label: 'Đánh giá Scoring', icon: 'leaderboard' },
]

// ─── Evaluation Definitions ──────────────────────────────────────────

const GUT_CHECK_QUESTIONS = [
  'Nghe One-Liner → có muốn CHỬI villain không?',
  'Kể cho bạn bè → bạn bè có MỞ MẮT TO không?',
  'Hero có HÀNH ĐỘNG cụ thể để thắng (không phải may mắn)?',
]

const VIRAL_CHECKS = [
  { key: 'V', icon: '🎭', label: 'Victim rõ ràng', hint: 'Cựu chiến binh, bà góa, mẹ đơn thân' },
  { key: 'I', icon: '🤯', label: 'Irony / WTF', hint: '"HOA built houses on HIS land"' },
  { key: 'R', icon: '💰', label: 'Con số $ cụ thể', hint: '$500/ngày, $18,000, $250,000' },
  { key: 'A', icon: '📈', label: 'Escalation ≥3 vòng', hint: 'Phạt → Lien → Foreclosure' },
  { key: 'L', icon: '🗣️', label: 'Villain Line đáng nhớ', hint: '"Dẹp cái đống nhếch nhác đó đi"' },
  { key: '💥', icon: '💥', label: 'Payoff tương xứng', hint: 'Mất chức + bồi thường + bẽ mặt' },
]

const UNIVERSAL_CRITERIA = [
  { id: 'U1', label: 'Tiêu đề hình ảnh cụ thể? Title WOW?', max: 10 },
  { id: 'U2', label: 'Topic universal? Ai cũng relate?', max: 10 },
  { id: 'U3', label: 'Hero CHỦ ĐỘNG?', max: 10 },
  { id: 'U4', label: 'WTF Concept? 1 câu → muốn nghe tiếp?', max: 10 },
  { id: 'U5', label: '≥3 con số cụ thể? ≥2 visual moments?', max: 10 },
  { id: 'U6', label: 'Comment trigger? "What would YOU do?"', max: 10 },
]

function getScoreColor(score: number): string {
  if (score >= 90) return '#22c55e'
  if (score >= 80) return '#84cc16'
  if (score >= 70) return '#eab308'
  return '#ef4444'
}

function getScoreLabel(score: number): string {
  if (score >= 90) return '🟢🟢 TUYỆT VỜI — Viết ngay'
  if (score >= 80) return '🟢 TỐT — Có thể polish'
  if (score >= 70) return '🟡 KHẢ THI — Cần thêm 1-2 yếu tố'
  return '🔴 CHƯA ĐẠT — Cần refactor'
}

export default function CreateIdeaModal({ isOpen, onClose, onSubmit, editIdea, onPromote }: CreateIdeaModalProps) {
  // ── Flow State ────────────────────────────────────────────────
  const [flowStep, setFlowStep] = useState<FlowStep>('create')
  const [activeTab, setActiveTab] = useState<CreateTab>('manual')

  // ── Form State ────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [primaryPattern, setPrimaryPattern] = useState<string | null>(null)
  const [subPatterns, setSubPatterns] = useState<string[]>([])
  const [scoringGroup, setScoringGroup] = useState<PatternGroup>('FURY')
  const [ideaData, setIdeaData] = useState<IdeaData>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── AI Generate State ─────────────────────────────────────────
  const [generateMode, setGenerateMode] = useState<GenerateMode>('full')
  const [generateTarget, setGenerateTarget] = useState<GenerateTarget>('description')
  const [aiContext, setAiContext] = useState('')
  const [aiReady, setAiReady] = useState(false) // AI has finished generating
  const { streaming, output: aiOutput, progress: aiProgress, runPhase, reset: resetAI, abort: abortAI } = useAI({
    onComplete: (fullOutput) => {
      // Parse title
      const titleMatch = fullOutput.match(/(?:Title|Tiêu đề|Tên)[:\s]*["*]*([^\n"*]+)/i)
      if (titleMatch) setTitle(titleMatch[1].trim())
      // Parse description
      const descMatch = fullOutput.match(/(?:Mô tả|Description)[:\s]*["*]*([^\n"*](?:[\s\S]*?)(?=\n(?:\d|#|\*|One-Liner|Hero|Villain|Hook|Pattern|Sub|Nhóm|Lý do)|$))/i)
      if (descMatch) setDescription(descMatch[1].trim())
      // Parse structured fields into ideaData
      const parsed: IdeaData = {}
      const olMatch = fullOutput.match(/(?:One-Liner|One Liner)[:\s]*["*]*([^\n"*]+)/i)
      if (olMatch) parsed.one_liner = olMatch[1].trim()
      const heroMatch = fullOutput.match(/(?:Hero)[:\s]*["*]*([^\n"*]+)/i)
      if (heroMatch) parsed.hero = heroMatch[1].trim()
      const villainMatch = fullOutput.match(/(?:Villain)[:\s]*["*]*([^\n"*]+)/i)
      if (villainMatch) parsed.villain = villainMatch[1].trim()
      const vlMatch = fullOutput.match(/(?:Villain Line|Câu thoại villain)[:\s]*["*]*([^\n"*]+)/i)
      if (vlMatch) parsed.villain_line = vlMatch[1].trim()
      const victimMatch = fullOutput.match(/(?:Victim|Nạn nhân)[:\s]*["*]*([^\n"*]+)/i)
      if (victimMatch) parsed.victim_type = victimMatch[1].trim()
      const hookMatch = fullOutput.match(/(?:Hook)[:\s]*["*]*([^\n"*]+)/i)
      if (hookMatch) parsed.hook = hookMatch[1].trim()
      const payoffMatch = fullOutput.match(/(?:Payoff|Hậu quả)[:\s]*["*]*([^\n"*]+)/i)
      if (payoffMatch) parsed.payoff = payoffMatch[1].trim()
      const vfMatch = fullOutput.match(/(?:Viral Formula|Formula)[:\s]*["*]*([^\n"*]+)/i)
      if (vfMatch) parsed.viral_formula = vfMatch[1].trim()
      const tfMatch = fullOutput.match(/(?:Title Formula)[:\s]*["*]*([^\n"*]+)/i)
      if (tfMatch) parsed.title_formula = tfMatch[1].trim()
      const wtfMatch = fullOutput.match(/(?:WTF Concept)[:\s]*["*]*([^\n"*]+)/i)
      if (wtfMatch) parsed.wtf_concept = wtfMatch[1].trim()
      const ctMatch = fullOutput.match(/(?:Comment Trigger|Câu hỏi)[:\s]*["*]*([^\n"*]+)/i)
      if (ctMatch) parsed.comment_trigger = ctMatch[1].trim()
      // Parse arrays
      const twistMatches = fullOutput.match(/(?:Twist|Key Twist)\s*\d*[:\s]*["*]*([^\n"*]+)/gi)
      if (twistMatches) parsed.key_twists = twistMatches.map(m => m.replace(/^.*?[:\s]+["*]*/, '').trim())
      const escMatches = fullOutput.match(/(?:Escalation|Vòng)\s*\d*[:\s]*["*]*([^\n"*]+)/gi)
      if (escMatches) parsed.escalation = escMatches.map(m => m.replace(/^.*?[:\s]+["*]*/, '').trim())
      const numMatches = fullOutput.match(/\$[\d,.]+[KMk]?|\d+\s*(?:sqft|sq ft|ngày|tháng|năm|tuổi)/gi)
      if (numMatches) parsed.concrete_numbers = [...new Set(numMatches)]
      const themeMatch = fullOutput.match(/(?:Dual Theme|Theme)[:\s]*["*]*([^\n"*]+)/i)
      if (themeMatch) parsed.dual_themes = themeMatch[1].split(/[,+]/).map(t => t.trim()).filter(Boolean)
      if (Object.keys(parsed).length > 0) setIdeaData(prev => ({ ...prev, ...parsed }))
      setAiReady(true)

      // Re-parse scores from improve output (when AI re-evaluates after improvement)
      const scoreRegex = /U(\d)[:\s]*(\d+)/g
      let scoreMatch
      const newScores: number[] = []
      let foundScores = false
      while ((scoreMatch = scoreRegex.exec(fullOutput)) !== null) {
        const idx = parseInt(scoreMatch[1]) - 1
        const val = Math.min(10, Math.max(0, parseInt(scoreMatch[2])))
        if (idx >= 0 && idx < 6) {
          newScores[idx] = val
          foundScores = true
        }
      }
      if (foundScores) {
        setUniversalScores(prev => {
          const updated = [...prev]
          newScores.forEach((v, i) => { if (v !== undefined) updated[i] = v })
          return updated
        })
      }
      const psMatch = fullOutput.match(/Pattern[- ]Specific[:\s]*(\d+)/i)
      if (psMatch) setPatternSpecificScore(Math.min(40, Math.max(0, parseInt(psMatch[1]))))
    },
    onError: () => {
      // Reset loading state when AI fails (e.g. expired JWT, network error)
      setLoading(false)
    }
  })

  // ── Evaluation State ──────────────────────────────────────────
  const [gutChecks, setGutChecks] = useState<boolean[]>([false, false, false])
  const [viralChecks, setViralChecks] = useState<boolean[]>([false, false, false, false, false, false])
  const [universalScores, setUniversalScores] = useState<number[]>([5, 5, 5, 5, 5, 5])
  const [patternSpecificScore, setPatternSpecificScore] = useState(20)
  const [evalNotes, setEvalNotes] = useState('')
  const [evalDone, setEvalDone] = useState(false)
  const [improving, setImproving] = useState(false)
  const [preImproveScore, setPreImproveScore] = useState<number | null>(null)
  const [promoting, setPromoting] = useState(false)

  const {
    streaming: evalAiStreaming,
    output: evalAiOutput,
    progress: evalAiProgress,
    runPhase: runEvalPhase,
    reset: resetEvalAI,
    abort: abortEvalAI,
  } = useAI({
    onComplete: (fullOutput) => {
      const scoreRegex = /U(\d)[:\s]*(\d+)/g
      let match
      const newScores = [...universalScores]
      while ((match = scoreRegex.exec(fullOutput)) !== null) {
        const idx = parseInt(match[1]) - 1
        const val = Math.min(10, Math.max(0, parseInt(match[2])))
        if (idx >= 0 && idx < 6) newScores[idx] = val
      }
      setUniversalScores(newScores)
      const psMatch = fullOutput.match(/Pattern[- ]Specific[:\s]*(\d+)/i)
      if (psMatch) setPatternSpecificScore(Math.min(40, Math.max(0, parseInt(psMatch[1]))))
      const gcPasses = (fullOutput.match(/✅/g) || []).length
      if (gcPasses >= 3) setGutChecks([true, true, true])
      const viralKeys = ['V', 'I', 'R', 'A', 'L', '💥']
      const newViral = viralKeys.map(k => {
        const re = new RegExp(`${k === '💥' ? '💥|Payoff' : k}[^\\n]*(?:✅|có|đạt|pass)`, 'i')
        return re.test(fullOutput)
      })
      setViralChecks(newViral)
      setEvalDone(true)
    }
  })

  // ── Computed Scores ───────────────────────────────────────────
  const universalTotal = useMemo(() => universalScores.reduce((a, b) => a + b, 0), [universalScores])
  const totalScore = useMemo(() => universalTotal + patternSpecificScore, [universalTotal, patternSpecificScore])
  const gutCheckPass = gutChecks.every(Boolean)
  const viralCount = viralChecks.filter(Boolean).length

  // ── Reset on open/close ───────────────────────────────────────
  useEffect(() => {
    if (editIdea) {
      setTitle(editIdea.title)
      setDescription(editIdea.description || '')
      setPrimaryPattern(editIdea.primary_pattern || null)
      setSubPatterns(editIdea.sub_patterns || [])
      setScoringGroup(editIdea.scoring_group || editIdea.category)
      setIdeaData(editIdea.idea_data || {})
      setActiveTab('manual')
      setFlowStep('evaluate') // editing goes straight to eval
    } else {
      setTitle('')
      setDescription('')
      setPrimaryPattern(null)
      setSubPatterns([])
      setScoringGroup('FURY')
      setIdeaData({})
      setActiveTab('manual')
      setFlowStep('create')
    }
    setError('')
    setAiReady(false)
    setEvalDone(false)
    setImproving(false)
    setPreImproveScore(null)
    setGutChecks([false, false, false])
    setViralChecks([false, false, false, false, false, false])
    setUniversalScores([5, 5, 5, 5, 5, 5])
    setPatternSpecificScore(20)
    setEvalNotes('')
    resetAI()
    resetEvalAI()
  }, [editIdea, isOpen])

  // ── Auto-suggest scoring group ────────────────────────────────
  useEffect(() => {
    if (primaryPattern) {
      const suggested = PATTERN_TO_SCORING_GROUP[primaryPattern]
      if (suggested) setScoringGroup(suggested)
    }
  }, [primaryPattern])

  // ── Sub-pattern toggle ────────────────────────────────────────
  const toggleSubPattern = (patternId: string) => {
    if (patternId === primaryPattern) return
    setSubPatterns(prev => {
      if (prev.includes(patternId)) return prev.filter(p => p !== patternId)
      if (prev.length >= 3) return prev
      return [...prev, patternId]
    })
  }

  // ── Step 1: Create Idea (AI generate → save to DB) ─────────────
  // Phase 1: Generate content via AI (if not already generated)
  // Phase 2: Save to DB
  const handleCreateIdea = async () => {
    setLoading(true)
    setError('')

    // If no AI output yet → trigger AI generation based on selections
    if (!aiOutput.trim() && !description.trim()) {
      const patName = primaryPattern ? HOA_PATTERNS.find(p => p.id === primaryPattern)?.name : null
      const autoPrompt = `Tạo ý tưởng video YouTube HOA Stories chi tiết:\n\n${aiContext ? `Topic/Context: ${aiContext}\n` : ''}${patName ? `Pattern: ${patName}\n` : ''}Nhóm scoring: ${scoringGroup}\n${subPatterns.length > 0 ? `Sub Patterns: ${subPatterns.map(id => HOA_PATTERNS.find(p => p.id === id)?.name).filter(Boolean).join(', ')}\n` : ''}\nTrả về STRUCTURED FORMAT (mỗi field trên 1 dòng):\n\n1. **Title:** (tiêu đề hấp dẫn theo title formula)\n2. **Mô tả:** (3-5 câu chi tiết)\n3. **One-Liner:** [VICTIM yếu thế] + [BỊ HOA tấn công vì X] + [NHƯNG hero là/có Y] + [KẾT QUẢ Z]\n4. **Hero:** (ai, đặc điểm, hành động chủ động)\n5. **Villain:** (ai, chức vụ, tính cách)\n6. **Villain Line:** (1 câu thoại villain đáng nhớ)\n7. **Victim:** (loại nạn nhân — cựu chiến binh/bà góa/mẹ đơn thân/etc.)\n8. **Hook:** (câu mở đầu — villain action/quote + con số $)\n9. **WTF Concept:** (1 câu tóm tắt khiến người nghe muốn nghe tiếp)\n10. **Viral Formula:** (1-6: Identity Reveal / HOA Overreach / Property War / Financial Fraud / MC Extreme / Sympathetic Victim)\n11. **Title Formula:** (Action+HUGE Mistake / Unaware I'm / I Let-Waited / $Number+Trigger / NOT Part of HOA / MC Format)\n12. **Dual Theme:** (≥2 theme kết hợp)\n13. **Twist 1:** (twist đầu tiên)\n14. **Twist 2:** (twist thứ hai)\n15. **Twist 3:** (twist thứ ba)\n16. **Escalation 1:** (vòng escalation đầu)\n17. **Escalation 2:** (vòng thứ hai)\n18. **Escalation 3:** (vòng thứ ba)\n19. **Payoff:** (hậu quả cụ thể cho villain)\n20. **Con số cụ thể:** (liệt kê $, sqft, ngày, tuổi)\n21. **Comment Trigger:** (câu hỏi gây tranh cãi)\n22. **Primary Pattern:** phù hợp nhất\n23. **Sub Patterns:** gợi ý (0-3)\n24. **Nhóm scoring:** (FURY/STRATEGY/COMEDY)`
      await runPhase('idea', '', autoPrompt, scoringGroup)
      // After AI finishes, onComplete will parse fields + set aiReady=true
      // The actual save will happen in the useEffect below
      return // Don't save yet, wait for AI to finish
    }

    // Manual tab or AI already generated → save to DB now
    await saveIdeaToDB()
  }

  // Save idea to DB (called after AI generates or if content already exists)
  const saveIdeaToDB = async () => {
    let finalTitle = title.trim()
    if (!finalTitle) {
      const pat = primaryPattern ? HOA_PATTERNS.find(p => p.id === primaryPattern) : null
      finalTitle = pat
        ? `${pat.icon} ${pat.name} — ${scoringGroup}`
        : `Idea ${scoringGroup} — ${new Date().toLocaleDateString('vi-VN')}`
    }
    const { error } = await onSubmit({
      title: finalTitle,
      description: description.trim() || aiOutput.trim() || undefined,
      category: scoringGroup,
      primary_pattern: primaryPattern || undefined,
      sub_patterns: subPatterns.length > 0 ? subPatterns : undefined,
      scoring_group: scoringGroup,
      idea_data: Object.keys(ideaData).length > 0 ? ideaData : undefined,
    })
    if (error) {
      setError(error)
    } else {
      if (!title.trim()) setTitle(finalTitle)
      setFlowStep('evaluate')
    }
    setLoading(false)
  }

  // Auto-save after AI finishes generating (when triggered from handleCreateIdea)
  useEffect(() => {
    if (aiReady && loading && flowStep === 'create') {
      saveIdeaToDB()
    }
  }, [aiReady])

  // Safety net: reset loading if AI enters error state
  useEffect(() => {
    if (aiProgress === 'error' && loading) {
      setError('AI gặp lỗi. Vui lòng thử lại.')
      setLoading(false)
    }
  }, [aiProgress])

  // ── AI Generate ───────────────────────────────────────────────
  const handleAiGenerate = async () => {
    resetAI()
    setAiReady(false)
    const patName = primaryPattern ? HOA_PATTERNS.find(p => p.id === primaryPattern)?.name : null
    const inputText = generateMode === 'full'
      ? `Tạo ý tưởng video YouTube HOA Stories từ topic sau:\n\n${aiContext || 'HOA bắt nạt cư dân'}\n${patName ? `\nPattern gợi ý: ${patName}` : ''}\n${scoringGroup ? `Nhóm scoring: ${scoringGroup}` : ''}\n\nTrả về STRUCTURED FORMAT (mỗi field trên 1 dòng):\n\n1. **Title:** (tiêu đề hấp dẫn theo title formula)\n2. **Mô tả:** (3-5 câu chi tiết)\n3. **One-Liner:** [VICTIM yếu thế] + [BỊ HOA tấn công vì X] + [NHƯNG hero là/có Y] + [KẾT QUẢ Z]\n4. **Hero:** (ai, đặc điểm, hành động chủ động)\n5. **Villain:** (ai, chức vụ, tính cách)\n6. **Villain Line:** (1 câu thoại villain đáng nhớ, đủ ghét để quote)\n7. **Victim:** (loại nạn nhân — cựu chiến binh/bà góa/mẹ đơn thân/etc.)\n8. **Hook:** (câu mở đầu — villain action/quote + con số $)\n9. **WTF Concept:** (1 câu tóm tắt khiến người nghe muốn nghe tiếp)\n10. **Viral Formula:** (1-6: Identity Reveal / HOA Overreach / Property War / Financial Fraud / MC Extreme / Sympathetic Victim)\n11. **Title Formula:** (Action+HUGE Mistake / Unaware I'm / I Let-Waited / $Number+Trigger / NOT Part of HOA / MC Format)\n12. **Dual Theme:** (≥2 theme kết hợp, vd: phân biệt + gia đình)\n13. **Twist 1:** (twist đầu tiên)\n14. **Twist 2:** (twist thứ hai)\n15. **Twist 3:** (twist thứ ba)\n16. **Escalation 1:** (vòng escalation đầu)\n17. **Escalation 2:** (vòng thứ hai)\n18. **Escalation 3:** (vòng thứ ba)\n19. **Payoff:** (hậu quả cụ thể cho villain — mất chức/bồi thường/bẽ mặt)\n20. **Con số cụ thể:** (liệt kê $, sqft, ngày, tuổi)\n21. **Comment Trigger:** (câu hỏi gây tranh cãi cho viewer)\n22. **Primary Pattern:** phù hợp nhất\n23. **Sub Patterns:** gợi ý (0-3)\n24. **Nhóm scoring:** (FURY/STRATEGY/COMEDY)`
      : generateTarget === 'description'
        ? `Viết mô tả chi tiết (3-5 câu) cho ý tưởng video HOA Stories:\n${patName ? `Pattern: ${patName}` : ''}\nScoring: ${scoringGroup}\n${aiContext ? `Context: ${aiContext}` : 'Tạo mô tả hấp dẫn cho pattern này'}`
        : generateTarget === 'pattern'
          ? `Phân tích và xác định HOA Story Pattern phù hợp nhất:\n${aiContext ? `Context: ${aiContext}` : 'Gợi ý pattern phổ biến nhất'}\n\n9 patterns: Malicious Compliance, Board Takeover, Dissolve HOA, Sympathetic Victim, Legal Trap, Property Rights, Financial Fraud, Foreclosure, Community Comedy\n\nTrả về: Pattern chính + lý do, Sub patterns gợi ý, Nhóm scoring`
          : `Đánh giá nhanh scoring cho idea:\nPattern: ${patName || 'chưa xác định'}\nScoring group: ${scoringGroup}\n${aiContext ? `Context: ${aiContext}` : ''}\n\nPhân tích sơ bộ Universal criteria (U1-U6) và Pattern-Specific tiềm năng.`
    await runPhase('idea', '', inputText, scoringGroup)
  }

  // ── AI Evaluate ───────────────────────────────────────────────
  const handleAiEvaluate = async () => {
    resetEvalAI()
    const patName = primaryPattern ? HOA_PATTERNS.find(p => p.id === primaryPattern)?.name : null
    const ideaText = `Title: ${title || '(chưa có)'}\nMô tả: ${description || aiOutput || '(chưa có)'}\nPattern: ${patName || '(chưa chọn)'}\nScoring Group: ${scoringGroup}`

    // Build pattern-specific scoring criteria based on selected group
    const patternCriteria = scoringGroup === 'FURY'
      ? `🔥 FURY (40 điểm): Nhân vật đồng cảm (x2) + Dual theme (x2) + Villain Line đáng nhớ (x1.5) + Villain ghê tởm (x1.5) + Escalation ≥3 vòng (x1.5) + Vật thể cảm xúc + Community rally`
      : scoringGroup === 'STRATEGY'
        ? `🧠 STRATEGY (40 điểm): Checkmate moment (x2) + Pháp lý credible (x2) + Chuỗi twist ≥3 (x1.5) + Villain quyền lực (x1.5) + Research journey (x1.5) + Ally + Hậu quả cụ thể`
        : `😂 COMEDY (40 điểm): Visual comedy WTF (x2) + Escalation Loop ≥2 (x2) + Punchline (x1.5) + Community tham gia (x1.5) + Villain kiêu ngạo→bẽ mặt (x1.5) + Technically correct + Celebration ending`

    const evalPrompt = `Đánh giá chi tiết idea HOA Stories theo HỆ THỐNG SCORING từ idea-formulas.md:

${ideaText}

---

## KIẾN THỨC ĐÁNH GIÁ (từ idea-formulas.md):

### 6 VIRAL FORMULAS ĐÃ CHỨNG MINH:
1. IDENTITY REVEAL (2.3M-3.8M views) — Villain hạ nhục NPC → NPC là OWNER/CEO/COP
2. HOA OVERREACH — HOA phạt → Nhà KHÔNG thuộc HOA → Legal checkmate
3. PROPERTY WAR — Chiếm đất → Hero im lặng → Thuê surveyor → Buộc dỡ
4. FINANCIAL FRAUD — Treasurer biển thủ → Hero audit → Vạch trần
5. MALICIOUS COMPLIANCE EXTREME — HOA luật vô lý → Tuân thủ 100% → HOA tự hại
6. SYMPATHETIC VICTIM — Victim yếu thế + Community rally → David vs Goliath

### RED FLAGS CẦN CHECK:
🔴 (1) Cốt truyện tuyến tính đoán trước (2) Nhân vật phẳng (3) Hero bị động (4) Thiếu con số (5) Topic niche
🟡 (6) Lỗ hổng logic (7) Hero chịu đựng quá lâu (8) Villain thiếu hậu quả (9) Kết quá perfect (10) Chỉ 1 twist (11) Thiếu debate

### TITLE ENGINEERING RULES:
- Con số CỤ THỂ > không có số | CAPS = fury trigger | Curiosity gap
- 6 Formulas: Action+"HUGE Mistake!" | "Unaware I'm [Identity]" | "I Let/Waited" | $Number+Trigger | "NOT Part of HOA" | MC Format

---

## YÊU CẦU OUTPUT FORMAT CHÍNH XÁC:

### GUT CHECK:
- Câu 1: [✅/❌] Nghe One-Liner → muốn chửi villain? — [giải thích]
- Câu 2: [✅/❌] Kể bạn bè → mở mắt to? — [giải thích]  
- Câu 3: [✅/❌] Hero hành động cụ thể? — [giải thích]

### V.I.R.A.L:
- V (Victim): [✅/❌] — [ai là victim? rõ ràng không?]
- I (Irony/WTF): [✅/❌] — [yếu tố WTF/irony là gì?]
- R (Con số $): [✅/❌] — [có con số cụ thể? bao nhiêu?]
- A (Escalation): [✅/❌] — [bao nhiêu vòng? liệt kê]
- L (Villain Line): [✅/❌] — [câu nói villain là gì?]
- 💥 (Payoff): [✅/❌] — [hậu quả villain cụ thể?]

### UNIVERSAL (60 điểm):
- U1: [điểm]/10 — Tiêu đề hình ảnh cụ thể? Title theo formula nào? [phân tích]
- U2: [điểm]/10 — Topic universal? Ai relate? [phân tích]
- U3: [điểm]/10 — Hero chủ động ra sao? [phân tích]
- U4: [điểm]/10 — WTF Concept? 1 câu tóm? [phân tích]
- U5: [điểm]/10 — Con số + visual moments? [liệt kê]
- U6: [điểm]/10 — Comment trigger? Câu hỏi mở? [phân tích]

### PATTERN-SPECIFIC (${scoringGroup}, 40 điểm):
${patternCriteria}
Pattern-Specific: [tổng]/40 — [đánh giá từng tiêu chí x2/x1.5]

### RED FLAGS PHÁT HIỆN:
- [liệt kê red flags nếu có, theo 15 red flags ở trên]

### GỢI Ý CẢI THIỆN (cụ thể, actionable):
1. [gợi ý 1 — fix điểm yếu nào? bằng cách nào?]
2. [gợi ý 2]
3. [gợi ý 3]`

    await runEvalPhase('idea', '', evalPrompt, scoringGroup)
  }

  // ── Scoring group options ─────────────────────────────────────
  const SCORING_OPTIONS: { value: PatternGroup; label: string; icon: string; desc: string }[] = [
    { value: 'FURY', label: 'FURY', icon: '🔥', desc: 'Phẫn nộ → Hả hê' },
    { value: 'STRATEGY', label: 'STRATEGY', icon: '🧠', desc: 'Hồi hộp → Nể phục' },
    { value: 'COMEDY', label: 'COMEDY', icon: '😂', desc: 'Bực → Cười → Sảng khoái' },
  ]

  // ── Modal title based on step ─────────────────────────────────
  const modalTitle = flowStep === 'evaluate'
    ? '📊 Đánh Giá Idea'
    : editIdea ? 'Chỉnh Sửa Ý Tưởng' : 'Tạo Ý Tưởng Mới'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="lg">
      <div className="space-y-5">

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 1: CREATE — Tabs + Submit                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        {flowStep === 'create' && (
          <>
            {/* Tab Selector */}
            <div className="flex gap-0 border border-white/10 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'manual'
                    ? 'bg-amber-500/15 text-amber-400 border-b-2 border-amber-400'
                    : 'bg-white/3 text-on-surface-variant hover:bg-white/5'
                }`}
              >
                <span className="text-base">🎯</span>
                Chọn Pattern Thủ Công
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'ai'
                    ? 'bg-violet-500/15 text-violet-400 border-b-2 border-violet-400'
                    : 'bg-white/3 text-on-surface-variant hover:bg-white/5'
                }`}
              >
                <span className="text-base">🤖</span>
                AI Tạo Idea
              </button>
            </div>

            {/* ─── TAB 1: Manual ──────────────────────────────── */}
            {activeTab === 'manual' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-widest text-on-surface-variant mb-2">
                    Pattern chính — chọn 1
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {HOA_PATTERNS.map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => setPrimaryPattern(prev => prev === pat.id ? null : pat.id)}
                        className={`py-2 px-2 rounded-lg border text-left transition-all text-[11px] leading-tight flex items-start gap-1.5 ${
                          primaryPattern === pat.id
                            ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <span className="text-sm flex-shrink-0 mt-px">{pat.icon}</span>
                        <span className={`${primaryPattern === pat.id ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                          {pat.name} — <span className="text-[9px] opacity-70">{pat.name_vi}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-widest text-on-surface-variant mb-2">
                    Pattern phụ (combo) — 0-3
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {HOA_PATTERNS.filter(p => p.id !== primaryPattern).map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => toggleSubPattern(pat.id)}
                        className={`py-1 px-2.5 rounded-lg border text-[10px] transition-all flex items-center gap-1 ${
                          subPatterns.includes(pat.id)
                            ? 'border-tertiary/50 bg-tertiary/10 text-tertiary'
                            : 'border-white/10 bg-white/5 text-on-surface-variant hover:bg-white/10'
                        } ${subPatterns.length >= 3 && !subPatterns.includes(pat.id) ? 'opacity-30 cursor-not-allowed' : ''}`}
                        disabled={subPatterns.length >= 3 && !subPatterns.includes(pat.id)}
                      >
                        <span>{pat.icon}</span>
                        <span>{pat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-widest text-on-surface-variant mb-2">
                    Nhóm scoring — chọn 1
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SCORING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setScoringGroup(opt.value)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          scoringGroup === opt.value
                            ? 'ring-1 ring-primary/30'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                        }`}
                        style={scoringGroup === opt.value ? {
                          borderColor: PATTERNS[opt.value].color + '50',
                          backgroundColor: PATTERNS[opt.value].color + '15',
                        } : undefined}
                      >
                        <span className="block text-xl mb-1">{opt.icon}</span>
                        <span className={`text-[10px] font-bold tracking-wider block ${
                          scoringGroup === opt.value ? '' : 'text-on-surface-variant'
                        }`}
                          style={scoringGroup === opt.value ? { color: PATTERNS[opt.value].color } : undefined}
                        >
                          {opt.label}
                        </span>
                        <span className="text-[9px] text-on-surface-variant/60 block mt-0.5 leading-tight">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 2: AI Generate ────────────────────────── */}
            {activeTab === 'ai' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex gap-1.5 p-1 bg-surface-container-highest rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGenerateMode('full')}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                      generateMode === 'full'
                        ? 'bg-primary/20 text-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-white/5'
                    }`}
                  >
                    🚀 Tạo toàn bộ
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenerateMode('partial')}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                      generateMode === 'partial'
                        ? 'bg-primary/20 text-primary shadow-sm'
                        : 'text-on-surface-variant hover:bg-white/5'
                    }`}
                  >
                    🔧 Tạo từng phần
                  </button>
                </div>

                {generateMode === 'partial' && (
                  <div className="flex gap-1.5">
                    {GENERATE_TARGETS.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setGenerateTarget(t.value)}
                        className={`flex-1 py-2 rounded-lg border text-[10px] font-medium transition-all flex items-center justify-center gap-1 ${
                          generateTarget === t.value
                            ? 'border-tertiary/40 bg-tertiary/10 text-tertiary'
                            : 'border-white/10 bg-white/5 text-on-surface-variant hover:bg-white/10'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  placeholder={generateMode === 'full'
                    ? 'Nhập topic, link Reddit, hoặc mô tả idea thô...'
                    : 'Context thêm cho AI (tùy chọn)...'}
                  rows={3}
                  className="w-full resize-none text-xs"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={streaming || !aiContext.trim()}
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2
                             transition-all disabled:opacity-30 disabled:cursor-not-allowed
                             hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                    color: '#fff',
                  }}
                >
                  {streaming ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang tạo...
                    </>
                  ) : (
                    <>🤖 {generateMode === 'full' ? 'Generate Idea' : `Generate: ${GENERATE_TARGETS.find(t => t.value === generateTarget)?.label}`}</>
                  )}
                </button>

                {streaming && (
                  <button type="button" onClick={abortAI} className="w-full text-center text-[10px] text-error hover:text-error-dim">
                    ⏹ Dừng
                  </button>
                )}

                {(aiOutput || aiProgress === 'error') && (
                  <div className="rounded-lg p-3 bg-surface-container-lowest border border-white/10 max-h-[250px] overflow-y-auto">
                    <pre className="text-[11px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-body">
                      {aiOutput}
                      {streaming && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm bg-violet-400" />
                      )}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error animate-fade-in">
                {error}
              </div>
            )}

            {/* ─── CREATE BUTTON (always visible in step 1) ──── */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateIdea}
                disabled={loading || (activeTab === 'ai' && !aiReady && !aiOutput)}
                className="primary-gradient text-on-primary-container px-6 py-2.5 rounded-lg font-bold text-sm 
                           hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : '✨ Tạo Ý Tưởng'}
              </button>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 2: EVALUATE — After idea is created               */}
        {/* ═══════════════════════════════════════════════════════ */}
        {flowStep === 'evaluate' && (
          <div className="space-y-4 animate-fade-in">

            {/* Idea Summary */}
            <div className="rounded-xl p-3 bg-white/5 border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  {title && <p className="text-sm font-bold text-on-surface mb-1">{title}</p>}
                  {description && <p className="text-[11px] text-on-surface-variant line-clamp-2">{description}</p>}
                </div>
                <span className="text-[9px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                  ✅ Đã tạo
                </span>
              </div>
              {primaryPattern && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {HOA_PATTERNS.find(p => p.id === primaryPattern)?.icon} {HOA_PATTERNS.find(p => p.id === primaryPattern)?.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md border"
                    style={{ borderColor: PATTERNS[scoringGroup].color + '40', color: PATTERNS[scoringGroup].color }}
                  >
                    {PATTERNS[scoringGroup].icon} {scoringGroup}
                  </span>
                </div>
              )}
            </div>

            {/* AI Evaluate Button */}
            <button
              type="button"
              onClick={handleAiEvaluate}
              disabled={evalAiStreaming}
              className="w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2
                         transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#fff',
              }}
            >
              {evalAiStreaming ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI đang đánh giá...
                </>
              ) : (
                <>🤖 AI Đánh Giá Tự Động</>
              )}
            </button>

            {evalAiStreaming && (
              <button type="button" onClick={abortEvalAI} className="w-full text-center text-[10px] text-error hover:text-error-dim">
                ⏹ Dừng
              </button>
            )}

            {/* ─── SCORING DETAILS (shown after AI evaluates) ── */}
            {(evalDone || evalAiOutput) && (
              <>
                {/* AI Eval Output */}
                {(evalAiOutput || evalAiProgress === 'error') && (
                  <div className="rounded-lg p-3 bg-surface-container-lowest border border-white/10 max-h-[200px] overflow-y-auto">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/50 mb-1">AI Analysis</p>
                    <pre className="text-[11px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-body">
                      {evalAiOutput}
                      {evalAiStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm bg-emerald-400" />
                      )}
                    </pre>
                  </div>
                )}

                {/* TOTAL SCORE */}
                <div className="rounded-xl p-4 border text-center" style={{
                  borderColor: getScoreColor(totalScore) + '40',
                  backgroundColor: getScoreColor(totalScore) + '08',
                }}>
                  <div className="text-3xl font-black" style={{ color: getScoreColor(totalScore) }}>
                    {totalScore}<span className="text-base font-normal text-on-surface-variant">/100</span>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: getScoreColor(totalScore) }}>
                    {getScoreLabel(totalScore)}
                  </p>
                  <div className="flex justify-center gap-4 mt-2 text-[9px] text-on-surface-variant/60">
                    <span>Universal: {universalTotal}/60</span>
                    <span>Pattern: {patternSpecificScore}/40</span>
                    <span>Gut: {gutCheckPass ? '✅' : '❌'}</span>
                    <span>VIRAL: {viralCount}/6</span>
                  </div>
                </div>

                {/* Gut Check */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Gut Check — 3/3 bắt buộc {gutCheckPass ? '✅' : '❌'}
                  </p>
                  <div className="space-y-1.5">
                    {GUT_CHECK_QUESTIONS.map((q, i) => (
                      <label key={i} className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={gutChecks[i]}
                          onChange={() => setGutChecks(prev => { const n = [...prev]; n[i] = !n[i]; return n })}
                          className="mt-0.5 accent-emerald-500"
                        />
                        <span className={`text-[11px] leading-tight ${gutChecks[i] ? 'text-emerald-400' : 'text-on-surface-variant'} group-hover:text-on-surface transition-colors`}>
                          {q}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* V.I.R.A.L */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    V.I.R.A.L — {viralCount}/6 {viralCount >= 5 ? '🟢' : viralCount >= 4 ? '🟡' : '🔴'}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {VIRAL_CHECKS.map((v, i) => (
                      <label key={v.key} className="flex items-start gap-2 cursor-pointer group py-1.5 px-2 rounded-lg border border-white/5 hover:border-white/15 transition-colors">
                        <input
                          type="checkbox"
                          checked={viralChecks[i]}
                          onChange={() => setViralChecks(prev => { const n = [...prev]; n[i] = !n[i]; return n })}
                          className="mt-0.5 accent-emerald-500"
                        />
                        <div>
                          <span className={`text-[11px] font-medium ${viralChecks[i] ? 'text-emerald-400' : 'text-on-surface-variant'}`}>
                            {v.icon} {v.key} — {v.label}
                          </span>
                          <span className="block text-[9px] text-on-surface-variant/50 leading-tight">{v.hint}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Universal Scoring */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Universal ({universalTotal}/60)
                  </p>
                  <div className="space-y-2">
                    {UNIVERSAL_CRITERIA.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-on-surface-variant w-6 flex-shrink-0">{c.id}</span>
                        <input
                          type="range" min={0} max={10}
                          value={universalScores[i]}
                          onChange={(e) => setUniversalScores(prev => { const n = [...prev]; n[i] = parseInt(e.target.value); return n })}
                          className="flex-1 h-1.5 accent-emerald-500"
                        />
                        <span className="text-[11px] font-bold w-6 text-right" style={{ color: universalScores[i] >= 7 ? '#22c55e' : universalScores[i] >= 5 ? '#eab308' : '#ef4444' }}>
                          {universalScores[i]}
                        </span>
                        <span className="text-[9px] text-on-surface-variant/50 w-[140px] truncate hidden lg:block">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pattern-Specific */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                    Pattern-Specific — {scoringGroup} ({patternSpecificScore}/40)
                  </p>
                  <input
                    type="range" min={0} max={40}
                    value={patternSpecificScore}
                    onChange={(e) => setPatternSpecificScore(parseInt(e.target.value))}
                    className="w-full h-2 accent-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-on-surface-variant/50 mt-1">
                    <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span>
                  </div>
                </div>

                {/* ─── IMPROVE BUTTON (after eval is done) ───── */}
                {evalDone && (
                  <button
                    type="button"
                    onClick={async () => {
                      setPreImproveScore(totalScore)
                      setImproving(true)
                      resetAI()
                      const patName = primaryPattern ? HOA_PATTERNS.find(p => p.id === primaryPattern)?.name : null
                      const improvePrompt = `Cải thiện idea HOA Stories dựa trên đánh giá:\n\nIdea hiện tại:\nTitle: ${title}\nMô tả: ${description || aiOutput}\nPattern: ${patName || 'chưa chọn'}\nScoring: ${scoringGroup}\n\nĐiểm đánh giá: ${totalScore}/100\nUniversal: ${universalTotal}/60\nPattern-Specific: ${patternSpecificScore}/40\nGut Check: ${gutCheckPass ? 'PASS' : 'FAIL'}\nV.I.R.A.L: ${viralCount}/6\n\nPhân tích AI:\n${evalAiOutput}\n\nHãy tạo phiên bản CẢI THIỆN với format:\n1. **Title:** (cải thiện tiêu đề hấp dẫn hơn)\n2. **Mô tả:** (3-5 câu chi tiết hơn, fix các điểm yếu)\n3. **Điểm cải thiện:** liệt kê cụ thể đã fix gì\n4. **Dự đoán điểm mới:** /100\n\nSau đó RE-EVALUATE với format chính xác:\n- U1: [điểm]/10\n- U2: [điểm]/10\n- U3: [điểm]/10\n- U4: [điểm]/10\n- U5: [điểm]/10\n- U6: [điểm]/10\n- Pattern-Specific: [điểm]/40`
                      await runPhase('idea', '', improvePrompt, scoringGroup)
                      setImproving(false)
                    }}
                    disabled={improving || streaming}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2
                               transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: '#0c0e12',
                    }}
                  >
                    {improving || streaming ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang cải thiện...
                      </>
                    ) : (
                      <>🔄 Cải Thiện Idea Theo Đề Xuất</>
                    )}
                  </button>
                )}

                {/* Improve Output */}
                {(improving || (aiOutput && evalDone)) && aiOutput && (
                  <div className="rounded-lg p-3 bg-amber-500/5 border border-amber-500/20 max-h-[250px] overflow-y-auto">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-amber-400/50 mb-1">Phiên Bản Cải Thiện</p>
                    <pre className="text-[11px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-body">
                      {aiOutput}
                      {streaming && (
                        <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm bg-amber-400" />
                      )}
                    </pre>
                  </div>
                )}

                {/* ─── SCORE COMPARISON (after improve) ───────── */}
                {preImproveScore !== null && aiOutput && !streaming && (
                  <div className="rounded-xl p-4 border border-amber-500/20 bg-amber-500/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80 mb-3">📊 So Sánh Điểm</p>
                    <div className="flex items-center justify-center gap-6">
                      {/* Before */}
                      <div className="text-center">
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Trước</p>
                        <div className="text-2xl font-black" style={{ color: getScoreColor(preImproveScore) }}>
                          {preImproveScore}<span className="text-xs font-normal text-on-surface-variant">/100</span>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="text-xl">
                        {totalScore > preImproveScore ? '📈' : totalScore === preImproveScore ? '➡️' : '📉'}
                      </div>
                      {/* After */}
                      <div className="text-center">
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Sau</p>
                        <div className="text-2xl font-black" style={{ color: getScoreColor(totalScore) }}>
                          {totalScore}<span className="text-xs font-normal text-on-surface-variant">/100</span>
                        </div>
                      </div>
                      {/* Delta */}
                      {totalScore !== preImproveScore && (
                        <div className="text-center">
                          <p className="text-[9px] text-on-surface-variant uppercase tracking-wider mb-1">Chênh</p>
                          <div className={`text-lg font-bold ${totalScore > preImproveScore ? 'text-emerald-400' : 'text-red-400'}`}>
                            {totalScore > preImproveScore ? '+' : ''}{totalScore - preImproveScore}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-center mt-2" style={{ color: getScoreColor(totalScore) }}>
                      {getScoreLabel(totalScore)}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Eval Notes */}
            <textarea
              value={evalNotes}
              onChange={(e) => setEvalNotes(e.target.value)}
              placeholder="Ghi chú đánh giá (tùy chọn)..."
              rows={2}
              className="w-full resize-none text-xs"
            />

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10 transition-colors"
              >
                Xong
              </button>

              {/* → Promote to Outline button */}
              {evalDone && onPromote && editIdea && (
                <button
                  type="button"
                  onClick={async () => {
                    setPromoting(true)
                    onPromote(editIdea)
                  }}
                  disabled={promoting}
                  className="px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2
                             hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    color: '#fff',
                  }}
                >
                  {promoting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang chuyển...
                    </>
                  ) : (
                    <>📋 Lên Dàn Ý →</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
