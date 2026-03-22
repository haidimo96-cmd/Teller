import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import TopNavbar from './TopNavbar'

export default function AppLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-black italic tracking-tighter text-on-surface mb-4">
            Teller
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary ml-1 animate-pulse-glow" />
          </h1>
          <div className="flex items-center justify-center gap-2 text-on-surface-variant text-sm">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Đang tải...
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNavbar />
      <main className="pt-20 lg:pt-24 pb-12 px-4 lg:px-8 max-w-[1920px] mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
