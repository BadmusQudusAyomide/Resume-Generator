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

interface ConversationProcessOptions {
  step: number
  userInput: string
  previousData: any
  conversationHistory: Array<{
    type: 'user' | 'ai'
    content: string
  }>
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

export async function processResumeConversation(options: ConversationProcessOptions) {
  const { step, userInput, previousData, conversationHistory } = options

  // Check if OpenAI is available
  if (!openai) {
    return getMockResponse(step, userInput, previousData)
  }

  const stepCategories = [
    'personal', // 0: welcome & name/role
    'personal', // 1: contact info
    'experience', // 2: main experience
    'experience', // 3: additional experience
    'education', // 4: education
    'skills', // 5: skills
    'projects', // 6: projects
    'additional', // 7: additional info
    'processing' // 8: final processing
  ]

  const currentCategory = stepCategories[step] || 'general'

  let systemPrompt = `You are an expert resume writer and career coach. Your task is to extract structured resume information from user responses and optimize it for ATS (Applicant Tracking Systems) compatibility.

Current conversation step: ${step}
Current category: ${currentCategory}

IMPORTANT INSTRUCTIONS:
1. Extract relevant information from the user's response
2. Improve and optimize the language for professional resume standards
3. Make content ATS-friendly by using industry keywords and proper formatting
4. Return data in the exact JSON structure requested
5. If information is incomplete, ask a specific follow-up question
6. Always maintain a friendly, encouraging tone

Previous extracted data: ${JSON.stringify(previousData, null, 2)}

Return your response as a JSON object with this structure:
{
  "extractedData": {
    // Only include the fields relevant to current step
  },
  "followUpQuestion": "string or null",
  "needsMoreInfo": boolean,
  "optimizedContent": {
    // Any content that was improved/optimized
  }
}`

  let userPrompt = ''

  switch (currentCategory) {
    case 'personal':
      if (step === 0) {
        userPrompt = `Extract the person's full name and target role/industry from this response: "${userInput}"`
      } else {
        userPrompt = `Extract contact information (email, phone, location, LinkedIn, portfolio) from this response: "${userInput}"`
      }
      break

    case 'experience':
      userPrompt = `Extract work experience details from this response. Include company name, position, duration, responsibilities, and achievements. Optimize the language for ATS compatibility and impact: "${userInput}"`
      break

    case 'education':
      userPrompt = `Extract educational background from this response. Include institutions, degrees, fields of study, graduation years, and any notable achievements: "${userInput}"`
      break

    case 'skills':
      userPrompt = `Extract and categorize skills from this response into technical skills, soft skills, and languages. Optimize skill names for ATS compatibility: "${userInput}"`
      break

    case 'projects':
      userPrompt = `Extract project information from this response. Include project names, descriptions, technologies used, and links if available: "${userInput}"`
      break

    case 'additional':
      userPrompt = `Extract any additional information like certifications, awards, volunteer work, or publications from this response: "${userInput}"`
      break

    default:
      userPrompt = `Process this general resume-related information: "${userInput}"`
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    // Try to parse JSON, if it fails, extract JSON from the response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(response)
    } catch (parseError) {
      // Try to extract JSON from the response if it's wrapped in text
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Invalid JSON response from AI')
      }
    }

    return parsedResponse
  } catch (error) {
    console.error('Error processing conversation:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
    
    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('rate_limit')) {
      return getMockResponse(step, userInput, previousData)
    }
    
    // Fallback response
    return {
      extractedData: {},
      followUpQuestion: "I had trouble processing that. Could you please provide that information again, perhaps with a bit more detail?",
      needsMoreInfo: true
    }
  }
}

export async function generateOptimizedResumeSummary(resumeData: Partial<ResumeData>) {
  if (!openai) {
    return generateMockSummary(resumeData)
  }

  const systemPrompt = `You are an expert resume writer. Create a compelling professional summary (2-3 sentences) that:
1. Highlights key achievements and skills
2. Uses industry keywords for ATS optimization
3. Demonstrates value proposition to employers
4. Maintains professional tone
5. Is tailored to the person's experience level and target role

The summary should be impactful, concise, and immediately grab the hiring manager's attention.`

  const userPrompt = `Based on this resume data, create an optimized professional summary:

Name: ${resumeData.personalInfo?.fullName || 'Professional'}
Experience: ${JSON.stringify(resumeData.experience || [], null, 2)}
Skills: ${JSON.stringify(resumeData.skills || {}, null, 2)}
Education: ${JSON.stringify(resumeData.education || [], null, 2)}
Projects: ${JSON.stringify(resumeData.projects || [], null, 2)}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.7
    })

    return completion.choices[0]?.message?.content || 'Unable to generate summary'
  } catch (error) {
    console.error('Error generating summary:', error)
    throw new Error('Failed to generate optimized summary')
  }
}

// Mock response function for development/fallback
function getMockResponse(step: number, userInput: string, previousData: any) {
  const stepCategories = [
    'personal', // 0: welcome & name/role
    'personal', // 1: contact info
    'experience', // 2: main experience
    'experience', // 3: additional experience
    'education', // 4: education
    'skills', // 5: skills
    'projects', // 6: projects
    'additional', // 7: additional info
    'processing' // 8: final processing
  ]

  const currentCategory = stepCategories[step] || 'general'

  switch (currentCategory) {
    case 'personal':
      if (step === 0) {
        // Extract name and role from input like "Badmus Qudus Ayomide, Fullstack Developer"
        const parts = userInput.split(',')
        const fullName = parts[0]?.trim() || ''
        const targetRole = parts[1]?.trim() || 'Software Developer'
        
        return {
          extractedData: {
            personalInfo: {
              fullName,
              targetRole
            }
          },
          followUpQuestion: `Great to meet you, ${fullName.split(' ')[0]}! I can see you're targeting ${targetRole} roles. Now, please share your contact information - email, phone number, and location (city, state/country). Also, if you have a LinkedIn profile or portfolio website, please include those too.`,
          needsMoreInfo: false
        }
      } else {
        // Mock contact info extraction
        return {
          extractedData: {
            personalInfo: {
              ...previousData.personalInfo,
              email: 'user@example.com',
              phone: '+1234567890',
              location: 'City, State',
              linkedIn: 'linkedin.com/in/username'
            }
          },
          followUpQuestion: "Perfect! Now let's talk about your work experience. Please tell me about your current or most recent job - company name, your position, how long you worked there, and what your main responsibilities and achievements were.",
          needsMoreInfo: false
        }
      }

    case 'experience':
      return {
        extractedData: {
          experience: [
            {
              company: 'Tech Company',
              position: 'Fullstack Developer',
              duration: '2022 - Present',
              description: ['Developed web applications using modern technologies', 'Collaborated with cross-functional teams'],
              achievements: ['Improved application performance by 30%', 'Led development of key features']
            }
          ]
        },
        followUpQuestion: step === 2 
          ? "That's excellent experience! Do you have any other significant work experience you'd like to include? If yes, please share the details. If not, just say 'no more experience' and we'll move on."
          : "Great! Now let's cover your education. Please tell me about your educational background - degrees, institutions, graduation years, and any notable achievements.",
        needsMoreInfo: false
      }

    case 'education':
      return {
        extractedData: {
          education: [
            {
              institution: 'University Name',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              year: '2022'
            }
          ]
        },
        followUpQuestion: "Excellent educational background! What are your key skills? Please mention both technical skills (programming languages, software, tools) and soft skills (leadership, communication, etc.).",
        needsMoreInfo: false
      }

    case 'skills':
      return {
        extractedData: {
          skills: {
            technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
            soft: ['Problem Solving', 'Team Collaboration', 'Communication'],
            languages: ['English', 'Spanish']
          }
        },
        followUpQuestion: "Great skill set! Do you have any notable projects, side projects, or portfolio pieces you'd like to showcase? Please describe them, including technologies used and any links if available.",
        needsMoreInfo: false
      }

    case 'projects':
      return {
        extractedData: {
          projects: [
            {
              name: 'Portfolio Website',
              description: 'Personal portfolio showcasing projects and skills',
              technologies: ['React', 'TypeScript', 'Tailwind CSS'],
              link: 'https://portfolio.example.com'
            }
          ]
        },
        followUpQuestion: "Impressive projects! Almost done! Is there anything else you'd like to include? Certifications, awards, volunteer work, publications, or any other achievements?",
        needsMoreInfo: false
      }

    case 'additional':
      return {
        extractedData: {
          certifications: [
            {
              name: 'AWS Certified Developer',
              issuer: 'Amazon Web Services',
              date: '2023'
            }
          ]
        },
        followUpQuestion: "Perfect! I've gathered all your information and I'm now processing it to create an ATS-optimized resume. I'll improve the language, format everything professionally, and ensure it passes through applicant tracking systems.",
        needsMoreInfo: false
      }

    default:
      return {
        extractedData: {},
        followUpQuestion: "Thank you for that information. Let's continue with the next section.",
        needsMoreInfo: false
      }
  }
}

// Mock summary generation for development/fallback
function generateMockSummary(resumeData: any) {
  const name = resumeData.personalInfo?.fullName || 'Professional'
  const firstName = name.split(' ')[0]
  const role = resumeData.personalInfo?.targetRole || 'Software Developer'
  
  return `Experienced ${role} with a proven track record of delivering high-quality software solutions. ${firstName} combines technical expertise with strong problem-solving skills to drive innovation and exceed project goals. Passionate about creating efficient, scalable applications that deliver exceptional user experiences.`
}
