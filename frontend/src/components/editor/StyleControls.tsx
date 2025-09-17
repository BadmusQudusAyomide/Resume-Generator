import { } from 'react'
import { useResume } from '../../contexts/ResumeContext'

const fonts = [
  { value: 'inter', label: 'Inter (Modern)' },
  { value: 'georgia', label: 'Georgia (Classic)' },
  { value: 'jetbrains', label: 'JetBrains Mono (Technical)' }
]

const spacingOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'spacious', label: 'Spacious' }
]

const colorPresets = [
  { name: 'Blue', primary: '#3b82f6', secondary: '#6b7280' },
  { name: 'Green', primary: '#10b981', secondary: '#6b7280' },
  { name: 'Purple', primary: '#8b5cf6', secondary: '#6b7280' },
  { name: 'Red', primary: '#ef4444', secondary: '#6b7280' },
  { name: 'Orange', primary: '#f59e0b', secondary: '#6b7280' },
  { name: 'Teal', primary: '#14b8a6', secondary: '#6b7280' },
  { name: 'Gray', primary: '#6b7280', secondary: '#9ca3af' },
  { name: 'Indigo', primary: '#6366f1', secondary: '#6b7280' }
]

export default function StyleControls() {
  const { currentResume, updateResumeStyles } = useResume()

  if (!currentResume) return null

  const { styles } = currentResume

  const updateStyle = (key: keyof typeof styles, value: any) => {
    updateResumeStyles({ [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Font Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Font Family
        </label>
        <div className="grid grid-cols-1 gap-2">
          {fonts.map((font) => (
            <label key={font.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="font"
                value={font.value}
                checked={styles.font === font.value}
                onChange={(e) => updateStyle('font', e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className={`text-sm ${
                font.value === 'inter' ? 'font-sans' :
                font.value === 'georgia' ? 'font-serif' :
                'font-mono'
              }`}>
                {font.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color Scheme
        </label>
        <div className="grid grid-cols-4 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                updateStyle('primaryColor', preset.primary)
                updateStyle('secondaryColor', preset.secondary)
              }}
              className={`p-3 rounded-lg border-2 transition-all ${
                styles.primaryColor === preset.primary
                  ? 'border-primary-500 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex space-x-1">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.secondary }}
                />
              </div>
              <span className="text-xs text-gray-600 mt-1 block">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={styles.primaryColor}
              onChange={(e) => updateStyle('primaryColor', e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={styles.primaryColor}
              onChange={(e) => updateStyle('primaryColor', e.target.value)}
              className="input flex-1"
              placeholder="#3b82f6"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secondary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={styles.secondaryColor}
              onChange={(e) => updateStyle('secondaryColor', e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={styles.secondaryColor}
              onChange={(e) => updateStyle('secondaryColor', e.target.value)}
              className="input flex-1"
              placeholder="#6b7280"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Spacing
        </label>
        <div className="grid grid-cols-3 gap-2">
          {spacingOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="spacing"
                value={option.value}
                checked={styles.spacing === option.value}
                onChange={(e) => updateStyle('spacing', e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Style Preview
        </label>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div 
            className="text-sm"
            style={{
              fontFamily: styles.font === 'inter' ? 'Inter, sans-serif' :
                         styles.font === 'georgia' ? 'Georgia, serif' :
                         'JetBrains Mono, monospace',
              color: styles.secondaryColor
            }}
          >
            <div 
              className="font-semibold text-lg mb-1"
              style={{ color: styles.primaryColor }}
            >
              John Doe
            </div>
            <div className="text-sm mb-2">Software Engineer</div>
            <div className="text-xs">
              This is how your resume will look with the selected styling.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
