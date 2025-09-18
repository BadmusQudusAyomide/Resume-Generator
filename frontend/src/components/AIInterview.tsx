import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Send, 
  Sparkles, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Target,
  CheckCircle,
  ArrowRight,
  MessageCircle
} from 'lucide-react'

interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface InterviewStep {
  id: number
  title: string
  icon: React.ReactNode
  question: string
  placeholder: string
  category: 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'goal'
}

const interviewSteps: InterviewStep[] = [
  {
    id: 0,
    title: "Personal Information",
    icon: <User className="w-5 h-5" />,
    question: "Hi! I'm your AI resume assistant. Let's start with the basics - what's your full name and what job title are you targeting?",
    placeholder: "e.g., John Doe, Software Engineer",
    category: 'personal'
  },
  {
    id: 1,
    title: "Contact Details",
    icon: <MessageCircle className="w-5 h-5" />,
    question: "Great! Now I need your contact information. Please share your email, phone number, and location (city, state/country). If you have a LinkedIn profile or portfolio website, include those too.",
    placeholder: "e.g., john@email.com, +1234567890, San Francisco CA, linkedin.com/in/johndoe",
    category: 'personal'
  },
  {
    id: 2,
    title: "Work Experience",
    icon: <Briefcase className="w-5 h-5" />,
    question: "Tell me about your current or most recent job. Include the company name, your position, how long you worked there, and your main responsibilities and achievements.",
    placeholder: "e.g., Software Engineer at Google, 2022-Present, developed web applications...",
    category: 'experience'
  },
  {
    id: 3,
    title: "Additional Experience",
    icon: <Briefcase className="w-5 h-5" />,
    question: "Do you have any other significant work experience you'd like to include? If yes, please share the details. If not, just type 'no more experience'.",
    placeholder: "e.g., Frontend Developer at Startup Inc, 2020-2022... or 'no more experience'",
    category: 'experience'
  },
  {
    id: 4,
    title: "Education",
    icon: <GraduationCap className="w-5 h-5" />,
    question: "What's your educational background? Please include your degree(s), institution(s), graduation year(s), and any notable achievements or GPA if relevant.",
    placeholder: "e.g., Bachelor of Computer Science, Stanford University, 2020, GPA: 3.8",
    category: 'education'
  },
  {
    id: 5,
    title: "Skills",
    icon: <Code className="w-5 h-5" />,
    question: "What are your key skills? Please mention both technical skills (programming languages, software, tools) and soft skills (leadership, communication, etc.).",
    placeholder: "e.g., JavaScript, React, Node.js, Python, Leadership, Problem Solving",
    category: 'skills'
  },
  {
    id: 6,
    title: "Projects",
    icon: <Target className="w-5 h-5" />,
    question: "Do you have any notable projects, certifications, or achievements you'd like to highlight? Include project names, descriptions, and technologies used.",
    placeholder: "e.g., E-commerce Platform - Built with React and Node.js, increased sales by 30%",
    category: 'projects'
  },
  {
    id: 7,
    title: "Career Goal",
    icon: <Target className="w-5 h-5" />,
    question: "Finally, what's your career goal or what type of role are you looking for? This will help me craft a compelling professional summary.",
    placeholder: "e.g., Seeking a senior software engineer role in fintech to lead innovative projects",
    category: 'goal'
  }
]

export default function AIInterview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [collectedData, setCollectedData] = useState<any>({})
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Initialize conversation
  useEffect(() => {
    if (user && messages.length === 0) {
      addAIMessage(interviewSteps[0].question)
    }
  }, [user])

  const addMessage = (content: string, type: 'user' | 'ai', isTyping = false) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      isTyping
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }

  const addAIMessage = (content: string, isTyping = false) => {
    return addMessage(content, 'ai', isTyping)
  }

  const addUserMessage = (content: string) => {
    return addMessage(content, 'user')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || isProcessing) return

    const input = userInput.trim()
    setUserInput('')
    setIsProcessing(true)

    // Add user message
    addUserMessage(input)

    // Simulate AI processing
    const typingId = addAIMessage('', true)
    
    setTimeout(() => {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingId))
      
      // Process the input and move to next step
      processUserInput(input)
      setIsProcessing(false)
    }, 1500)
  }

  const processUserInput = (input: string) => {
    const step = interviewSteps[currentStep]
    
    // Store the data
    const newData = { ...collectedData }
    if (!newData[step.category]) {
      newData[step.category] = []
    }
    
    if (step.category === 'personal') {
      if (currentStep === 0) {
        // Parse name and job title
        const parts = input.split(',')
        newData.personalInfo = {
          fullName: parts[0]?.trim() || '',
          targetRole: parts[1]?.trim() || ''
        }
      } else {
        // Parse contact info
        newData.personalInfo = {
          ...newData.personalInfo,
          email: extractEmail(input),
          phone: extractPhone(input),
          location: extractLocation(input),
          linkedIn: extractLinkedIn(input),
          website: extractWebsite(input)
        }
      }
    } else if (step.category === 'experience') {
      if (input.toLowerCase().includes('no more experience')) {
        // Skip adding experience
      } else {
        if (!newData.experience) newData.experience = []
        newData.experience.push({
          company: extractCompany(input),
          position: extractPosition(input),
          duration: extractDuration(input),
          description: input,
          achievements: []
        })
      }
    } else if (step.category === 'education') {
      if (!newData.education) newData.education = []
      newData.education.push({
        institution: extractInstitution(input),
        degree: extractDegree(input),
        field: extractField(input),
        year: extractYear(input),
        gpa: extractGPA(input)
      })
    } else if (step.category === 'skills') {
      const skills = input.split(',').map(s => s.trim()).filter(s => s)
      newData.skills = {
        technical: skills.filter(s => isTechnicalSkill(s)),
        soft: skills.filter(s => !isTechnicalSkill(s)),
        languages: []
      }
    } else if (step.category === 'projects') {
      if (!newData.projects) newData.projects = []
      newData.projects.push({
        name: extractProjectName(input),
        description: input,
        technologies: extractTechnologies(input),
        link: extractProjectLink(input)
      })
    } else if (step.category === 'goal') {
      newData.careerGoal = input
    }

    setCollectedData(newData)
    setCompletedSteps(prev => [...prev, currentStep])

    // Move to next step or finish
    if (currentStep < interviewSteps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      
      setTimeout(() => {
        addAIMessage(interviewSteps[nextStep].question)
      }, 500)
    } else {
      // Interview complete
      setTimeout(() => {
        addAIMessage("Perfect! I've gathered all your information. Let me process this and create your optimized resume draft. This will take just a moment...")
        
        setTimeout(() => {
          // Navigate to editor with collected data
          navigate('/editor', { 
            state: { 
              resumeData: newData,
              templateId: 'modern' // Default template
            } 
          })
        }, 2000)
      }, 500)
    }
  }

  // Helper functions for data extraction
  const extractEmail = (text: string) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
    const match = text.match(emailRegex)
    return match ? match[0] : ''
  }

  const extractPhone = (text: string) => {
    const phoneRegex = /[\+]?[1-9]?[\d\s\-\(\)]{10,}/
    const match = text.match(phoneRegex)
    return match ? match[0] : ''
  }

  const extractLocation = (text: string) => {
    // Simple location extraction - look for city, state patterns
    const locationRegex = /([A-Za-z\s]+),?\s*([A-Za-z]{2,})/
    const match = text.match(locationRegex)
    return match ? `${match[1]}, ${match[2]}` : ''
  }

  const extractLinkedIn = (text: string) => {
    const linkedinRegex = /(linkedin\.com\/in\/[A-Za-z0-9\-]+)/
    const match = text.match(linkedinRegex)
    return match ? `https://${match[0]}` : ''
  }

  const extractWebsite = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/
    const match = text.match(urlRegex)
    return match ? match[0] : ''
  }

  const extractCompany = (text: string) => {
    // Look for "at [Company]" pattern
    const companyRegex = /at\s+([A-Za-z0-9\s&.,-]+?)(?:,|\s+\d{4}|\s+from|\s+since|$)/i
    const match = text.match(companyRegex)
    return match ? match[1].trim() : ''
  }

  const extractPosition = (text: string) => {
    // Look for job title before "at"
    const positionRegex = /^([A-Za-z\s]+?)\s+at\s+/i
    const match = text.match(positionRegex)
    return match ? match[1].trim() : ''
  }

  const extractDuration = (text: string) => {
    // Look for date patterns
    const durationRegex = /(\d{4}[-\s]*(?:to|-)?\s*(?:\d{4}|present|current))/i
    const match = text.match(durationRegex)
    return match ? match[1] : ''
  }

  const extractInstitution = (text: string) => {
    // Look for university/college names
    const institutionRegex = /(?:at|from)\s+([A-Za-z\s&.,-]+?)(?:,|\s+\d{4}|$)/i
    const match = text.match(institutionRegex)
    return match ? match[1].trim() : ''
  }

  const extractDegree = (text: string) => {
    const degreeRegex = /(bachelor|master|phd|doctorate|associate|diploma|certificate)[\s\w]*/i
    const match = text.match(degreeRegex)
    return match ? match[0] : ''
  }

  const extractField = (text: string) => {
    const fieldRegex = /(?:in|of)\s+([A-Za-z\s]+?)(?:,|\s+from|\s+at|$)/i
    const match = text.match(fieldRegex)
    return match ? match[1].trim() : ''
  }

  const extractYear = (text: string) => {
    const yearRegex = /\b(19|20)\d{2}\b/
    const match = text.match(yearRegex)
    return match ? match[0] : ''
  }

  const extractGPA = (text: string) => {
    const gpaRegex = /gpa:?\s*(\d+\.?\d*)/i
    const match = text.match(gpaRegex)
    return match ? match[1] : ''
  }

  const extractProjectName = (text: string) => {
    // Look for project name at the beginning
    const projectRegex = /^([A-Za-z\s\-]+?)(?:\s*-|\s*:|\s*built|\s*developed)/i
    const match = text.match(projectRegex)
    return match ? match[1].trim() : 'Project'
  }

  const extractTechnologies = (text: string) => {
    const techKeywords = ['react', 'node', 'python', 'javascript', 'typescript', 'java', 'c++', 'html', 'css', 'sql', 'mongodb', 'express', 'angular', 'vue']
    const foundTech = techKeywords.filter(tech => 
      text.toLowerCase().includes(tech.toLowerCase())
    )
    return foundTech
  }

  const extractProjectLink = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/
    const match = text.match(urlRegex)
    return match ? match[0] : ''
  }

  const isTechnicalSkill = (skill: string) => {
    const techKeywords = ['javascript', 'python', 'react', 'node', 'java', 'c++', 'html', 'css', 'sql', 'mongodb', 'express', 'angular', 'vue', 'typescript', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust']
    return techKeywords.some(tech => skill.toLowerCase().includes(tech.toLowerCase()))
  }

  const currentStepInfo = interviewSteps[currentStep]
  const progress = ((completedSteps.length) / interviewSteps.length) * 100

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 glass-strong px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">AI Interview</span>
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Let's Build Your Perfect Resume
          </h1>
          <p className="text-xl text-gray-300">
            Answer a few questions and I'll create an optimized resume draft for you
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-gray-400">{completedSteps.length}/{interviewSteps.length} completed</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step Info */}
        <div className="glass-strong rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              {currentStepInfo?.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{currentStepInfo?.title}</h2>
              <p className="text-gray-400 text-sm">Step {currentStep + 1} of {interviewSteps.length}</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <div className="border-t border-white/10 p-6">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={currentStepInfo?.placeholder}
                className="flex-1 input"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={!userInput.trim() || isProcessing}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Steps Overview */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {interviewSteps.map((step, index) => (
            <div
              key={step.id}
              className={`glass-strong rounded-xl p-4 text-center transition-all ${
                completedSteps.includes(index)
                  ? 'border-green-400/50 bg-green-400/10'
                  : index === currentStep
                  ? 'border-blue-400/50 bg-blue-400/10'
                  : 'border-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${
                completedSteps.includes(index)
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>
              <p className="text-xs text-gray-400">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
