import { useState } from 'react'
import { FileText, Zap, Download, ArrowRight, Users, Shield, Sparkles, ChevronDown, CheckCircle, Award, TrendingUp } from 'lucide-react'
import AuthModal from './auth/AuthModal'

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Professional Templates',
      description: 'ATS-friendly designs crafted by experts.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered',
      description: 'Smart content suggestions and optimization.'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Instant Export',
      description: 'Download in PDF, Word, or multiple formats.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared.'
    }
  ]

  const stats = [
    { label: 'Resumes Created', value: '500K+', icon: <FileText className="w-5 h-5" /> },
    { label: 'Success Rate', value: '94%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Companies', value: '10K+', icon: <Award className="w-5 h-5" /> },
    { label: 'Happy Users', value: '98%', icon: <Users className="w-5 h-5" /> }
  ]

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen relative">
      {/* Premium Orb Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large background orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '5s' }}></div>
        <div className="absolute bottom-32 left-20 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-premium-float" style={{ animationDelay: '10s' }}></div>

        {/* Floating accent orbs */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-blue-400/60 rounded-full animate-orb-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-3/4 left-1/4 w-6 h-6 bg-purple-400/60 rounded-full animate-orb-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-cyan-400/60 rounded-full animate-orb-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-pink-400/60 rounded-full animate-orb-pulse" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center z-10">
          {/* Premium badge */}
          <div className="inline-flex items-center space-x-2 glass-strong px-4 py-2 rounded-full mb-8 animate-gentle-float">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Premium Resume Builder</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Craft Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-glow">
              Perfect Resume
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your career with our sophisticated resume builder.
            Professional templates, AI-powered optimization, and instant results.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={() => openAuthModal('signup')}
              className="btn btn-primary btn-lg glow flex items-center space-x-3 group"
            >
              <span>Start Building Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="btn btn-glass btn-lg flex items-center space-x-3"
            >
              <span>Sign In</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-strong rounded-2xl p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-blue-400 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Premium?
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to create a standout resume that gets you noticed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card text-center group hover:scale-105 transition-all duration-500 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Decorative orbs */}
            <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-orb-pulse"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-orb-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to Elevate
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Your Career?
                </span>
              </h2>

              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Join thousands of professionals who've transformed their careers with our premium resume builder.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="btn btn-primary btn-lg glow flex items-center space-x-3 group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center space-x-4 text-gray-400">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  )
}
