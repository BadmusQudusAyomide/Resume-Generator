import { useState } from 'react'
import { TrendingUp, Target, Wand2, Loader2 } from 'lucide-react'

interface AIToolsProps {
  section: string
  content: string
  onContentUpdate: (newContent: string) => void
  className?: string
}

export default function AITools({ section, content, onContentUpdate, className = '' }: AIToolsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const handleAIAction = async (action: 'rewrite' | 'metrics' | 'tailor') => {
    if (!content.trim()) return
    
    setIsProcessing(true)
    setActiveAction(action)
    
    try {
      // Simulate AI processing (replace with actual AI service call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let enhancedContent = content
      
      switch (action) {
        case 'rewrite':
          enhancedContent = await rewriteContent(content, section)
          break
        case 'metrics':
          enhancedContent = await addMetrics(content)
          break
        case 'tailor':
          enhancedContent = await tailorContent(content, section)
          break
      }
      
      onContentUpdate(enhancedContent)
    } catch (error) {
      console.error('AI action failed:', error)
    } finally {
      setIsProcessing(false)
      setActiveAction(null)
    }
  }

  const rewriteContent = async (text: string, sectionType: string): Promise<string> => {
    // Mock AI rewrite - replace with actual AI service
    const improvements = {
      experience: [
        'Led cross-functional team of 8 developers',
        'Implemented scalable microservices architecture',
        'Optimized database queries resulting in 40% performance improvement',
        'Mentored junior developers and conducted code reviews'
      ],
      education: [
        'Graduated Magna Cum Laude with 3.8 GPA',
        'Relevant coursework: Data Structures, Algorithms, Software Engineering',
        'Active member of Computer Science Society'
      ],
      skills: [
        'Expert-level proficiency in React.js and TypeScript',
        'Advanced knowledge of cloud platforms (AWS, Azure)',
        'Strong background in agile development methodologies'
      ]
    }
    
    const sectionImprovements = improvements[sectionType as keyof typeof improvements] || []
    if (sectionImprovements.length > 0) {
      const randomImprovement = sectionImprovements[Math.floor(Math.random() * sectionImprovements.length)]
      return `${text}\n• ${randomImprovement}`
    }
    
    return `${text} (Enhanced with AI optimization)`
  }

  const addMetrics = async (text: string): Promise<string> => {
    // Mock metrics addition - replace with actual AI service
    const metrics = [
      'increased efficiency by 35%',
      'reduced processing time by 50%',
      'improved user satisfaction by 25%',
      'managed budget of $500K+',
      'served 10,000+ customers',
      'achieved 99.9% uptime'
    ]
    
    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)]
    return text.includes('%') || text.includes('$') || text.includes('+') 
      ? text 
      : `${text} and ${randomMetric}`
  }

  const tailorContent = async (text: string, sectionType: string): Promise<string> => {
    // Mock job tailoring - replace with actual AI service
    const keywords = {
      experience: ['agile', 'scalable', 'cross-functional', 'stakeholder management'],
      education: ['relevant coursework', 'academic excellence', 'research experience'],
      skills: ['proficient', 'advanced', 'expert-level', 'industry-standard']
    }
    
    const sectionKeywords = keywords[sectionType as keyof typeof keywords] || []
    if (sectionKeywords.length > 0) {
      const randomKeyword = sectionKeywords[Math.floor(Math.random() * sectionKeywords.length)]
      return `${text} (Optimized with ${randomKeyword} focus)`
    }
    
    return `${text} (ATS-optimized)`
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="text-xs text-gray-400 mr-2">AI Tools:</div>
      
      <button
        onClick={() => handleAIAction('rewrite')}
        disabled={isProcessing || !content.trim()}
        className="btn btn-ghost btn-sm flex items-center space-x-1 text-xs disabled:opacity-50"
        title="Rewrite with AI"
      >
        {isProcessing && activeAction === 'rewrite' ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Wand2 className="w-3 h-3" />
        )}
        <span>Rewrite</span>
      </button>

      <button
        onClick={() => handleAIAction('metrics')}
        disabled={isProcessing || !content.trim()}
        className="btn btn-ghost btn-sm flex items-center space-x-1 text-xs disabled:opacity-50"
        title="Add metrics and numbers"
      >
        {isProcessing && activeAction === 'metrics' ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <TrendingUp className="w-3 h-3" />
        )}
        <span>Add Metrics</span>
      </button>

      <button
        onClick={() => handleAIAction('tailor')}
        disabled={isProcessing || !content.trim()}
        className="btn btn-ghost btn-sm flex items-center space-x-1 text-xs disabled:opacity-50"
        title="Tailor to job description"
      >
        {isProcessing && activeAction === 'tailor' ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Target className="w-3 h-3" />
        )}
        <span>Tailor</span>
      </button>
    </div>
  )
}
