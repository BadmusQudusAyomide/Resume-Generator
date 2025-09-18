import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  Download, 
  Eye, 
  Crown,
  Star,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import AuthModal from './auth/AuthModal'
import StartMethodModal from './StartMethodModal'

export default function Dashboard() {
  const { user } = useAuth()
  const { currentPlan } = useSubscription()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  const [showStartMethodModal, setShowStartMethodModal] = useState(false)
  const [userResumes] = useState<any[]>([])
  const navigate = useNavigate()

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleCreateResume = () => {
    if (!user) {
      openAuthModal('signup')
      return
    }
    setShowStartMethodModal(true)
  }

  const handleEditResume = (resumeId: string) => {
    navigate(`/editor/${resumeId}`)
  }

  const handlePreviewResume = (resumeId: string) => {
    navigate(`/preview/${resumeId}`)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  // Mock user stats
  const userStats = {
    totalResumes: userResumes.length,
    totalDownloads: 0,
    totalViews: 0,
    templatesUsed: new Set(userResumes.map(r => r.templateId)).size
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass max-w-lg w-full rounded-2xl p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white/80" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to ResumeBuilder Pro
            </h2>
            <p className="text-gray-400 text-lg">
              Create professional resumes with our AI-powered builder and premium templates
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => openAuthModal('signup')}
              className="btn btn-primary btn-lg w-full flex items-center justify-center space-x-3 group"
            >
              <span>Start Building for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="btn btn-glass w-full"
            >
              Sign In to Your Account
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-400">
            <div>
              <div className="font-semibold text-white">50+</div>
              <div>Templates</div>
            </div>
            <div>
              <div className="font-semibold text-white">500K+</div>
              <div>Users</div>
            </div>
            <div>
              <div className="font-semibold text-white">4.9★</div>
              <div>Rating</div>
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Plan Status */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Welcome back, {user.displayName?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-xl text-gray-400">
                Ready to create your next career milestone?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
              {/* Plan Badge */}
              <div className={`glass-strong px-6 py-3 rounded-2xl flex items-center space-x-3 ${
                currentPlan?.id === 'free' ? 'border-yellow-400/30' : 'border-purple-400/30'
              }`}>
                {currentPlan?.id === 'free' ? (
                  <Star className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Crown className="w-5 h-5 text-purple-400" />
                )}
                <div>
                  <div className="text-white font-semibold">{currentPlan?.name} Plan</div>
                  <div className="text-xs text-gray-400">
                    {currentPlan?.id === 'free' ? 'Limited features' : 'Full access'}
                  </div>
                </div>
                {currentPlan?.id === 'free' && (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="btn btn-primary btn-sm ml-2"
                  >
                    Upgrade
                  </button>
                )}
              </div>

              <button
                onClick={handleCreateResume}
                className="btn btn-primary btn-lg flex items-center space-x-3 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>+ Create New Resume</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="glass text-center rounded-2xl p-6">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-white/80" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{userStats.totalResumes}</div>
            <div className="text-gray-400 text-sm">Active Resumes</div>
          </div>

          <div className="glass text-center rounded-2xl p-6">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-white/80" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{userStats.totalDownloads}</div>
            <div className="text-gray-400 text-sm">Downloads</div>
          </div>

          <div className="glass text-center rounded-2xl p-6">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-white/80" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{userStats.totalViews}</div>
            <div className="text-gray-400 text-sm">Profile Views</div>
          </div>

          <div className="glass text-center rounded-2xl p-6">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white/80" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{userStats.templatesUsed}</div>
            <div className="text-gray-400 text-sm">Templates Used</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create Resume */}
            <div 
              className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
              onClick={handleCreateResume}
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                  <Plus className="w-7 h-7 text-white/80" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Create New Resume</h3>
                  <p className="text-gray-400 text-sm">Choose AI Interview or Manual Form</p>
                </div>
              </div>
            </div>

            {/* Browse Templates */}
            <div 
              className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
              onClick={() => navigate('/templates')}
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white/80" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Browse Templates</h3>
                  <p className="text-gray-400 text-sm">Explore our template gallery</p>
                </div>
              </div>
            </div>

            {/* Upgrade Plan */}
            {currentPlan?.id === 'free' && (
              <div 
                className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => navigate('/pricing')}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                    <Crown className="w-7 h-7 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Upgrade to Pro</h3>
                    <p className="text-gray-400 text-sm">Unlock all premium features</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Resumes */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Your Resumes</h2>
            {userResumes.length > 0 && (
              <button className="btn btn-glass">
                View All
              </button>
            )}
          </div>

          {userResumes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-white/70" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">No resumes yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Start a conversation with our AI to create your first professional, ATS-optimized resume.
              </p>
              <button
                onClick={handleCreateResume}
                className="btn btn-primary btn-lg flex items-center space-x-3 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Resume</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userResumes.map((resume) => (
                <div
                  key={resume.id}
                  className="glass rounded-2xl p-6 hover:bg-white/7 transition-colors cursor-pointer"
                  onClick={() => handleEditResume(resume.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white/80" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{resume.title}</h3>
                        <p className="text-sm text-gray-400">
                          Updated {formatDate(resume.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePreviewResume(resume.id)
                        }}
                        className="btn btn-glass btn-icon"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade CTA for Free Users */}
        {currentPlan?.id === 'free' && (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Crown className="w-12 h-12 text-white/80" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Go Premium?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8">
                Unlock 50+ premium templates, remove watermarks, and get unlimited resumes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/pricing')}
                  className="btn btn-primary btn-lg flex items-center space-x-3"
                >
                  <Crown className="w-5 h-5" />
                  <span>View Pricing Plans</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/templates')}
                  className="btn btn-glass btn-lg"
                >
                  Browse Templates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Start Method Modal */}
      <StartMethodModal
        isOpen={showStartMethodModal}
        onClose={() => setShowStartMethodModal(false)}
      />
    </div>
  )
}
