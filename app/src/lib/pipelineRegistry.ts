/**
 * Pipeline Registry — Source of Truth for the 7-phase production pipeline.
 * Derived from PIPELINE-REGISTRY.json (Process/ folder).
 *
 * Pipeline: Idea → Outline → Script Vi → Review → Script En → Script VO → Title
 *
 * All phase metadata (names, colors, icons, steps, IO, rules) live here.
 * Components import from this file instead of hardcoding stages.
 */

// ─── Types ──────────────────────────────────────────────────────────

export type Stage = 'idea' | 'outline' | 'script_vi' | 'review' | 'script_en' | 'script_vo' | 'title' | 'done'

export type PatternGroup = 'FURY' | 'STRATEGY' | 'COMEDY'

export interface PhaseStep {
  step_id: string
  name: string
  description: string
  pause_after?: boolean
  pause_message?: string
}

export interface WorkflowRef {
  id: string
  file: string
  name: string
}

export interface RuleRef {
  file: string
  purpose: string
  used_in_step?: string
  variants?: Record<string, string>
}

export interface PipelinePhase {
  id: string
  phase_number: number
  name: string
  name_en: string
  icon: string
  color: string
  estimated_time_min: number
  description: string
  description_en: string
  stage: Stage            // maps phase → Stage enum used by DB
  steps: PhaseStep[]
  workflows: WorkflowRef[]
  rules_required: RuleRef[]
  dependencies: string[]
  can_skip: boolean
}

export interface PatternInfo {
  icon: string
  color: string
  name: string
  name_vi: string
  description: string
  emotion_flow: string
  hero_weapon: string
  climax_ending: string
  cliffhanger_tone: string
}

// ─── Phase Definitions ──────────────────────────────────────────────

export const PHASES: PipelinePhase[] = [
  {
    id: 'idea-evaluation',
    phase_number: 1,
    name: 'Ý Tưởng',
    name_en: 'Idea Brainstorm',
    icon: '💡',
    color: '#F59E0B',
    estimated_time_min: 20,
    description: 'Brainstorm ý tưởng với AI, sàng lọc & đánh giá idea.',
    description_en: 'Brainstorm ideas with AI, evaluate using research-backed scoring system.',
    stage: 'idea',
    steps: [
      { step_id: '1-1', name: 'Brainstorm với AI', description: 'Nhập topic → AI gợi ý ideas dựa trên 9 story patterns' },
      { step_id: '1-1.5', name: 'Xác định HOA Story Pattern', description: 'Match idea với 9 HOA patterns' },
      { step_id: '1-1.7', name: 'Xác định nhóm scoring', description: 'Chọn FURY / STRATEGY / COMEDY' },
      { step_id: '1-2', name: 'Chấm điểm Universal + Pattern-Specific', description: 'Universal (U1-U6) + Pattern-Specific (Tier S/A/B)' },
      { step_id: '1-3', name: 'Red Flags + Tính điểm tổng', description: 'Kiểm tra red flags, tính tổng /100', pause_after: true, pause_message: 'Trình kết quả cho user duyệt' },
    ],
    workflows: [
      { id: 'danh-gia-idea', file: 'Idea Process/workflows/danh-gia-idea.md', name: 'Đánh giá idea (P1)' },
      { id: 'danh-gia-idea-p2', file: 'Idea Process/workflows/danh-gia-idea-p2.md', name: 'Đánh giá idea (P2)' },
    ],
    rules_required: [],
    dependencies: [],
    can_skip: true,
  },
  {
    id: 'outline-creation',
    phase_number: 2,
    name: 'Dàn Ý',
    name_en: 'Outline Creation',
    icon: '📋',
    color: '#3B82F6',
    estimated_time_min: 45,
    description: 'Tạo dàn ý chi tiết gồm Story Prep, Character Blueprint, Arc Map.',
    description_en: 'Create detailed outline including story prep, character blueprints, arc mapping.',
    stage: 'outline',
    steps: [
      { step_id: '2-step1', name: 'Story Prep + Character + Inventory', description: 'Ticking Clock, Binary Forces, Object, Character Blueprint (3 C\'s)', pause_after: true, pause_message: 'Trình Story Prep cho user xác nhận' },
      { step_id: '2-step2', name: 'Arc Map + Outline hoàn chỉnh', description: 'Mini Arc Mapping, Retention Hook Map, Emotional Ladder', pause_after: true, pause_message: 'Trình outline cho user duyệt' },
    ],
    workflows: [
      { id: 'tao-dan-y', file: 'Outline Process/workflow/tao-dan-y.md', name: 'Tạo dàn ý kịch bản' },
    ],
    rules_required: [
      { file: 'Outline Process/core-rules/story-prep.md', purpose: 'Character Blueprint, Object, Forces' },
      { file: 'Outline Process/core-rules/structure-and-technique.md', purpose: 'Mini Arc, Therefore Test' },
      { file: 'Outline Process/format-rules/outline-creator.md', purpose: 'Output format' },
    ],
    dependencies: ['idea-evaluation'],
    can_skip: true,
  },
  {
    id: 'script-vi',
    phase_number: 3,
    name: 'Kịch Bản Vi',
    name_en: 'Vietnamese Script',
    icon: '✍️',
    color: '#8B5CF6',
    estimated_time_min: 90,
    description: 'Viết kịch bản tiếng Việt. Hỗ trợ comment từng dòng để yêu cầu AI chỉnh sửa.',
    description_en: 'Write Vietnamese script with inline commenting for AI-assisted line-by-line editing.',
    stage: 'script_vi',
    steps: [
      { step_id: '3-step1', name: 'Viết Hook (P1) — Tiếng Việt', description: 'Reddit Synopsis, Villain Opening, Narrator greeting', pause_after: true, pause_message: 'Gửi hook cho user duyệt' },
      { step_id: '3-step2', name: 'Viết Body (P2-P9) — Tiếng Việt', description: 'Setup + Escalation + Climax + Ending', pause_after: true, pause_message: 'Gửi body cho user duyệt' },
      { step_id: '3-step3', name: 'Ghép + Tinh chỉnh', description: 'Ghép Hook + Body, tinh chỉnh từ comment inline', pause_after: true, pause_message: 'Gửi script VI cho user duyệt' },
    ],
    workflows: [
      { id: 'viet-kich-ban', file: 'Script Process/workflow/viet-kich-ban.md', name: 'Viết kịch bản' },
    ],
    rules_required: [
      { file: 'Script Process/phase-rules/phase-1-hook.md', purpose: 'Hook writing rules', used_in_step: '3-step1' },
      { file: 'Script Process/phase-rules/phase-2-body-{pattern}.md', purpose: 'Body writing rules (pattern-specific)', used_in_step: '3-step2', variants: { FURY: 'phase-2-body-fury.md', STRATEGY: 'phase-2-body-strategy.md', COMEDY: 'phase-2-body-comedy.md' } },
      { file: 'Script Process/format-and-wording/script-format-checklist.md', purpose: 'Format rules', used_in_step: '3-step3' },
      { file: 'Script Process/format-and-wording/script-wording-formula.md', purpose: 'Bảng sửa lỗi từ ngữ VI', used_in_step: '3-step3' },
    ],
    dependencies: ['outline-creation'],
    can_skip: false,
  },
  {
    id: 'review',
    phase_number: 4,
    name: 'Review',
    name_en: 'Script Review',
    icon: '🔍',
    color: '#EF4444',
    estimated_time_min: 45,
    description: 'Review kịch bản 3 pha (Hook → Body → Final), đánh giá Universal + Pattern-Specific.',
    description_en: '3-phase script review: Hook → Body → Final.',
    stage: 'review',
    steps: [
      { step_id: '4-pha1', name: 'Review Hook', description: 'Rà soát Hook: 3-step structure, Villain Line, Macro Question' },
      { step_id: '4-pha2', name: 'Review Body', description: 'Rà soát Body (P2-P9): Craft, Pacing, Mini Arcs, Pattern-specific' },
      { step_id: '4-pha3', name: 'Final Review', description: 'Rà soát toàn bộ script: Format, Transitions, Anti-patterns' },
      { step_id: '4-fix', name: 'Áp dụng fixes', description: 'Đề xuất fixes → user duyệt → áp dụng', pause_after: true, pause_message: 'Trình fixes cho user duyệt' },
    ],
    workflows: [
      { id: 'review', file: 'Review Process/workflow/review.md', name: 'Review kịch bản' },
    ],
    rules_required: [
      { file: 'Review Process/sub-review/hook-review.md', purpose: 'Hook review checklist', used_in_step: '4-pha1' },
      { file: 'Review Process/sub-review/body-{pattern}.md', purpose: 'Body review checklist', used_in_step: '4-pha2', variants: { FURY: 'body-fury.md', STRATEGY: 'body-strategy.md', COMEDY: 'body-comedy.md' } },
      { file: 'Review Process/sub-review/final-review.md', purpose: 'Final review', used_in_step: '4-pha3' },
    ],
    dependencies: ['script-vi'],
    can_skip: false,
  },
  {
    id: 'script-en',
    phase_number: 5,
    name: 'Kịch Bản En',
    name_en: 'English Script',
    icon: '🌐',
    color: '#06B6D4',
    estimated_time_min: 60,
    description: 'Dịch kịch bản từ tiếng Việt sang tiếng Anh, giữ nguyên tone storytelling.',
    description_en: 'Translate Vietnamese script to English, maintaining storytelling tone and narrative flow.',
    stage: 'script_en',
    steps: [
      { step_id: '5-step1', name: 'Dịch sang tiếng Anh', description: 'Dịch VI → EN (viết lại tự nhiên, không dịch word-by-word)', pause_after: true, pause_message: 'Gửi script EN cho user duyệt' },
      { step_id: '5-step2', name: 'Review bản dịch', description: 'Kiểm tra tone, fluency, narrative flow', pause_after: true, pause_message: 'Gửi bản dịch final cho user duyệt' },
    ],
    workflows: [],
    rules_required: [
      { file: 'Script Process/format-and-wording/script-format-checklist.md', purpose: 'Format consistency' },
    ],
    dependencies: ['review'],
    can_skip: false,
  },
  {
    id: 'script-vo',
    phase_number: 6,
    name: 'Script VO',
    name_en: 'VO Script Generation',
    icon: '🎙️',
    color: '#10B981',
    estimated_time_min: 45,
    description: 'Chuyển Script EN → các file VO có audio tags cho ElevenLabs.',
    description_en: 'Convert EN script to VO files with audio tags for ElevenLabs.',
    stage: 'script_vo',
    steps: [
      { step_id: '6-phase1', name: 'ĐỌC & HIỂU', description: 'Emotional Arc Map, Villain Evolution, Sacred Phrases' },
      { step_id: '6-phase2', name: 'CHUẨN BỊ', description: 'Clean text, chia files ≤800 từ/file' },
      { step_id: '6-phase3', name: 'VIẾT & QA', description: 'Gắn audio tags + QA Checklist', pause_after: true, pause_message: 'Trình VO files cho user duyệt' },
    ],
    workflows: [
      { id: 'tao-script-note', file: 'VO Process/workflow/tao-script-note.md', name: 'Tạo Script Note cho VO' },
    ],
    rules_required: [
      { file: 'VO Process/vo-rules/vo-foundations.md', purpose: 'Nguyên tắc nền tảng, clean text, chia file' },
      { file: 'VO Process/vo-rules/vo-tags-reference.md', purpose: 'Danh sách tags, tonal families' },
      { file: 'VO Process/vo-rules/vo-tagging-rules.md', purpose: 'Cách chèn tags' },
      { file: 'VO Process/vo-rules/vo-anti-patterns-qa.md', purpose: 'Lỗi cần tránh + QA checklist' },
    ],
    dependencies: ['script-en'],
    can_skip: false,
  },
  {
    id: 'title-generation',
    phase_number: 7,
    name: 'Title & Thumbnail',
    name_en: 'Title Generation',
    icon: '🎬',
    color: '#EC4899',
    estimated_time_min: 30,
    description: 'Tạo 5 gợi ý title tiếng Anh + thumbnail suggestion.',
    description_en: 'Generate 5 English title suggestions using viral formulas + thumbnail concepts.',
    stage: 'title',
    steps: [
      { step_id: '7-1', name: 'Extract Key Elements', description: 'Villain, hành động, vũ khí bí mật, twist, con số' },
      { step_id: '7-2', name: 'Generate 5 Title Options', description: '5 formulas: Overstep→Payback, Identity, Injustice, Numbers, Wild card' },
      { step_id: '7-3', name: 'Analyze & Score', description: 'Curiosity, Clarity, Emotion, Gap Level, Psychology breakdown' },
      { step_id: '7-4', name: 'Professional Checklist', description: 'A: Emotional, B: Curiosity, C: Linguistic, D: Two-Clause, E: Technical' },
      { step_id: '7-5', name: 'Recommend Top Pick', description: 'Chọn 1 title tốt nhất + giải thích lý do' },
      { step_id: '7-6', name: 'Gợi ý Thumbnail', description: 'Layout, Text Overlay, Nhân vật, Bảng Màu, Props' },
    ],
    workflows: [
      { id: 'tao-title', file: 'Title Process/workflow/tao-title.md', name: 'Tạo title suggestions' },
    ],
    rules_required: [
      { file: 'Title Process/title-rules/title-generator.md', purpose: 'Core Principles, Emotional Triggers' },
      { file: 'Title Process/title-rules/title-generator-p2.md', purpose: 'Curiosity Gap, Power Words, Checklist' },
      { file: 'Title Process/title-rules/title-generator-p3.md', purpose: '5 Formulas, Output Format' },
    ],
    dependencies: ['script-vo'],
    can_skip: false,
  },
]

// ─── Ordered Stages (for DB + Kanban) ───────────────────────────────

/** All stages in pipeline order, including 'done' */
export const STAGES: Stage[] = ['idea', 'outline', 'script_vi', 'review', 'script_en', 'script_vo', 'title', 'done']

/** Pipeline stages only (excludes 'done') for Kanban columns */
export const PIPELINE_STAGES: Stage[] = ['idea', 'outline', 'script_vi', 'review', 'script_en', 'script_vo', 'title']

// ─── Label / Icon / Color Lookups (Stage-based) ─────────────────────

export const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Ý Tưởng',
  outline: 'Dàn Ý',
  script_vi: 'Script Vi',
  review: 'Review',
  script_en: 'Script En',
  script_vo: 'Script VO',
  title: 'Title',
  done: 'Hoàn Thành',
}

export const STAGE_ICONS: Record<Stage, string> = {
  idea: 'lightbulb',
  outline: 'format_list_bulleted',
  script_vi: 'edit_note',
  review: 'rate_review',
  script_en: 'translate',
  script_vo: 'mic',
  title: 'title',
  done: 'check_circle',
}

export const STAGE_EMOJIS: Record<Stage, string> = {
  idea: '💡',
  outline: '📋',
  script_vi: '✍️',
  review: '🔍',
  script_en: '🌐',
  script_vo: '🎙️',
  title: '🎬',
  done: '✅',
}

export const STAGE_COLORS: Record<Stage, string> = {
  idea: '#F59E0B',
  outline: '#3B82F6',
  script_vi: '#8B5CF6',
  review: '#EF4444',
  script_en: '#06B6D4',
  script_vo: '#10B981',
  title: '#EC4899',
  done: '#6B7280',
}

// ─── Pattern Definitions ────────────────────────────────────────────

export const PATTERNS: Record<PatternGroup, PatternInfo> = {
  FURY: {
    icon: '🔥',
    color: '#EF4444',
    name: 'FURY',
    name_vi: 'Phẫn Nộ',
    description: 'Fury → Justice → Catharsis',
    emotion_flow: 'PHẪN NỘ → HẢ HÊ',
    hero_weapon: 'Tuân thủ ác ý / Cộng đồng bảo vệ',
    climax_ending: 'Villain TỰ HỦY',
    cliffhanger_tone: 'Nặng, căng — Villain có đi xa hơn?',
  },
  STRATEGY: {
    icon: '🧠',
    color: '#3B82F6',
    name: 'STRATEGY',
    name_vi: 'Chiến Lược',
    description: 'Tension → Checkmate → Power Shift',
    emotion_flow: 'HỒI HỘP → NỂ PHỤC',
    hero_weapon: 'Nghiên cứu pháp lý / Chiến lược dài hạn',
    climax_ending: 'Villain MẤT QUYỀN',
    cliffhanger_tone: 'Hồi hộp, tò mò — Checkmate có hoạt động?',
  },
  COMEDY: {
    icon: '😂',
    color: '#F59E0B',
    name: 'COMEDY',
    name_vi: 'Hài Hước',
    description: 'Bực bội → Cười → Sảng khoái',
    emotion_flow: 'CƯỜI + TỰ HÀO',
    hero_weapon: 'Sáng tạo + Humor + Cộng đồng',
    climax_ending: 'Villain BẼ MẶT rời đi',
    cliffhanger_tone: 'Nhẹ nhàng, vui — Hero nghĩ ra gì tiếp?',
  },
}

// ─── HOA Story Patterns ─────────────────────────────────────────────

export interface HoaPattern {
  id: string
  icon: string
  name: string
  name_vi: string
}

export const HOA_PATTERNS: HoaPattern[] = [
  { id: 'malicious_compliance', icon: '🔧', name: 'Malicious Compliance', name_vi: 'Dùng luật HOA chống chính HOA' },
  { id: 'board_takeover', icon: '👑', name: 'Board Takeover', name_vi: 'Lật đổ ban quản trị' },
  { id: 'dissolve_hoa', icon: '💣', name: 'Dissolve HOA', name_vi: 'Giải thể hoàn toàn' },
  { id: 'sympathetic_victim', icon: '🎖️', name: 'Sympathetic Victim', name_vi: 'Nạn nhân yếu thế bị HOA bắt nạt' },
  { id: 'legal_trap', icon: '🕵️', name: 'Legal Trap', name_vi: 'Bẫy pháp lý checkmate' },
  { id: 'property_rights', icon: '🏡', name: 'Property Rights', name_vi: 'Quyền sở hữu, grandfathered' },
  { id: 'financial_fraud', icon: '💰', name: 'Financial Fraud', name_vi: 'Biển thủ quỹ HOA' },
  { id: 'foreclosure', icon: '🏚️', name: 'Foreclosure', name_vi: 'Cưỡng chế bất hợp pháp' },
  { id: 'community_comedy', icon: '😂', name: 'Community Comedy', name_vi: 'Troll hài hước' },
]

/** Default scoring group for each pattern. Malicious Compliance defaults FURY but can be overridden to COMEDY. */
export const PATTERN_TO_SCORING_GROUP: Record<string, PatternGroup> = {
  malicious_compliance: 'FURY',
  board_takeover: 'STRATEGY',
  dissolve_hoa: 'STRATEGY',
  sympathetic_victim: 'FURY',
  legal_trap: 'STRATEGY',
  property_rights: 'STRATEGY',
  financial_fraud: 'STRATEGY',
  foreclosure: 'FURY',
  community_comedy: 'COMEDY',
}

/** Get the pattern info by ID */
export function getPatternById(id: string): HoaPattern | undefined {
  return HOA_PATTERNS.find(p => p.id === id)
}
