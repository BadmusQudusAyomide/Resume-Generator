import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FileText,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react'

interface FormData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    website: string
    linkedIn: string
  }
  experience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
  }
  summary: string
}

const steps = [
  { id: 0, title: 'Personal Info', icon: <User className="w-5 h-5" /> },
  { id: 1, title: 'Experience', icon: <Briefcase className="w-5 h-5" /> },
  { id: 2, title: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 3, title: 'Skills', icon: <Code className="w-5 h-5" /> },
  { id: 4, title: 'Summary', icon: <FileText className="w-5 h-5" /> }
]

export default function ManualFormWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedIn: ''
    },
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    }],
    education: [{
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }],
    skills: {
      technical: [''],
      soft: [''],
      languages: ['']
    },
    summary: ''
  })

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData
  })

  const watchedValues = watch()

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: ['']
      }]
    }))
  }

  const removeExperience = (index: number) => {
    if (formData.experience.length > 1) {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index)
      }))
    }
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      }]
    }))
  }

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }))
    }
  }

  const addSkill = (category: 'technical' | 'soft' | 'languages') => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], '']
      }
    }))
  }

  const removeSkill = (category: 'technical' | 'soft' | 'languages', index: number) => {
    if (formData.skills[category].length > 1) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: prev.skills[category].filter((_, i) => i !== index)
        }
      }))
    }
  }

  const onSubmit = (data: any) => {
    if (currentStep === steps.length - 1) {
      // Final submission
      const resumeData = {
        personalInfo: {
          fullName: `${data.personal.firstName} ${data.personal.lastName}`,
          email: data.personal.email,
          phone: data.personal.phone,
          location: data.personal.location,
          website: data.personal.website,
          linkedIn: data.personal.linkedIn
        },
        experience: data.experience.filter((exp: any) => exp.company && exp.position),
        education: data.education.filter((edu: any) => edu.institution && edu.degree),
        skills: {
          technical: data.skills.technical.filter((skill: string) => skill.trim()),
          soft: data.skills.soft.filter((skill: string) => skill.trim()),
          languages: data.skills.languages.filter((skill: string) => skill.trim())
        },
        summary: data.summary
      }

      // Navigate to editor with collected data
      navigate('/editor', { 
        state: { 
          resumeData,
          templateId: 'modern' // Default template
        } 
      })
    } else {
      nextStep()
    }
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name *
          </label>
          <input
            {...register('personal.firstName', { required: 'First name is required' })}
            className="input"
            placeholder="John"
          />
          {errors.personal?.firstName && (
            <p className="text-red-400 text-sm mt-1">{errors.personal.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            {...register('personal.lastName', { required: 'Last name is required' })}
            className="input"
            placeholder="Doe"
          />
          {errors.personal?.lastName && (
            <p className="text-red-400 text-sm mt-1">{errors.personal.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email *
        </label>
        <input
          {...register('personal.email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          className="input"
          placeholder="john.doe@email.com"
        />
        {errors.personal?.email && (
          <p className="text-red-400 text-sm mt-1">{errors.personal.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone
          </label>
          <input
            {...register('personal.phone')}
            className="input"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            {...register('personal.location')}
            className="input"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Website
          </label>
          <input
            {...register('personal.website')}
            className="input"
            placeholder="https://johndoe.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            LinkedIn
          </label>
          <input
            {...register('personal.linkedIn')}
            className="input"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
      </div>
    </div>
  )

  const renderExperience = () => (
    <div className="space-y-8">
      {formData.experience.map((_, index) => (
        <div key={index} className="glass-strong rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Experience {index + 1}</h3>
            {formData.experience.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="btn btn-ghost btn-icon text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company *
                </label>
                <input
                  {...register(`experience.${index}.company`, { required: 'Company is required' })}
                  className="input"
                  placeholder="Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position *
                </label>
                <input
                  {...register(`experience.${index}.position`, { required: 'Position is required' })}
                  className="input"
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  {...register(`experience.${index}.startDate`)}
                  type="month"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  {...register(`experience.${index}.endDate`)}
                  type="month"
                  className="input"
                  disabled={watchedValues.experience?.[index]?.current}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    {...register(`experience.${index}.current`)}
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <span>Current Position</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                {...register(`experience.${index}.description`)}
                rows={4}
                className="input"
                placeholder="Describe your role, responsibilities, and achievements..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="btn btn-glass w-full flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Experience</span>
      </button>
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-8">
      {formData.education.map((_, index) => (
        <div key={index} className="glass-strong rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Education {index + 1}</h3>
            {formData.education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="btn btn-ghost btn-icon text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Institution *
              </label>
              <input
                {...register(`education.${index}.institution`, { required: 'Institution is required' })}
                className="input"
                placeholder="Stanford University"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Degree *
                </label>
                <input
                  {...register(`education.${index}.degree`, { required: 'Degree is required' })}
                  className="input"
                  placeholder="Bachelor of Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Field of Study
                </label>
                <input
                  {...register(`education.${index}.field`)}
                  className="input"
                  placeholder="Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  {...register(`education.${index}.startDate`)}
                  type="month"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  {...register(`education.${index}.endDate`)}
                  type="month"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GPA (Optional)
                </label>
                <input
                  {...register(`education.${index}.gpa`)}
                  className="input"
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="btn btn-glass w-full flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Education</span>
      </button>
    </div>
  )

  const renderSkills = () => (
    <div className="space-y-8">
      {/* Technical Skills */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Technical Skills</h3>
        <div className="space-y-3">
          {formData.skills.technical.map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                {...register(`skills.technical.${index}`)}
                className="input flex-1"
                placeholder="e.g., JavaScript, React, Node.js"
              />
              {formData.skills.technical.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill('technical', index)}
                  className="btn btn-ghost btn-icon text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addSkill('technical')}
            className="btn btn-glass btn-sm"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Soft Skills */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Soft Skills</h3>
        <div className="space-y-3">
          {formData.skills.soft.map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                {...register(`skills.soft.${index}`)}
                className="input flex-1"
                placeholder="e.g., Leadership, Communication, Problem Solving"
              />
              {formData.skills.soft.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill('soft', index)}
                  className="btn btn-ghost btn-icon text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addSkill('soft')}
            className="btn btn-glass btn-sm"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Languages */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Languages</h3>
        <div className="space-y-3">
          {formData.skills.languages.map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                {...register(`skills.languages.${index}`)}
                className="input flex-1"
                placeholder="e.g., English (Native), Spanish (Fluent)"
              />
              {formData.skills.languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkill('languages', index)}
                  className="btn btn-ghost btn-icon text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addSkill('languages')}
            className="btn btn-glass btn-sm"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Language
          </button>
        </div>
      </div>
    </div>
  )

  const renderSummary = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Professional Summary
        </label>
        <textarea
          {...register('summary')}
          rows={6}
          className="input"
          placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career goals. This will be the first thing employers see on your resume."
        />
        <p className="text-sm text-gray-400 mt-2">
          💡 Tip: Keep it concise (2-3 sentences) and focus on your unique value proposition.
        </p>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo()
      case 1: return renderExperience()
      case 2: return renderEducation()
      case 3: return renderSkills()
      case 4: return renderSummary()
      default: return null
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 glass-strong px-6 py-3 rounded-full mb-6">
            <FileText className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Manual Form</span>
            <FileText className="w-5 h-5 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Build Your Resume Step by Step
          </h1>
          <p className="text-xl text-gray-300">
            Fill out each section with your information
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  index === currentStep
                    ? 'bg-green-500/20 border border-green-400/50 text-green-400'
                    : index < currentStep
                    ? 'bg-green-500/10 border border-green-400/30 text-green-300'
                    : 'bg-gray-800 border border-gray-600 text-gray-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-sm font-medium hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h2>
              <p className="text-gray-400">
                {currentStep === 0 && "Let's start with your basic information"}
                {currentStep === 1 && "Tell us about your work experience"}
                {currentStep === 2 && "Add your educational background"}
                {currentStep === 3 && "List your key skills and competencies"}
                {currentStep === 4 && "Write a compelling professional summary"}
              </p>
            </div>

            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn btn-glass flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>{currentStep === steps.length - 1 ? 'Create Resume' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
