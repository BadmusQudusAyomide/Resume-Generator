import { useState } from 'react'
import { useResume } from '../../contexts/ResumeContext'
import { Plus, Trash2, Edit3 } from 'lucide-react'

const skillCategories = [
  'Technical Skills',
  'Programming Languages',
  'Frameworks & Libraries',
  'Tools & Technologies',
  'Soft Skills',
  'Languages',
  'Certifications'
]

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
]

export default function SkillsSection() {
  const { currentResume, updateResumeData } = useResume()
  const [editingId, setEditingId] = useState<string | null>(null)

  const addSkill = () => {
    if (!currentResume) return

    const newSkill = {
      id: crypto.randomUUID(),
      name: '',
      level: 'intermediate' as const,
      category: 'Technical Skills'
    }

    updateResumeData({
      skills: [...currentResume.data.skills, newSkill]
    })
    setEditingId(newSkill.id)
  }

  const updateSkill = (id: string, updates: any) => {
    if (!currentResume) return

    const updated = currentResume.data.skills.map(skill =>
      skill.id === id ? { ...skill, ...updates } : skill
    )

    updateResumeData({ skills: updated })
  }

  const removeSkill = (id: string) => {
    if (!currentResume) return

    const updated = currentResume.data.skills.filter(skill => skill.id !== id)
    updateResumeData({ skills: updated })
  }

  const groupedSkills = currentResume?.data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, typeof currentResume.data.skills>) || {}

  return (
    <div className="space-y-4">
      {Object.entries(groupedSkills).map(([category, skills]) => (
        <div key={category} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-3">{category}</h3>
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm">{skill.name}</span>
                  <span className="text-xs text-gray-500 capitalize">
                    ({skill.level})
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingId(editingId === skill.id ? null : skill.id)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingId && skills.some(skill => skill.id === editingId) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              {skills
                .filter(skill => skill.id === editingId)
                .map((skill) => (
                  <div key={skill.id} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skill Name
                      </label>
                      <input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                        className="input"
                        placeholder="JavaScript, React, Python..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={skill.category}
                          onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                          className="input"
                        >
                          {skillCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Level
                        </label>
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkill(skill.id, { level: e.target.value as any })}
                          className="input"
                        >
                          {skillLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn btn-secondary"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addSkill}
        className="btn btn-secondary w-full flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Skill</span>
      </button>
    </div>
  )
}
