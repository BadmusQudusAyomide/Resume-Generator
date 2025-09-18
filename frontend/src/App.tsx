import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ResumeProvider } from './contexts/ResumeContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import { useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Editor from './components/Editor'
import Preview from './components/Preview'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import TemplateGallery from './components/TemplateGallery'
import PricingPage from './components/PricingPage'
import AIResumeChat from './components/AIResumeChat'
import AIInterview from './components/AIInterview'
import ManualFormWizard from './components/ManualFormWizard'
import './App.css'

function AppContent() {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return (
    <Router>
      <Header
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        isPreviewMode={isPreviewMode}
      />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route 
          path="/templates" 
          element={
            <TemplateGallery 
              onSelectTemplate={(templateId) => {
                // This will be handled by the TemplateGallery component internally
                console.log('Template selected:', templateId)
              }} 
            />
          } 
        />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/ai-chat" element={<AIResumeChat />} />
        <Route path="/ai-interview" element={<AIInterview />} />
        <Route path="/manual-form" element={<ManualFormWizard />} />
        <Route
          path="/editor/:id?"
          element={
            <div className="pt-24 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="animate-fade-in">
                  <Editor />
                </div>
              </div>
            </div>
          }
        />
        <Route
          path="/editor"
          element={
            <div className="pt-24 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="animate-fade-in">
                  <Editor />
                </div>
              </div>
            </div>
          }
        />
        <Route
          path="/preview/:id"
          element={
            <div className="pt-24 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="animate-fade-in">
                  <Preview />
                </div>
              </div>
            </div>
          }
        />
        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ResumeProvider>
          <AppContent />
        </ResumeProvider>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App
