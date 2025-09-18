import { useState } from 'react'
import { useSubscription } from '../../contexts/SubscriptionContext'
import { Download, FileText, File, Code, Crown, Loader2, Check } from 'lucide-react'

interface ExportOptionsProps {
  resumeData: any
  onUpgradeClick: () => void
}

interface ExportFormat {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  isPro: boolean
  fileExtension: string
}

const exportFormats: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF',
    icon: <FileText className="w-5 h-5" />,
    description: 'Most common format, perfect for applications',
    isPro: false,
    fileExtension: 'pdf'
  },
  {
    id: 'docx',
    name: 'Word Document',
    icon: <File className="w-5 h-5" />,
    description: 'Editable format for further customization',
    isPro: true,
    fileExtension: 'docx'
  },
  {
    id: 'markdown',
    name: 'Markdown',
    icon: <Code className="w-5 h-5" />,
    description: 'Plain text format for developers',
    isPro: true,
    fileExtension: 'md'
  }
]

export default function ExportOptions({ resumeData, onUpgradeClick }: ExportOptionsProps) {
  const { currentPlan } = useSubscription()
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)
  const isPro = currentPlan?.id !== 'free'

  const handleExport = async (format: ExportFormat) => {
    if (format.isPro && !isPro) {
      onUpgradeClick()
      return
    }

    setIsExporting(format.id)
    setExportSuccess(null)

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock export functionality - replace with actual export service
      const exportedContent = await generateExportContent(format.id, resumeData)
      
      // Create and download file
      const blob = new Blob([exportedContent], { 
        type: getContentType(format.id) 
      })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `resume.${format.fileExtension}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setExportSuccess(format.id)
      setTimeout(() => setExportSuccess(null), 3000)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(null)
    }
  }

  const generateExportContent = async (format: string, data: any): Promise<string> => {
    switch (format) {
      case 'pdf':
        // Mock PDF content - replace with actual PDF generation
        return 'PDF content would be generated here'
      
      case 'docx':
        // Mock DOCX content - replace with actual DOCX generation
        return 'DOCX content would be generated here'
      
      case 'markdown':
        return generateMarkdownContent(data)
      
      default:
        return 'Unknown format'
    }
  }

  const generateMarkdownContent = (data: any): string => {
    const { personal, experience, education, skills, projects } = data

    let markdown = `# ${personal?.firstName} ${personal?.lastName}\n\n`
    
    if (personal?.email || personal?.phone || personal?.location) {
      markdown += `**Contact Information**\n`
      if (personal.email) markdown += `- Email: ${personal.email}\n`
      if (personal.phone) markdown += `- Phone: ${personal.phone}\n`
      if (personal.location) markdown += `- Location: ${personal.location}\n`
      if (personal.website) markdown += `- Website: ${personal.website}\n`
      markdown += `\n`
    }

    if (personal?.summary) {
      markdown += `## Professional Summary\n\n${personal.summary}\n\n`
    }

    if (experience?.length > 0) {
      markdown += `## Work Experience\n\n`
      experience.forEach((exp: any) => {
        markdown += `### ${exp.position} at ${exp.company}\n`
        markdown += `*${exp.startDate} - ${exp.endDate}*\n\n`
        if (exp.description) {
          markdown += `${exp.description}\n\n`
        }
      })
    }

    if (education?.length > 0) {
      markdown += `## Education\n\n`
      education.forEach((edu: any) => {
        markdown += `### ${edu.degree}\n`
        markdown += `**${edu.institution}** - ${edu.endDate}\n`
        if (edu.field) markdown += `Field of Study: ${edu.field}\n`
        markdown += `\n`
      })
    }

    if (skills?.length > 0) {
      markdown += `## Skills\n\n`
      const skillsByCategory = skills.reduce((acc: any, skill: any) => {
        if (!acc[skill.category]) acc[skill.category] = []
        acc[skill.category].push(skill.name)
        return acc
      }, {})

      Object.entries(skillsByCategory).forEach(([category, skillList]: [string, any]) => {
        markdown += `**${category}:** ${skillList.join(', ')}\n\n`
      })
    }

    if (projects?.length > 0) {
      markdown += `## Projects\n\n`
      projects.forEach((project: any) => {
        markdown += `### ${project.name}\n`
        if (project.description) markdown += `${project.description}\n`
        if (project.technologies?.length > 0) {
          markdown += `**Technologies:** ${project.technologies.join(', ')}\n`
        }
        if (project.url) markdown += `**URL:** ${project.url}\n`
        markdown += `\n`
      })
    }

    return markdown
  }

  const getContentType = (format: string): string => {
    switch (format) {
      case 'pdf':
        return 'application/pdf'
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      case 'markdown':
        return 'text/markdown'
      default:
        return 'text/plain'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Download className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Export Resume</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {exportFormats.map((format) => (
          <div
            key={format.id}
            className={`glass-strong rounded-xl p-4 transition-all ${
              format.isPro && !isPro ? 'opacity-75' : 'hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  format.isPro && !isPro ? 'bg-gray-700' : 'bg-blue-500/20'
                }`}>
                  {format.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-white">{format.name}</h4>
                    {format.isPro && (
                      <Crown className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{format.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleExport(format)}
                disabled={isExporting === format.id}
                className={`btn ${
                  format.isPro && !isPro 
                    ? 'btn-glass opacity-50' 
                    : exportSuccess === format.id
                    ? 'btn-success'
                    : 'btn-primary'
                } btn-sm flex items-center space-x-2`}
              >
                {isExporting === format.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : exportSuccess === format.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      {format.isPro && !isPro ? 'Upgrade' : 'Download'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!isPro && (
        <div className="glass-strong rounded-xl p-4 border border-purple-400/30">
          <div className="flex items-center space-x-3 mb-3">
            <Crown className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Free Plan Limitations</h4>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Free users can only export to PDF with a small watermark. Upgrade to Pro for:
          </p>
          <ul className="text-sm text-gray-300 space-y-1 mb-4">
            <li>• All export formats (PDF, DOCX, Markdown)</li>
            <li>• No watermarks</li>
            <li>• Unlimited downloads</li>
            <li>• Priority processing</li>
          </ul>
          <button
            onClick={onUpgradeClick}
            className="btn btn-primary btn-sm w-full flex items-center justify-center space-x-2"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade to Pro</span>
          </button>
        </div>
      )}
    </div>
  )
}
