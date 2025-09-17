export interface ResumeData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    website: string
    summary: string
    photo?: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    gpa?: string
    achievements: string[]
  }>
  skills: Array<{
    id: string
    name: string
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    category: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url?: string
    startDate: string
    endDate: string
    current: boolean
  }>
}

export interface ResumeStyles {
  font: 'inter' | 'georgia' | 'jetbrains'
  primaryColor: string
  secondaryColor: string
  spacing: 'compact' | 'normal' | 'spacious'
}

export interface Resume {
  id: string
  title: string
  slug: string
  templateId: string
  data: ResumeData
  styles: ResumeStyles
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  ownerId: string
}
