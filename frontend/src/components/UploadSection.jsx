import { useState, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function UploadSection({ onResult }) {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f.name.endsWith('.pdf')) { toast.error('Only PDF files!'); return }
    setFile(f)
  }

  const handleSubmit = async () => {
    if (!file) { toast.error('Please upload a resume PDF.'); return }
    setLoading(true)
    setStep('Extracting resume text...')

    const formData = new FormData()
    formData.append('file', file)
    if (jd.trim()) formData.append('job_description', jd.trim())

    try {
      setStep('Claude AI is analyzing your resume...')
      const res = await axios.post('/api/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Analysis complete!')
      onResult(res.data.analysis, res.data.filename)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed!')
    } finally {
      setLoading(false)
      setStep('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Analyze Your Resume</h2>
        <p className="text-slate-400">Get ATS score, skill extraction, and AI-powered improvement suggestions</p>
      </div>

      {/* PDF Upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        onClick={() => !loading && fileRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all text-center
          ${dragging ? 'border-violet-400 bg-violet-900/20' : file ? 'border-green-500 bg-green-900/10' : 'border-slate-600 bg-slate-800 hover:border-violet-500'}
          ${loading ? 'cursor-not-allowed' : ''}`}
      >
        <input ref={fileRef} type="file" accept=".pdf" className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />

        {file ? (
          <>
            <div className="text-4xl mb-3">✅</div>
            <p className="text-green-400 font-semibold">{file.name}</p>
            <p className="text-slate-400 text-sm mt-1">Click to change file</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">📄</div>
            <p className="text-slate-200 font-semibold text-lg">Drop your Resume PDF here</p>
            <p className="text-slate-400 text-sm mt-1">or click to browse</p>
          </>
        )}
      </div>

      {/* Job Description (Optional) */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Job Description <span className="text-slate-500 font-normal">(optional — for match scoring)</span>
        </label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the job description here to get a match score and keyword gap analysis..."
          rows={4}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 transition resize-none"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {step}
          </span>
        ) : '🔍 Analyze Resume'}
      </button>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {[
          { icon: '🎯', label: 'ATS Score', desc: 'Keyword & formatting analysis' },
          { icon: '🧠', label: 'Skill Extraction', desc: 'Technical, soft, tools & languages' },
          { icon: '💡', label: 'AI Suggestions', desc: 'Prioritized improvement tips' },
          { icon: '📊', label: 'JD Match Score', desc: 'How well you fit the role' },
        ].map(f => (
          <div key={f.label} className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="text-sm font-medium text-white">{f.label}</p>
              <p className="text-xs text-slate-400">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
