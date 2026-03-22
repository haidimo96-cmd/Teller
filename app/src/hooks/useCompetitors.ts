import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Competitor {
  id: string
  channel_name: string
  channel_url: string | null
  subscriber_count: string | null
  category: string | null
  content_style: string | null
  strengths: string | null
  weaknesses: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type CreateCompetitorInput = Omit<Competitor, 'id' | 'created_by' | 'created_at' | 'updated_at'>

export function useCompetitors() {
  const { user } = useAuth()
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCompetitors = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('competitors')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setCompetitors(data as Competitor[])
    setLoading(false)
  }, [])

  const createCompetitor = async (input: CreateCompetitorInput) => {
    if (!user) return { error: 'Not authenticated' }
    const { error } = await supabase
      .from('competitors')
      .insert({ ...input, created_by: user.id })

    if (!error) await fetchCompetitors()
    return { error: error?.message || null }
  }

  const updateCompetitor = async (id: string, input: Partial<CreateCompetitorInput>) => {
    const { error } = await supabase
      .from('competitors')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setCompetitors(prev => prev.map(c => c.id === id ? { ...c, ...input } : c))
    }
    return { error: error?.message || null }
  }

  const deleteCompetitor = async (id: string) => {
    const { error } = await supabase
      .from('competitors')
      .delete()
      .eq('id', id)

    if (!error) {
      setCompetitors(prev => prev.filter(c => c.id !== id))
    }
    return { error: error?.message || null }
  }

  return { competitors, loading, fetchCompetitors, createCompetitor, updateCompetitor, deleteCompetitor }
}
