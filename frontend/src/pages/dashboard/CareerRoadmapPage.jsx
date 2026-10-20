import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight, Clock3, ExternalLink, LoaderCircle, Map, Plus, Target, X } from 'lucide-react'
import api from '@/services/api.js'

export function CareerRoadmapPage() {
  const [paths, setPaths] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [roadmap, setRoadmap] = useState(null)
  const [expanded, setExpanded] = useState({})
  const [loadingList, setLoadingList] = useState(true)
  const [loadingRoadmap, setLoadingRoadmap] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState('')
  const [listFailed, setListFailed] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [createRole, setCreateRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('beginner')
  const [currentSkills, setCurrentSkills] = useState('')
  const [learningGoal, setLearningGoal] = useState('')
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)
  const requestVersion = useRef(0)

  const fetchPaths = useCallback(() => {
    setLoadingList(true)
    setListFailed(false)
    let active = true
    api.get('/career-roadmaps').then(({ data }) => {
      if (!active) return
      const available = data.data?.roadmaps || []
      setPaths(available)
      setSelectedId(current => current || available[0]?.id || '')
      setError('')
    }).catch((requestError) => { if (active) { setListFailed(true); setError(requestError.response?.data?.message === 'Route not found' ? 'The Career Roadmap API route was not found. Restart the backend server so it loads the current routes, then retry.' : 'Career paths could not be loaded. Check your connection and try again.') } }).finally(() => { if (active) setLoadingList(false) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    let cleanup
    Promise.resolve().then(() => { cleanup = fetchPaths() })
    return () => cleanup?.()
  }, [fetchPaths])

  const loadRoadmap = useCallback(async (id) => {
    if (!id) return
    const version = ++requestVersion.current
    setLoadingRoadmap(true)
    setError('')
    try {
      const { data } = await api.get(`/career-roadmaps/${id}`)
      if (version === requestVersion.current && data.data?.roadmap?.id === id) {
        setRoadmap(data.data.roadmap)
        setExpanded({ 0: true })
      }
    } catch (requestError) { if (version === requestVersion.current) { setRoadmap(null); setError(requestError.response?.data?.message === 'Route not found' ? 'This roadmap API route was not found. Restart the backend server and retry.' : 'This roadmap could not be loaded. Please try again.') } }
    finally { if (version === requestVersion.current) setLoadingRoadmap(false) }
  }, [])

  useEffect(() => {
    if (!selectedId) return
    let active = true
    const version = ++requestVersion.current
    Promise.resolve().then(async () => {
      if (active) setLoadingRoadmap(true)
      setError('')
      try {
        const { data } = await api.get(`/career-roadmaps/${selectedId}`)
        if (active && version === requestVersion.current && data.data?.roadmap?.id === selectedId) {
          setRoadmap(data.data.roadmap)
          setExpanded({ 0: true })
        }
      } catch (requestError) { if (active && version === requestVersion.current) { setRoadmap(null); setError(requestError.response?.data?.message === 'Route not found' ? 'This roadmap API route was not found. Restart the backend server and retry.' : 'This roadmap could not be loaded. Please try again.') } }
      finally { if (active && version === requestVersion.current) setLoadingRoadmap(false) }
    })
    return () => { active = false }
  }, [selectedId])

  async function toggleTopic(topicId, completed) {
    if (!roadmap || saving) return
    setSaving(topicId)
    try {
      const { data } = await api.patch(`/career-roadmaps/${roadmap.id}/topics`, { topicId, completed })
      const updated = data.data?.roadmap
      if (updated?.id === roadmap.id && selectedId === roadmap.id) {
        setRoadmap(updated)
        setPaths(current => current.map(path => path.id === updated.id ? { ...path, progress: updated.progress, started: true } : path))
      }
    } catch { setError('Progress could not be saved. Please try again.') }
    finally { setSaving('') }
  }

  async function createRoadmap(event) {
    event.preventDefault()
    if (!createRole || creating) return
    setCreating(true)
    setCreateError('')
    try {
      await api.post(`/career-roadmaps/${createRole}/start`, { experienceLevel, currentSkills, learningGoal })
      setPaths(current => current.map(path => path.id === createRole ? { ...path, started: true } : path))
      setSelectedId(createRole)
      setCreateOpen(false)
    } catch (requestError) {
      setCreateError(requestError.response?.data?.message || 'Could not save your roadmap. Please try again.')
    } finally { setCreating(false) }
  }

  const card = 'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]'
  return <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <header className="mb-7">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-primary)]">CAREER ROADMAP</p>
      <h1 className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">A clear path to your next role</h1>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><p className="max-w-2xl text-sm leading-6 text-[var(--color-muted)]">Choose a career track, work through topics in order, and keep your learning progress saved to your account.</p><button onClick={() => { setCreateRole(selectedId || paths[0]?.id || ''); setCreateOpen(true); setCreateError('') }} disabled={loadingList || paths.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17}/>Create My Roadmap</button></div>
    </header>

    {error && <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500"><AlertCircle size={18}/>{error}<button className="ml-auto underline" onClick={() => listFailed ? fetchPaths() : selectedId ? loadRoadmap(selectedId) : fetchPaths()}>Retry</button></div>}
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className={`${card} h-fit p-4`}>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]"><Map size={16} className="text-[var(--color-primary)]"/>Career tracks</h2>
        {loadingList ? <div className="flex items-center gap-2 p-3 text-sm text-[var(--color-muted)]"><LoaderCircle className="animate-spin" size={16}/>Loading paths…</div> : listFailed ? <div className="p-3 text-sm text-[var(--color-muted)]">Career paths are temporarily unavailable. Use Retry above.</div> : paths.length === 0 ? <p className="p-3 text-sm text-[var(--color-muted)]">No career paths are available yet.</p> : <div className="space-y-1">{paths.map(path => <button key={path.id} onClick={() => { setError(''); setSelectedId(path.id) }} className={`w-full rounded-xl p-3 text-left transition ${selectedId === path.id ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'}`}>
          <span className="block text-sm font-semibold">{path.title}</span><span className="mt-1 block text-xs text-[var(--color-muted)]">{path.difficulty} · {path.stageCount} stages · {path.started ? `${path.progress}% complete` : path.estimatedDuration}</span><span className="mt-1 block text-xs leading-5 text-[var(--color-muted)]">{path.description}</span>
        </button>)}</div>}
      </aside>

      <section className="min-w-0">
        {loadingRoadmap ? <div className={`${card} flex min-h-64 items-center justify-center gap-2 text-sm text-[var(--color-muted)]`}><LoaderCircle className="animate-spin" size={18}/>Loading roadmap…</div> : roadmap && <>
          <div className={`${card} mb-5 p-5 sm:p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4"><div><span className="mb-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]"><Target size={13}/>{roadmap.difficulty}</span><h2 className="text-2xl font-black text-[var(--color-text)]">{roadmap.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">{roadmap.description}</p></div><div className="flex items-center gap-2 text-sm text-[var(--color-muted)]"><Clock3 size={16}/>{roadmap.estimatedDuration}</div></div>
            <div className="mt-5"><div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-[var(--color-text)]">Overall progress</span><span className="text-[var(--color-muted)]">{roadmap.completedTopics} of {roadmap.totalTopics} topics · {roadmap.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--progress-track)]"><div className="h-full rounded-full bg-[var(--color-primary)] transition-all" style={{ width: `${roadmap.progress}%` }}/></div></div>
          </div>
          <div className="space-y-3">{roadmap.stages.map(stage => <article key={stage.order} className={`${card} overflow-hidden`}>
            <button className="flex w-full items-center gap-3 p-4 text-left sm:p-5" onClick={() => setExpanded(current => ({ ...current, [stage.order - 1]: !current[stage.order - 1] }))} aria-expanded={Boolean(expanded[stage.order - 1])}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-sm font-bold text-[var(--color-primary)]">{stage.status === 'completed' ? <Check size={17}/> : stage.order}</span><span className="min-w-0 flex-1"><span className="block font-bold text-[var(--color-text)]">{stage.title}</span><span className="mt-1 block text-xs text-[var(--color-muted)]">{stage.completedTopics}/{stage.totalTopics} topics · {stage.progress}%</span></span>{expanded[stage.order - 1] ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}</button>
            {expanded[stage.order - 1] && <div className="border-t border-[var(--color-border)] px-4 pb-4 sm:px-5"><p className="py-4 text-sm leading-6 text-[var(--color-muted)]">{stage.description}</p>
              {stage.topics.map(topic => <div key={topic.id} className="mb-3 rounded-xl border border-[var(--color-border)] p-4">
                <div className="flex items-start gap-3"><button onClick={() => toggleTopic(topic.id, !topic.completed)} disabled={Boolean(saving)} aria-label={`${topic.completed ? 'Mark incomplete' : 'Mark complete'}: ${topic.title}`} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${topic.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'} disabled:opacity-50`}>{saving === topic.id ? <LoaderCircle size={13} className="animate-spin"/> : topic.completed && <Check size={14}/>}</button>
                  <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><h3 className={`text-sm font-bold ${topic.completed ? 'text-[var(--color-muted)] line-through' : 'text-[var(--color-text)]'}`}>{topic.title}</h3><span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-muted)]"><Clock3 size={12}/>{Math.round(topic.estimatedMinutes / 60 * 10) / 10}h</span></div><p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{topic.description}</p>{topic.keyConcepts?.length > 0 && <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]"><strong className="text-[var(--color-text)]">Key concepts:</strong> {topic.keyConcepts.join(' · ')}</p>}<p className="mt-2 text-xs leading-5 text-[var(--color-text)]"><strong>Why it matters:</strong> {topic.why}</p><p className="mt-2 flex gap-1.5 text-xs leading-5 text-[var(--color-muted)]"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--color-primary)]"/><span><strong>Try this:</strong> {topic.task}</span></p>
                    {topic.resources?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{topic.resources.map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"><BookOpen size={13}/>{resource.label}<ExternalLink size={11}/></a>)}</div>}
                  </div></div>
              </div>)}
              {stage.project && <div className="rounded-xl bg-[var(--color-primary)]/5 p-4"><p className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]">Stage project</p><p className="mt-1 text-sm leading-6 text-[var(--color-text)]">{stage.project}</p><p className="mt-2 text-xs font-semibold text-[var(--color-muted)]">Completion: {stage.completionCriteria}</p></div>}
            </div>}
          </article>)}</div>
        </>}
      </section>
    </div>
    {createOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !creating) setCreateOpen(false) }}>
      <section role="dialog" aria-modal="true" aria-labelledby="create-roadmap-title" className="my-auto w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-2xl sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">GET STARTED</p><h2 id="create-roadmap-title" className="mt-1 text-xl font-black text-[var(--color-text)]">Create your roadmap</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Choose a curated career path and save it to your account.</p></div><button aria-label="Close dialog" disabled={creating} onClick={() => setCreateOpen(false)} className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]"><X size={18}/></button></div>
        <form onSubmit={createRoadmap} className="space-y-4">
          <label className="block text-sm font-semibold text-[var(--color-text)]">Target career path<select required value={createRole} onChange={event => setCreateRole(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 font-normal"><option value="">Choose a career path</option>{paths.map(path => <option key={path.id} value={path.id}>{path.title}</option>)}</select></label>
          <label className="block text-sm font-semibold text-[var(--color-text)]">Experience level<select required value={experienceLevel} onChange={event => setExperienceLevel(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 font-normal"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
          <label className="block text-sm font-semibold text-[var(--color-text)]">Current skills <span className="font-normal text-[var(--color-muted)]">(optional)</span><textarea maxLength={2000} rows={2} value={currentSkills} onChange={event => setCurrentSkills(event.target.value)} placeholder="e.g. HTML, CSS, JavaScript" className="mt-1.5 w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 font-normal placeholder:text-[var(--color-muted)]"/></label>
          <label className="block text-sm font-semibold text-[var(--color-text)]">Learning goal <span className="font-normal text-[var(--color-muted)]">(optional)</span><textarea maxLength={1000} rows={2} value={learningGoal} onChange={event => setLearningGoal(event.target.value)} placeholder="What do you want to be able to build?" className="mt-1.5 w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 font-normal placeholder:text-[var(--color-muted)]"/></label>
          {createError && <p role="alert" className="flex items-center gap-2 text-sm text-red-500"><AlertCircle size={16}/>{createError}</p>}
          <div className="flex justify-end gap-2 pt-1"><button type="button" disabled={creating} onClick={() => setCreateOpen(false)} className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)]">Cancel</button><button type="submit" disabled={creating || !createRole} className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{creating && <LoaderCircle size={16} className="animate-spin"/>}{creating ? 'Saving…' : 'Create roadmap'}</button></div>
        </form>
      </section>
    </div>}
  </main>
}
