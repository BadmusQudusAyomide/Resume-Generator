import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../lib/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

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
}

interface ResumeContextType {
  currentResume: Resume | null
  loading: boolean
  saveResume: (resume: Partial<Resume>) => Promise<void>
  loadResume: (id: string) => Promise<void>
  createResume: () => Promise<string>
  createResumeWithAIData: (aiData: any, templateId: string) => Promise<string>
  updateResumeData: (data: Partial<ResumeData>) => void
  updateResumeStyles: (styles: Partial<ResumeStyles>) => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

const defaultResumeData: ResumeData = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
}

const defaultStyles: ResumeStyles = {
  font: 'inter',
  primaryColor: '#3b82f6',
  secondaryColor: '#6b7280',
  spacing: 'normal',
}

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [currentResume, setCurrentResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(false)

  const createResume = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated')
    
    const resumeId = crypto.randomUUID()
    const slug = crypto.randomUUID().slice(0, 8)
    
    const newResume: Resume = {
      id: resumeId,
      title: 'My Resume',
      slug,
      templateId: 'modern',
      data: defaultResumeData,
      styles: defaultStyles,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, 'resumes', resumeId), {
      ...newResume,
      ownerId: user.uid,
    })

    setCurrentResume(newResume)
    return resumeId
  }

  const createResumeWithAIData = async (aiData: any, templateId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated')
    
    console.log('Creating resume with AI data:', aiData)
    
    const resumeId = crypto.randomUUID()
    const slug = crypto.randomUUID().slice(0, 8)
    
    // Transform AI data to match our ResumeData structure
    const transformedData: ResumeData = {
      personal: {
        firstName: aiData.personalInfo?.fullName?.split(' ')[0] || aiData.personal?.firstName || '',
        lastName: aiData.personalInfo?.fullName?.split(' ').slice(1).join(' ') || aiData.personal?.lastName || '',
        email: aiData.personalInfo?.email || aiData.personal?.email || '',
        phone: aiData.personalInfo?.phone || aiData.personal?.phone || '',
        location: aiData.personalInfo?.location || aiData.personal?.location || '',
        website: aiData.personalInfo?.portfolio || aiData.personalInfo?.linkedIn || aiData.personal?.website || '',
        summary: aiData.summary || aiData.personal?.summary || '',
      },
      experience: (aiData.experience || []).map((exp: any) => ({
        id: crypto.randomUUID(),
        company: exp.company || '',
        position: exp.position || '',
        location: '',
        startDate: exp.duration?.split(' - ')[0] || '',
        endDate: exp.duration?.split(' - ')[1] || 'Present',
        current: exp.duration?.includes('Present') || false,
        description: Array.isArray(exp.description) ? exp.description.join('\n') : (exp.description || ''),
        achievements: exp.achievements || [],
      })),
      education: (aiData.education || []).map((edu: any) => ({
        id: crypto.randomUUID(),
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        location: '',
        startDate: '',
        endDate: edu.year || '',
        current: false,
        gpa: edu.gpa || '',
        achievements: [],
      })),
      skills: [
        ...(aiData.skills?.technical || []).map((skill: string) => ({
          id: crypto.randomUUID(),
          name: skill,
          level: 'intermediate' as const,
          category: 'Technical',
        })),
        ...(aiData.skills?.soft || []).map((skill: string) => ({
          id: crypto.randomUUID(),
          name: skill,
          level: 'advanced' as const,
          category: 'Soft Skills',
        })),
        ...(aiData.skills?.languages || []).map((skill: string) => ({
          id: crypto.randomUUID(),
          name: skill,
          level: 'advanced' as const,
          category: 'Languages',
        })),
      ],
      projects: (aiData.projects || []).map((project: any) => ({
        id: crypto.randomUUID(),
        name: project.name || '',
        description: project.description || '',
        technologies: project.technologies || [],
        url: project.link || '',
        startDate: '',
        endDate: '',
        current: false,
      })),
    }
    
    const newResume: Resume = {
      id: resumeId,
      title: `${transformedData.personal.firstName}'s AI Resume`,
      slug,
      templateId: templateId || 'modern',
      data: transformedData,
      styles: defaultStyles,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, 'resumes', resumeId), {
      ...newResume,
      ownerId: user.uid,
    })

    setCurrentResume(newResume)
    return resumeId
  }

  const loadResume = async (id: string) => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const resumeDoc = await getDoc(doc(db, 'resumes', id))
      if (resumeDoc.exists()) {
        const data = resumeDoc.data()
        setCurrentResume({
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Resume)
      }
    } finally {
      setLoading(false)
    }
  }

  const saveResume = async (resume: Partial<Resume>) => {
    if (!user || !currentResume) throw new Error('User not authenticated or no resume loaded')
    
    const updatedResume = {
      ...currentResume,
      ...resume,
      updatedAt: new Date(),
    }

    await updateDoc(doc(db, 'resumes', currentResume.id), {
      ...updatedResume,
      ownerId: user.uid,
    })

    setCurrentResume(updatedResume)
  }

  const updateResumeData = useCallback((data: Partial<ResumeData>) => {
    setCurrentResume(prev => {
      if (!prev) return prev
      return {
        ...prev,
        data: { ...prev.data, ...data },
        updatedAt: new Date(),
      }
    })
  }, []) // No dependencies - this function is stable

  const updateResumeStyles = (styles: Partial<ResumeStyles>) => {
    if (!currentResume) return
    
    setCurrentResume({
      ...currentResume,
      styles: { ...currentResume.styles, ...styles },
      updatedAt: new Date(),
    })
  }

  // Auto-save when resume data changes
  useEffect(() => {
    if (currentResume && user) {
      const timeoutId = setTimeout(() => {
        saveResume(currentResume)
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [currentResume])

  const value = {
    currentResume,
    loading,
    saveResume,
    loadResume,
    createResume,
    createResumeWithAIData,
    updateResumeData,
    updateResumeStyles,
  }

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}
