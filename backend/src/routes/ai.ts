import { Router } from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { generateAISuggestion, processResumeConversation, generateOptimizedResumeSummary } from '../services/aiService'

const router = Router()

// AI suggestion endpoint
router.post('/suggest', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { promptType, context, resumeData } = req.body

    if (!promptType || !context) {
      return res.status(400).json({ error: 'Prompt type and context are required' })
    }

    // TODO: Check user's AI quota/plan
    // TODO: Rate limiting for free users

    const suggestion = await generateAISuggestion({
      promptType,
      context,
      resumeData,
      userId: req.user?.uid
    })

    res.json({ suggestion })
  } catch (error) {
    console.error('Error generating AI suggestion:', error)
    res.status(500).json({ error: 'Failed to generate AI suggestion' })
  }
})

// Available prompt types
router.get('/prompt-types', (req, res) => {
  res.json({
    promptTypes: [
      {
        id: 'about-me',
        name: 'About Me Summary',
        description: 'Generate a professional summary based on your experience'
      },
      {
        id: 'job-bullets',
        name: 'Job Description Bullets',
        description: 'Convert job responsibilities into achievement-focused bullets'
      },
      {
        id: 'rewrite',
        name: 'Rewrite & Polish',
        description: 'Improve existing text for clarity and impact'
      },
      {
        id: 'skills',
        name: 'Skills Suggestions',
        description: 'Suggest relevant skills based on your experience'
      }
    ]
  })
})

// Process resume conversation endpoint
router.post('/process-resume-conversation', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { step, userInput, previousData, conversationHistory } = req.body

    if (typeof step !== 'number' || !userInput) {
      return res.status(400).json({ error: 'Step and user input are required' })
    }

    // TODO: Check user's AI quota/plan
    // TODO: Rate limiting for free users

    const result = await processResumeConversation({
      step,
      userInput,
      previousData: previousData || {},
      conversationHistory: conversationHistory || []
    })

    res.json(result)
  } catch (error) {
    console.error('Error processing resume conversation:', error)
    res.status(500).json({ error: 'Failed to process conversation' })
  }
})

// Generate optimized resume summary
router.post('/generate-summary', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { resumeData } = req.body

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' })
    }

    const summary = await generateOptimizedResumeSummary(resumeData)

    res.json({ summary })
  } catch (error) {
    console.error('Error generating resume summary:', error)
    res.status(500).json({ error: 'Failed to generate summary' })
  }
})

export default router
