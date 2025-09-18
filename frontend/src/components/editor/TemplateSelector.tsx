import { useState } from 'react'
import { useSubscription } from '../../contexts/SubscriptionContext'
import { Crown, Check, Lock, Sparkles } from 'lucide-react'

interface Template {
  id: string
  name: string
  category: 'free' | 'pro'
  preview: string
  description: string
  features: string[]
}

interface TemplateSelectorProps {
  currentTemplate: string
  onTemplateSelect: (templateId: string) => void
  onUpgradeClick: () => void
}

const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    category: 'free',
    preview: '/templates/classic-preview.png',
    description: 'Clean and professional design perfect for any industry',
    features: ['ATS-friendly', 'Single column', 'Traditional layout']
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'free',
    preview: '/templates/minimalist-preview.png',
    description: 'Simple and elegant with focus on content',
    features: ['Clean design', 'Plenty of whitespace', 'Easy to read']
  },
  {
    id: 'modern',
    name: 'Modern',
    category: 'pro',
    preview: '/templates/modern-preview.png',
    description: 'Contemporary design with subtle colors and modern typography',
    features: ['Color accents', 'Modern fonts', 'Two-column layout', 'Icons']
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'pro',
    preview: '/templates/creative-preview.png',
    description: 'Bold and creative design for design and marketing roles',
    features: ['Creative layout', 'Color gradients', 'Unique sections', 'Visual elements']
  },
  {
    id: 'elegant',
    name: 'Elegant',
    category: 'pro',
    preview: '/templates/elegant-preview.png',
    description: 'Sophisticated design with premium typography',
    features: ['Premium fonts', 'Elegant spacing', 'Professional colors', 'Refined layout']
  },
  {
    id: 'compact',
    name: 'Compact ATS',
    category: 'pro',
    preview: '/templates/compact-preview.png',
    description: 'Maximizes content while maintaining ATS compatibility',
    features: ['Space efficient', 'ATS optimized', 'Dense layout', 'More content']
  }
]

export default function TemplateSelector({ currentTemplate, onTemplateSelect, onUpgradeClick }: TemplateSelectorProps) {
  const { currentPlan } = useSubscription()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const isPro = currentPlan?.id !== 'free'

  const handleTemplateClick = (template: Template) => {
    if (template.category === 'pro' && !isPro) {
      setShowUpgradeModal(true)
      return
    }
    onTemplateSelect(template.id)
  }

  const freeTemplates = templates.filter(t => t.category === 'free')
  const proTemplates = templates.filter(t => t.category === 'pro')

  return (
    <div className="space-y-6">
      {/* Free Templates */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Check className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Free Templates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {freeTemplates.map((template) => (
            <div
              key={template.id}
              className={`glass-strong rounded-xl p-4 cursor-pointer transition-all hover:scale-105 border-2 ${
                currentTemplate === template.id
                  ? 'border-blue-400/50 bg-blue-400/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => handleTemplateClick(template)}
            >
              <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Preview</div>
              </div>
              <h4 className="font-semibold text-white mb-1">{template.name}</h4>
              <p className="text-sm text-gray-400 mb-2">{template.description}</p>
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Templates */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Crown className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Pro Templates</h3>
          {!isPro && (
            <span className="text-xs bg-purple-400/10 text-purple-400 px-2 py-1 rounded">
              Upgrade Required
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {proTemplates.map((template) => (
            <div
              key={template.id}
              className={`glass-strong rounded-xl p-4 cursor-pointer transition-all hover:scale-105 border-2 relative ${
                currentTemplate === template.id && isPro
                  ? 'border-purple-400/50 bg-purple-400/10'
                  : 'border-white/10 hover:border-white/20'
              } ${!isPro ? 'opacity-75' : ''}`}
              onClick={() => handleTemplateClick(template)}
            >
              {!isPro && (
                <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Preview</div>
              </div>
              <h4 className="font-semibold text-white mb-1">{template.name}</h4>
              <p className="text-sm text-gray-400 mb-2">{template.description}</p>
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-purple-400/10 text-purple-400 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h3>
              <p className="text-gray-300 mb-6">
                Unlock all premium templates and advanced features to make your resume stand out.
              </p>

              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Access to all premium templates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Remove watermarks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Unlimited AI rewrites</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Priority support</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="btn btn-glass flex-1"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false)
                    onUpgradeClick()
                  }}
                  className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
