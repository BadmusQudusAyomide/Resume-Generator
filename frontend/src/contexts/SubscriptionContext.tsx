import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { SubscriptionPlan, UserSubscription } from '../types/subscription'

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan | null
  subscription: UserSubscription | null
  plans: SubscriptionPlan[]
  loading: boolean
  upgradeToPlan: (planId: string) => Promise<void>
  cancelSubscription: () => Promise<void>
  hasAccess: (feature: string) => boolean
  canAccessTemplate: (tier: 'free' | 'premium') => boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

// Default subscription plans
const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'monthly',
    features: [
      '3 resume templates',
      '1 active resume',
      'Basic customization',
      'PDF download',
      'Resume watermark'
    ],
    templateAccess: 'free',
    maxResumes: 1,
    watermark: true,
    priority: 1
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    price: 19,
    interval: 'monthly',
    features: [
      '50+ premium templates',
      'Unlimited resumes',
      'Advanced customization',
      'Multiple formats (PDF, DOCX)',
      'No watermark',
      'Priority support',
      'AI-powered suggestions'
    ],
    templateAccess: 'all',
    maxResumes: -1, // unlimited
    watermark: false,
    priority: 2,
    popular: true
  },
  {
    id: 'pro-yearly',
    name: 'Pro',
    price: 190,
    interval: 'yearly',
    features: [
      '50+ premium templates',
      'Unlimited resumes',
      'Advanced customization',
      'Multiple formats (PDF, DOCX)',
      'No watermark',
      'Priority support',
      'AI-powered suggestions',
      '2 months free'
    ],
    templateAccess: 'all',
    maxResumes: -1,
    watermark: false,
    priority: 3,
    discount: 17 // 17% discount
  },
  {
    id: 'enterprise-monthly',
    name: 'Enterprise',
    price: 49,
    interval: 'monthly',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Brand customization',
      'Analytics dashboard',
      'API access',
      'Dedicated support',
      'Custom templates'
    ],
    templateAccess: 'all',
    maxResumes: -1,
    watermark: false,
    priority: 4
  }
]

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [plans] = useState<SubscriptionPlan[]>(defaultPlans)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // Simulate loading user subscription
      setTimeout(() => {
        // Default to free plan for new users
        setCurrentPlan(plans.find(p => p.id === 'free') || null)
        setSubscription({
          planId: 'free',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          cancelAtPeriodEnd: false
        })
        setLoading(false)
      }, 1000)
    } else {
      setCurrentPlan(null)
      setSubscription(null)
      setLoading(false)
    }
  }, [user, plans])

  const upgradeToPlan = async (planId: string): Promise<void> => {
    const plan = plans.find(p => p.id === planId)
    if (!plan) throw new Error('Plan not found')

    // Simulate payment processing
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    setCurrentPlan(plan)
    setSubscription({
      planId: plan.id,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(
        Date.now() + (plan.interval === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
      ),
      cancelAtPeriodEnd: false
    })
    setLoading(false)
  }

  const cancelSubscription = async (): Promise<void> => {
    if (!subscription) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubscription({
      ...subscription,
      cancelAtPeriodEnd: true
    })
    setLoading(false)
  }

  const hasAccess = (feature: string): boolean => {
    if (!currentPlan) return false
    return currentPlan.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
  }

  const canAccessTemplate = (tier: 'free' | 'premium'): boolean => {
    if (!currentPlan) return false
    if (tier === 'free') return true
    return currentPlan.templateAccess === 'all' || currentPlan.templateAccess === 'premium'
  }

  const value = {
    currentPlan,
    subscription,
    plans,
    loading,
    upgradeToPlan,
    cancelSubscription,
    hasAccess,
    canAccessTemplate
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
