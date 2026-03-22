import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface TitlePackage {
  id: string
  project_id: string
  titles: string | null
  thumbnail_desc: string | null
  selected_title: string | null
  created_at: string
}

interface Props {
  projectId: string
  projectTitle: string
}

const MAX_TITLE_SLOTS = 5
const TITLE_TIPS = [
  'Dùng số cụ thể: "$340K", "5 năm", "72 giờ"',
  'Tạo khoảng trống tò mò: "điều KHÔNG AI dám nói"',
  'Power words: CẤM, BẮT, PHẠT, MẤT, ĐÒI',
  'Gợi cảm xúc mạnh: giận dữ, bất công, bất ngờ',
  'Dưới 60 ký tự để không bị cắt trên YouTube',
]

export default function TitleSuggestions({ projectId, projectTitle }: Props) {
  const [pkg, setPkg] = useState<TitlePackage | null>(null)
  const [titles, setTitles] = useState<string[]>(Array(MAX_TITLE_SLOTS).fill(''))
  const [thumbnailDesc, setThumbnailDesc] = useState('')
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showTips, setShowTips] = useState(false)

  useEffect(() => { fetchPackage() }, [projectId])

  const fetchPackage = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('title_packages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (data) {
      const p = data as TitlePackage
      setPkg(p)
      try {
        const parsed = JSON.parse(p.titles || '[]')
        const arr = Array.isArray(parsed) ? parsed : []
        const paddedTitles = [...arr, ...Array(MAX_TITLE_SLOTS - arr.length).fill('')].slice(0, MAX_TITLE_SLOTS)
        setTitles(paddedTitles)
        // Use the freshly parsed titles, not the stale `titles` state
        const selIdx = paddedTitles.findIndex((t: string) => t === p.selected_title)
        if (selIdx >= 0) setSelectedIdx(selIdx)
      } catch { setTitles(Array(MAX_TITLE_SLOTS).fill('')) }
      setThumbnailDesc(p.thumbnail_desc || '')
    }
    setLoading(false)
  }

  const savePackage = async () => {
    setSaving(true)
    const titlesJson = JSON.stringify(titles.filter(t => t.trim()))
    const selectedTitle = selectedIdx !== null ? titles[selectedIdx] : null

    if (pkg) {
      await supabase
        .from('title_packages')
        .update({ titles: titlesJson, thumbnail_desc: thumbnailDesc, selected_title: selectedTitle })
        .eq('id', pkg.id)
    } else {
      const { data } = await supabase
        .from('title_packages')
        .insert({ project_id: projectId, titles: titlesJson, thumbnail_desc: thumbnailDesc, selected_title: selectedTitle })
        .select()
        .single()
      if (data) setPkg(data as TitlePackage)
    }
    setSaving(false)
  }

  const updateTitle = (idx: number, value: string) => {
    setTitles(prev => prev.map((t, i) => i === idx ? value : t))
  }

  const filledCount = titles.filter(t => t.trim()).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Tiêu đề</p>
            <p className="text-xl font-bold">{filledCount}<span className="text-on-surface-variant/40">/{MAX_TITLE_SLOTS}</span></p>
          </div>
          <div className="text-center">
            <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Đã chọn</p>
            <p className="text-xl font-bold">{selectedIdx !== null ? '✓' : '—'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTips(!showTips)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              showTips ? 'bg-tertiary/20 text-tertiary' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">tips_and_updates</span>
            Tips
          </button>
          <button
            onClick={savePackage}
            disabled={saving}
            className="primary-gradient text-on-primary-container px-5 py-2 rounded-lg font-bold text-sm
                       hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Tips Panel */}
      {showTips && (
        <div className="mb-6 p-4 rounded-xl bg-tertiary/5 border border-tertiary/20 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-tertiary text-sm">lightbulb</span>
            <p className="text-xs font-bold uppercase tracking-widest text-tertiary">Bí quyết viết tiêu đề YouTube</p>
          </div>
          {TITLE_TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
              <span className="text-tertiary/60 mt-0.5">•</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}

      {/* Title Slots */}
      <div className="space-y-3 mb-8">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">title</span>
          {MAX_TITLE_SLOTS} Phương Án Tiêu Đề
        </p>
        {titles.map((title, idx) => {
          const charCount = title.length
          const isLong = charCount > 60
          const isSelected = selectedIdx === idx

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-primary/10 border border-primary/30 ring-1 ring-primary/20'
                  : 'bg-white/5 border border-white/5 hover:border-white/10'
              }`}
            >
              {/* Select Button */}
              <button
                onClick={() => setSelectedIdx(isSelected ? null : idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-primary text-surface'
                    : 'bg-white/5 text-on-surface-variant/40 hover:text-primary hover:bg-primary/10'
                }`}
                title={isSelected ? 'Bỏ chọn' : 'Chọn tiêu đề này'}
              >
                <span className="material-symbols-outlined text-sm" style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </button>

              {/* Title Input */}
              <div className="flex-grow">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => updateTitle(idx, e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-sm font-semibold 
                             focus:ring-0 placeholder:text-on-surface-variant/30"
                  placeholder={idx === 0 ? `Dựa trên: ${projectTitle}` : `Phương án ${idx + 1}...`}
                />
              </div>

              {/* Character Count */}
              <span className={`text-[10px] font-mono flex-shrink-0 ${
                isLong ? 'text-error' : charCount > 0 ? 'text-on-surface-variant/60' : 'text-transparent'
              }`}>
                {charCount}/60
              </span>

              {/* Slot Number */}
              <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-on-surface-variant/40 flex-shrink-0">
                {idx + 1}
              </span>
            </div>
          )
        })}
      </div>

      {/* Thumbnail Description */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">image</span>
          Mô Tả Thumbnail
        </p>
        <textarea
          value={thumbnailDesc}
          onChange={(e) => setThumbnailDesc(e.target.value)}
          className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-4
                     text-sm leading-relaxed resize-y focus:ring-1 focus:ring-primary min-h-[120px]"
          placeholder="Mô tả hình ảnh thumbnail...&#10;Ví dụ: Close-up khuôn mặt giận dữ, nền đỏ tối, text trắng bold '$18,000', biểu tượng cỏ xanh góc phải"
        />
      </div>

      {/* Selected Title Preview */}
      {selectedIdx !== null && titles[selectedIdx]?.trim() && (
        <div className="mt-8 p-5 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-2 font-bold">Tiêu đề đã chọn</p>
          <p className="text-lg font-extrabold text-on-surface leading-tight">{titles[selectedIdx]}</p>
          {thumbnailDesc && (
            <p className="text-xs text-on-surface-variant mt-2 italic">{thumbnailDesc}</p>
          )}
        </div>
      )}
    </div>
  )
}
