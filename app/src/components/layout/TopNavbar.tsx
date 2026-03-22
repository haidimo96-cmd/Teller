import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'

const navLinks = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/ideas', label: 'Ý tưởng', icon: 'lightbulb' },
  { path: '/competitors', label: 'Đối thủ', icon: 'analytics' },
  { path: '/ai-settings', label: 'AI Models', icon: 'smart_toy' },
]

export default function TopNavbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 glass-header border-b border-white/10 h-16 lg:h-20 px-4 lg:px-8">
      <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6 lg:gap-12">
          <Link to="/" className="text-xl lg:text-2xl font-black italic tracking-tighter text-on-surface">
            Teller
            <span className="inline-block w-2 h-2 rounded-full bg-primary ml-1 shadow-[0_0_10px_#eafe8e]" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-tight transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Search */}
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              type="search"
              placeholder="Tìm kiếm..."
              className="bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-full pl-10 pr-4 py-2 text-sm w-56"
            />
          </div>

          {/* New Video Button */}
          <Link
            to="/ideas"
            className="primary-gradient text-on-primary-container px-3 lg:px-5 py-2 rounded-lg font-bold text-xs lg:text-sm 
                       flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="hidden sm:inline">Tạo mới</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-medium text-on-surface truncate max-w-[120px]">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-on-surface-variant">Creator</p>
            </div>
            <button
              onClick={signOut}
              className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-primary/20 bg-surface-container-high
                         flex items-center justify-center hover:border-primary/50 transition-all"
              title="Đăng xuất"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                logout
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/10 absolute top-full left-0 w-full p-4 animate-fade-in">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                  search
                </span>
                <input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-full pl-10 pr-4 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
