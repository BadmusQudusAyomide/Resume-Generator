import React from 'react'
import { useResume } from '../../contexts/ResumeContext'
import { useForm } from 'react-hook-form'

export default function PersonalInfo() {
  const { currentResume, updateResumeData } = useResume()
  const { register, watch } = useForm({
    defaultValues: currentResume?.data.personal || {}
  })

  const watchedValues = watch()

  // Update resume data when form values change
  React.useEffect(() => {
    if (currentResume) {
      updateResumeData({ personal: watchedValues })
    }
  }, [watchedValues, currentResume, updateResumeData])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            {...register('firstName')}
            className="input"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register('lastName')}
            className="input"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="input"
          placeholder="john.doe@email.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            {...register('phone')}
            className="input"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            {...register('location')}
            className="input"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website
        </label>
        <input
          {...register('website')}
          className="input"
          placeholder="https://johndoe.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary
        </label>
        <textarea
          {...register('summary')}
          rows={4}
          className="input"
          placeholder="Brief summary of your professional background and key achievements..."
        />
      </div>
    </div>
  )
}
