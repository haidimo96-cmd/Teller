import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIdeas, type Idea, type IdeasFilter, type CreateIdeaInput } from '../hooks/useIdeas'
import IdeaCard from '../components/ideas/IdeaCard'
import CreateIdeaModal from '../components/ideas/CreateIdeaModal'


import Modal from '../components/ui/Modal'

const CATEGORIES = [
  { value: null, label: 'Tất cả', icon: 'apps' },
  { value: 'FURY' as const, label: 'Fury', icon: 'local_fire_department' },
  { value: 'STRATEGY' as const, label: 'Strategy', icon: 'psychology' },
  { value: 'COMEDY' as const, label: 'Comedy', icon: 'sentiment_very_satisfied' },
]

const STATUSES = [
  { value: null, label: 'Tất cả' },
  { value: 'draft' as const, label: 'Nháp' },
  { value: 'evaluated' as const, label: 'Đã đánh giá' },
  { value: 'approved' as const, label: 'Đã duyệt' },
  { value: 'rejected' as const, label: 'Từ chối' },
]

export default function IdeasPage() {
  const navigate = useNavigate()
  const { ideas, loading, fetchIdeas, createIdea, updateIdea, deleteIdea, promoteIdea } = useIdeas()

  // Filters
  const [filters, setFilters] = useState<IdeasFilter>({})
  const [searchInput, setSearchInput] = useState('')

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null)

  const [deletingIdea, setDeletingIdea] = useState<Idea | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Load ideas on mount and filter change
  useEffect(() => {
    fetchIdeas(filters)
  }, [fetchIdeas, filters])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput || undefined }))
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Stats
  const stats = useMemo(() => ({
    total: ideas.length,
    draft: ideas.filter(i => i.status === 'draft').length,
    evaluated: ideas.filter(i => i.status === 'evaluated').length,
    approved: ideas.filter(i => i.status === 'approved').length,
  }), [ideas])

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Handlers
  const handleCreate = async (input: CreateIdeaInput) => {
    const result = await createIdea(input)
    if (!result.error) showToast('Tạo ý tưởng thành công!')
    return result
  }

  const handleEdit = async (input: CreateIdeaInput) => {
    if (!editingIdea) return { error: 'No idea selected' }
    const result = await updateIdea(editingIdea.id, input)
    if (!result.error) {
      showToast('Đã cập nhật ý tưởng!')
      setEditingIdea(null)
    }
    return result
  }

  const handleDelete = async () => {
    if (!deletingIdea) return
    const result = await deleteIdea(deletingIdea.id)
    if (!result.error) {
      showToast('Đã xóa ý tưởng')
      setDeletingIdea(null)
    } else {
      showToast(result.error, 'error')
    }
  }

  const handlePromote = async (idea: Idea) => {
    const result = await promoteIdea(idea)
    if (!result.error) {
      showToast('Đã chuyển thành Video Project!')
      setTimeout(() => navigate('/'), 800)
    } else {
      showToast(result.error, 'error')
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface mb-1">
            Quản Lý Ý Tưởng
          </h1>
          <p className="text-on-surface-variant text-sm">
            Tạo, đánh giá và quản lý các ý tưởng nội dung.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="primary-gradient text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm 
                     flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all self-start"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Thêm Ý Tưởng
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          {/* Category Tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.value }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.category === cat.value
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-white/5 text-on-surface-variant hover:bg-white/10 border border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-white/10" />

          {/* Status Filter */}
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map((st) => (
              <button
                key={st.label}
                onClick={() => setFilters(prev => ({ ...prev, status: st.value }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.status === st.value
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-white/5 text-on-surface-variant hover:bg-white/10 border border-transparent'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              search
            </span>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm ý tưởng..."
              className="pl-9 pr-4 py-2 w-full lg:w-56 text-xs !rounded-lg"
            />
          </div>
        </div>

        {/* Mini Stats */}
        <div className="flex gap-4 text-[10px] text-on-surface-variant uppercase tracking-widest pt-1 border-t border-white/5">
          <span>{stats.total} ý tưởng</span>
          <span className="text-on-surface-variant/40">•</span>
          <span className="text-success">{stats.approved} duyệt</span>
          <span className="text-on-surface-variant/40">•</span>
          <span className="text-tertiary">{stats.evaluated} đánh giá</span>
          <span className="text-on-surface-variant/40">•</span>
          <span>{stats.draft} nháp</span>
        </div>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-on-surface-variant text-sm">Đang tải...</p>
          </div>
        </div>
      ) : ideas.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 lg:p-12 text-center">
          <span className="material-symbols-outlined text-primary/50 text-6xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
            lightbulb
          </span>
          <h3 className="text-lg font-bold text-on-surface mb-2">
            {filters.category || filters.status || filters.search
              ? 'Không tìm thấy ý tưởng nào'
              : 'Chưa có ý tưởng nào'}
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
            {filters.category || filters.status || filters.search
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'
              : 'Bắt đầu bằng cách tạo ý tưởng đầu tiên cho kênh YouTube.'}
          </p>
          {!(filters.category || filters.status || filters.search) && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="primary-gradient text-on-primary-container px-6 py-3 rounded-lg font-bold text-sm 
                         inline-flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Tạo Ý Tưởng Đầu Tiên
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {ideas.map((idea, index) => (
            <div key={idea.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <IdeaCard
                idea={idea}
                onEdit={(i) => setEditingIdea(i)}
                onPromote={handlePromote}
                onDelete={(i) => setDeletingIdea(i)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateIdeaModal
        isOpen={showCreateModal || !!editingIdea}
        onClose={() => { setShowCreateModal(false); setEditingIdea(null) }}
        onSubmit={editingIdea ? handleEdit : handleCreate}
        editIdea={editingIdea}
        onPromote={async (idea) => {
          const result = await promoteIdea(idea)
          if (!result.error && result.projectId) {
            showToast('Đã chuyển thành Video Project! Đang mở Dàn Ý...')
            setShowCreateModal(false)
            setEditingIdea(null)
            navigate(`/projects/${result.projectId}?tab=outline`)
          } else if (result.error) {
            showToast(result.error, 'error')
          }
        }}
      />



      {/* Delete Confirmation */}
      <Modal isOpen={!!deletingIdea} onClose={() => setDeletingIdea(null)} title="Xác nhận xóa" size="sm">
        <div className="text-center py-2">
          <span className="material-symbols-outlined text-error text-4xl mb-3 block">warning</span>
          <p className="text-sm text-on-surface mb-1">
            Bạn có chắc muốn xóa ý tưởng này?
          </p>
          <p className="text-xs text-on-surface-variant mb-5">
            "{deletingIdea?.title}"
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setDeletingIdea(null)}
              className="px-5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleDelete}
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
        <div className={`fixed bottom-6 right-6 z-[200] animate-fade-in ${
          toast.type === 'success' ? 'glass-card border-success/30' : 'glass-card border-error/30'
        } rounded-lg px-5 py-3 flex items-center gap-2.5 shadow-2xl`}>
          <span className={`material-symbols-outlined text-lg ${
            toast.type === 'success' ? 'text-success' : 'text-error'
          }`} style={{ fontVariationSettings: "'FILL' 1" }}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm text-on-surface">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
