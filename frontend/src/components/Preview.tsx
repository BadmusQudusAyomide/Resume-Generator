import { useResume } from '../contexts/ResumeContext'
import { FileText, Download, Share2 } from 'lucide-react'
import ModernTemplate from '../templates/ModernTemplate'

export default function Preview() {
  const { currentResume } = useResume()

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No resume data to preview</p>
          <p className="text-sm text-gray-400 mt-2">
            Start editing to see your resume come to life
          </p>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    // TODO: Implement PDF download functionality
    console.log('Download resume as PDF')
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share resume')
  }

  return (
    <div className="space-y-4">
      {/* Preview Actions */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-600">Resume Preview</h4>
        <div className="flex space-x-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors text-gray-600 hover:text-gray-800"
            title="Share Resume"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors text-gray-600 hover:text-gray-800"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="preview-container bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="transform scale-75 origin-top-left" style={{ width: '133.33%', height: '133.33%' }}>
          <ModernTemplate 
            data={currentResume.data} 
            styles={currentResume.styles} 
          />
        </div>
      </div>

      {/* Preview Info */}
      <div className="text-xs text-gray-500 text-center">
        Preview is scaled to fit. Actual size will be used for download.
      </div>
    </div>
  )
}
