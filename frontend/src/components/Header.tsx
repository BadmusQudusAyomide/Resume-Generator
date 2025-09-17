import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useResume } from '../contexts/ResumeContext'
import { LogOut, User, Eye, EyeOff, Plus, FileText, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthModal from './auth/AuthModal'
import DarkModeToggle from './DarkModeToggle'

interface HeaderProps {
  onTogglePreview: () => void
  isPreviewMode?: boolean
}

export default function Header({ onTogglePreview, isPreviewMode = false }: HeaderProps) {
  const { user, logout } = useAuth()
  const { currentResume, createResume } = useResume()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleCreateResume = async () => {
    if (!user) {
      openAuthModal('signup')
      return
    }
    await createResume()
  }

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/70 backdrop-blur supports-[backdrop-filter]:bg-[#09090b]/50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-14 flex items-center justify-between">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white/80" />
            </div>
            <span className="text-sm font-semibold text-white/90 tracking-tight">ResumeBuilder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <DarkModeToggle />

            {user ? (
              <>
                {currentResume && (
                  <button
                    onClick={onTogglePreview}
                    className="btn btn-glass flex items-center gap-2 h-9 px-3"
                  >
                    {isPreviewMode ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Edit</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </>
                    )}
                  </button>
                )}
                
                {!currentResume && (
                  <button
                    onClick={handleCreateResume}
                    className="btn btn-primary flex items-center gap-2 h-9 px-3"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Resume</span>
                  </button>
                )}
                
                {/* User Menu */}
                <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-white/80" />
                  </div>
                  <span className="text-xs font-medium text-white/70 hidden lg:block">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="btn btn-glass flex items-center gap-2 h-9 px-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="btn btn-ghost h-9 px-3"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="btn btn-primary h-9 px-3"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-white/5 border border-white/10 text-white/80"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-white/10 pt-3 pb-4 animate-slide-down bg-[#09090b]/70">
            {/* Dark Mode Toggle for Mobile */}
            <div className="flex justify-center mb-3">
              <DarkModeToggle />
            </div>

            {user ? (
              <div className="space-y-2 px-3">
                <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-white/80" />
                  </div>
                  <span className="text-xs font-medium text-white/70">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                
                {currentResume && (
                  <button
                    onClick={() => {
                      onTogglePreview()
                      setShowMobileMenu(false)
                    }}
                    className="btn btn-glass w-full flex items-center justify-center gap-2 h-9"
                  >
                    {isPreviewMode ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Back to Edit</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                      </>
                    )}
                  </button>
                )}

                {!currentResume && (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="btn btn-primary w-full h-9"
                  >
                    Create Resume
                  </button>
                )}

                <button
                  onClick={logout}
                  className="btn btn-ghost w-full h-9"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="btn btn-ghost w-full h-9"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { openAuthModal('signup'); setShowMobileMenu(false) }}
                  className="btn btn-primary w-full h-9"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  )
}
