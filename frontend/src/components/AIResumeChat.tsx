import { useState, useRef, useEffect } from 'react'
// Removed unused ResumeData import
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { apiUrl, API_ENDPOINTS } from '../config/api'
// Temporarily disabled Firestore imports
// import { doc, setDoc, getDoc } from 'firebase/firestore'
// import { db } from '../lib/firebase'
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  MessageSquare,
  Brain
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedIn?: string
    portfolio?: string
  }
  summary: string
  experience: Array<{
    company: string
    position: string
    duration: string
    description: string[]
    achievements: string[]
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    year: string
    gpa?: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
  }
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    link?: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
  }>
}

export default function AIResumeChat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [extractedData, setExtractedData] = useState<any>({})
  const [conversationId, setConversationId] = useState<string>('')
  const [isComplete, setIsComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const conversationSteps = [
    {
      id: 'welcome',
      question: "Hi! I'm your AI Resume Assistant. I'll help you create an amazing, ATS-optimized resume through our conversation. Let's start with the basics - what's your full name and what type of role are you targeting?",
      category: 'personal'
    },
    {
      id: 'contact',
      question: "Great! Now, please share your contact information - email, phone number, and location (city, state/country). Also, if you have a LinkedIn profile or portfolio website, please include those too.",
      category: 'personal'
    },
    {
      id: 'experience',
      question: "Let's talk about your work experience. Please tell me about your current or most recent job - company name, your position, how long you worked there, and what your main responsibilities and achievements were. Don't worry about perfect formatting - I'll optimize everything!",
      category: 'experience'
    },
    {
      id: 'more_experience',
      question: "That's excellent! Do you have any other significant work experience you'd like to include? If yes, please share the details. If not, just say 'no more experience' and we'll move on.",
      category: 'experience'
    },
    {
      id: 'education',
      question: "Now let's cover your education. Please tell me about your educational background - degrees, institutions, graduation years, and any notable achievements like GPA, honors, or relevant coursework.",
      category: 'education'
    },
    {
      id: 'skills',
      question: "What are your key skills? Please mention both technical skills (programming languages, software, tools) and soft skills (leadership, communication, etc.). Also, if you speak multiple languages, please include those.",
      category: 'skills'
    },
    {
      id: 'projects',
      question: "Do you have any notable projects, side projects, or portfolio pieces you'd like to showcase? Please describe them, including technologies used and any links if available. If none, just say 'no projects'.",
      category: 'projects'
    },
    {
      id: 'additional',
      question: "Almost done! Is there anything else you'd like to include? Certifications, awards, volunteer work, publications, or any other achievements that would strengthen your resume?",
      category: 'additional'
    },
    {
      id: 'complete',
      question: "Perfect! I've gathered all your information and I'm now processing it to create an ATS-optimized resume. I'll improve the language, format everything professionally, and ensure it passes through applicant tracking systems. This will take just a moment...",
      category: 'processing'
    }
  ]

  // Firestore functions temporarily removed due to permission issues
  // Will be re-implemented later with proper authentication

  useEffect(() => {
    // Initialize conversation only once when user is available and no messages exist
    if (user && messages.length === 0) {
      setConversationId(user.uid)
      addAIMessage(conversationSteps[0].question)
    }
  }, [user, messages.length]) // Include messages.length in dependencies

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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

  const addAIMessage = (content: string) => {
    const messageId = addMessage('', 'ai', true)
    
    // Simulate typing effect
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content, isTyping: false }
          : msg
      ))
    }, 1000 + Math.random() * 1000)
  }

  const processUserResponse = async (userInput: string) => {
    setIsLoading(true)
    
    try {
      console.log('Processing user input:', userInput)
      console.log('Current step:', currentStep)
      console.log('Previous data:', extractedData)
      
      // Call AI service to process and extract data
      const response = await fetch(apiUrl(API_ENDPOINTS.AI_PROCESS_CONVERSATION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          step: currentStep,
          userInput,
          previousData: extractedData,
          conversationHistory: messages.slice(-6) // Last 6 messages for context
        })
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`Failed to process response: ${response.status}`)
      }

      const result = await response.json()
      console.log('AI Response:', result)
      
      // Update extracted data
      const updatedData = { ...extractedData, ...result.extractedData }
      setExtractedData(updatedData)
      
      // Move to next step
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      
      // Save conversation data to Firestore (temporarily disabled due to permissions)
      // setTimeout(() => saveConversationData(), 500)
      
      if (nextStep < conversationSteps.length) {
        // Add follow-up question or next step
        if (result.followUpQuestion) {
          addAIMessage(result.followUpQuestion)
        } else {
          addAIMessage(conversationSteps[nextStep].question)
        }
      } else {
        // Conversation complete
        setIsComplete(true)
        addAIMessage("🎉 Excellent! I've successfully processed all your information and created an optimized resume profile. Your content has been enhanced for ATS compatibility and professional impact. Ready to choose a template and see your amazing resume?")
      }
      
    } catch (error) {
      console.error('Error processing response:', error)
      addAIMessage("I apologize, but I encountered an issue processing your response. Could you please try again or rephrase your answer?")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    addMessage(userMessage, 'user')
    setInputValue('')

    if (isComplete) {
      // Handle post-completion messages
      addAIMessage("Great! Let's proceed to template selection where you can see your optimized resume in action.")
      setTimeout(() => {
        navigate('/templates', { state: { resumeData: extractedData } })
      }, 2000)
      return
    }

    await processUserResponse(userMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const proceedToTemplates = () => {
    console.log('Proceeding to templates with data:', extractedData)
    navigate('/templates', { state: { resumeData: extractedData } })
  }

  const clearConversation = () => {
    // Clear local state only (Firestore temporarily disabled)
    setMessages([])
    setExtractedData({})
    setCurrentStep(0)
    setIsComplete(false)
    
    // Start fresh
    addAIMessage(conversationSteps[0].question)
  }

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 glass-strong px-6 py-3 rounded-full mb-6">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">AI Resume Builder</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Build Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Perfect Resume
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            I'll guide you through creating an ATS-optimized resume that gets you noticed by employers.
          </p>
          
          {messages.length > 1 && (
            <div className="mt-6">
              <button
                onClick={clearConversation}
                className="btn btn-glass btn-sm text-gray-400 hover:text-white"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="glass-strong rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium">Progress</span>
            <span className="text-gray-400 text-sm">
              {Math.min(currentStep + 1, conversationSteps.length)} / {conversationSteps.length}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / conversationSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="glass-strong rounded-3xl overflow-hidden">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'ai' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'bg-gradient-to-r from-green-500 to-teal-500'
                }`}>
                  {message.type === 'ai' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'ai'
                    ? 'bg-white/10 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                }`}>
                  {message.isTyping ? (
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-6">
            {isComplete ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-green-400 mb-4">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Resume Data Collected & Optimized!</span>
                </div>
                <button
                  onClick={proceedToTemplates}
                  className="btn btn-primary btn-lg flex items-center space-x-3 mx-auto group"
                >
                  <FileText className="w-5 h-5" />
                  <span>Choose Template & Generate Resume</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your response here..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="btn btn-primary btn-icon flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="glass text-center rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Conversational</h3>
            <p className="text-gray-400 text-sm">Natural conversation makes resume building easy and intuitive</p>
          </div>
          
          <div className="glass text-center rounded-2xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI-Optimized</h3>
            <p className="text-gray-400 text-sm">Content is automatically enhanced for ATS compatibility</p>
          </div>
          
          <div className="glass text-center rounded-2xl p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Professional</h3>
            <p className="text-gray-400 text-sm">Get industry-standard formatting and language</p>
          </div>
        </div>
      </div>
    </div>
  )
}
