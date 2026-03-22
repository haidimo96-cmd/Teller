import { useState } from 'react'
import type { Competitor } from '../../hooks/useCompetitors'

interface Props {
  competitor: Competitor
  onEdit: (competitor: Competitor) => void
  onDelete: (id: string) => void
  onView: (competitor: Competitor) => void
}

export default function CompetitorCard({ competitor, onEdit, onDelete, onView }: Props) {
  const [showMenu, setShowMenu] = useState(false)

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  }

  const getCategoryColor = (cat: string | null) => {
    switch (cat) {
      case 'storytelling': return 'bg-primary/10 text-primary border-primary/20'
      case 'educational': return 'bg-tertiary/10 text-tertiary border-tertiary/20'
      case 'entertainment': return 'bg-secondary/10 text-secondary border-secondary/20'
      case 'news': return 'bg-error/10 text-error border-error/20'
      default: return 'bg-white/5 text-on-surface-variant border-white/10'
    }
  }

  return (
    <div
      className="glass-card rounded-xl p-5 group hover:border-primary/30 transition-all relative cursor-pointer"
      onClick={() => onView(competitor)}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 
                        border border-primary/20 text-primary font-extrabold text-sm">
          {getInitials(competitor.channel_name)}
        </div>

        <div className="flex-grow min-w-0">
          <h3 
            className="font-bold text-on-surface text-base leading-tight mb-1 hover:text-primary transition-colors truncate"
          >
            {competitor.channel_name}
          </h3>
          {competitor.subscriber_count && (
            <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px]">group</span>
              {competitor.subscriber_count} subscribers
            </span>
          )}
        </div>

        {/* Three-dot Menu */}
        <div className="relative z-20" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-on-surface-variant/50 hover:text-on-surface transition-colors p-1 -m-1"
          >
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-8 z-50 bg-surface-container-high border border-white/10 rounded-lg shadow-2xl py-1 w-40 animate-fade-in">
                <button
                  onClick={() => { onView(competitor); setShowMenu(false) }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Xem chi tiết
                </button>
                <button
                  onClick={() => { onEdit(competitor); setShowMenu(false) }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Chỉnh sửa
                </button>
                {competitor.channel_url && (
                  <a
                    href={competitor.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Mở kênh
                  </a>
                )}
                <hr className="border-white/5 my-1" />
                <button
                  onClick={() => { onDelete(competitor.id); setShowMenu(false) }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-error/10 text-error flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Xóa
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category Badge */}
      {competitor.category && (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-3 ${getCategoryColor(competitor.category)}`}>
          {competitor.category}
        </span>
      )}

      {/* Content Style */}
      {competitor.content_style && (
        <p className="text-xs text-on-surface-variant mb-3 line-clamp-2 leading-relaxed">
          {competitor.content_style}
        </p>
      )}

      {/* Strengths & Weaknesses */}
      <div className="flex gap-3">
        {competitor.strengths && (
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-success/60 uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">thumb_up</span>
              Mạnh
            </p>
            <p className="text-[10px] text-on-surface-variant line-clamp-2">{competitor.strengths}</p>
          </div>
        )}
        {competitor.weaknesses && (
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-error/60 uppercase tracking-widest mb-1 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">thumb_down</span>
              Yếu
            </p>
            <p className="text-[10px] text-on-surface-variant line-clamp-2">{competitor.weaknesses}</p>
          </div>
        )}
      </div>
    </div>
  )
}
