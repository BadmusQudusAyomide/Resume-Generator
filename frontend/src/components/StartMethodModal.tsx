import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Sparkles, FileText, ArrowRight, MessageCircle, Edit3 } from 'lucide-react'

interface StartMethodModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function StartMethodModal({ isOpen, onClose }: StartMethodModalProps) {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState<'ai' | 'manual' | null>(null)

  console.log('StartMethodModal - isOpen:', isOpen) // Debug log

  if (!isOpen) return null

  const handleMethodSelect = (method: 'ai' | 'manual') => {
    setSelectedMethod(method)
    
    // Navigate based on selection
    if (method === 'ai') {
      navigate('/ai-interview')
      onClose()
    } else {
      navigate('/manual-form')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Create New Resume</h2>
            <p className="text-gray-400">Choose how you'd like to get started</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Interview Option */}
            <div
              className={`glass-strong rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                selectedMethod === 'ai' 
                  ? 'border-blue-400/50 bg-blue-400/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => handleMethodSelect('ai')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">✨ AI Interview</h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  Answer 6-8 simple questions and let our AI build your resume draft automatically
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span>Conversational & Easy</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                    <span>AI-Optimized Content</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <ArrowRight className="w-4 h-4 mr-2 text-purple-400" />
                    <span>5-10 minutes</span>
                  </div>
                </div>

                <button className="btn btn-primary w-full flex items-center justify-center space-x-2">
                  <span>Start AI Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Manual Form Option */}
            <div
              className={`glass-strong rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                selectedMethod === 'manual' 
                  ? 'border-green-400/50 bg-green-400/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => handleMethodSelect('manual')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Edit3 className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">📝 Manual Form</h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  Fill out structured forms step-by-step with full control over every detail
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <Edit3 className="w-4 h-4 mr-2 text-green-400" />
                    <span>Complete Control</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <FileText className="w-4 h-4 mr-2 text-blue-400" />
                    <span>Structured Sections</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <ArrowRight className="w-4 h-4 mr-2 text-purple-400" />
                    <span>10-15 minutes</span>
                  </div>
                </div>

                <button className="btn btn-glass w-full flex items-center justify-center space-x-2 border-green-400/30 hover:bg-green-400/10">
                  <span>Start Manual Form</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-8 p-4 glass-strong rounded-xl">
            <p className="text-center text-sm text-gray-400">
              💡 <strong className="text-white">Pro Tip:</strong> Both methods lead to the same powerful resume editor where you can customize everything!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
