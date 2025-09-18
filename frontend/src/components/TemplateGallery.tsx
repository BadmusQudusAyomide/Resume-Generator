import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSubscription } from '../contexts/SubscriptionContext'
import { templates, templateCategories } from '../data/templates'
import { Template } from '../types/subscription'
import { 
  Grid, 
  Briefcase, 
  Zap, 
  Palette, 
  Code, 
  Crown, 
  Heart, 
  DollarSign,
  Lock,
  Star,
  Sparkles,
  Eye,
  ArrowRight,
  Filter,
  FileText
} from 'lucide-react'

const iconMap = {
  Grid,
  Briefcase,
  Zap,
  Palette,
  Code,
  Crown,
  Heart,
  DollarSign
}

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void
}

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { currentPlan, canAccessTemplate } = useSubscription()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if we have AI-generated resume data
  const aiResumeData = location.state?.resumeData

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const handleTemplateSelect = (template: Template) => {
    if (template.tier === 'premium' && !canAccessTemplate('premium')) {
      setShowUpgradeModal(true)
      return
    }
    
    // If we have AI-generated data, navigate to editor with both template and data
    if (aiResumeData) {
      navigate('/editor', { 
        state: { 
          templateId: template.id, 
          resumeData: aiResumeData 
        } 
      })
    } else {
      onSelectTemplate(template.id)
    }
  }

  const handleUpgrade = () => {
    navigate('/pricing')
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {aiResumeData ? (
            <>
              <div className="inline-flex items-center space-x-3 glass-strong px-6 py-3 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">AI Resume Data Ready!</span>
                <Sparkles className="w-5 h-5 text-green-400" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Choose Your Perfect
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Resume Template
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Great! I've optimized your information for ATS compatibility. Now choose a template and watch your resume come to life with your personalized, professional content.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-white mb-4">
                Choose Your Perfect
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Resume Template
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Professional templates designed by experts to help you land your dream job.
                Choose from our collection of ATS-friendly designs.
              </p>
            </>
          )}
        </div>

        {/* Current Plan Badge */}
        <div className="flex justify-center mb-8">
          <div className={`glass-strong px-6 py-3 rounded-full flex items-center space-x-3 ${
            currentPlan?.id === 'free' ? 'border-yellow-400/50' : 'border-green-400/50'
          }`}>
            {currentPlan?.id === 'free' ? (
              <Star className="w-5 h-5 text-yellow-400" />
            ) : (
              <Crown className="w-5 h-5 text-purple-400" />
            )}
            <span className="text-white font-medium">
              Current Plan: {currentPlan?.name}
            </span>
            {currentPlan?.id === 'free' && (
              <button
                onClick={() => navigate('/pricing')}
                className="btn btn-primary btn-sm ml-2"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-gray-400 font-medium">Filter by Category</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {templateCategories.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap]
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`btn flex items-center space-x-2 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'btn-primary'
                      : 'btn-glass hover:scale-105'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                  <span className="text-xs opacity-75">
                    ({category.templates.length})
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {filteredTemplates.map((template) => {
            const hasAccess = canAccessTemplate(template.tier)
            
            return (
              <div
                key={template.id}
                className={`group relative glass-card overflow-hidden transition-all duration-500 hover:scale-105 ${
                  !hasAccess ? 'opacity-75' : ''
                }`}
              >
                {/* Template Preview */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-4">
                  {/* Placeholder for template thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                      <div className="text-xs text-gray-500">Template Preview</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {template.tier === 'premium' && (
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    )}
                    {template.isNew && (
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </div>
                    )}
                    {template.isFeatured && (
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>

                  {/* Lock Overlay for Premium Templates */}
                  {template.tier === 'premium' && !hasAccess && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                        <div className="text-white text-sm font-medium">Premium Template</div>
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="btn btn-primary btn-sm mt-2"
                        >
                          Upgrade to Access
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button className="btn btn-glass btn-icon">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        className="btn btn-primary btn-icon"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {template.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{(template.popularity / 10).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full btn ${
                      hasAccess ? 'btn-primary' : 'btn-glass'
                    } flex items-center justify-center space-x-2`}
                  >
                    {hasAccess ? (
                      <>
                        <span>Use Template</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Upgrade Required</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Upgrade CTA */}
        {currentPlan?.id === 'free' && (
          <div className="glass-strong rounded-3xl p-12 text-center mb-16">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
                <h2 className="text-3xl font-bold text-white">
                  Unlock All Premium Templates
                </h2>
                <Sparkles className="w-8 h-8 text-purple-400 ml-3" />
              </div>
              
              <p className="text-xl text-gray-300 mb-8">
                Get access to 50+ professional templates, unlimited resumes, and premium features.
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
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full text-center">
            <div className="mb-6">
              <Crown className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Premium Template</h3>
              <p className="text-gray-300">
                This template is only available with a Premium subscription.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleUpgrade}
                className="btn btn-primary w-full"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="btn btn-ghost w-full"
              >
                Continue with Free Templates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
