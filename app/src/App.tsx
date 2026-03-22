import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import IdeasPage from './pages/IdeasPage'
import VideoDetailPage from './pages/VideoDetailPage'
import CompetitorsPage from './pages/CompetitorsPage'
import AISettingsPage from './pages/AISettingsPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ideas" element={<IdeasPage />} />
            <Route path="/projects/:id" element={<VideoDetailPage />} />
            <Route path="/competitors" element={<CompetitorsPage />} />
            <Route path="/ai-settings" element={<AISettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
