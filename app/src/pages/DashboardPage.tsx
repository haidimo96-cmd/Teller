import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { PIPELINE_STAGES, STAGE_LABELS, STAGE_ICONS, STAGE_COLORS, STAGES, type VideoProject, type Stage } from '../hooks/useProjects'
import { useIdeas, type Idea } from '../hooks/useIdeas'
import Modal from '../components/ui/Modal'

interface ProjectStats {
  total: number
  inProgress: number
  completed: number
  blocked: number
}

/** Maps each stage to the previous stage whose projects can be "promoted" into it */
const PREV_STAGE: Partial<Record<Stage, Stage>> = {
  outline: 'idea',
  script_vi: 'outline',
  review: 'script_vi',
  script_en: 'review',
  script_vo: 'script_en',
  title: 'script_vo',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { createIdea, promoteIdea, fetchUnlinkedIdeas } = useIdeas()

  const [stats, setStats] = useState<ProjectStats>({ total: 0, inProgress: 0, completed: 0, blocked: 0 })
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<'medium' | 'high' | 'critical'>('medium')
  const [creating, setCreating] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ── Add-to-column modal ──
  const [addingToStage, setAddingToStage] = useState<Stage | null>(null)
  const [unlinkedIdeas, setUnlinkedIdeas] = useState<Idea[]>([])
  const [prevStageProjects, setPrevStageProjects] = useState<VideoProject[]>([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  // Quick-create idea fields
  const [quickTitle, setQuickTitle] = useState('')
  const [quickCategory, setQuickCategory] = useState<'FURY' | 'STRATEGY' | 'COMEDY'>('FURY')

  // ── Delete project ──
  const [deletingProject, setDeletingProject] = useState<VideoProject | null>(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('video_projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    if (data) {
      setProjects(data as VideoProject[])
      setStats({
        total: data.length,
        inProgress: data.filter(p => p.stage !== 'done').length,
        completed: data.filter(p => p.stage === 'done').length,
        blocked: data.filter(p => p.priority === 'critical').length,
      })
    }
    setLoading(false)
  }

  const createProject = async () => {
    if (!user || !newTitle.trim()) return
    setCreating(true)
    const { error } = await supabase
      .from('video_projects')
      .insert({ title: newTitle.trim(), stage: 'idea', priority: newPriority, created_by: user.id })

    if (!error) {
      setShowCreateProject(false)
      setNewTitle('')
      setToast('Đã tạo Video Project!')
      setTimeout(() => setToast(null), 2500)
      fetchData()
    }
    setCreating(false)
  }

  const getProjectsByStage = (stage: string) => projects.filter(p => p.stage === stage)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-error'
      case 'high': return 'text-warning'
      case 'medium': return 'text-primary'
      default: return 'text-on-surface-variant'
    }
  }

  // ── Open add modal for a specific stage ──
  const openAddModal = useCallback(async (stage: Stage) => {
    setAddingToStage(stage)
    setLoadingAdd(true)
    setQuickTitle('')
    setQuickCategory('FURY')

    if (stage === 'idea') {
      // For "Ý Tưởng" column — just show quick-create form, no fetching needed
      setLoadingAdd(false)
      return
    }

    if (stage === 'outline') {
      // For "Dàn Ý" — fetch ideas not yet linked to any video_project
      const ideas = await fetchUnlinkedIdeas()
      setUnlinkedIdeas(ideas)
      setLoadingAdd(false)
      return
    }

    // For all other stages — show projects at prev stage
    const prev = PREV_STAGE[stage]
    if (prev) {
      const filtered = projects.filter(p => p.stage === prev)
      setPrevStageProjects(filtered)
    }
    setLoadingAdd(false)
  }, [fetchUnlinkedIdeas, projects])

  // ── Quick-create idea (for Ý Tưởng column) ──
  const handleQuickCreateIdea = async () => {
    if (!quickTitle.trim()) return
    setLoadingAdd(true)
    const result = await createIdea({ title: quickTitle.trim(), category: quickCategory })
    if (!result.error) {
      setAddingToStage(null)
      setToast('Đã tạo ý tưởng mới!')
      setTimeout(() => setToast(null), 2500)
    }
    setLoadingAdd(false)
  }

  // ── Promote idea → project at outline stage ──
  const handlePromoteToOutline = async (idea: Idea) => {
    setLoadingAdd(true)
    const result = await promoteIdea(idea)
    if (!result.error && result.projectId) {
      // Move project to 'outline' stage
      await supabase
        .from('video_projects')
        .update({ stage: 'outline', updated_at: new Date().toISOString() })
        .eq('id', result.projectId)

      setAddingToStage(null)
      setToast(`"${idea.title}" → Dàn Ý!`)
      setTimeout(() => setToast(null), 2500)
      fetchData()
    } else if (result.error) {
      setToast(result.error)
      setTimeout(() => setToast(null), 3000)
    }
    setLoadingAdd(false)
  }

  // ── Move a project to next stage ──
  const handleMoveProjectToStage = async (project: VideoProject, targetStage: Stage) => {
    setLoadingAdd(true)
    const { error: err } = await supabase
      .from('video_projects')
      .update({ stage: targetStage, updated_at: new Date().toISOString() })
      .eq('id', project.id)

    if (!err) {
      setAddingToStage(null)
      setToast(`"${project.title}" → ${STAGE_LABELS[targetStage]}!`)
      setTimeout(() => setToast(null), 2500)
      fetchData()
    }
    setLoadingAdd(false)
  }

  // ── Delete project ──
  const handleDeleteProject = async () => {
    if (!deletingProject) return
    const { error: err } = await supabase
      .from('video_projects')
      .delete()
      .eq('id', deletingProject.id)

    if (!err) {
      setDeletingProject(null)
      setToast('Đã xóa Video Project!')
      setTimeout(() => setToast(null), 2500)
      fetchData()
    }
  }

  // ── Modal title based on target stage ──
  const getAddModalTitle = (stage: Stage) => {
    if (stage === 'idea') return 'Tạo Ý Tưởng Mới'
    if (stage === 'outline') return 'Chọn Idea → Dàn Ý'
    const prev = PREV_STAGE[stage]
    return `Chọn từ ${prev ? STAGE_LABELS[prev] : ''} → ${STAGE_LABELS[stage]}`
  }

  return (
    <div className="space-y-8 lg:space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section>
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface mb-2">
              Tổng Quan Pipeline
            </h1>
            <p className="text-on-surface-variant text-sm">
              Theo dõi tiến độ sản xuất nội dung từ ý tưởng đến xuất bản.
            </p>
          </div>
          <button
            onClick={() => setShowCreateProject(true)}
            className="primary-gradient text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm 
                       flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tạo Video
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="glass-card p-4 lg:p-6 rounded-xl group hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-3 lg:mb-4">
              <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                video_library
              </span>
            </div>
            <h3 className="text-on-surface-variant text-[10px] lg:text-xs font-medium uppercase tracking-widest mb-1">
              Tổng Video
            </h3>
            <p className="text-3xl lg:text-5xl font-black text-primary tracking-tighter">{stats.total}</p>
          </div>

          <div className="glass-card p-4 lg:p-6 rounded-xl group hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-3 lg:mb-4">
              <span className="material-symbols-outlined text-on-surface text-2xl lg:text-3xl">pending_actions</span>
            </div>
            <h3 className="text-on-surface-variant text-[10px] lg:text-xs font-medium uppercase tracking-widest mb-1">
              Đang Thực Hiện
            </h3>
            <p className="text-3xl lg:text-5xl font-black text-on-surface tracking-tighter">{stats.inProgress}</p>
          </div>

          <div className="glass-card p-4 lg:p-6 rounded-xl group hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-3 lg:mb-4">
              <span className="material-symbols-outlined text-success text-2xl lg:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h3 className="text-on-surface-variant text-[10px] lg:text-xs font-medium uppercase tracking-widest mb-1">
              Hoàn Thành
            </h3>
            <p className="text-3xl lg:text-5xl font-black text-success tracking-tighter">{stats.completed}</p>
          </div>

          <div className="glass-card p-4 lg:p-6 rounded-xl group hover:scale-[1.02] transition-all">
            <div className="flex justify-between items-start mb-3 lg:mb-4">
              <span className="material-symbols-outlined text-error text-2xl lg:text-3xl">error_outline</span>
            </div>
            <h3 className="text-on-surface-variant text-[10px] lg:text-xs font-medium uppercase tracking-widest mb-1">
              Khẩn Cấp
            </h3>
            <p className="text-3xl lg:text-5xl font-black text-error tracking-tighter">{stats.blocked}</p>
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <div className="glass-card rounded-xl p-6 border-error/30 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error text-2xl">error_outline</span>
            <div>
              <p className="text-sm font-bold text-error">Không thể tải dữ liệu</p>
              <p className="text-xs text-on-surface-variant mt-1">{error}</p>
            </div>
            <button onClick={fetchData} className="ml-auto px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">Pipeline Sản Xuất</h2>
          <Link to="/ideas" className="text-xs text-primary hover:text-primary-dim transition-colors font-medium">
            Quản lý ý tưởng →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-on-surface-variant text-sm">Đang tải pipeline...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4 -mx-4 lg:mx-0">
            <div className="flex gap-4 lg:gap-6 min-w-[1800px] px-4 lg:px-0">
              {PIPELINE_STAGES.map((stage) => {
                const stageProjects = getProjectsByStage(stage)
                const phaseColor = STAGE_COLORS[stage]
                return (
                  <div key={stage} className="w-48 lg:w-60 flex-shrink-0 flex flex-col gap-3 lg:gap-4">
                    {/* Column Header */}
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: phaseColor, boxShadow: `0 0 8px ${phaseColor}40` }} />
                        <span className="material-symbols-outlined text-sm" style={{ color: phaseColor }}>
                          {STAGE_ICONS[stage]}
                        </span>
                        <h4 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                          {STAGE_LABELS[stage]}
                        </h4>
                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                          {stageProjects.length}
                        </span>
                      </div>
                      {/* ➕ Add button */}
                      <button
                        onClick={() => openAddModal(stage)}
                        className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-all group/add"
                        title={`Thêm vào ${STAGE_LABELS[stage]}`}
                      >
                        <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover/add:text-primary transition-colors">
                          add
                        </span>
                      </button>
                    </div>

                    {/* Column Body */}
                    <div className="flex flex-col gap-3 min-h-[300px] lg:min-h-[400px] p-2 rounded-xl bg-surface-container-low/50 border border-white/5">
                      {stageProjects.length === 0 ? (
                        <button
                          onClick={() => openAddModal(stage)}
                          className="flex flex-col items-center justify-center h-32 text-on-surface-variant/50 text-xs 
                                     hover:text-on-surface-variant hover:bg-white/5 rounded-lg transition-all cursor-pointer group/empty"
                        >
                          <span className="material-symbols-outlined text-lg mb-1 group-hover/empty:text-primary transition-colors">add_circle_outline</span>
                          Thêm mới
                        </button>
                      ) : (
                        stageProjects.map((project) => {
                          // Navigate to the NEXT step's tab based on current stage
                          const nextTabMap: Record<string, string> = {
                            idea: 'idea',
                            outline: 'outline',
                            script_vi: 'script_vi',
                            review: 'review',
                            script_en: 'script_en',
                            script_vo: 'script_vo',
                            title: 'title',
                            done: '',
                          }
                          const nextTab = nextTabMap[stage] || ''
                          const url = nextTab
                            ? `/projects/${project.id}?tab=${nextTab}`
                            : `/projects/${project.id}`
                          return (
                          <div key={project.id} className="relative group/card">
                            <Link
                              to={url}
                              className="glass-card p-3 rounded-lg hover:border-primary/50 transition-all cursor-pointer group block"
                            >
                              <h5 className="text-xs lg:text-sm font-bold text-on-surface line-clamp-2 mb-2 leading-tight group-hover:text-primary transition-colors">
                                {project.title}
                              </h5>
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase ${getPriorityColor(project.priority)}`}>
                                  {project.priority}
                                </span>
                                {project.due_date && (
                                  <span className="text-[10px] text-on-surface-variant">
                                    {new Date(project.due_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </Link>
                            {/* 🗑 Delete button - visible on hover */}
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingProject(project) }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center 
                                         bg-error/0 hover:bg-error/20 opacity-0 group-hover/card:opacity-100 transition-all"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined text-xs text-error/70 hover:text-error">delete</span>
                            </button>
                          </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="glass-card rounded-2xl p-8 lg:p-12 text-center mt-4">
            <span className="material-symbols-outlined text-primary text-5xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              movie_creation
            </span>
            <h3 className="text-lg font-bold text-on-surface mb-2">Chưa có Video Project nào</h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
              Bắt đầu bằng cách tạo ý tưởng mới hoặc tạo Video Project trực tiếp.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/ideas"
                className="border border-white/20 text-on-surface px-5 py-2.5 rounded-lg font-bold text-sm 
                           inline-flex items-center gap-2 hover:bg-white/5 transition-all"
              >
                <span className="material-symbols-outlined text-lg">lightbulb</span>
                Tạo Ý Tưởng
              </Link>
              <button
                onClick={() => setShowCreateProject(true)}
                className="primary-gradient text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm 
                           inline-flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Tạo Video Project
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ═══ Create Project Modal ═══ */}
      <Modal isOpen={showCreateProject} onClose={() => setShowCreateProject(false)} title="Tạo Video Project" size="sm">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-2">
              Tên Video <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ví dụ: HOA cấm cây Giáng sinh..."
              className="w-full"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-2">
              Độ ưu tiên
            </label>
            <div className="flex gap-2">
              {(['medium', 'high', 'critical'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    newPriority === p
                      ? p === 'critical' ? 'bg-error/20 text-error border border-error/30'
                        : p === 'high' ? 'bg-warning/20 text-warning border border-warning/30'
                        : 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-white/5 text-on-surface-variant border border-transparent hover:bg-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreateProject(false)} className="px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10">Hủy</button>
            <button
              onClick={createProject}
              disabled={creating || !newTitle.trim()}
              className="primary-gradient text-on-primary-container px-6 py-2.5 rounded-lg font-bold text-sm 
                         hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {creating ? 'Đang tạo...' : 'Tạo Project'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══ Add-to-Column Modal ═══ */}
      <Modal
        isOpen={!!addingToStage}
        onClose={() => setAddingToStage(null)}
        title={addingToStage ? getAddModalTitle(addingToStage) : ''}
        size="sm"
      >
        {addingToStage && (
          <div className="space-y-4">
            {loadingAdd && (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            )}

            {/* ── IDEA: Quick-create form ── */}
            {addingToStage === 'idea' && !loadingAdd && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-2">
                    Tiêu đề <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="VD: HOA phạt vì trồng hoa..."
                    className="w-full"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-2">
                    Nhóm
                  </label>
                  <div className="flex gap-2">
                    {(['FURY', 'STRATEGY', 'COMEDY'] as const).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setQuickCategory(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          quickCategory === c
                            ? c === 'FURY' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : c === 'STRATEGY' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-white/5 text-on-surface-variant border border-transparent hover:bg-white/10'
                        }`}
                      >
                        {c === 'FURY' ? '🔥' : c === 'STRATEGY' ? '🧠' : '😂'} {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleQuickCreateIdea}
                    disabled={!quickTitle.trim() || loadingAdd}
                    className="primary-gradient text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm 
                               hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex-1"
                  >
                    Tạo Ý Tưởng
                  </button>
                  <Link
                    to="/ideas"
                    onClick={() => setAddingToStage(null)}
                    className="px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10 
                               border border-white/10 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Trang Ideas
                  </Link>
                </div>
              </div>
            )}

            {/* ── OUTLINE: Pick from unlinked ideas ── */}
            {addingToStage === 'outline' && !loadingAdd && (
              <div>
                {unlinkedIdeas.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-4xl mb-3 block">lightbulb</span>
                    <p className="text-sm text-on-surface-variant mb-3">Không có idea nào chưa lên dàn ý.</p>
                    <Link
                      to="/ideas"
                      onClick={() => setAddingToStage(null)}
                      className="inline-flex items-center gap-1.5 text-primary text-sm hover:text-primary-dim transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Tạo idea mới
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                    <p className="text-xs text-on-surface-variant mb-2">
                      Chọn idea để tạo dàn ý ({unlinkedIdeas.length} idea chưa lên dàn ý):
                    </p>
                    {unlinkedIdeas.map((idea) => (
                      <button
                        key={idea.id}
                        onClick={() => handlePromoteToOutline(idea)}
                        disabled={loadingAdd}
                        className="w-full text-left glass-card p-3 rounded-lg hover:border-primary/50 hover:bg-primary/5 
                                   transition-all flex items-center gap-3 group"
                      >
                        <span className="text-lg flex-shrink-0">
                          {idea.category === 'FURY' ? '🔥' : idea.category === 'STRATEGY' ? '🧠' : '😂'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                            {idea.title}
                          </h5>
                          <span className="text-[10px] text-on-surface-variant uppercase">
                            {idea.category} • {idea.status}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-sm text-on-surface-variant/40 group-hover:text-primary transition-colors">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── OTHER STAGES: Pick from prev stage projects ── */}
            {addingToStage !== 'idea' && addingToStage !== 'outline' && !loadingAdd && (
              <div>
                {prevStageProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-on-surface-variant/40 text-4xl mb-3 block">
                      {STAGE_ICONS[PREV_STAGE[addingToStage] || 'idea']}
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      Không có project nào ở giai đoạn {STAGE_LABELS[PREV_STAGE[addingToStage] || 'idea']} để chuyển.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                    <p className="text-xs text-on-surface-variant mb-2">
                      Chọn project để chuyển sang {STAGE_LABELS[addingToStage]} ({prevStageProjects.length} project):
                    </p>
                    {prevStageProjects.map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => handleMoveProjectToStage(proj, addingToStage)}
                        disabled={loadingAdd}
                        className="w-full text-left glass-card p-3 rounded-lg hover:border-primary/50 hover:bg-primary/5 
                                   transition-all flex items-center gap-3 group"
                      >
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: STAGE_COLORS[proj.stage] }}
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                            {proj.title}
                          </h5>
                          <span className={`text-[10px] font-bold uppercase ${getPriorityColor(proj.priority)}`}>
                            {proj.priority}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-sm text-on-surface-variant/40 group-hover:text-primary transition-colors">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ═══ Delete Project Confirmation ═══ */}
      <Modal isOpen={!!deletingProject} onClose={() => setDeletingProject(null)} title="Xác nhận xóa" size="sm">
        <div className="text-center py-2">
          <span className="material-symbols-outlined text-error text-4xl mb-3 block">warning</span>
          <p className="text-sm text-on-surface mb-1">
            Bạn có chắc muốn xóa project này?
          </p>
          <p className="text-xs text-on-surface-variant mb-5">
            "{deletingProject?.title}"
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setDeletingProject(null)}
              className="px-5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleDeleteProject}
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-error/20 text-error border border-error/30
                         hover:bg-error/30 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] animate-fade-in glass-card border-success/30 rounded-lg px-5 py-3 flex items-center gap-2.5 shadow-2xl">
          <span className="material-symbols-outlined text-lg text-success" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  )
}
