import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function LoginPage() {
  const { user, signIn, signUp } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  // Redirect if already logged in
  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (isRegister) {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.')
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background glow effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic tracking-tighter text-on-surface">
            Teller
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary ml-1 animate-pulse-glow" />
          </h1>
          <p className="text-on-surface-variant text-sm mt-2">
            Content Pipeline Management
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold text-on-surface mb-6">
            {isRegister ? 'Tạo tài khoản mới' : 'Đăng nhập'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full"
              />
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error animate-fade-in">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-3 text-sm text-success animate-fade-in">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-on-primary-container py-3 rounded-lg font-bold text-sm
                         hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                isRegister ? 'Đăng ký' : 'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
                setSuccess('')
              }}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {isRegister ? (
                <>Đã có tài khoản? <span className="text-primary font-medium">Đăng nhập</span></>
              ) : (
                <>Chưa có tài khoản? <span className="text-primary font-medium">Đăng ký</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-on-surface-variant mt-6 uppercase tracking-widest">
          © 2026 Teller • v1.0.0
        </p>
      </div>
    </div>
  )
}
