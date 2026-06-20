import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import UploadSection from './components/UploadSection'
import ResultsDashboard from './components/ResultsDashboard'

export default function App() {
  const [result, setResult] = useState(null)
  const [filename, setFilename] = useState('')

  const handleReset = () => { setResult(null); setFilename('') }

  return (
    <div className="min-h-screen bg-slate-900">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }
      }} />

      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-xl">🎯</div>
          <div>
            <h1 className="text-xl font-bold text-white">Intelligent Resume Analyzer</h1>
            <p className="text-xs text-slate-400">ATS Scoring · Skills Extraction · AI-Powered Insights</p>
          </div>
          {result && (
            <button onClick={handleReset}
              className="ml-auto bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition">
              ← Analyze Another
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {!result ? (
          <UploadSection onResult={(data, name) => { setResult(data); setFilename(name) }} />
        ) : (
          <ResultsDashboard analysis={result} filename={filename} />
        )}
      </main>
    </div>
  )
}
