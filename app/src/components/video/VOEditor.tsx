import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'

interface VONote {
  id: string
  project_id: string
  section_label: string | null
  content: string | null
  tags: string | null
  sort_order: number
  created_at: string
}

interface Props {
  projectId: string
}

const VO_TAGS = [
  { tag: '<break time="0.5s"/>', label: 'Ngắt 0.5s', icon: 'timer', color: 'text-primary' },
  { tag: '<break time="1s"/>', label: 'Ngắt 1s', icon: 'hourglass_empty', color: 'text-primary' },
  { tag: '<break time="2s"/>', label: 'Ngắt 2s', icon: 'hourglass_full', color: 'text-primary' },
  { tag: '[WHISPER]', label: 'Thì thầm', icon: 'hearing', color: 'text-secondary' },
  { tag: '[EMPHASIS]', label: 'Nhấn mạnh', icon: 'priority_high', color: 'text-error' },
  { tag: '[SLOW]', label: 'Chậm lại', icon: 'slow_motion_video', color: 'text-tertiary' },
  { tag: '[FAST]', label: 'Nhanh hơn', icon: 'speed', color: 'text-warning' },
  { tag: '[PAUSE]', label: 'Tạm dừng', icon: 'pause_circle', color: 'text-on-surface-variant' },
  { tag: '[SAD]', label: 'Buồn', icon: 'sentiment_dissatisfied', color: 'text-blue-400' },
  { tag: '[ANGRY]', label: 'Giận dữ', icon: 'mood_bad', color: 'text-error' },
  { tag: '[HAPPY]', label: 'Vui vẻ', icon: 'sentiment_satisfied', color: 'text-success' },
  { tag: '[SARCASTIC]', label: 'Mỉa mai', icon: 'sentiment_neutral', color: 'text-warning' },
]

export default function VOEditor({ projectId }: Props) {
  const [sections, setSections] = useState<VONote[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => { fetchSections() }, [projectId])

  const fetchSections = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('vo_notes')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true })

    if (data && data.length > 0) {
      setSections(data as VONote[])
      setActiveSectionId(data[0].id)
    }
    setLoading(false)
  }

  const addSection = async () => {
    const newOrder = sections.length > 0 ? Math.max(...sections.map(s => s.sort_order)) + 1 : 0
    const label = `Phần ${sections.length + 1}`
    const { data, error } = await supabase
      .from('vo_notes')
      .insert({ project_id: projectId, section_label: label, content: '', tags: '', sort_order: newOrder })
      .select()
      .single()

    if (!error && data) {
      const newSection = data as VONote
      setSections(prev => [...prev, newSection])
      setActiveSectionId(newSection.id)
    }
  }

  const updateSection = (id: string, field: keyof VONote, value: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const saveAll = async () => {
    setSaving(true)
    for (const section of sections) {
      await supabase
        .from('vo_notes')
        .update({ content: section.content, section_label: section.section_label, tags: section.tags })
        .eq('id', section.id)
    }
    setSaving(false)
  }

  const deleteSection = async (id: string) => {
    await supabase.from('vo_notes').delete().eq('id', id)
    setSections(prev => prev.filter(s => s.id !== id))
    if (activeSectionId === id) {
      setActiveSectionId(sections.find(s => s.id !== id)?.id || null)
    }
  }

  const insertTag = (tag: string) => {
    const activeSection = sections.find(s => s.id === activeSectionId)
    if (!activeSection) return
    const currentContent = activeSection.content || ''
    updateSection(activeSection.id, 'content', currentContent + ' ' + tag + ' ')
  }

  const activeSection = sections.find(s => s.id === activeSectionId)

  // Generate ElevenLabs-ready preview
  const elevenLabsPreview = useMemo(() => {
    return sections.map(s => {
      let content = s.content || ''
      // Convert custom tags to SSML-like format
      content = content.replace(/\[WHISPER\]/g, '<prosody volume="soft">')
      content = content.replace(/\[\/WHISPER\]/g, '</prosody>')
      content = content.replace(/\[EMPHASIS\]/g, '<emphasis level="strong">')
      content = content.replace(/\[\/EMPHASIS\]/g, '</emphasis>')
      content = content.replace(/\[SLOW\]/g, '<prosody rate="slow">')
      content = content.replace(/\[\/SLOW\]/g, '</prosody>')
      content = content.replace(/\[FAST\]/g, '<prosody rate="fast">')
      content = content.replace(/\[\/FAST\]/g, '</prosody>')
      content = content.replace(/\[PAUSE\]/g, '<break time="1s"/>')
      content = content.replace(/\[(SAD|ANGRY|HAPPY|SARCASTIC)\]/g, '/* $1 */')
      return `--- ${s.section_label} ---\n${content}`
    }).join('\n\n')
  }, [sections])

  const totalWordCount = sections.reduce((acc, s) => {
    const plainText = (s.content || '').replace(/<[^>]+>|\[[^\]]+\]/g, '').trim()
    return acc + (plainText ? plainText.split(/\s+/).length : 0)
  }, 0)

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
            <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Phần</p>
            <p className="text-xl font-bold">{sections.length}</p>
          </div>
          <div className="text-center">
            <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Tổng từ</p>
            <p className="text-xl font-bold">{totalWordCount.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-on-surface-variant text-[10px] tracking-widest uppercase mb-1">Est.</p>
            <p className="text-xl font-bold">{Math.ceil(totalWordCount / 130)} phút</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              showPreview ? 'bg-primary/20 text-primary' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">preview</span>
            Preview
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="primary-gradient text-on-primary-container px-5 py-2 rounded-lg font-bold text-sm
                       hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu tất cả'}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* ElevenLabs Preview */
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm text-primary">smart_toy</span>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">ElevenLabs Format Preview</p>
          </div>
          <pre className="bg-surface-container-lowest border border-white/10 rounded-lg p-5 text-xs leading-relaxed 
                          font-mono text-on-surface-variant overflow-x-auto whitespace-pre-wrap max-h-[500px] overflow-y-auto">
            {elevenLabsPreview || 'Chưa có nội dung VO. Thêm phần mới để bắt đầu.'}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(elevenLabsPreview)
            }}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm transition-all"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Copy ElevenLabs Text
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Section List */}
          <div className="lg:w-48 flex-shrink-0 space-y-2">
            {sections.map((section, i) => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between group ${
                  activeSectionId === section.id
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-on-surface-variant/50 font-mono">{i + 1}</span>
                  <span className="truncate">{section.section_label || `Phần ${i + 1}`}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSection(section.id) }}
                  className="opacity-0 group-hover:opacity-100 text-error/60 hover:text-error transition-opacity"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </button>
            ))}
            <button
              onClick={addSection}
              className="w-full px-3 py-2.5 rounded-lg text-xs font-medium text-on-surface-variant
                         border border-dashed border-white/20 hover:border-primary/50 hover:text-primary transition-all
                         flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Thêm phần
            </button>
          </div>

          {/* Editor */}
          <div className="flex-grow space-y-4">
            {activeSection ? (
              <>
                {/* Section Label */}
                <input
                  type="text"
                  value={activeSection.section_label || ''}
                  onChange={(e) => updateSection(activeSection.id, 'section_label', e.target.value)}
                  className="w-full bg-transparent border-none text-lg font-bold text-on-surface p-0 
                             focus:ring-0 placeholder:text-on-surface-variant/30"
                  placeholder="Tên phần (vd: Hook, Conflict, Climax...)"
                />

                {/* Tag Bar */}
                <div className="flex gap-1.5 flex-wrap p-2 rounded-lg bg-white/5 border border-white/5">
                  {VO_TAGS.map(t => (
                    <button
                      key={t.tag}
                      onClick={() => insertTag(t.tag)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold 
                                  bg-white/5 hover:bg-white/10 transition-all ${t.color}`}
                      title={t.tag}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Content Editor */}
                <textarea
                  value={activeSection.content || ''}
                  onChange={(e) => updateSection(activeSection.id, 'content', e.target.value)}
                  className="w-full min-h-[350px] bg-surface-container-lowest border border-white/10 rounded-lg p-4
                             text-sm leading-relaxed resize-y focus:ring-1 focus:ring-primary font-body"
                  placeholder="Viết nội dung VO ở đây... Sử dụng các tag ở trên để đánh dấu cảm xúc và nhịp độ."
                />
              </>
            ) : (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-primary/20 text-5xl mb-3 block">mic</span>
                <p className="text-on-surface-variant text-sm mb-4">Chưa có phần VO nào.</p>
                <button
                  onClick={addSection}
                  className="primary-gradient text-on-primary-container px-5 py-2.5 rounded-lg font-bold text-sm
                             inline-flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Tạo Phần VO Đầu Tiên
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
