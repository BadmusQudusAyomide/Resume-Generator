import { useAuth } from '../contexts/AuthContext'
import { useResume } from '../contexts/ResumeContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FileText, User, Briefcase, GraduationCap, Code, FolderOpen, Palette, Download, TrendingUp } from 'lucide-react'
import PersonalInfo from './editor/PersonalInfo'
import ExperienceSection from './editor/ExperienceSection'
import EducationSection from './editor/EducationSection'
import SkillsSection from './editor/SkillsSection'
import ProjectsSection from './editor/ProjectsSection'
import StyleControls from './editor/StyleControls'
import TemplateSelector from './editor/TemplateSelector'
import ExportOptions from './editor/ExportOptions'
import AIFeedbackPanel from './editor/AIFeedbackPanel'
import Preview from './Preview'

export default function Editor() {
  const { user } = useAuth()
  const { currentResume, loading, createResumeWithAIData } = useResume()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeRightPanel, setActiveRightPanel] = useState<'preview' | 'templates' | 'export' | 'feedback'>('preview')

  // Check if we have AI-generated data to create a resume with
  useEffect(() => {
    const aiData = location.state?.resumeData
    const templateId = location.state?.templateId
    
    if (aiData && templateId && !currentResume) {
      createResumeWithAIData(aiData, templateId)
        .then((resumeId) => {
          // Clear the state to prevent re-creation
          navigate(`/editor/${resumeId}`, { replace: true })
        })
        .catch((error) => {
          console.error('Failed to create resume with AI data:', error)
        })
    }
  }, [location.state, currentResume, createResumeWithAIData, navigate])

  const handleTemplateSelect = (templateId: string) => {
    if (currentResume) {
      // Template selection logic would go here
      console.log('Template selected:', templateId)
    }
  }

  const handleUpgradeClick = () => {
    navigate('/pricing')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass-card text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="glass-card max-w-md mx-auto">
          <FileText className="w-16 h-16 text-primary-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">
            Welcome to Resume Builder
          </h2>
          <p className="text-white/80 mb-8">
            Sign in to create and manage your professional resume
          </p>
        </div>
      </div>
    )
  }

  if (!currentResume) {
    return (
      <div className="text-center py-12">
        <div className="glass-card max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-6 glow">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Create Your Resume
          </h2>
          <p className="text-white/80 mb-8">
            Get started by creating a new resume
          </p>
        </div>
      </div>
    )
  }

  const sections = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: <User className="w-5 h-5" />,
      component: <PersonalInfo />
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: <Briefcase className="w-5 h-5" />,
      component: <ExperienceSection />
    },
    {
      id: 'education',
      title: 'Education',
      icon: <GraduationCap className="w-5 h-5" />,
      component: <EducationSection />
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: <Code className="w-5 h-5" />,
      component: <SkillsSection />
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: <FolderOpen className="w-5 h-5" />,
      component: <ProjectsSection />
    },
    {
      id: 'style',
      title: 'Style & Design',
      icon: <Palette className="w-5 h-5" />,
      component: <StyleControls />
    }
  ]

  const rightPanelTabs = [
    { id: 'preview', label: 'Preview', icon: <FileText className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <Palette className="w-4 h-4" /> },
    { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
    { id: 'feedback', label: 'AI Feedback', icon: <TrendingUp className="w-4 h-4" /> }
  ]

  const renderRightPanelContent = () => {
    switch (activeRightPanel) {
      case 'templates':
        return (
          <TemplateSelector
            currentTemplate={currentResume?.templateId || 'modern'}
            onTemplateSelect={handleTemplateSelect}
            onUpgradeClick={handleUpgradeClick}
          />
        )
      case 'export':
        return (
          <ExportOptions
            resumeData={currentResume?.data}
            onUpgradeClick={handleUpgradeClick}
          />
        )
      case 'feedback':
        return (
          <AIFeedbackPanel
            resumeData={currentResume?.data}
          />
        )
      default:
        return (
          <div className="preview-container bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <Preview />
          </div>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Editor Panel */}
      <div className="xl:col-span-2 space-y-6">
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            className="glass-card animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white">
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold text-white">
                {section.title}
              </h2>
            </div>
            {section.component}
          </div>
        ))}
      </div>

      {/* Right Panel with Tabs */}
      <div className="xl:col-span-1">
        <div className="sticky top-32">
          <div className="glass-card">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-800/50 rounded-xl p-1">
              {rightPanelTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightPanel(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeRightPanel === tab.id
                      ? 'bg-white text-gray-900'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {renderRightPanelContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
