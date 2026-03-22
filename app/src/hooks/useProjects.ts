import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Re-export pipeline config from the single source of truth
export { STAGES, STAGE_LABELS, STAGE_ICONS, STAGE_COLORS, STAGE_EMOJIS, PIPELINE_STAGES } from '../lib/pipelineRegistry'
export type { Stage } from '../lib/pipelineRegistry'
import type { Stage } from '../lib/pipelineRegistry'

export interface VideoProject {
  id: string
  idea_id: string | null
  title: string
  stage: Stage
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Outline {
  id: string
  project_id: string
  content: string | null
  created_at: string
  updated_at?: string
}

export interface Script {
  id: string
  project_id: string
  content: string | null
  version: number
  word_count: number | null
  status: 'draft' | 'review' | 'approved'
  created_at: string
}

export interface ScriptReview {
  id: string
  script_id: string
  reviewer_id: string | null
  status: 'pending' | 'approved' | 'needs_revision'
  comments: string | null
  created_at: string
}

export function useProjects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('video_projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setProjects(data as VideoProject[])
    setLoading(false)
  }, [])

  const updateStage = async (projectId: string, newStage: Stage) => {
    const { error } = await supabase
      .from('video_projects')
      .update({ stage: newStage, updated_at: new Date().toISOString() })
      .eq('id', projectId)

    if (!error) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, stage: newStage } : p))
    }
    return { error: error?.message || null }
  }

  const updateProject = async (projectId: string, data: Partial<Pick<VideoProject, 'title' | 'priority' | 'due_date' | 'notes'>>) => {
    const { error } = await supabase
      .from('video_projects')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', projectId)

    if (!error) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...data } : p))
    }
    return { error: error?.message || null }
  }

  const deleteProject = async (projectId: string) => {
    const { error } = await supabase
      .from('video_projects')
      .delete()
      .eq('id', projectId)

    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== projectId))
    }
    return { error: error?.message || null }
  }

  // Outline operations
  const fetchOutlines = async (projectId: string) => {
    const { data } = await supabase
      .from('outlines')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    return (data || []) as Outline[]
  }

  const saveOutline = async (projectId: string, content: string) => {
    const { data, error } = await supabase
      .from('outlines')
      .upsert(
        { project_id: projectId, content, updated_at: new Date().toISOString() },
        { onConflict: 'project_id' }
      )
      .select()
      .single()
    return { data: data as Outline | null, error: error?.message || null }
  }

  // Script operations
  const fetchScripts = async (projectId: string) => {
    const { data } = await supabase
      .from('scripts')
      .select('*')
      .eq('project_id', projectId)
      .order('version', { ascending: false })
    return (data || []) as Script[]
  }

  const saveScript = async (projectId: string, content: string, version: number) => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length
    const { data, error } = await supabase
      .from('scripts')
      .insert({ project_id: projectId, content, version, word_count: wordCount, status: 'draft' })
      .select()
      .single()
    return { data: data as Script | null, error: error?.message || null }
  }

  const updateScript = async (scriptId: string, content: string) => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length
    const { error } = await supabase
      .from('scripts')
      .update({ content, word_count: wordCount })
      .eq('id', scriptId)
    return { error: error?.message || null }
  }

  // Script review
  const submitReview = async (scriptId: string, status: ScriptReview['status'], comments: string) => {
    if (!user) return { error: 'Not authenticated' }
    const { error } = await supabase
      .from('script_reviews')
      .insert({ script_id: scriptId, reviewer_id: user.id, status, comments })
    return { error: error?.message || null }
  }

  const fetchReviews = async (scriptId: string) => {
    const { data } = await supabase
      .from('script_reviews')
      .select('*')
      .eq('script_id', scriptId)
      .order('created_at', { ascending: false })
    return (data || []) as ScriptReview[]
  }

  return {
    projects, loading, fetchProjects, updateStage, updateProject, deleteProject,
    fetchOutlines, saveOutline,
    fetchScripts, saveScript, updateScript,
    submitReview, fetchReviews,
  }
}
