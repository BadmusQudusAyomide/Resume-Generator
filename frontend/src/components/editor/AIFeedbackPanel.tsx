import { useState, useEffect } from 'react'
import { TrendingUp, AlertCircle, CheckCircle, Target, Lightbulb, RefreshCw } from 'lucide-react'

interface AIFeedbackPanelProps {
  resumeData: any
  className?: string
}

interface FeedbackItem {
  type: 'success' | 'warning' | 'error' | 'info'
  category: string
  message: string
  suggestion?: string
  priority: 'high' | 'medium' | 'low'
}

interface ATSScore {
  overall: number
  categories: {
    keywords: number
    formatting: number
    length: number
    sections: number
    contact: number
  }
}

export default function AIFeedbackPanel({ resumeData, className = '' }: AIFeedbackPanelProps) {
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (resumeData) {
      analyzeResume()
    }
  }, [resumeData])

  const analyzeResume = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const analysis = performATSAnalysis(resumeData)
    setAtsScore(analysis.score)
    setFeedback(analysis.feedback)
    setIsAnalyzing(false)
  }

  const performATSAnalysis = (data: any) => {
    const feedback: FeedbackItem[] = []
    let keywordsScore = 70
    let formattingScore = 85
    let lengthScore = 80
    let sectionsScore = 90
    let contactScore = 95

    // Analyze contact information
    if (!data.personal?.email) {
      feedback.push({
        type: 'error',
        category: 'Contact',
        message: 'Missing email address',
        suggestion: 'Add a professional email address',
        priority: 'high'
      })
      contactScore -= 30
    }

    if (!data.personal?.phone) {
      feedback.push({
        type: 'warning',
        category: 'Contact',
        message: 'Missing phone number',
        suggestion: 'Add your phone number for better reachability',
        priority: 'medium'
      })
      contactScore -= 15
    }

    // Analyze experience section
    if (!data.experience || data.experience.length === 0) {
      feedback.push({
        type: 'error',
        category: 'Experience',
        message: 'No work experience listed',
        suggestion: 'Add at least one work experience entry',
        priority: 'high'
      })
      sectionsScore -= 40
    } else {
      data.experience.forEach((exp: any, index: number) => {
        if (!exp.description || exp.description.length < 50) {
          feedback.push({
            type: 'warning',
            category: 'Experience',
            message: `Experience ${index + 1} needs more detailed description`,
            suggestion: 'Add specific achievements and responsibilities (aim for 100+ characters)',
            priority: 'medium'
          })
          keywordsScore -= 10
        }

        // Check for metrics
        if (!exp.description?.match(/\d+%|\$\d+|\d+\+|increased|improved|reduced|managed/i)) {
          feedback.push({
            type: 'info',
            category: 'Experience',
            message: `Experience ${index + 1} could benefit from quantifiable achievements`,
            suggestion: 'Add numbers, percentages, or metrics to show impact',
            priority: 'medium'
          })
          keywordsScore -= 5
        }
      })
    }

    // Analyze skills section
    if (!data.skills || data.skills.length === 0) {
      feedback.push({
        type: 'warning',
        category: 'Skills',
        message: 'No skills listed',
        suggestion: 'Add relevant technical and soft skills',
        priority: 'medium'
      })
      sectionsScore -= 20
      keywordsScore -= 15
    } else if (data.skills.length < 5) {
      feedback.push({
        type: 'info',
        category: 'Skills',
        message: 'Consider adding more skills',
        suggestion: 'Aim for 8-12 relevant skills to improve keyword matching',
        priority: 'low'
      })
      keywordsScore -= 5
    }

    // Analyze education
    if (!data.education || data.education.length === 0) {
      feedback.push({
        type: 'warning',
        category: 'Education',
        message: 'No education information',
        suggestion: 'Add your educational background',
        priority: 'medium'
      })
      sectionsScore -= 15
    }

    // Analyze summary
    if (!data.personal?.summary) {
      feedback.push({
        type: 'info',
        category: 'Summary',
        message: 'Missing professional summary',
        suggestion: 'Add a 2-3 sentence professional summary at the top',
        priority: 'low'
      })
      keywordsScore -= 10
    } else if (data.personal.summary.length < 100) {
      feedback.push({
        type: 'info',
        category: 'Summary',
        message: 'Professional summary is quite short',
        suggestion: 'Expand your summary to 100-200 characters for better impact',
        priority: 'low'
      })
      keywordsScore -= 5
    }

    // Calculate overall score
    const overall = Math.round(
      (keywordsScore + formattingScore + lengthScore + sectionsScore + contactScore) / 5
    )

    // Add positive feedback for good practices
    if (overall >= 80) {
      feedback.unshift({
        type: 'success',
        category: 'Overall',
        message: 'Great job! Your resume is well-structured',
        priority: 'low'
      })
    }

    return {
      score: {
        overall,
        categories: {
          keywords: keywordsScore,
          formatting: formattingScore,
          length: lengthScore,
          sections: sectionsScore,
          contact: contactScore
        }
      },
      feedback
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-400'
    if (score >= 60) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Lightbulb className="w-4 h-4 text-blue-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400'
      case 'medium':
        return 'border-l-yellow-400'
      default:
        return 'border-l-blue-400'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ATS Score */}
      <div className="glass-strong rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">ATS Score</h3>
          </div>
          <button
            onClick={analyzeResume}
            disabled={isAnalyzing}
            className="btn btn-ghost btn-sm flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Analyzing your resume...</p>
          </div>
        ) : atsScore ? (
          <>
            {/* Overall Score */}
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(atsScore.overall)}`}>
                {atsScore.overall}/100
              </div>
              <p className="text-gray-400">
                {atsScore.overall >= 80 ? 'Excellent' : atsScore.overall >= 60 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>

            {/* Category Scores */}
            <div className="space-y-3">
              {Object.entries(atsScore.categories).map(([category, score]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getScoreBackground(score)} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Feedback */}
      <div className="glass-strong rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
        </div>

        {feedback.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No feedback available. Analyze your resume to get suggestions.
          </p>
        ) : (
          <div className="space-y-3">
            {feedback.map((item, index) => (
              <div
                key={index}
                className={`glass-strong rounded-lg p-4 border-l-4 ${getPriorityColor(item.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  {getFeedbackIcon(item.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">{item.category}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.priority === 'high' ? 'bg-red-400/10 text-red-400' :
                        item.priority === 'medium' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-blue-400/10 text-blue-400'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{item.message}</p>
                    {item.suggestion && (
                      <p className="text-xs text-gray-400 italic">{item.suggestion}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
