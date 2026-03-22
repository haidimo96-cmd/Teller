import { useEffect, useState, useMemo } from 'react'
import { useCompetitors, type Competitor, type CreateCompetitorInput } from '../hooks/useCompetitors'
import CompetitorCard from '../components/competitors/CompetitorCard'
import Modal from '../components/ui/Modal'

const CATEGORIES = [
  { key: '', label: 'Tất cả', icon: 'grid_view' },
  { key: 'storytelling', label: 'Storytelling', icon: 'auto_stories' },
  { key: 'educational', label: 'Educational', icon: 'school' },
  { key: 'entertainment', label: 'Entertainment', icon: 'theater_comedy' },
  { key: 'news', label: 'News', icon: 'newspaper' },
]

const FORM_INITIAL: CreateCompetitorInput = {
  channel_name: '',
  channel_url: '',
  subscriber_count: '',
  category: 'storytelling',
  content_style: '',
  strengths: '',
  weaknesses: '',
  notes: '',
}

export default function CompetitorsPage() {
  const { competitors, loading, fetchCompetitors, createCompetitor, updateCompetitor, deleteCompetitor } = useCompetitors()
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
  const [viewingCompetitor, setViewingCompetitor] = useState<Competitor | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [form, setForm] = useState<CreateCompetitorInput>(FORM_INITIAL)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { fetchCompetitors() }, [fetchCompetitors])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const filtered = useMemo(() => {
    return competitors.filter(c => {
      if (activeCategory && c.category !== activeCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return c.channel_name.toLowerCase().includes(q) ||
               c.content_style?.toLowerCase().includes(q) ||
               c.notes?.toLowerCase().includes(q)
      }
      return true
    })
  }, [competitors, activeCategory, searchQuery])

  const handleCreate = async () => {
    if (!form.channel_name.trim()) return
    setSaving(true)
    const { error } = await createCompetitor(form)
    if (!error) {
      setShowCreateModal(false)
      setForm(FORM_INITIAL)
      showToast('Đã thêm đối thủ!')
    }
    setSaving(false)
  }

  const handleUpdate = async () => {
    if (!editingCompetitor || !form.channel_name.trim()) return
    setSaving(true)
    const { error } = await updateCompetitor(editingCompetitor.id, form)
    if (!error) {
      setEditingCompetitor(null)
      setForm(FORM_INITIAL)
      showToast('Đã cập nhật!')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    await deleteCompetitor(confirmDelete)
    setConfirmDelete(null)
    showToast('Đã xóa đối thủ!')
  }

  const openEdit = (c: Competitor) => {
    setForm({
      channel_name: c.channel_name,
      channel_url: c.channel_url || '',
      subscriber_count: c.subscriber_count || '',
      category: c.category || 'storytelling',
      content_style: c.content_style || '',
      strengths: c.strengths || '',
      weaknesses: c.weaknesses || '',
      notes: c.notes || '',
    })
    setEditingCompetitor(c)
  }

  const isEditing = !!editingCompetitor
  const isModalOpen = showCreateModal || isEditing

  const stats = {
    total: competitors.length,
    storytelling: competitors.filter(c => c.category === 'storytelling').length,
    educational: competitors.filter(c => c.category === 'educational').length,
    entertainment: competitors.filter(c => c.category === 'entertainment').length,
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface mb-1">
            Phân Tích Đối Thủ
          </h1>
          <p className="text-on-surface-variant text-sm">
            Kho dữ liệu kịch bản đối thủ, audience insight và kỹ thuật viết.
          </p>
        </div>
        <button
          onClick={() => { setForm(FORM_INITIAL); setShowCreateModal(true) }}
          className="primary-gradient text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm 
                     flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Thêm Đối Thủ
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-white/5 text-on-surface-variant hover:bg-white/10 border border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative lg:ml-auto w-full lg:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-on-surface-variant/50">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm đối thủ..."
              className="w-full pl-9 pr-4 py-2 text-xs"
            />
          </div>
        </div>

        {/* Mini Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-[10px] tracking-widest uppercase font-bold">
          <span>{stats.total} <span className="text-on-surface-variant/60">Đối thủ</span></span>
          <span className="text-primary">{stats.storytelling} <span className="text-on-surface-variant/60">Story</span></span>
          <span className="text-tertiary">{stats.educational} <span className="text-on-surface-variant/60">Edu</span></span>
          <span className="text-secondary">{stats.entertainment} <span className="text-on-surface-variant/60">Ent</span></span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <CompetitorCard
              key={c.id}
              competitor={c}
              onEdit={openEdit}
              onDelete={(id) => setConfirmDelete(id)}
              onView={setViewingCompetitor}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-10 lg:p-16 text-center">
          <span className="material-symbols-outlined text-primary/20 text-5xl mb-3 block">analytics</span>
          <h3 className="font-bold mb-2 text-lg">
            {searchQuery || activeCategory ? 'Không tìm thấy kết quả' : 'Chưa có đối thủ nào'}
          </h3>
          <p className="text-on-surface-variant text-sm mb-5">
            {searchQuery || activeCategory
              ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.'
              : 'Bắt đầu bằng cách thêm kênh đối thủ để phân tích.'}
          </p>
          {!searchQuery && !activeCategory && (
            <button
              onClick={() => { setForm(FORM_INITIAL); setShowCreateModal(true) }}
              className="primary-gradient text-on-primary-container px-6 py-2.5 rounded-lg font-bold text-sm 
                         inline-flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Thêm Đối Thủ Đầu Tiên
            </button>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setShowCreateModal(false); setEditingCompetitor(null) }}
        title={isEditing ? 'Chỉnh Sửa Đối Thủ' : 'Thêm Đối Thủ'}
        size="md"
      >
        <div className="space-y-4">
          {/* Channel Name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-1.5">
              Tên Kênh <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={form.channel_name}
              onChange={(e) => setForm(f => ({ ...f, channel_name: e.target.value }))}
              placeholder="Ví dụ: MrBeast, Kurzgesagt..."
              className="w-full"
              autoFocus
            />
          </div>

          {/* Row: URL + Subscribers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-1.5">URL Kênh</label>
              <input
                type="url"
                value={form.channel_url || ''}
                onChange={(e) => setForm(f => ({ ...f, channel_url: e.target.value }))}
                placeholder="https://youtube.com/@..."
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-1.5">Subscribers</label>
              <input
                type="text"
                value={form.subscriber_count || ''}
                onChange={(e) => setForm(f => ({ ...f, subscriber_count: e.target.value }))}
                placeholder="1.2M, 500K..."
                className="w-full"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-1.5">Thể loại</label>
            <div className="flex gap-2 flex-wrap">
              {['storytelling', 'educational', 'entertainment', 'news'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    form.category === cat
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-white/5 text-on-surface-variant border border-transparent hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content Style */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-1.5">Phong cách nội dung</label>
            <textarea
              value={form.content_style || ''}
              onChange={(e) => setForm(f => ({ ...f, content_style: e.target.value }))}
              placeholder="Mô tả phong cách: talking head, animation, documentary..."
              className="w-full"
              rows={2}
            />
          </div>

          {/* Strengths + Weaknesses */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-success/70 mb-1.5">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px]">thumb_up</span>
                  Điểm mạnh
                </span>
              </label>
              <textarea
                value={form.strengths || ''}
                onChange={(e) => setForm(f => ({ ...f, strengths: e.target.value }))}
                placeholder="Hook mạnh, editing chất..."
                className="w-full"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-error/70 mb-1.5">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px]">thumb_down</span>
                  Điểm yếu
                </span>
              </label>
              <textarea
                value={form.weaknesses || ''}
                onChange={(e) => setForm(f => ({ ...f, weaknesses: e.target.value }))}
                placeholder="Thumbnail kém, VO đơn điệu..."
                className="w-full"
                rows={2}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-1.5">Ghi chú</label>
            <textarea
              value={form.notes || ''}
              onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Ghi chú thêm..."
              className="w-full"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => { setShowCreateModal(false); setEditingCompetitor(null) }}
              className="px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10"
            >
              Hủy
            </button>
            <button
              onClick={isEditing ? handleUpdate : handleCreate}
              disabled={saving || !form.channel_name.trim()}
              className="primary-gradient text-on-primary-container px-6 py-2.5 rounded-lg font-bold text-sm
                         hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm Đối Thủ'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Detail Drawer */}
      {viewingCompetitor && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingCompetitor(null)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface-container border-l border-white/10 
                          shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-6 lg:p-8">
              {/* Close Button */}
              <button
                onClick={() => setViewingCompetitor(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center 
                                border border-primary/20 text-primary font-extrabold text-xl">
                  {viewingCompetitor.channel_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">{viewingCompetitor.channel_name}</h2>
                  {viewingCompetitor.subscriber_count && (
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">group</span>
                      {viewingCompetitor.subscriber_count} subscribers
                    </span>
                  )}
                </div>
              </div>

              {/* Category */}
              {viewingCompetitor.category && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider 
                                 bg-primary/10 text-primary border border-primary/20 mb-6">
                  {viewingCompetitor.category}
                </span>
              )}

              {/* URL */}
              {viewingCompetitor.channel_url && (
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">URL Kênh</p>
                  <a
                    href={viewingCompetitor.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary-dim transition-colors inline-flex items-center gap-1"
                  >
                    {viewingCompetitor.channel_url}
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              )}

              {/* Content Style */}
              {viewingCompetitor.content_style && (
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">Phong cách nội dung</p>
                  <p className="text-sm text-on-surface leading-relaxed">{viewingCompetitor.content_style}</p>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-success mb-2 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                    Điểm mạnh
                  </p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {viewingCompetitor.strengths || 'Chưa có'}
                  </p>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-error mb-2 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">thumb_down</span>
                    Điểm yếu
                  </p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {viewingCompetitor.weaknesses || 'Chưa có'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {viewingCompetitor.notes && (
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 font-bold">Ghi chú</p>
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{viewingCompetitor.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => { openEdit(viewingCompetitor); setViewingCompetitor(null) }}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 
                             rounded-lg text-sm font-semibold transition-all"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => { setConfirmDelete(viewingCompetitor.id); setViewingCompetitor(null) }}
                  className="flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error px-4 py-2.5 
                             rounded-lg text-sm font-semibold border border-error/20 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Xóa đối thủ" size="sm">
        <div className="text-center py-2">
          <span className="material-symbols-outlined text-error text-4xl mb-3 block">warning</span>
          <p className="text-sm mb-1">Xóa đối thủ này?</p>
          <p className="text-xs text-on-surface-variant mb-5">Hành động này không thể hoàn tác.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setConfirmDelete(null)} className="px-5 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-white/10">Hủy</button>
            <button onClick={handleDelete} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-error/20 text-error border border-error/30 hover:bg-error/30">Xóa</button>
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
