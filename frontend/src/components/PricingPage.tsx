import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '../contexts/SubscriptionContext'
import { 
  Check, 
  Crown, 
  Zap, 
  Star, 
  ArrowRight, 
  Sparkles,
  Shield,
  Users,
  Briefcase
} from 'lucide-react'

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const { plans, currentPlan, upgradeToPlan } = useSubscription()
  const navigate = useNavigate()

  const filteredPlans = plans.filter(plan => 
    plan.interval === billingInterval || plan.id === 'free'
  )

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === currentPlan?.id) return

    setIsProcessing(planId)
    try {
      await upgradeToPlan(planId)
      // Simulate payment success
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setIsProcessing(null)
    }
  }

  const getPlanIcon = (planId: string) => {
    if (planId === 'free') return <Star className="w-6 h-6" />
    if (planId.includes('enterprise')) return <Briefcase className="w-6 h-6" />
    return <Crown className="w-6 h-6" />
  }

  const getPlanColor = (planId: string) => {
    if (planId === 'free') return 'from-gray-500 to-gray-600'
    if (planId.includes('enterprise')) return 'from-purple-600 to-indigo-600'
    return 'from-blue-500 to-purple-600'
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-strong px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Simple, Transparent Pricing</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Start free and upgrade as you grow. All plans include our core features 
            with premium options for advanced needs.
          </p>

          {/* Billing Toggle */}
          <div className="glass-strong rounded-2xl p-2 inline-flex items-center space-x-1 mb-12">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                billingInterval === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative ${
                billingInterval === 'yearly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPlans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id
            const isPopular = plan.popular
            const isProcessingThis = isProcessing === plan.id

            return (
              <div
                key={plan.id}
                className={`relative glass-card overflow-hidden transition-all duration-500 hover:scale-105 ${
                  isPopular ? 'ring-2 ring-purple-500/50 shadow-2xl' : ''
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${getPlanColor(plan.id)} rounded-2xl flex items-center justify-center text-white`}>
                      {getPlanIcon(plan.id)}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-4xl font-bold text-white">
                        ${plan.price}
                      </span>
                      {plan.id !== 'free' && (
                        <span className="text-gray-400 ml-2">
                          /{plan.interval}
                        </span>
                      )}
                    </div>

                    {plan.discount && (
                      <div className="text-green-400 text-sm font-medium">
                        Save {plan.discount}% with yearly billing
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrentPlan || isProcessingThis}
                    className={`w-full btn transition-all duration-300 ${
                      isCurrentPlan
                        ? 'btn-glass cursor-not-allowed'
                        : plan.id === 'free'
                        ? 'btn-ghost'
                        : 'btn-primary hover:scale-105'
                    }`}
                  >
                    {isProcessingThis ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="spinner w-5 h-5" />
                        <span>Processing...</span>
                      </div>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : plan.id === 'free' ? (
                      'Get Started Free'
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Upgrade Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="glass-strong rounded-3xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Premium?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">50+ Premium Templates</h3>
              <p className="text-gray-400">
                Access our entire collection of professionally designed templates 
                for every industry and role.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">No Watermarks</h3>
              <p className="text-gray-400">
                Professional, clean resumes without any branding or watermarks. 
                Perfect for job applications.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Priority Support</h3>
              <p className="text-gray-400">
                Get help when you need it with our dedicated support team and 
                priority response times.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass-card text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have 
                access to premium features until the end of your billing period.
              </p>
            </div>

            <div className="glass-card text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-400">
                We offer a 30-day money-back guarantee. If you're not satisfied with 
                our service, contact us for a full refund.
              </p>
            </div>

            <div className="glass-card text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept all major credit cards, PayPal, and other secure payment methods 
                through our payment processor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
