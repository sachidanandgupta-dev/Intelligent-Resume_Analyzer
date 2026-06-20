import { useState } from 'react'

const ScoreRing = ({ score, size = 120, color = '#7c3aed' }) => {
  const r = 45
  const circ = 2 * Math.PI * r
  const pct = (score / 100) * circ

  const getColor = (s) => {
    if (s >= 80) return '#22c55e'
    if (s >= 60) return '#f59e0b'
    return '#ef4444'
  }
  const c = color === 'auto' ? getColor(score) : color

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={c} strokeWidth="10"
        strokeDasharray={`${pct} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="50" y="50" textAnchor="middle" dy="0.35em" fill="white"
        fontSize="18" fontWeight="bold">{score}</text>
    </svg>
  )
}

const Badge = ({ label, color = 'slate' }) => {
  const colors = {
    blue: 'bg-blue-900/40 text-blue-300 border-blue-800',
    green: 'bg-green-900/40 text-green-300 border-green-800',
    violet: 'bg-violet-900/40 text-violet-300 border-violet-800',
    amber: 'bg-amber-900/40 text-amber-300 border-amber-800',
    slate: 'bg-slate-700/60 text-slate-300 border-slate-600',
    red: 'bg-red-900/40 text-red-300 border-red-800',
  }
  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium ${colors[color]}`}>
      {label}
    </span>
  )
}

const ProgressBar = ({ label, value, max = 25, color = 'violet' }) => {
  const pct = Math.round((value / max) * 100)
  const colors = {
    violet: 'bg-violet-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
  }
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-medium">{value}/{max}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${colors[color]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function ResultsDashboard({ analysis, filename }) {
  const [tab, setTab] = useState('overview')
  const a = analysis

  const verdictColor = {
    'Strong Candidate': 'text-green-400 bg-green-900/30 border-green-700',
    'Good Candidate': 'text-blue-400 bg-blue-900/30 border-blue-700',
    'Needs Improvement': 'text-amber-400 bg-amber-900/30 border-amber-700',
    'Not Recommended': 'text-red-400 bg-red-900/30 border-red-700',
  }[a.overall_verdict] || 'text-slate-300 bg-slate-800 border-slate-600'

  const tabs = ['overview', 'skills', 'projects', 'improvements', 'details']

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-wrap items-center gap-5">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Analyzed File</p>
          <p className="text-white font-semibold">{filename}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Candidate</p>
          <p className="text-white font-semibold">{a.candidate_info?.name || 'Unknown'}</p>
        </div>
        {a.candidate_info?.email && (
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Email</p>
            <p className="text-white text-sm">{a.candidate_info.email}</p>
          </div>
        )}
        <div className="ml-auto">
          <span className={`text-sm font-semibold px-4 py-2 rounded-xl border ${verdictColor}`}>
            {a.overall_verdict}
          </span>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col items-center">
          <ScoreRing score={a.ats_score} color="auto" />
          <p className="text-sm font-semibold text-slate-200 mt-3">ATS Score</p>
          <p className="text-xs text-slate-500">Overall Rating</p>
        </div>
        {a.ats_score_breakdown && Object.entries(a.ats_score_breakdown).map(([key, val]) => (
          <div key={key} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col justify-center">
            <div className="text-2xl font-bold text-violet-400 mb-1">{val}<span className="text-slate-500 text-base">/25</span></div>
            <p className="text-xs text-slate-300 capitalize">{key.replace(/_/g, ' ')}</p>
            <div className="h-1.5 bg-slate-700 rounded-full mt-2">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(val / 25) * 100}%` }} />
            </div>
          </div>
        ))}
        {a.job_match_score !== null && a.job_match_score !== undefined && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col items-center">
            <ScoreRing score={a.job_match_score} color="#3b82f6" />
            <p className="text-sm font-semibold text-slate-200 mt-3">JD Match</p>
            <p className="text-xs text-slate-500">Role Fit Score</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {a.summary && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">📝 AI Summary</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{a.summary}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-0">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition capitalize
              ${tab === t ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Strengths */}
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-3">✅ Strengths</h3>
                <ul className="space-y-2">
                  {(a.strengths || []).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-green-400 mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Weaknesses */}
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-3">⚠️ Weaknesses</h3>
                <ul className="space-y-2">
                  {(a.weaknesses || []).map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-red-400 mt-0.5">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Experience */}
            {a.experience_summary && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">💼 Experience Highlights</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(a.experience_summary.roles || []).map((r, i) => <Badge key={i} label={r} color="blue" />)}
                </div>
                <ul className="space-y-1">
                  {(a.experience_summary.highlights || []).map((h, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">→</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {a.missing_keywords?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-amber-400 mb-3">🔍 Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {a.missing_keywords.map((k, i) => <Badge key={i} label={k} color="amber" />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SKILLS */}
        {tab === 'skills' && (
          <div className="space-y-5">
            {[
              { key: 'technical', label: '⚙️ Technical Skills', color: 'violet' },
              { key: 'tools', label: '🛠️ Tools & Platforms', color: 'blue' },
              { key: 'languages', label: '💻 Programming Languages', color: 'green' },
              { key: 'soft', label: '🤝 Soft Skills', color: 'amber' },
            ].map(({ key, label, color }) => (
              a.skills?.[key]?.length > 0 && (
                <div key={key}>
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">{label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {a.skills[key].map((s, i) => <Badge key={i} label={s} color={color} />)}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* PROJECTS */}
        {tab === 'projects' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-1">🚀 Projects Detected</h3>
            {(a.projects || []).map((p, i) => (
              <div key={i} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <p className="font-semibold text-white mb-1">{p.name}</p>
                <p className="text-sm text-slate-400 mb-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(p.tech_stack || []).map((t, j) => <Badge key={j} label={t} color="violet" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* IMPROVEMENTS */}
        {tab === 'improvements' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-1">💡 Prioritized Improvement Suggestions</h3>
            {(a.improvements || []).map((imp, i) => {
              const colors = { HIGH: 'border-red-700 bg-red-900/20', MEDIUM: 'border-amber-700 bg-amber-900/20', LOW: 'border-blue-700 bg-blue-900/20' }
              const tagColors = { HIGH: 'text-red-400', MEDIUM: 'text-amber-400', LOW: 'text-blue-400' }
              return (
                <div key={i} className={`rounded-xl p-4 border ${colors[imp.priority] || 'border-slate-600 bg-slate-700/30'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${tagColors[imp.priority]}`}>{imp.priority}</span>
                    <span className="text-slate-300 text-sm font-medium">{imp.area}</span>
                  </div>
                  <p className="text-sm text-slate-300">{imp.suggestion}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* DETAILS */}
        {tab === 'details' && (
          <div className="space-y-5">
            {/* Education */}
            {a.education?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">🎓 Education</h3>
                {a.education.map((e, i) => (
                  <div key={i} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 mb-2">
                    <p className="text-white font-medium">{e.degree}</p>
                    <p className="text-slate-400 text-sm">{e.institution} · {e.year}</p>
                    {e.gpa && <p className="text-slate-500 text-xs mt-0.5">GPA: {e.gpa}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {a.certifications?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-3">📜 Certifications</h3>
                <ul className="space-y-1">
                  {a.certifications.map((c, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                      <span className="text-violet-400">✓</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">📇 Contact Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(a.candidate_info || {}).filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-slate-500 capitalize">{k}: </span>
                    <span className="text-slate-300">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* JD Match Analysis */}
            {a.job_match_analysis && (
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-2">📊 Job Match Analysis</h3>
                <p className="text-sm text-slate-300 bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                  {a.job_match_analysis}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
