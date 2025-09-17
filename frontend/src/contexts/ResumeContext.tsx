import React, { createContext, useContext, useState, useEffect } from 'react'
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

  const updateResumeData = (data: Partial<ResumeData>) => {
    if (!currentResume) return
    
    setCurrentResume({
      ...currentResume,
      data: { ...currentResume.data, ...data },
      updatedAt: new Date(),
    })
  }

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
