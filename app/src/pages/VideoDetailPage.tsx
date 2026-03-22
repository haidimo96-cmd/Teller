import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { timeAgo } from '../lib/utils'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import VOEditor from '../components/video/VOEditor'
import TitleSuggestions from '../components/video/TitleSuggestions'
import AiStreamPanel from '../components/ai/AiStreamPanel'
import ScriptEditor from '../components/video/ScriptEditor'
import ReviewPanel from '../components/video/ReviewPanel'
import {
  STAGES, STAGE_LABELS, STAGE_ICONS, STAGE_COLORS, PIPELINE_STAGES,
  type VideoProject, type Stage, type Script, type Outline
} from '../hooks/useProjects'
import type { Idea, IdeaData, IdeaEvaluation } from '../hooks/useIdeas'
import { getPatternById } from '../lib/pipelineRegistry'

type Tab = 'idea' | 'outline' | 'script_vi' | 'review' | 'script_en' | 'script_vo' | 'title'

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<VideoProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('script_vi')
  const [scripts, setScripts] = useState<Script[]>([])
  const [outlines, setOutlines] = useState<Outline[]>([])
  const [editingScript, setEditingScript] = useState(false)
  const [scriptContent, setScriptContent] = useState('')
  const [outlineContent, setOutlineContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [outlineStep, setOutlineStep] = useState<number>(1)
  const [outlinePattern, setOutlinePattern] = useState<string>('justice')
  const [expandedStage, setExpandedStage] = useState<Stage | null>(null)
  const [step1Content, setStep1Content] = useState('')
  const [step2Content, setStep2Content] = useState('')

  // Idea data
  const [linkedIdea, setLinkedIdea] = useState<Idea | null>(null)
  const [ideaEval, setIdeaEval] = useState<IdeaEvaluation | null>(null)
  const [showImprovePanel, setShowImprovePanel] = useState(false)

  // Read ?tab= query param to auto-switch tab (e.g. from IdeasPage promote)
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['idea', 'outline', 'script_vi', 'review', 'script_en', 'script_vo', 'title'].includes(tabParam)) {
      setActiveTab(tabParam as Tab)
    }
  }, [searchParams])

  useEffect(() => { if (id) fetchProject() }, [id])

  const fetchProject = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('video_projects')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setProject(data as VideoProject)
      // Fetch scripts & outlines
      const [{ data: s }, { data: o }] = await Promise.all([
        supabase.from('scripts').select('*').eq('project_id', id).order('version', { ascending: false }),
        supabase.from('outlines').select('*').eq('project_id', id).order('created_at', { ascending: false }),
      ])
      setScripts((s || []) as Script[])
      setOutlines((o || []) as Outline[])
      if (s && s.length > 0) setScriptContent(s[0].content || '')
      if (o && o.length > 0) setOutlineContent(o[0].content || '')

      // Fetch idea + evaluation if linked to an idea
      const proj = data as VideoProject
      if (proj.idea_id) {
        const [{ data: ideaRow }, { data: evalData }] = await Promise.all([
          supabase.from('ideas').select('*').eq('id', proj.idea_id).maybeSingle(),
          supabase.from('idea_evaluations').select('*').eq('idea_id', proj.idea_id)
            .order('created_at', { ascending: false }).limit(1).maybeSingle(),
        ])
        setLinkedIdea(ideaRow as Idea | null)
        setIdeaEval(evalData as IdeaEvaluation | null)
      }
    }
    setLoading(false)
  }

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const moveToStage = async (newStage: Stage) => {
    if (!project) return
    const { error } = await supabase
      .from('video_projects')
      .update({ stage: newStage, updated_at: new Date().toISOString() })
      .eq('id', project.id)
    if (!error) {
      setProject({ ...project, stage: newStage })
      showToastMsg(`Đã chuyển sang: ${STAGE_LABELS[newStage]}`)
    }
  }

  const saveCurrentScript = async () => {
    if (!project) return
    setSaving(true)
    const version = scripts.length > 0 ? scripts[0].version + 1 : 1
    const wordCount = scriptContent.trim().split(/\s+/).filter(Boolean).length
    const { data, error } = await supabase
      .from('scripts')
      .insert({ project_id: project.id, content: scriptContent, version, word_count: wordCount, status: 'draft' })
      .select()
      .single()
    if (!error && data) {
      setScripts(prev => [data as Script, ...prev])
      setEditingScript(false)
      showToastMsg(`Đã lưu Script V${version}`)
    }
    setSaving(false)
  }

  const saveCurrentOutline = async () => {
    if (!project) return
    setSaving(true)
    const { data, error } = await supabase
      .from('outlines')
      .upsert(
        { project_id: project.id, content: outlineContent, updated_at: new Date().toISOString() },
        { onConflict: 'project_id' }
      )
      .select()
      .single()
    if (!error && data) {
      setOutlines([data as Outline])
      showToastMsg('Đã lưu Dàn Ý')
    } else if (error) {
      // If upsert fails (no unique constraint), try insert
      const { data: insertData, error: insertError } = await supabase
        .from('outlines')
        .insert({ project_id: project.id, content: outlineContent })
        .select()
        .single()
      if (!insertError && insertData) {
        setOutlines(prev => [insertData as Outline, ...prev])
        showToastMsg('Đã lưu Dàn Ý')
      }
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!project) return
    await supabase.from('video_projects').delete().eq('id', project.id)
    navigate('/')
  }

  const nextStage = () => {
    if (!project) return
    const idx = STAGES.indexOf(project.stage)
    if (idx < STAGES.length - 1) moveToStage(STAGES[idx + 1])
  }

  const currentStageIdx = project ? STAGES.indexOf(project.stage) : 0
  const wordCount = scriptContent.trim().split(/\s+/).filter(Boolean).length
  const estDuration = `${Math.floor(wordCount / 130)}:${String(Math.round((wordCount % 130) / 130 * 60)).padStart(2, '0')}`

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 animate-fade-in">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
        <span className="material-symbols-outlined text-error text-5xl mb-4 block">error</span>
        <h3 className="text-lg font-bold mb-2">Project không tìm thấy</h3>
        <Link to="/" className="text-sm text-primary hover:text-primary-dim transition-colors">← Quay về Dashboard</Link>
      </div>
    )
  }

  const TABS: { key: Tab; label: string; icon: string }[] = [
    ...(project.idea_id ? [{ key: 'idea' as Tab, label: 'Ý Tưởng', icon: 'lightbulb' }] : []),
    { key: 'outline', label: 'Dàn Ý', icon: 'format_list_bulleted' },
    { key: 'script_vi', label: 'Script Vi', icon: 'edit_note' },
    { key: 'review', label: 'Review', icon: 'rate_review' },
    { key: 'script_en', label: 'Script En', icon: 'translate' },
    { key: 'script_vo', label: 'Script VO', icon: 'mic' },
    { key: 'title', label: 'Title', icon: 'title' },
  ]

  return (
    <div className="animate-fade-in pb-24">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-on-surface-variant text-[10px] tracking-widest uppercase">
        <Link to="/" className="hover:text-primary transition-colors">Dashboard</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <span className="text-primary">{project.stage === 'idea' ? 'Chi Tiết Idea' : 'Chi Tiết Video'}</span>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row gap-8 mb-10">
        {/* Left: Project Info */}
        <div className="lg:w-[60%]">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={project.priority === 'critical' ? 'rejected' : project.priority === 'high' ? 'fury' : 'strategy'}>
              {project.priority}
            </Badge>
            <span className="text-on-surface-variant text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">calendar_today</span>
              {new Date(project.created_at).toLocaleDateString('vi-VN')}
            </span>
            {project.due_date && (
              <span className="text-warning text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">event</span>
                Hạn: {new Date(project.due_date).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
            {project.title}
          </h1>

          <div className="flex items-center gap-6 mb-6 flex-wrap">
            <div>
              <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Giai đoạn</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_COLORS[project.stage], boxShadow: `0 0 8px ${STAGE_COLORS[project.stage]}80` }} />
                <span className="font-bold" style={{ color: STAGE_COLORS[project.stage] }}>{STAGE_LABELS[project.stage]}</span>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Scripts</p>
              <span className="font-bold">{scripts.length} phiên bản</span>
            </div>
            {/* Idea Evaluation Status */}
            {project.idea_id && (
              <>
                <div className="h-10 w-px bg-white/10" />
                <div>
                  <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Đánh giá</p>
                  {ideaEval ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-primary">{ideaEval.total_score}/100</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-success/10 text-success border border-success/20 font-bold">✅ Đã đánh giá</span>
                    </div>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-on-surface-variant border border-white/10 font-bold">❌ Chưa đánh giá</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Pipeline Progress */}
        <div className="lg:w-[40%]">
          <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-3">Pipeline Progress</p>
          <div className="grid grid-cols-4 gap-2">
            {PIPELINE_STAGES.map((stage) => {
              const stageIdx = STAGES.indexOf(stage)
              const isDone = stageIdx < currentStageIdx
              const isCurrent = stage === project.stage
              const isFuture = stageIdx > currentStageIdx
              const phaseColor = STAGE_COLORS[stage]
              const isExpanded = expandedStage === stage

              return (
                <button
                  key={stage}
                  onClick={() => setExpandedStage(prev => prev === stage ? null : stage)}
                  className={`glass-card rounded-lg p-3 flex items-center gap-2 transition-all text-left
                    ${isDone ? 'border-white/20 bg-white/5' : ''}
                    ${isCurrent ? 'ring-1' : ''}
                    ${isFuture ? 'opacity-40 hover:opacity-70' : ''}
                    ${isExpanded ? 'ring-2 scale-[1.03]' : ''}
                    hover:scale-[1.02]`}
                  style={isCurrent || isExpanded ? { borderColor: `${phaseColor}60`, backgroundColor: `${phaseColor}10`, boxShadow: `inset 0 0 0 1px ${phaseColor}30` } : undefined}
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ color: isDone || isCurrent || isExpanded ? phaseColor : undefined, fontVariationSettings: isDone ? "'FILL' 1" : undefined }}
                  >
                    {isDone ? 'check_circle' : isCurrent ? 'trending_flat' : STAGE_ICONS[stage]}
                  </span>
                  <span className={`text-[11px] font-bold`} style={{ color: isDone || isCurrent || isExpanded ? phaseColor : undefined }}>
                    {STAGE_LABELS[stage]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── Expanded Stage Detail Panel ── */}
          {expandedStage && (
            <div className="mt-3 glass-card rounded-xl p-4 border animate-fade-in" style={{
              borderColor: `${STAGE_COLORS[expandedStage]}30`,
              backgroundColor: `${STAGE_COLORS[expandedStage]}05`,
            }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: STAGE_COLORS[expandedStage] }}>
                  <span className="material-symbols-outlined text-sm">{STAGE_ICONS[expandedStage]}</span>
                  {STAGE_LABELS[expandedStage]}
                </h4>
                <button onClick={() => setExpandedStage(null)} className="text-on-surface-variant hover:text-on-surface text-xs">✕</button>
              </div>

              {/* IDEA Stage */}
              {expandedStage === 'idea' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {STAGES.indexOf(project.stage) > STAGES.indexOf('idea') ? '✅ Hoàn thành' : '⏳ Đang thực hiện'}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Ý tưởng đã được tạo. Đánh giá và cải thiện trước khi lên dàn ý.</p>
                  <button
                    onClick={() => { setActiveTab('outline'); setExpandedStage(null); moveToStage('outline') }}
                    className="w-full mt-2 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    style={{ background: `linear-gradient(135deg, ${STAGE_COLORS['outline']}, ${STAGE_COLORS['outline']}cc)`, color: '#0c0e12' }}
                  >
                    📋 Sang Dàn Ý →
                  </button>
                </div>
              )}

              {/* OUTLINE Stage */}
              {expandedStage === 'outline' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border ${step1Content ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-on-surface-variant border-white/10'}`}>
                      Step 1: {step1Content ? '✅' : '❌'} Story Prep
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border ${step2Content ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-on-surface-variant border-white/10'}`}>
                      Step 2: {step2Content ? '✅' : '❌'} Arc Map
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    {step1Content && step2Content
                      ? 'Cả 2 step đã hoàn thành. Gộp dàn ý và chuyển sang Script Vi.'
                      : step1Content
                        ? 'Step 1 xong. Hoàn thành Step 2 rồi gộp dàn ý.'
                        : 'Bắt đầu Step 1: Story Prep + Character Blueprint.'}
                  </p>
                  <button
                    onClick={() => { setActiveTab('outline'); setExpandedStage(null) }}
                    className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    📋 Mở Tab Dàn Ý
                  </button>
                  {step1Content && step2Content && (
                    <button
                      onClick={() => { setActiveTab('script_vi'); setExpandedStage(null); moveToStage('script_vi') }}
                      className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      style={{ background: `linear-gradient(135deg, ${STAGE_COLORS['script_vi']}, ${STAGE_COLORS['script_vi']}cc)`, color: '#0c0e12' }}
                    >
                      📝 Sang Script Vi →
                    </button>
                  )}
                </div>
              )}

              {/* SCRIPT_VI Stage */}
              {expandedStage === 'script_vi' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                      {scripts.length} phiên bản
                    </span>
                    {scripts.length > 0 && (
                      <span className="text-[10px] text-on-surface-variant">
                        V{scripts[0].version} — {scripts[0].word_count?.toLocaleString() || 0} từ
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    {scripts.length > 0 ? 'Có script. Chỉnh sửa hoặc chuyển sang Review.' : 'Chưa có script. Tạo từ dàn ý.'}
                  </p>
                  <button
                    onClick={() => { setActiveTab('script_vi'); setExpandedStage(null) }}
                    className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    📝 Mở Tab Script Vi
                  </button>
                  {scripts.length > 0 && (
                    <button
                      onClick={() => { setActiveTab('review'); setExpandedStage(null); moveToStage('review') }}
                      className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                      style={{ background: `linear-gradient(135deg, ${STAGE_COLORS['review']}, ${STAGE_COLORS['review']}cc)`, color: '#0c0e12' }}
                    >
                      📖 Sang Review →
                    </button>
                  )}
                </div>
              )}

              {/* REVIEW Stage */}
              {expandedStage === 'review' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-on-surface-variant">Review script trước khi dịch sang tiếng Anh.</p>
                  <button onClick={() => { setActiveTab('review'); setExpandedStage(null) }}
                    className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    📖 Mở Tab Review
                  </button>
                  <button onClick={() => { setActiveTab('script_en'); setExpandedStage(null); moveToStage('script_en') }}
                    className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    style={{ background: `linear-gradient(135deg, ${STAGE_COLORS['script_en']}, ${STAGE_COLORS['script_en']}cc)`, color: '#0c0e12' }}>
                    🌐 Sang Script En →
                  </button>
                </div>
              )}

              {/* SCRIPT_EN, SCRIPT_VO, TITLE, DONE stages */}
              {['script_en', 'script_vo', 'title', 'done'].includes(expandedStage) && (
                <div className="space-y-2">
                  <p className="text-[11px] text-on-surface-variant">{STAGE_LABELS[expandedStage]}</p>
                  <button
                    onClick={() => {
                      const tabMap: Record<string, Tab> = { script_en: 'script_en', script_vo: 'script_vo', title: 'title' }
                      const tab = tabMap[expandedStage]
                      if (tab) setActiveTab(tab)
                      setExpandedStage(null)
                    }}
                    className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    Mở Tab {STAGE_LABELS[expandedStage]}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Tab Bar (vertical) + Content + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vertical Tabs */}
        <div className="lg:w-[160px] flex-shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map(tab => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(234,254,142,0.08)]'
                      : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>{tab.icon}</span>
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-grow min-w-0">
          <div className="glass-card rounded-2xl p-6 lg:p-8 min-h-[500px]">
            {activeTab === 'idea' && linkedIdea && (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-base" style={{ color: '#F59E0B', fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                    Thông Tin Ý Tưởng
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                      linkedIdea.category === 'FURY' ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : linkedIdea.category === 'STRATEGY' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {linkedIdea.category === 'FURY' ? '🔥' : linkedIdea.category === 'STRATEGY' ? '🧠' : '😂'} {linkedIdea.category}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                      linkedIdea.status === 'approved' ? 'bg-success/10 text-success border-success/20'
                        : linkedIdea.status === 'evaluated' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : linkedIdea.status === 'rejected' ? 'bg-error/10 text-error border-error/20'
                        : 'bg-white/5 text-on-surface-variant border-white/10'
                    }`}>
                      {linkedIdea.status === 'approved' ? '✅ Đã duyệt' : linkedIdea.status === 'evaluated' ? '📊 Đã đánh giá' : linkedIdea.status === 'rejected' ? '❌ Từ chối' : '📝 Nháp'}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="glass-card rounded-xl p-5 space-y-3">
                  <h4 className="text-lg font-extrabold text-on-surface leading-snug">{linkedIdea.title}</h4>
                  {linkedIdea.description && (
                    <p className="text-sm text-on-surface-variant leading-relaxed">{linkedIdea.description}</p>
                  )}
                </div>

                {/* Pattern Tags */}
                {(linkedIdea.primary_pattern || (linkedIdea.sub_patterns && linkedIdea.sub_patterns.length > 0)) && (
                  <div className="glass-card rounded-xl p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Story Patterns</h4>
                    <div className="flex flex-wrap gap-2">
                      {linkedIdea.primary_pattern && (() => {
                        const pat = getPatternById(linkedIdea.primary_pattern!)
                        return pat ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                            {pat.icon} {pat.name}
                            <span className="text-[9px] font-normal text-primary/60 ml-1">PRIMARY</span>
                          </span>
                        ) : null
                      })()}
                      {(linkedIdea.sub_patterns || []).map(id => {
                        const sp = getPatternById(id)
                        return sp ? (
                          <span key={sp.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-on-surface-variant border border-white/10 text-xs">
                            {sp.icon} {sp.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                )}

                {/* ── Evaluation Section: Dynamic based on evaluation status ── */}
                {ideaEval ? (
                  /* ✅ HAS EVALUATION — Show score + advance CTA */
                  <div className="space-y-4">
                    <div className="rounded-xl p-6 space-y-4" style={{ border: '1px solid rgba(16, 185, 129, 0.25)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06), rgba(16, 185, 129, 0.02))' }}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                          Kết Quả Đánh Giá
                        </h4>
                        <div className="flex items-center gap-2">
                          {ideaEval.total_score != null && (
                            <span className={`text-[10px] px-2.5 py-1 rounded-md font-extrabold border ${
                              ideaEval.total_score >= 90 ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : ideaEval.total_score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : ideaEval.total_score >= 70 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {ideaEval.total_score >= 90 ? '🟢🟢 TUYỆT VỜI' : ideaEval.total_score >= 80 ? '🟢 TỐT' : ideaEval.total_score >= 70 ? '🟡 KHẢ THI' : '🔴 CHƯA ĐẠT'}
                            </span>
                          )}
                          <button
                            onClick={async () => {
                              // Delete old evaluation and let user re-evaluate
                              await supabase.from('idea_evaluations').delete().eq('id', ideaEval.id)
                              setIdeaEval(null)
                              showToastMsg('Đã xóa đánh giá cũ. Bấm Chạy AI để đánh giá lại.')
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-on-surface-variant border border-white/10 hover:bg-white/10 transition-colors"
                            title="Đánh giá lại"
                          >
                            🔄 Đánh giá lại
                          </button>
                        </div>
                      </div>

                      {ideaEval.total_score != null ? (
                        <div className="flex items-center gap-8">
                          {/* Total Score - Big */}
                          <div className="text-center">
                            <div className="relative inline-flex items-center justify-center" style={{ width: 80, height: 80 }}>
                              <svg className="absolute inset-0" width="80" height="80" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                <circle cx="40" cy="40" r="34" fill="none"
                                  stroke={ideaEval.total_score >= 80 ? '#10B981' : ideaEval.total_score >= 70 ? '#F59E0B' : '#EF4444'}
                                  strokeWidth="6" strokeLinecap="round"
                                  strokeDasharray={`${ideaEval.total_score / 100 * 213.6} 213.6`}
                                  transform="rotate(-90 40 40)" style={{ transition: 'stroke-dasharray 1s ease' }}
                                />
                              </svg>
                              <span className="text-2xl font-black text-on-surface">{ideaEval.total_score}</span>
                            </div>
                            <p className="text-[9px] text-on-surface-variant/50 mt-1 uppercase tracking-widest">Tổng điểm</p>
                          </div>

                          {/* Breakdown */}
                          <div className="flex-1 space-y-2">
                            {ideaEval.hoa_pattern_score != null && (
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">Pattern Score</span>
                                <span className="text-sm font-bold text-blue-400">{ideaEval.hoa_pattern_score}<span className="text-on-surface-variant/40">/40</span></span>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">Universal Score</span>
                              <span className="text-sm font-bold text-amber-400">
                                {ideaEval.hoa_pattern_score != null ? ideaEval.total_score - ideaEval.hoa_pattern_score : '—'}<span className="text-on-surface-variant/40">/60</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                          <p className="text-xs text-amber-400/80 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            Không parse được điểm từ AI output. Bấm "Đánh giá lại" để chạy lại.
                          </p>
                        </div>
                      )}

                      {ideaEval.red_flags && (
                        <div className="p-3 rounded-lg bg-error/5 border border-error/10">
                          <p className="text-[10px] uppercase tracking-widest text-error/70 mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">flag</span> Red Flags
                          </p>
                          <p className="text-xs text-error/90 leading-relaxed whitespace-pre-line">{ideaEval.red_flags}</p>
                        </div>
                      )}

                      {/* ── Parsed Improvement Suggestions ── */}
                      {ideaEval.notes && (() => {
                        // Try multiple header patterns for improvement suggestions
                        const sugPatterns = [
                          /💡\s*GỢI Ý CẢI THIỆN[:\s]*([\s\S]*?)(?=###|##\s+✅|##\s+ĐIỂM MẠNH|$)/i,
                          /gợi ý(?:\s+cải thiện)?[:\s]*([\s\S]*?)(?=###|##\s+✅|##\s+điểm mạnh|$)/i,
                          /cần cải thiện[:\s]*([\s\S]*?)(?=###|##\s+✅|##\s+điểm mạnh|$)/i,
                          /suggestions?[:\s]*([\s\S]*?)(?=###|##\s+✅|##\s+strengths|$)/i,
                          /MODE:\s*improve[\s\S]*?\n([\s\S]*?)(?=###\s+✅|##\s+ĐIỂM|$)/i,
                        ]
                        let sugMatch = null
                        for (const p of sugPatterns) { sugMatch = ideaEval.notes!.match(p); if (sugMatch) break }
                        if (!sugMatch) return null
                        const items = sugMatch[1].trim().split(/\n/)
                          .filter(l => l.trim().match(/^[-*•\d.]+/) || l.trim().match(/^\*\*?\d/))
                          .map(l => l.replace(/^[-*•\d.\s]+/, '').replace(/^\*\*/, '').trim())
                          .filter(l => l.length > 5)
                        if (items.length === 0) return null
                        return (
                          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/15 space-y-2">
                            <p className="text-[10px] uppercase tracking-widest text-amber-400/80 flex items-center gap-1 mb-2">
                              <span className="material-symbols-outlined text-xs">lightbulb</span> Gợi Ý Cải Thiện ({items.length})
                            </p>
                            {items.map((item, i) => (
                              <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-amber-500/5 border border-amber-500/10">
                                <span className="text-amber-400 text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                                <p className="text-xs text-on-surface-variant leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        )
                      })()}

                      {/* ── Parsed Strengths ── */}
                      {ideaEval.notes && (() => {
                        const strPatterns = [
                          /✅\s*ĐIỂM MẠNH[:\s]*([\s\S]*?)(?=###|##\s+💡|##\s+gợi ý|$)/i,
                          /điểm mạnh[:\s]*([\s\S]*?)(?=###|##\s+💡|##\s+gợi ý|$)/i,
                          /strengths?[:\s]*([\s\S]*?)(?=###|##\s+💡|##\s+suggestions|$)/i,
                          /ưu điểm[:\s]*([\s\S]*?)(?=###|##\s+💡|$)/i,
                        ]
                        let strMatch = null
                        for (const p of strPatterns) { strMatch = ideaEval.notes!.match(p); if (strMatch) break }
                        if (!strMatch) return null
                        const items = strMatch[1].trim().split(/\n/)
                          .filter(l => l.trim().match(/^[-*•\d.]+/) || l.trim().match(/^\*\*?\d/))
                          .map(l => l.replace(/^[-*•\d.\s]+/, '').replace(/^\*\*/, '').trim())
                          .filter(l => l.length > 3)
                        if (items.length === 0) return null
                        return (
                          <div className="flex flex-wrap gap-2">
                            {items.map((item, i) => (
                              <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                                ✅ {item.length > 60 ? item.substring(0, 60) + '...' : item}
                              </span>
                            ))}
                          </div>
                        )
                      })()}

                      {/* Collapsible Full AI Notes */}
                      {ideaEval.notes && (
                        <details className="group">
                          <summary className="cursor-pointer text-[10px] uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-1 hover:text-on-surface-variant transition-colors">
                            <span className="material-symbols-outlined text-xs group-open:rotate-90 transition-transform">chevron_right</span>
                            Xem chi tiết đánh giá đầy đủ
                          </summary>
                          <div className="mt-2 p-3 rounded-lg bg-white/3 border border-white/5 max-h-[400px] overflow-y-auto">
                            <pre className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap font-mono">{ideaEval.notes}</pre>
                          </div>
                        </details>
                      )}
                    </div>

                    {/* ── Improve Idea with AI ── */}
                    {!showImprovePanel ? (
                      <button
                        onClick={() => setShowImprovePanel(true)}
                        className="w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] border-2 border-dashed"
                        style={{
                          borderColor: 'rgba(168, 85, 247, 0.3)',
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.06), rgba(168, 85, 247, 0.02))',
                          color: '#a855f7',
                        }}
                      >
                        <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                        🔧 Cải Thiện Idea với AI (dựa trên gợi ý đánh giá)
                      </button>
                    ) : (
                      <div className="rounded-xl p-4 space-y-3" style={{ border: '1px solid rgba(168, 85, 247, 0.25)', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.06), rgba(168, 85, 247, 0.02))' }}>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                            AI Cải Thiện Idea
                          </h4>
                          <button
                            onClick={() => setShowImprovePanel(false)}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-on-surface-variant border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            ✕ Đóng
                          </button>
                        </div>
                        <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                          AI sẽ giữ nguyên core concept & điểm mạnh, áp dụng gợi ý cải thiện, thêm chi tiết cụ thể.
                        </p>
                        <AiStreamPanel
                          phase="improve"
                          projectId={project.id}
                          inputContent={(() => {
                            // Build input: current idea + evaluation feedback
                            const parts = [
                              `== IDEA HIỆN TẠI ==`,
                              `Title: ${linkedIdea.title}`,
                              `Category: ${linkedIdea.category}`,
                              `Primary Pattern: ${linkedIdea.primary_pattern || 'N/A'}`,
                              `Sub-Patterns: ${(linkedIdea.sub_patterns || []).join(', ') || 'N/A'}`,
                              `\nDescription:\n${linkedIdea.description || 'N/A'}`,
                              linkedIdea.idea_data ? `\nIdea Data:\n${JSON.stringify(linkedIdea.idea_data, null, 2)}` : '',
                              `\n== KẾT QUẢ ĐÁNH GIÁ ==`,
                              `Total Score: ${ideaEval.total_score ?? 'N/A'}/100`,
                              ideaEval.hoa_pattern_score != null ? `Pattern Score: ${ideaEval.hoa_pattern_score}/40` : '',
                              ideaEval.red_flags ? `\nRed Flags:\n${ideaEval.red_flags}` : '',
                            ]
                            // Extract suggestions from notes
                            if (ideaEval.notes) {
                              const sugMatch = ideaEval.notes.match(/💡\s*GỢI Ý CẢI THIỆN[:\s]*([\s\S]*?)(?=###|##\s+✅|$)/i)
                                || ideaEval.notes.match(/gợi ý cải thiện[:\s]*([\s\S]*?)(?=###|##\s+✅|$)/i)
                              if (sugMatch) parts.push(`\n== GỢI Ý CẢI THIỆN ==\n${sugMatch[1].trim()}`)

                              const strMatch = ideaEval.notes.match(/✅\s*ĐIỂM MẠNH[:\s]*([\s\S]*?)(?=###|##\s+💡|$)/i)
                                || ideaEval.notes.match(/điểm mạnh[:\s]*([\s\S]*?)(?=###|##\s+💡|$)/i)
                              if (strMatch) parts.push(`\n== ĐIỂM MẠNH (GIỮ NGUYÊN) ==\n${strMatch[1].trim()}`)
                            }
                            parts.push(`\n---\nHãy cải thiện idea theo gợi ý trên, giữ nguyên điểm mạnh, output JSON block ở cuối.`)
                            return parts.filter(Boolean).join('\n')
                          })()}
                          patternGroup={linkedIdea.category || 'FURY'}
                          onSaved={() => {
                            fetchProject()
                            setShowImprovePanel(false)
                            showToastMsg('✨ Idea đã được cải thiện!')
                          }}
                        />
                      </div>
                    )}

                    {/* ── CTA: Move to Outline ── */}
                    <button
                      onClick={() => {
                        setActiveTab('outline')
                        moveToStage('outline')
                      }}
                      className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] group"
                      style={{
                        background: `linear-gradient(135deg, ${STAGE_COLORS['outline']}, ${STAGE_COLORS['outline']}cc)`,
                        color: '#0c0e12',
                        boxShadow: `0 4px 20px ${STAGE_COLORS['outline']}40`,
                      }}
                    >
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">format_list_bulleted</span>
                      Idea đã được đánh giá — Chuyển sang Dàn Ý
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                ) : (
                  /* ❌ NO EVALUATION — Show evaluate button + AI panel */
                  <div className="space-y-4">
                    <div className="rounded-xl p-5 space-y-4" style={{ border: '1px solid rgba(245, 158, 11, 0.2)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.01))' }}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">rate_review</span>
                          Đánh Giá Ý Tưởng
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold animate-pulse">
                          ⏳ Chưa đánh giá
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Chạy AI để đánh giá ý tưởng theo <strong>V.I.R.A.L Checklist</strong>, <strong>Gut Check</strong>, 
                        và <strong>Scoring System 100 điểm</strong>. AI sẽ phân tích pattern, red flags, và cho điểm chi tiết.
                      </p>
                    </div>

                    {/* AI Evaluate Panel */}
                    <AiStreamPanel
                      phase="evaluate"
                      projectId={project.id}
                      inputContent={`Title: ${linkedIdea.title}\nCategory: ${linkedIdea.category}\nScoring Group: ${linkedIdea.scoring_group || linkedIdea.category}\nPrimary Pattern: ${linkedIdea.primary_pattern || 'N/A'}\nSub-Patterns: ${(linkedIdea.sub_patterns || []).join(', ') || 'N/A'}\n\nDescription:\n${linkedIdea.description || 'N/A'}\n\nIdea Data:\n${linkedIdea.idea_data ? JSON.stringify(linkedIdea.idea_data, null, 2) : 'N/A'}`}
                      patternGroup={linkedIdea.category || 'FURY'}
                      onSaved={() => {
                        fetchProject()
                        showToastMsg('Đã lưu kết quả đánh giá!')
                      }}
                    />
                  </div>
                )}

                {/* Structured Idea Data */}
                {linkedIdea.idea_data && Object.keys(linkedIdea.idea_data).length > 0 && (() => {
                  const d = linkedIdea.idea_data as IdeaData
                  return (
                    <div className="glass-card rounded-xl p-5 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-amber-400">auto_stories</span>
                        Chi Tiết Ý Tưởng
                      </h4>

                      {/* One-liner */}
                      {d.one_liner && (
                        <div className="p-3 rounded-lg bg-primary/5 border-l-3 border-primary/40">
                          <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-1">One-Liner</p>
                          <p className="text-sm text-on-surface font-medium italic leading-relaxed">"{d.one_liner}"</p>
                        </div>
                      )}

                      {/* Hero & Villain */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {d.hero && (
                          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                            <p className="text-[10px] uppercase tracking-widest text-emerald-400/70 mb-1 flex items-center gap-1">🦸 Hero</p>
                            <p className="text-xs text-on-surface leading-relaxed">{d.hero}</p>
                          </div>
                        )}
                        {d.villain && (
                          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                            <p className="text-[10px] uppercase tracking-widest text-red-400/70 mb-1 flex items-center gap-1">😈 Villain</p>
                            <p className="text-xs text-on-surface leading-relaxed">{d.villain}</p>
                          </div>
                        )}
                      </div>

                      {/* Villain Line */}
                      {d.villain_line && (
                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                          <p className="text-[10px] uppercase tracking-widest text-red-400/70 mb-1">💬 Villain Line</p>
                          <p className="text-sm text-red-300 italic">"{d.villain_line}"</p>
                        </div>
                      )}

                      {/* Hook */}
                      {d.hook && (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                          <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-1">🎣 Hook</p>
                          <p className="text-sm text-on-surface leading-relaxed">{d.hook}</p>
                        </div>
                      )}

                      {/* Viral Formula + Victim Type */}
                      <div className="flex flex-wrap gap-2">
                        {d.viral_formula && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                            🎭 {d.viral_formula}
                          </span>
                        )}
                        {d.victim_type && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                            🎯 {d.victim_type}
                          </span>
                        )}
                        {d.title_formula && (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                            📌 {d.title_formula}
                          </span>
                        )}
                      </div>

                      {/* Key Twists */}
                      {d.key_twists && d.key_twists.length > 0 && (
                        <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                          <p className="text-[10px] uppercase tracking-widest text-purple-400/70 mb-2">🌀 Key Twists</p>
                          <div className="space-y-1.5">
                            {d.key_twists.map((twist, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-[10px] font-bold text-purple-400/50 mt-0.5">{i + 1}.</span>
                                <p className="text-xs text-on-surface leading-relaxed">{twist}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Escalation */}
                      {d.escalation && d.escalation.length > 0 && (
                        <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                          <p className="text-[10px] uppercase tracking-widest text-orange-400/70 mb-2">📈 Escalation</p>
                          <div className="space-y-1.5">
                            {d.escalation.map((step, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-[10px] font-bold text-orange-400/50 mt-0.5">→</span>
                                <p className="text-xs text-on-surface leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payoff */}
                      {d.payoff && (
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                          <p className="text-[10px] uppercase tracking-widest text-emerald-400/70 mb-1">💥 Payoff</p>
                          <p className="text-sm text-emerald-300 font-medium">{d.payoff}</p>
                        </div>
                      )}

                      {/* Concrete Numbers */}
                      {d.concrete_numbers && d.concrete_numbers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {d.concrete_numbers.map((num, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                              💰 {num}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Dual Themes */}
                      {d.dual_themes && d.dual_themes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {d.dual_themes.map((theme, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs">
                              🏷️ {theme}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* WTF Concept & Comment Trigger */}
                      {d.wtf_concept && (
                        <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                          <p className="text-[10px] uppercase tracking-widest text-yellow-400/70 mb-1">🤯 WTF Concept</p>
                          <p className="text-xs text-on-surface leading-relaxed">{d.wtf_concept}</p>
                        </div>
                      )}
                      {d.comment_trigger && (
                        <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                          <p className="text-[10px] uppercase tracking-widest text-cyan-400/70 mb-1">💬 Comment Trigger</p>
                          <p className="text-xs text-on-surface italic leading-relaxed">"{d.comment_trigger}"</p>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Created at */}
                <div className="flex items-center gap-2 text-on-surface-variant text-xs pt-2 border-t border-white/5">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Tạo lúc: {new Date(linkedIdea.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}

            {activeTab === 'idea' && !linkedIdea && (
              <div className="text-center py-20 animate-fade-in">
                <span className="material-symbols-outlined text-5xl mb-4 block opacity-30" style={{ color: '#F59E0B' }}>lightbulb</span>
                <p className="text-sm text-on-surface-variant">Không tìm thấy thông tin ý tưởng liên kết.</p>
              </div>
            )}
            {activeTab === 'script_vi' && (
              <div className="animate-fade-in">
                <ScriptEditor
                  content={scriptContent}
                  onChange={setScriptContent}
                  outlineContent={outlineContent}
                  projectId={project.id}
                  projectTitle={project.title}
                  onSave={saveCurrentScript}
                  saving={saving}
                  scripts={scripts}
                />

                {/* Version History */}
                {scripts.length > 1 && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-[10px] tracking-widest uppercase text-on-surface-variant mb-3">Lịch sử phiên bản</p>
                    <div className="flex gap-2 flex-wrap">
                      {scripts.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setScriptContent(s.content || '')}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium border border-white/5 transition-colors"
                        >
                          V{s.version} — {s.word_count} từ — {timeAgo(s.created_at)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'outline' && (
              <div className="animate-fade-in">
                {/* Step Selector + Pattern Dropdown */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOutlineStep(1)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        outlineStep === 1
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 text-on-surface-variant hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {step1Content ? '✅' : '①'} Story Prep
                    </button>
                    <span className="text-on-surface-variant text-xs">→</span>
                    <button
                      onClick={() => setOutlineStep(2)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        outlineStep === 2
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                          : 'bg-white/5 text-on-surface-variant hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {step2Content ? '✅' : '②'} Arc Map
                    </button>
                    {step1Content && step2Content && (
                      <>
                        <span className="text-on-surface-variant text-xs">→</span>
                        <span className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          ✅ Sẵn sàng gộp
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={outlinePattern}
                      onChange={(e) => setOutlinePattern(e.target.value)}
                      className="bg-surface-container-lowest border border-white/10 rounded-lg px-3 py-2 text-xs
                                 focus:ring-1 focus:ring-primary focus:border-primary text-on-surface"
                    >
                      <option value="justice">⚔️ Justice</option>
                      <option value="heartwarming">💛 Heartwarming</option>
                      <option value="moral-dilemma">⚖️ Moral Dilemma</option>
                      <option value="mystery-suspense">🔍 Mystery</option>
                    </select>
                  </div>
                </div>

                {/* Step Description */}
                <div className="mb-4 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <p className="text-xs text-blue-300/80">
                    {outlineStep === 1
                      ? '📋 Step 1: Tạo Story Prep (Ticking Clock, Binary Forces, Object, Character Blueprint, Story Inventory). User duyệt trước khi sang Step 2.'
                      : '🗺️ Step 2: Tạo Arc Map + Outline (Mini Arcs, Therefore Test, Retention Hook Map). Dùng Story Prep từ Step 1 làm input.'}
                  </p>
                </div>

                {/* Step Content Editor */}
                <textarea
                  value={outlineStep === 1 ? step1Content : step2Content}
                  onChange={(e) => outlineStep === 1 ? setStep1Content(e.target.value) : setStep2Content(e.target.value)}
                  className="w-full min-h-[300px] bg-surface-container-lowest border border-white/10 rounded-lg p-4
                             text-sm leading-relaxed resize-y focus:ring-1 focus:ring-primary font-mono"
                  placeholder={outlineStep === 1
                    ? 'PATTERN: [Justice/Heartwarming/AITA/Mystery]\nTICKING CLOCK: ...\nBINARY FORCE: [X] vs [Y]\nOBJECT: ...\n\nCHARACTER BLUEPRINT:\n  HERO TRAITS: ... / ... / ...\n  VILLAIN TRAITS: ... / ... / ...'
                    : 'PART 1: HOOK (~8% ≈ 280 words)\nMINI ARC QUESTION: ...\nMINI CLIMAX: ...\n→ THEREFORE: ...\nAUDIENCE EMOTION: ...\nWHAT HAPPENS: ...\nLATDE SEEDS: [L: | A: | T: | D: | E:]'}
                />

                {/* Save Step + AI buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button
                    onClick={() => {
                      const content = outlineStep === 1 ? step1Content : step2Content
                      if (!content.trim()) return
                      setToast(`Step ${outlineStep} đã lưu!`)
                      setTimeout(() => setToast(null), 2000)
                    }}
                    disabled={outlineStep === 1 ? !step1Content.trim() : !step2Content.trim()}
                    className="primary-gradient text-on-primary-container px-4 py-2 rounded-lg font-bold text-xs
                               hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    💾 Lưu Step {outlineStep}
                  </button>

                  {/* Go to next step */}
                  {outlineStep === 1 && step1Content.trim() && (
                    <button
                      onClick={() => setOutlineStep(2)}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1"
                    >
                      Sang Step 2 →
                    </button>
                  )}
                </div>

                {/* AI Stream Panel */}
                <AiStreamPanel
                  phase="outline"
                  projectId={project.id}
                  inputContent={outlineStep === 2 && step1Content
                    ? `STORY PREP (từ Step 1):\n${step1Content}\n\n---\n\nTạo Arc Map + Outline dựa trên Story Prep trên.`
                    : (outlineStep === 1 ? step1Content : step2Content) || project.title}
                  onSaved={fetchProject}
                  step={outlineStep}
                  storyPattern={outlinePattern}
                  onNextStep={(output) => {
                    setStep1Content(output)
                    setOutlineStep(2)
                  }}
                />

                {/* ─── MERGE SECTION ─── */}
                {step1Content && step2Content && (
                  <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                      🔗 Gộp Dàn Ý Hoàn Chỉnh
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">
                      Cả 2 step đã hoàn thành. Bấm gộp để tạo dàn ý hoàn chỉnh và lưu vào DB.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={async () => {
                          const merged = `═══ STORY PREP ═══\n\n${step1Content}\n\n═══ ARC MAP + OUTLINE ═══\n\n${step2Content}`
                          setOutlineContent(merged)
                          setSaving(true)
                          await saveCurrentOutline()
                          setSaving(false)
                          setToast('Đã gộp & lưu dàn ý hoàn chỉnh!')
                          setTimeout(() => setToast(null), 2500)
                        }}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff' }}
                      >
                        {saving ? 'Đang gộp...' : '🔗 Gộp & Lưu Dàn Ý'}
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('script_vi')
                          moveToStage('script_vi')
                        }}
                        className="px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${STAGE_COLORS['script_vi']}, ${STAGE_COLORS['script_vi']}cc)`, color: '#0c0e12' }}
                      >
                        📝 Sang Script Vi →
                      </button>
                    </div>
                  </div>
                )}

                {/* Merged outline preview (if already merged) */}
                {outlineContent && outlineContent.includes('═══ STORY PREP ═══') && (
                  <div className="mt-4 rounded-lg bg-surface-container-lowest border border-white/10 p-4 max-h-[200px] overflow-y-auto">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/50 mb-2">Dàn ý hoàn chỉnh (đã lưu)</p>
                    <pre className="text-[11px] text-on-surface-variant whitespace-pre-wrap leading-relaxed font-mono">
                      {outlineContent}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'review' && (
              <div className="animate-fade-in">
                <ReviewPanel
                  projectId={project.id}
                  scriptContent={scriptContent}
                />

                {/* AI-assisted review */}
                {scriptContent && (
                  <AiStreamPanel
                    phase="review"
                    projectId={project.id}
                    inputContent={scriptContent}
                    onSaved={fetchProject}
                  />
                )}
              </div>
            )}

            {activeTab === 'script_en' && (
              <div className="animate-fade-in">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Kịch Bản Tiếng Anh</h3>
                <p className="text-on-surface-variant text-xs mb-6">
                  Dịch kịch bản từ tiếng Việt sang tiếng Anh. AI sẽ giữ nguyên tone storytelling.
                </p>

                {scriptContent ? (
                  <AiStreamPanel
                    phase="script_en"
                    projectId={project.id}
                    inputContent={scriptContent}
                    onSaved={fetchProject}
                  />
                ) : (
                  <div className="text-center py-16 text-on-surface-variant">
                    <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">translate</span>
                    <p className="text-sm">Cần có Script Vi trước khi dịch sang tiếng Anh.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'script_vo' && (
              <VOEditor projectId={project.id} />
            )}

            {activeTab === 'title' && (
              <TitleSuggestions projectId={project.id} projectTitle={project.title} />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[300px] space-y-6 flex-shrink-0">
          {/* Video Info Card */}
          <div className="glass-card rounded-xl p-5 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-3">Thông Tin</h3>
            <div>
              <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1.5">Độ ưu tiên</p>
              <Badge variant={project.priority === 'critical' ? 'rejected' : project.priority === 'high' ? 'fury' : 'strategy'} size="md">
                {project.priority}
              </Badge>
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1.5">Giai đoạn</p>
              <Badge variant="approved" size="md">
                {STAGE_LABELS[project.stage]}
              </Badge>
            </div>
            {project.due_date && (
              <div>
                <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1.5">Hạn chót</p>
                <span className="text-sm font-semibold">{new Date(project.due_date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            )}
            <div>
              <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1.5">Ngày tạo</p>
              <span className="text-sm">{timeAgo(project.created_at)}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">Ghi Chú</h3>
            <textarea
              value={project.notes || ''}
              onChange={(e) => setProject({ ...project, notes: e.target.value })}
              onBlur={async () => {
                if (project) {
                  await supabase.from('video_projects')
                    .update({ notes: project.notes, updated_at: new Date().toISOString() })
                    .eq('id', project.id)
                }
              }}
              className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-sm
                         focus:ring-1 focus:ring-primary resize-none"
              placeholder="Ghi chú..."
              rows={3}
            />
          </div>
        </aside>
      </div>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 px-8 py-3 bg-surface-dim/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {project.stage !== 'done' && (
            <button
              onClick={nextStage}
              className="primary-gradient text-on-primary-container px-5 py-2 rounded-lg font-bold text-sm
                         shadow-[0_0_20px_rgba(234,254,142,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">arrow_forward</span>
              Chuyển sang {STAGE_LABELS[STAGES[Math.min(currentStageIdx + 1, STAGES.length - 1)]]}
            </button>
          )}
        </div>

        {/* Stage Dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {PIPELINE_STAGES.map((stage) => {
            const stageIdx = STAGES.indexOf(stage)
            const phaseColor = STAGE_COLORS[stage]
            const isCurrent = stageIdx === currentStageIdx
            const isDone = stageIdx < currentStageIdx
            return (
              <div
                key={stage}
                className={`rounded-full transition-all ${
                  isCurrent ? 'w-3 h-3' : 'w-2 h-2'
                }`}
                style={{
                  backgroundColor: isCurrent ? phaseColor : isDone ? `${phaseColor}66` : 'rgba(255,255,255,0.1)',
                  boxShadow: isCurrent ? `0 0 8px ${phaseColor}80` : undefined,
                }}
              />
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-error hover:text-error-dim transition-colors text-sm font-bold"
          >
            Xóa
          </button>
        </div>
      </footer>

      {/* Delete Confirmation */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Xóa Video Project" size="sm">
        <div className="text-center py-2">
          <span className="material-symbols-outlined text-error text-4xl mb-3 block">warning</span>
          <p className="text-sm mb-1">Xóa "{project.title}"?</p>
          <p className="text-xs text-on-surface-variant mb-5">Hành động này không thể hoàn tác.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setShowDeleteConfirm(false)} className="px-5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10">Hủy</button>
            <button onClick={handleDelete} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-error/20 text-error border border-error/30 hover:bg-error/30">Xóa</button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-[200] animate-fade-in glass-card border-success/30 rounded-lg px-5 py-3 flex items-center gap-2.5 shadow-2xl">
          <span className="material-symbols-outlined text-lg text-success" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  )
}
