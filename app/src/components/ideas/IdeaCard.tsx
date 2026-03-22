import { useState, useRef, useEffect } from 'react'
import Badge from '../ui/Badge'
import type { Idea } from '../../hooks/useIdeas'
import { timeAgo } from '../../lib/utils'
import { getPatternById } from '../../lib/pipelineRegistry'

interface IdeaCardProps {
  idea: Idea
  onEdit: (idea: Idea) => void
  onPromote: (idea: Idea) => void
  onDelete: (idea: Idea) => void
}

export default function IdeaCard({ idea, onEdit, onPromote, onDelete }: IdeaCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categoryVariant = idea.category.toLowerCase() as 'fury' | 'strategy' | 'comedy'
  const statusVariant = idea.status as 'draft' | 'evaluated' | 'approved' | 'rejected'

  const categoryIcon: Record<string, string> = {
    FURY: 'local_fire_department',
    STRATEGY: 'psychology',
    COMEDY: 'sentiment_very_satisfied',
  }

  const statusLabel: Record<string, string> = {
    draft: 'Nháp',
    evaluated: 'Đã đánh giá',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
  }

  const primaryPat = idea.primary_pattern ? getPatternById(idea.primary_pattern) : null
  const subPats = (idea.sub_patterns || []).map(id => getPatternById(id)).filter(Boolean)

  return (
    <div className="glass-card rounded-xl p-4 lg:p-5 group hover:border-primary/30 transition-all relative">
      {/* Top row: Category + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={categoryVariant} size="sm">
            <span className="material-symbols-outlined text-[11px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              {categoryIcon[idea.category]}
            </span>
            {idea.category}
          </Badge>
          <Badge variant={statusVariant} size="sm">
            {statusLabel[idea.status]}
          </Badge>
        </div>

        {/* Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 
                       hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-base">more_vert</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 glass-card rounded-lg border border-white/10 py-1 z-50 animate-fade-in">
              <button
                onClick={() => { setMenuOpen(false); onEdit(idea) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-on-surface hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Chỉnh sửa
              </button>

              {(idea.status === 'evaluated' || idea.status === 'draft') && (
                <button
                  onClick={() => { setMenuOpen(false); onPromote(idea) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  Chuyển thành Video
                </button>
              )}
              <div className="border-t border-white/10 my-1" />
              <button
                onClick={() => { setMenuOpen(false); onDelete(idea) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-error hover:bg-error/5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pattern Tags */}
      {primaryPat && (
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-on-surface-variant">
            {primaryPat.icon} {primaryPat.name}
          </span>
          {subPats.map(sp => sp && (
            <span key={sp.id} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/3 text-[9px] text-on-surface-variant/60">
              {sp.icon} {sp.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="text-sm lg:text-base font-bold text-on-surface mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {idea.title}
      </h3>

      {/* Description */}
      {idea.description && (
        <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
          {idea.description}
        </p>
      )}

      {/* Structured Idea Data Preview */}
      {idea.idea_data && Object.keys(idea.idea_data).length > 0 && (
        <div className="space-y-1.5 mb-3">
          {idea.idea_data.one_liner && (
            <p className="text-[10px] text-on-surface-variant/80 italic leading-snug line-clamp-2 pl-2 border-l-2 border-primary/30">
              {idea.idea_data.one_liner}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {idea.idea_data.viral_formula && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] text-amber-400 border border-amber-500/20">
                🎭 {idea.idea_data.viral_formula}
              </span>
            )}
            {idea.idea_data.hero && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-[9px] text-emerald-400 border border-emerald-500/20">
                🦸 {idea.idea_data.hero.length > 25 ? idea.idea_data.hero.slice(0, 25) + '…' : idea.idea_data.hero}
              </span>
            )}
            {idea.idea_data.villain && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/10 text-[9px] text-red-400 border border-red-500/20">
                😈 {idea.idea_data.villain.length > 25 ? idea.idea_data.villain.slice(0, 25) + '…' : idea.idea_data.villain}
              </span>
            )}
            {idea.idea_data.concrete_numbers && idea.idea_data.concrete_numbers.length > 0 && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-500/10 text-[9px] text-blue-400 border border-blue-500/20">
                💰 {idea.idea_data.concrete_numbers.slice(0, 3).join(', ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer: Time + Eval Status */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">schedule</span>
          {timeAgo(idea.created_at)}
        </span>
        {idea.status === 'evaluated' || idea.status === 'approved' ? (
          <span className="text-[10px] font-medium flex items-center gap-1 text-success">
            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Đã đánh giá
          </span>
        ) : (
          <span className="text-[10px] font-medium flex items-center gap-1 text-on-surface-variant/50">
            <span className="material-symbols-outlined text-[12px]">pending</span>
            Chưa đánh giá
          </span>
        )}
      </div>
    </div>
  )
}
