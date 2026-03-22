import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// ─── Structured Idea Data (stored as JSONB) ─────────────────────
export interface IdeaData {
  one_liner?: string          // "[VICTIM] + [BỊ HOA tấn công] + [NHƯNG] + [KẾT QUẢ]"
  hero?: string               // Mô tả hero (ai, đặc điểm, hành động chủ động)
  villain?: string            // Mô tả villain (ai, chức vụ, đặc điểm)
  villain_line?: string       // Câu thoại villain đáng nhớ
  victim_type?: string        // "cựu chiến binh" | "bà góa" | "mẹ đơn thân" | etc.
  hook?: string               // Câu hook mở đầu (villain quote / action)
  key_twists?: string[]       // 3-5 twists cascade
  escalation?: string[]       // Các vòng escalation (≥3)
  payoff?: string             // Hậu quả cụ thể cho villain
  viral_formula?: string      // Formula nào sử dụng (1-6)
  title_formula?: string      // Title formula nào sử dụng
  dual_themes?: string[]      // Các theme kết hợp (e.g. ["phân biệt", "gia đình"])
  concrete_numbers?: string[] // Con số cụ thể ($, sqft, ngày)
  wtf_concept?: string        // 1 câu tóm tắt WTF
  comment_trigger?: string    // Câu hỏi gây tranh cãi
}

export interface Idea {
  id: string
  title: string
  description: string | null
  category: 'FURY' | 'STRATEGY' | 'COMEDY'
  primary_pattern: string | null
  sub_patterns: string[] | null
  scoring_group: 'FURY' | 'STRATEGY' | 'COMEDY' | null
  idea_data: IdeaData | null
  status: 'draft' | 'evaluated' | 'approved' | 'rejected'
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface IdeaEvaluation {
  id: string
  idea_id: string
  hoa_pattern_score: number | null
  red_flags: string | null
  total_score: number | null
  notes: string | null
  evaluated_by: string | null
  created_at: string
}

export interface CreateIdeaInput {
  title: string
  description?: string
  category: 'FURY' | 'STRATEGY' | 'COMEDY'
  primary_pattern?: string
  sub_patterns?: string[]
  scoring_group?: 'FURY' | 'STRATEGY' | 'COMEDY'
  idea_data?: IdeaData
}

export interface EvaluationInput {
  hoa_pattern_score: number
  red_flags: string
  total_score: number
  notes: string
}

export interface IdeasFilter {
  category?: 'FURY' | 'STRATEGY' | 'COMEDY' | null
  status?: 'draft' | 'evaluated' | 'approved' | 'rejected' | null
  search?: string
}

export function useIdeas() {
  const { user } = useAuth()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIdeas = useCallback(async (filters?: IdeasFilter) => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error: err } = await query
    if (err) {
      setError(err.message)
    } else {
      setIdeas(data || [])
    }
    setLoading(false)
  }, [])

  const createIdea = async (input: CreateIdeaInput) => {
    if (!user) return { error: 'Not authenticated' }

    // Base insert payload (always works)
    const basePayload: Record<string, unknown> = {
      title: input.title,
      description: input.description || null,
      category: input.category,
      created_by: user.id,
    }

    // Extended fields (may not exist in DB if migration hasn't run)
    const extPayload: Record<string, unknown> = {
      ...basePayload,
      ...(input.primary_pattern ? { primary_pattern: input.primary_pattern } : {}),
      ...(input.sub_patterns ? { sub_patterns: input.sub_patterns } : {}),
      ...(input.scoring_group ? { scoring_group: input.scoring_group } : {}),
      ...(input.idea_data ? { idea_data: input.idea_data } : {}),
    }

    // Try with extended fields first
    let { data, error: err } = await supabase
      .from('ideas')
      .insert(extPayload)
      .select()
      .single()

    // Fallback: if schema error (column doesn't exist), retry without new fields
    if (err && err.message.includes('schema cache')) {
      const result = await supabase
        .from('ideas')
        .insert(basePayload)
        .select()
        .single()
      data = result.data
      err = result.error
    }

    if (err) return { error: err.message }
    setIdeas(prev => [data, ...prev])
    return { error: null, data }
  }

  const updateIdea = async (id: string, input: Partial<CreateIdeaInput & { status: string }>) => {
    const { data, error: err } = await supabase
      .from('ideas')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (err) return { error: err.message }
    setIdeas(prev => prev.map(i => i.id === id ? data : i))
    return { error: null, data }
  }

  const deleteIdea = async (id: string) => {
    const { error: err } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id)

    if (err) return { error: err.message }
    setIdeas(prev => prev.filter(i => i.id !== id))
    return { error: null }
  }

  const evaluateIdea = async (ideaId: string, input: EvaluationInput) => {
    if (!user) return { error: 'Not authenticated' }

    const { error: err } = await supabase
      .from('idea_evaluations')
      .insert({
        idea_id: ideaId,
        hoa_pattern_score: input.hoa_pattern_score,
        red_flags: input.red_flags || null,
        total_score: input.total_score,
        notes: input.notes || null,
        evaluated_by: user.id,
      })

    if (err) return { error: err.message }

    // Update idea status to evaluated
    await updateIdea(ideaId, { status: 'evaluated' })
    return { error: null }
  }

  const promoteIdea = async (idea: Idea) => {
    if (!user) return { error: 'Not authenticated' }

    // Create video project from idea
    const { data, error: err } = await supabase
      .from('video_projects')
      .insert({
        idea_id: idea.id,
        title: idea.title,
        stage: 'idea',
        priority: 'medium',
        created_by: user.id,
      })
      .select()
      .single()

    if (err) return { error: err.message }

    // Update idea status to approved
    await updateIdea(idea.id, { status: 'approved' })
    return { error: null, projectId: data.id }
  }

  const fetchUnlinkedIdeas = useCallback(async () => {
    // Step 1: Get all idea_ids already linked to video_projects
    const { data: linkedRows } = await supabase
      .from('video_projects')
      .select('idea_id')
      .not('idea_id', 'is', null)

    const linkedIds = (linkedRows || []).map((r: { idea_id: string }) => r.idea_id)

    // Step 2: Fetch all ideas not in linked set
    let query = supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })

    if (linkedIds.length > 0) {
      // Supabase: .not('id', 'in', '(uuid1,uuid2,...)')
      query = query.not('id', 'in', `(${linkedIds.join(',')})`)
    }

    const { data } = await query
    return (data || []) as Idea[]
  }, [])

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    evaluateIdea,
    promoteIdea,
    fetchUnlinkedIdeas,
  }
}
