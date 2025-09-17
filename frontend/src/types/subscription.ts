export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  templateAccess: 'free' | 'premium' | 'all'
  maxResumes: number
  watermark: boolean
  priority: number
  popular?: boolean
  discount?: number
}

export interface UserSubscription {
  planId: string
  status: 'active' | 'canceled' | 'expired' | 'trial'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export interface Template {
  id: string
  name: string
  description: string
  category: string
  tier: 'free' | 'premium'
  thumbnail: string
  previewUrl: string
  tags: string[]
  popularity: number
  isNew?: boolean
  isFeatured?: boolean
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
  icon: string
  templates: Template[]
}
