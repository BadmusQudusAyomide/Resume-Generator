import OpenAI from 'openai'

// Only initialize OpenAI if API key is provided
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your_openai_api_key' 
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null

interface AISuggestionOptions {
  promptType: string
  context: string
  resumeData: any
  userId?: string
}

export async function generateAISuggestion(options: AISuggestionOptions): Promise<string> {
  const { promptType, context, resumeData } = options

  // Check if OpenAI is available
  if (!openai) {
    return 'AI suggestions are not available. Please add your OpenAI API key to enable AI features.'
  }

  let systemPrompt = ''
  let userPrompt = ''

  switch (promptType) {
    case 'about-me':
      systemPrompt = `You are a professional resume writer. Generate a compelling professional summary (2-3 sentences) based on the user's experience and background. Focus on key achievements, skills, and career highlights. Use action verbs and quantify achievements when possible.`
      userPrompt = `Based on this experience: ${context}\n\nGenerate a professional summary.`
      break

    case 'job-bullets':
      systemPrompt = `You are a professional resume writer. Convert job responsibilities into achievement-focused bullet points. Each bullet should start with a strong action verb and include quantifiable results when possible. Format as a list of bullet points.`
      userPrompt = `Convert these job responsibilities into achievement-focused bullet points:\n\n${context}`
      break

    case 'rewrite':
      systemPrompt = `You are a professional resume writer. Rewrite and polish the given text to make it more impactful, clear, and professional. Maintain the original meaning while improving clarity and impact.`
      userPrompt = `Rewrite and polish this text:\n\n${context}`
      break

    case 'skills':
      systemPrompt = `You are a career advisor. Based on the user's experience and background, suggest relevant technical and soft skills they should include on their resume. Focus on skills that are in demand and relevant to their field.`
      userPrompt = `Based on this experience: ${context}\n\nSuggest relevant skills for their resume.`
      break

    default:
      throw new Error('Invalid prompt type')
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    return completion.choices[0]?.message?.content || 'Unable to generate suggestion'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate AI suggestion')
  }
}
