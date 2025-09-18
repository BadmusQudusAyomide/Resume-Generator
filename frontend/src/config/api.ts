export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' 
  : 'http://localhost:3002'

export const API_ENDPOINTS = {
  AI_PROCESS_CONVERSATION: '/api/ai/process-resume-conversation',
  AI_GENERATE_SUMMARY: '/api/ai/generate-summary',
  AI_SUGGEST: '/api/ai/suggest'
}

export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`
