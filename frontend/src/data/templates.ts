import { Template, TemplateCategory } from '../types/subscription'

export const templates: Template[] = [
  // Free Templates
  {
    id: 'classic-free',
    name: 'Classic Professional',
    description: 'Clean and traditional resume layout perfect for corporate roles',
    category: 'professional',
    tier: 'free',
    thumbnail: '/templates/classic-free.jpg',
    previewUrl: '/preview/classic-free',
    tags: ['professional', 'corporate', 'traditional'],
    popularity: 95
  },
  {
    id: 'modern-free',
    name: 'Modern Minimal',
    description: 'Contemporary design with clean lines and modern typography',
    category: 'modern',
    tier: 'free',
    thumbnail: '/templates/modern-free.jpg',
    previewUrl: '/preview/modern-free',
    tags: ['modern', 'minimal', 'clean'],
    popularity: 88
  },
  {
    id: 'simple-free',
    name: 'Simple & Clean',
    description: 'Straightforward layout focusing on content readability',
    category: 'simple',
    tier: 'free',
    thumbnail: '/templates/simple-free.jpg',
    previewUrl: '/preview/simple-free',
    tags: ['simple', 'readable', 'basic'],
    popularity: 82
  },

  // Premium Templates
  {
    id: 'executive-pro',
    name: 'Executive Elite',
    description: 'Sophisticated design for C-level and senior executive positions',
    category: 'executive',
    tier: 'premium',
    thumbnail: '/templates/executive-pro.jpg',
    previewUrl: '/preview/executive-pro',
    tags: ['executive', 'luxury', 'sophisticated'],
    popularity: 97,
    isFeatured: true
  },
  {
    id: 'creative-pro',
    name: 'Creative Genius',
    description: 'Bold and artistic design for creative professionals',
    category: 'creative',
    tier: 'premium',
    thumbnail: '/templates/creative-pro.jpg',
    previewUrl: '/preview/creative-pro',
    tags: ['creative', 'artistic', 'bold'],
    popularity: 91,
    isNew: true
  },
  {
    id: 'tech-pro',
    name: 'Tech Innovator',
    description: 'Modern tech-focused design with sleek elements',
    category: 'technology',
    tier: 'premium',
    thumbnail: '/templates/tech-pro.jpg',
    previewUrl: '/preview/tech-pro',
    tags: ['technology', 'modern', 'sleek'],
    popularity: 94
  },
  {
    id: 'medical-pro',
    name: 'Medical Professional',
    description: 'Clean, trustworthy design for healthcare professionals',
    category: 'healthcare',
    tier: 'premium',
    thumbnail: '/templates/medical-pro.jpg',
    previewUrl: '/preview/medical-pro',
    tags: ['medical', 'healthcare', 'professional'],
    popularity: 89
  },
  {
    id: 'finance-pro',
    name: 'Finance Expert',
    description: 'Conservative and professional design for finance sector',
    category: 'finance',
    tier: 'premium',
    thumbnail: '/templates/finance-pro.jpg',
    previewUrl: '/preview/finance-pro',
    tags: ['finance', 'conservative', 'professional'],
    popularity: 87
  },
  {
    id: 'academic-pro',
    name: 'Academic Scholar',
    description: 'Detailed layout perfect for academic and research positions',
    category: 'academic',
    tier: 'premium',
    thumbnail: '/templates/academic-pro.jpg',
    previewUrl: '/preview/academic-pro',
    tags: ['academic', 'research', 'detailed'],
    popularity: 85
  },
  {
    id: 'startup-pro',
    name: 'Startup Maverick',
    description: 'Dynamic design for startup and entrepreneurial roles',
    category: 'startup',
    tier: 'premium',
    thumbnail: '/templates/startup-pro.jpg',
    previewUrl: '/preview/startup-pro',
    tags: ['startup', 'dynamic', 'entrepreneurial'],
    popularity: 92,
    isNew: true
  },
  {
    id: 'consulting-pro',
    name: 'Consulting Pro',
    description: 'Strategic and analytical design for consulting professionals',
    category: 'consulting',
    tier: 'premium',
    thumbnail: '/templates/consulting-pro.jpg',
    previewUrl: '/preview/consulting-pro',
    tags: ['consulting', 'strategic', 'analytical'],
    popularity: 90
  },
  {
    id: 'sales-pro',
    name: 'Sales Champion',
    description: 'Results-focused design highlighting achievements',
    category: 'sales',
    tier: 'premium',
    thumbnail: '/templates/sales-pro.jpg',
    previewUrl: '/preview/sales-pro',
    tags: ['sales', 'results', 'achievements'],
    popularity: 86
  },
  {
    id: 'marketing-pro',
    name: 'Marketing Maestro',
    description: 'Creative and strategic design for marketing professionals',
    category: 'marketing',
    tier: 'premium',
    thumbnail: '/templates/marketing-pro.jpg',
    previewUrl: '/preview/marketing-pro',
    tags: ['marketing', 'creative', 'strategic'],
    popularity: 93
  }
]

export const templateCategories: TemplateCategory[] = [
  {
    id: 'all',
    name: 'All Templates',
    description: 'Browse all available resume templates',
    icon: 'Grid',
    templates: templates
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Traditional and corporate-friendly designs',
    icon: 'Briefcase',
    templates: templates.filter(t => t.category === 'professional')
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary and minimalist designs',
    icon: 'Zap',
    templates: templates.filter(t => t.category === 'modern')
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic and unique designs for creative roles',
    icon: 'Palette',
    templates: templates.filter(t => t.category === 'creative')
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Tech-focused designs for IT professionals',
    icon: 'Code',
    templates: templates.filter(t => t.category === 'technology')
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated designs for senior positions',
    icon: 'Crown',
    templates: templates.filter(t => t.category === 'executive')
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Professional designs for medical professionals',
    icon: 'Heart',
    templates: templates.filter(t => t.category === 'healthcare')
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Conservative designs for finance sector',
    icon: 'DollarSign',
    templates: templates.filter(t => t.category === 'finance')
  }
]
