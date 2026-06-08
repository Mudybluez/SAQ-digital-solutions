import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Edit2, LogOut, Check, AlertCircle, Eye, RefreshCw } from 'lucide-react'
import { useContent } from '../context/ContentContext'

const PREDEFINED_TECHS = [
  // Frontend
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'Vue.js', color: '#4FC08D' },
  { name: 'Nuxt.js', color: '#00DC82' },
  { name: 'Angular', color: '#DD0031' },
  { name: 'Svelte', color: '#FF3E00' },
  { name: 'SolidJS', color: '#446B9E' },
  { name: 'Astro', color: '#FF5D01' },
  { name: 'HTML5', color: '#E34F26' },
  { name: 'CSS3', color: '#1572B6' },
  { name: 'Tailwind CSS', color: '#38BDF8' },
  { name: 'Sass', color: '#CC6699' },
  { name: 'Bootstrap', color: '#7952B3' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Webpack', color: '#8DD6F9' },
  { name: 'Vite', color: '#646CFF' },
  { name: 'Redux', color: '#764ABC' },
  { name: 'Pinia', color: '#FFE066' },

  // Backend
  { name: 'Node.js', color: '#339933' },
  { name: 'Express', color: '#FFFFFF' },
  { name: 'NestJS', color: '#E0234E' },
  { name: 'Python', color: '#3776AB' },
  { name: 'Django', color: '#092E20' },
  { name: 'FastAPI', color: '#009688' },
  { name: 'Flask', color: '#FFFFFF' },
  { name: 'Ruby', color: '#CC342D' },
  { name: 'Ruby on Rails', color: '#CC0000' },
  { name: 'Go', color: '#00ADD8' },
  { name: 'Rust', color: '#000000' },
  { name: 'PHP', color: '#777BB4' },
  { name: 'Laravel', color: '#FF2D20' },
  { name: 'Java', color: '#007396' },
  { name: 'Spring Boot', color: '#6DB33F' },
  { name: 'C#', color: '#239120' },
  { name: '.NET Core', color: '#512BD4' },

  // Databases & Cache
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'MySQL', color: '#4479A1' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Redis', color: '#DC382D' },
  { name: 'SQLite', color: '#003B57' },
  { name: 'Firebase', color: '#FFCA28' },
  { name: 'Supabase', color: '#3ECF8E' },
  { name: 'Prisma', color: '#2D3748' },

  // DevOps & Infrastructure
  { name: 'Docker', color: '#2496ED' },
  { name: 'Kubernetes', color: '#326CE5' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Google Cloud', color: '#4285F4' },
  { name: 'Vercel', color: '#FFFFFF' },
  { name: 'Netlify', color: '#00C8C8' },
  { name: 'Heroku', color: '#430098' },
  { name: 'Nginx', color: '#009639' },
  { name: 'Git', color: '#F05032' },
  { name: 'GitHub Actions', color: '#2088FF' },

  // Integrations & Automation
  { name: 'Telegram', color: '#26A5E4' },
  { name: 'n8n', color: '#E8951A' },
  { name: 'Make', color: '#FF6D00' },
  { name: 'Zapier', color: '#FF4A00' },
  { name: 'GraphQL', color: '#E10098' },
  { name: 'WebSockets', color: '#F8B41E' },
  { name: 'Stripe', color: '#008CDD' },
  { name: 'Halyk Bank', color: '#00A859' },
  { name: 'Kaspi', color: '#F14635' }
]

export default function AdminPage() {
  const navigate = useNavigate()
  const { homepageContent, privacyContent, refreshContent } = useContent()

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Navigation State
  const [activeTab, setActiveTab] = useState('leads') // leads | portfolio | home_cms | privacy_cms

  // Data States
  const [leads, setLeads] = useState([])
  const [projects, setProjects] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [projectsLoading, setProjectsLoading] = useState(false)

  // CMS Form States
  const [homeForm, setHomeForm] = useState(null)
  const [privacyForm, setPrivacyForm] = useState(null)
  const [cmsStatus, setCmsStatus] = useState({ success: '', error: '' })
  const [customTechName, setCustomTechName] = useState('')
  const [customTechColor, setCustomTechColor] = useState('#C4862A')

  // Portfolio Form State (for Create/Edit)
  const [editingProject, setEditingProject] = useState(null) // null or project object
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [projectFormError, setProjectFormError] = useState('')
  const [projectFormSuccess, setProjectFormSuccess] = useState('')

  // Check login on load
  useEffect(() => {
    const savedPass = sessionStorage.getItem('admin_password')
    const savedTime = sessionStorage.getItem('admin_login_time')
    if (savedPass && savedTime && (Date.now() - Number(savedTime) < 60 * 60 * 1000)) {
      setIsAuthenticated(true)
    }
  }, [])

  // Load active tab data
  useEffect(() => {
    if (!isAuthenticated) return

    if (activeTab === 'leads') {
      loadLeads()
    } else if (activeTab === 'portfolio') {
      loadProjects()
    } else if (activeTab === 'home_cms') {
      // Clone homepageContent to edit locally
      setHomeForm(JSON.parse(JSON.stringify(homepageContent)))
    } else if (activeTab === 'privacy_cms') {
      setPrivacyForm(JSON.parse(JSON.stringify(privacyContent)))
    }
    setCmsStatus({ success: '', error: '' })
  }, [isAuthenticated, activeTab, homepageContent, privacyContent])

  // Custom fetch with auth headers
  const authFetch = async (url, options = {}) => {
    const pass = password || sessionStorage.getItem('admin_password')
    if (!options.headers) options.headers = {}
    options.headers['Authorization'] = 'Basic ' + btoa('admin:' + pass)
    
    const res = await fetch(url, options)
    if (res.status === 401) {
      handleLogout()
      throw new Error('Сессия истекла. Войдите заново.')
    }
    return res
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setAuthLoading(true)

    try {
      // Test password against leads list endpoint
      const res = await fetch('/api/lead/list', {
        headers: { 'Authorization': 'Basic ' + btoa('admin:' + password) }
      })

      if (!res.ok) {
        throw new Error('Неверный пароль администратора')
      }

      sessionStorage.setItem('admin_password', password)
      sessionStorage.setItem('admin_login_time', String(Date.now()))
      setIsAuthenticated(true)
    } catch (err) {
      setLoginError(err.message || 'Ошибка входа')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_password')
    sessionStorage.removeItem('admin_login_time')
    setIsAuthenticated(false)
    setPassword('')
  }

  // Leads Actions
  const loadLeads = async () => {
    setLeadsLoading(true)
    try {
      const res = await authFetch('/api/lead/list')
      const data = await res.json()
      if (data.ok) {
        setLeads(data.leads)
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLeadsLoading(false)
    }
  }

  // Projects Actions
  const loadProjects = async () => {
    setProjectsLoading(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.ok) {
        setProjects(data.projects)
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setProjectsLoading(false)
    }
  }

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Вы действительно хотите удалить этот кейс?')) return
    try {
      const res = await authFetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Ошибка удаления')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  // Project Form handlers
  const openProjectForm = (project = null) => {
    setProjectFormError('')
    setProjectFormSuccess('')
    if (project) {
      setEditingProject({
        ...project,
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
        solution_points: Array.isArray(project.solution_points) ? project.solution_points.join('\n') : '',
        results: Array.isArray(project.results) 
          ? project.results.map(r => `${r.num} = ${r.lbl}`).join('\n')
          : '',
        screens: Array.isArray(project.screens) ? [...project.screens] : [],
        // Make sure stats/facts exist
        facts_type: project.facts?.['Тип'] || '',
        facts_engine: project.facts?.['AI-движок'] || project.facts?.['Движок'] || '',
        facts_tech: project.facts?.['Технологии'] || '',
        facts_arch: project.facts?.['Архитектура'] || '',
      })
    } else {
      setEditingProject({
        title: '', slug: '', category: 'Web App', description: '', image: '', link: '',
        overview: '', challenge: '', solution: '',
        tags: '', solution_points: '', results: '', screens: [],
        results_title: 'Результаты',
        facts_type: '', facts_engine: '', facts_tech: '', facts_arch: ''
      })
    }
    setIsProjectFormOpen(true)
  }

  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    setProjectFormError('')
    setProjectFormSuccess('')

    // Prepare payload
    const tagsArr = editingProject.tags.split(',').map(t => t.trim().toUpperCase()).filter(Boolean)
    const pointsArr = editingProject.solution_points.split('\n').map(p => p.trim()).filter(Boolean)
    const screensArr = Array.isArray(editingProject.screens) ? editingProject.screens : []
    const resultsArr = editingProject.results.split('\n').map(line => {
      const parts = line.split('=')
      if (parts.length >= 2) {
        return { num: parts[0].trim(), lbl: parts.slice(1).join('=').trim() }
      }
      return null
    }).filter(Boolean)

    const factsObj = {}
    if (editingProject.facts_type) factsObj['Тип'] = editingProject.facts_type.trim()
    if (editingProject.facts_engine) factsObj['AI-движок'] = editingProject.facts_engine.trim()
    if (editingProject.facts_tech) factsObj['Технологии'] = editingProject.facts_tech.trim()
    if (editingProject.facts_arch) factsObj['Архитектура'] = editingProject.facts_arch.trim()

    const payload = {
      title: editingProject.title.trim(),
      slug: editingProject.slug.trim(),
      category: editingProject.category.trim(),
      description: editingProject.description.trim(),
      image: editingProject.image.trim(),
      link: editingProject.link ? editingProject.link.trim() : null,
      overview: editingProject.overview.trim(),
      challenge: editingProject.challenge.trim(),
      solution: editingProject.solution.trim(),
      results_title: editingProject.results_title.trim(),
      tags: tagsArr,
      solution_points: pointsArr,
      results: resultsArr,
      screens: screensArr,
      facts: factsObj
    }

    try {
      let res
      if (editingProject.id) {
        res = await authFetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await authFetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      const data = await res.json()
      if (res.ok && data.ok) {
        setProjectFormSuccess('Кейс успешно сохранен!')
        setTimeout(() => {
          setIsProjectFormOpen(false)
          loadProjects()
        }, 1200)
      } else {
        throw new Error(data.error || 'Ошибка валидации')
      }
    } catch (err) {
      setProjectFormError(err.message)
    }
  }

  // File Upload helper
  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await authFetch('/api/projects/upload-image', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Ошибка при загрузке файла')
    }
    return data.url
  }

  // Cover image upload handler
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const url = await uploadFile(file)
      setEditingProject(p => ({ ...p, image: url }))
    } catch (err) {
      alert(err.message)
    }
  }

  // Screenshots upload handler (multiple files supported)
  const handleScreenshotUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    try {
      const uploadPromises = files.map(file => uploadFile(file))
      const urls = await Promise.all(uploadPromises)
      setEditingProject(p => ({
        ...p,
        screens: [...(p.screens || []), ...urls]
      }))
    } catch (err) {
      alert(err.message)
    }
  }

  // Settings / CMS saving
  const handleSaveCMS = async (key, val) => {
    setCmsStatus({ success: '', error: '' })
    try {
      const res = await authFetch(`/api/projects/settings/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: val })
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setCmsStatus({ success: 'Контент успешно обновлен!', error: '' })
        refreshContent() // Immediately load updated site content
      } else {
        throw new Error(data.error || 'Ошибка сохранения')
      }
    } catch (err) {
      setCmsStatus({ success: '', error: err.message })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6 font-body">
        <div className="w-full max-w-[420px] bg-navy-2 border border-gold/15 p-8 rounded-none shadow-2xl">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="SAQ Logo" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="font-head font-[800] text-2xl text-gold uppercase tracking-[1px]">SAQ Creative Agency</h1>
            <p className="text-xs text-muted font-mono tracking-[2px] mt-1">Панель управления</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-semibold tracking-[3px] uppercase text-muted mb-2">
                Пароль администратора
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль..."
                className="w-full bg-navy border border-white/10 px-4 py-3 text-ink focus:outline-none focus:border-gold transition-colors font-mono"
                required
              />
              {loginError && (
                <div className="flex items-center gap-2 text-red-400 text-xs mt-2 font-mono">
                  <AlertCircle size={14} />
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gold hover:bg-gold-glow text-navy py-3.5 font-head font-[800] tracking-[-0.3px] uppercase text-sm transition-colors cursor-pointer"
            >
              {authLoading ? 'Авторизация...' : 'Войти в панель'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy text-ink font-body flex flex-col">
      {/* ── HEADER ── */}
      <header className="bg-navy-2 border-b border-gold/15 px-6 md:px-12 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="SAQ Logo" className="h-9 w-auto" />
          <div>
            <h1 className="font-head font-[800] text-xl text-gold uppercase tracking-[1px] leading-none">SAQ Control Panel</h1>
            <p className="text-[10px] text-muted font-mono tracking-[2px] mt-1">СИСТЕМА УПРАВЛЕНИЯ КОНТЕНТОМ</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/" target="_blank" className="flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-gold/30 text-xs uppercase tracking-[1.5px] transition-colors">
            <Eye size={14} /> Перейти на сайт
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 bg-red-950/30 border border-red-500/20 hover:border-red-500/50 text-red-400 text-xs uppercase tracking-[1.5px] transition-colors cursor-pointer">
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* ── SIDEBAR ── */}
        <aside className="w-full md:w-[260px] bg-navy-2 md:border-r border-gold/10 p-6 flex flex-col gap-1.5">
          <p className="text-[9px] font-bold text-muted/50 tracking-[3px] uppercase mb-2">Разделы</p>
          
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full text-left px-4 py-3 transition-all duration-200 border-l-2 uppercase tracking-[1.5px] text-xs font-semibold
              ${activeTab === 'leads' ? 'bg-gold/5 text-gold border-gold' : 'border-transparent text-muted hover:text-ink hover:bg-white/3'}`}
          >
            Заявки ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full text-left px-4 py-3 transition-all duration-200 border-l-2 uppercase tracking-[1.5px] text-xs font-semibold
              ${activeTab === 'portfolio' ? 'bg-gold/5 text-gold border-gold' : 'border-transparent text-muted hover:text-ink hover:bg-white/3'}`}
          >
            Кейсы Портфолио
          </button>

          <p className="text-[9px] font-bold text-muted/50 tracking-[3px] uppercase mt-6 mb-2">Конструктор страниц</p>

          <button
            onClick={() => setActiveTab('home_cms')}
            className={`w-full text-left px-4 py-3 transition-all duration-200 border-l-2 uppercase tracking-[1.5px] text-xs font-semibold
              ${activeTab === 'home_cms' ? 'bg-gold/5 text-gold border-gold' : 'border-transparent text-muted hover:text-ink hover:bg-white/3'}`}
          >
            Главная страница
          </button>

          <button
            onClick={() => setActiveTab('privacy_cms')}
            className={`w-full text-left px-4 py-3 transition-all duration-200 border-l-2 uppercase tracking-[1.5px] text-xs font-semibold
              ${activeTab === 'privacy_cms' ? 'bg-gold/5 text-gold border-gold' : 'border-transparent text-muted hover:text-ink hover:bg-white/3'}`}
          >
            Политика Конфиденциальности
          </button>
        </aside>

        {/* ── CONTENT AREA ── */}
        <main className="flex-1 p-6 md:p-10 bg-navy">
          {/* Status Overlay */}
          {cmsStatus.success && (
            <div className="mb-6 p-4 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
              <Check size={18} />
              <span>{cmsStatus.success}</span>
            </div>
          )}
          {cmsStatus.error && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-500/20 text-red-400 flex items-center gap-3">
              <AlertCircle size={18} />
              <span>{cmsStatus.error}</span>
            </div>
          )}

          {/* 1. LEADS TAB */}
          {activeTab === 'leads' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-head font-[800] text-3xl text-ink">Заявки клиентов</h2>
                  <p className="text-xs text-muted font-mono tracking-[1px] mt-1">Список полученных заявок через форму обратной связи</p>
                </div>
                <button onClick={loadLeads} disabled={leadsLoading} className="p-2 border border-white/10 hover:border-gold/40 text-muted hover:text-gold transition-all">
                  <RefreshCw size={16} className={leadsLoading ? 'animate-spin' : ''} />
                </button>
              </div>

              {leadsLoading ? (
                <div className="py-20 text-center text-muted font-mono">Загрузка заявок...</div>
              ) : leads.length === 0 ? (
                <div className="py-20 text-center text-muted border border-dashed border-white/5">Заявок пока нет.</div>
              ) : (
                <div className="overflow-x-auto border border-white/10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-navy-2 border-b border-white/10 text-[10px] font-bold uppercase tracking-[2px] text-muted">
                        <th className="p-4"># ID</th>
                        <th className="p-4">Дата</th>
                        <th className="p-4">Имя</th>
                        <th className="p-4">Контакты</th>
                        <th className="p-4">Тип</th>
                        <th className="p-4">Сообщение</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {leads.map(l => (
                        <tr key={l.id} className="hover:bg-white/1 transition-colors">
                          <td className="p-4 font-mono text-xs text-muted">#{l.id}</td>
                          <td className="p-4 whitespace-nowrap text-xs">{new Date(l.created_at).toLocaleString('ru-RU')}</td>
                          <td className="p-4 font-semibold text-gold">{l.name}</td>
                          <td className="p-4 font-mono text-xs">{l.contact || l.phone}</td>
                          <td className="p-4"><span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-[1px] bg-gold/10 text-gold border border-gold/15">{l.type}</span></td>
                          <td className="p-4 text-muted max-w-[320px] break-words">{l.desc || l.message || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 2. PORTFOLIO TAB */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-head font-[800] text-3xl text-ink">Кейсы портфолио</h2>
                  <p className="text-xs text-muted font-mono tracking-[1px] mt-1">Добавление, редактирование и удаление проектов</p>
                </div>
                <button
                  onClick={() => openProjectForm()}
                  className="bg-gold hover:bg-gold-glow text-navy px-5 py-3 font-head font-[800] text-xs uppercase tracking-[1px] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={16} /> Добавить кейс
                </button>
              </div>

              {/* PROJECT FORM MODAL */}
              {isProjectFormOpen && (
                <div className="mb-12 bg-navy-2 border border-gold/20 p-6 md:p-8">
                  <h3 className="font-head font-[800] text-xl text-gold mb-6 uppercase tracking-[1px]">
                    {editingProject.id ? `Редактирование кейса ID: ${editingProject.id}` : 'Создание нового кейса'}
                  </h3>

                  <form onSubmit={handleProjectSubmit} className="space-y-6">
                    {projectFormError && (
                      <div className="p-4 bg-red-950/30 border border-red-500/20 text-red-400 flex items-center gap-3">
                        <AlertCircle size={16} />
                        <span className="text-sm">{projectFormError}</span>
                      </div>
                    )}
                    {projectFormSuccess && (
                      <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 flex items-center gap-3">
                        <Check size={16} />
                        <span className="text-sm">{projectFormSuccess}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Название кейса *</label>
                        <input type="text" required value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Slug (URL индификатор) *</label>
                        <input type="text" required placeholder="zenscribe" value={editingProject.slug} onChange={e => setEditingProject({...editingProject, slug: e.target.value})} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-ink focus:outline-none focus:border-gold font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Категория *</label>
                        <select value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-ink focus:outline-none focus:border-gold">
                          <option value="Web App">Web App</option>
                          <option value="Landing Page">Landing Page</option>
                          <option value="Automation">Automation / Bots</option>
                          <option value="Brand Site">Brand Site</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Теги (через запятую) *</label>
                        <input type="text" placeholder="AI, SAAS, REACT" value={editingProject.tags} onChange={e => setEditingProject({...editingProject, tags: e.target.value})} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-ink focus:outline-none focus:border-gold font-mono" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Обложка кейса *</label>
                        <div className="flex items-start gap-4">
                          {editingProject.image && (
                            <div className="w-16 h-16 bg-navy border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                              <img src={editingProject.image} alt="Cover Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                              <input type="text" required value={editingProject.image} onChange={e => setEditingProject({...editingProject, image: e.target.value})} className="flex-1 bg-navy border border-white/10 px-4 py-2 text-xs text-ink focus:outline-none focus:border-gold font-mono" />
                              <label className="bg-navy border border-white/10 hover:border-gold px-4 py-2 text-xs text-muted hover:text-gold cursor-pointer flex items-center justify-center transition-colors">
                                Загрузить
                                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Ссылка на проект (Live Link)</label>
                        <input type="text" placeholder="https://example.com" value={editingProject.link || ''} onChange={e => setEditingProject({...editingProject, link: e.target.value})} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Краткое описание (для карточки) *</label>
                      <textarea required value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} rows={2} className="w-full bg-navy border border-white/10 p-4 text-ink focus:outline-none focus:border-gold" />
                    </div>

                    {/* DETAILS SECTIONS */}
                    <div className="border-t border-white/10 pt-6 space-y-6">
                      <h4 className="font-head text-sm text-gold uppercase tracking-[1.5px]">Характеристики (Facts)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-2">Тип</label>
                          <input type="text" placeholder="AI SaaS / Web App" value={editingProject.facts_type} onChange={e => setEditingProject({...editingProject, facts_type: e.target.value})} className="w-full bg-navy border border-white/10 px-3 py-2 text-ink text-sm focus:outline-none focus:border-gold" />
                        </div>
                        <div>
                          <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-2">AI-Движок</label>
                          <input type="text" placeholder="Gemini 2.5 Flash" value={editingProject.facts_engine} onChange={e => setEditingProject({...editingProject, facts_engine: e.target.value})} className="w-full bg-navy border border-white/10 px-3 py-2 text-ink text-sm focus:outline-none focus:border-gold" />
                        </div>
                        <div>
                          <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-2">Технологии</label>
                          <input type="text" placeholder="React, Node.js" value={editingProject.facts_tech} onChange={e => setEditingProject({...editingProject, facts_tech: e.target.value})} className="w-full bg-navy border border-white/10 px-3 py-2 text-ink text-sm focus:outline-none focus:border-gold" />
                        </div>
                        <div>
                          <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-2">Архитектура</label>
                          <input type="text" placeholder="Микросервисы" value={editingProject.facts_arch} onChange={e => setEditingProject({...editingProject, facts_arch: e.target.value})} className="w-full bg-navy border border-white/10 px-3 py-2 text-ink text-sm focus:outline-none focus:border-gold" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Обзор проекта (Overview) *</label>
                        <textarea required value={editingProject.overview} onChange={e => setEditingProject({...editingProject, overview: e.target.value})} rows={5} className="w-full bg-navy border border-white/10 p-4 text-ink text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Проблема (Challenge) *</label>
                        <textarea required value={editingProject.challenge} onChange={e => setEditingProject({...editingProject, challenge: e.target.value})} rows={5} className="w-full bg-navy border border-white/10 p-4 text-ink text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Решение (Solution) *</label>
                      <textarea required value={editingProject.solution} onChange={e => setEditingProject({...editingProject, solution: e.target.value})} rows={3} className="w-full bg-navy border border-white/10 p-4 text-ink text-sm focus:outline-none focus:border-gold" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-2">Ключевые фичи решения (по одной строке)</label>
                        <textarea rows={5} placeholder="Интеграция с API&#10;Оплата Kaspi" value={editingProject.solution_points} onChange={e => setEditingProject({...editingProject, solution_points: e.target.value})} className="w-full bg-navy border border-white/10 p-4 text-ink text-sm focus:outline-none focus:border-gold font-mono" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted">Показатели/Результаты (по одной строке: Число = Описание)</label>
                          <input type="text" placeholder="Заголовок результатов" value={editingProject.results_title} onChange={e => setEditingProject({...editingProject, results_title: e.target.value})} className="bg-navy border border-white/10 text-xs px-2 py-1 text-gold max-w-[150px] focus:outline-none focus:border-gold" />
                        </div>
                        <textarea rows={5} placeholder="3 языка = EN, RU, KZ&#10;60 000+ = слов сгенерировано" value={editingProject.results} onChange={e => setEditingProject({...editingProject, results: e.target.value})} className="w-full bg-navy border border-white/10 p-4 text-ink text-sm focus:outline-none focus:border-gold font-mono" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold tracking-[2px] uppercase text-muted mb-3">
                        Скриншоты проекта ({editingProject.screens ? editingProject.screens.length : 0})
                      </label>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {editingProject.screens && editingProject.screens.map((src, idx) => (
                          <div key={idx} className="relative group aspect-video bg-navy border border-white/10 overflow-hidden flex items-center justify-center">
                            <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProject(p => ({
                                    ...p,
                                    screens: p.screens.filter((_, i) => i !== idx)
                                  }))
                                }}
                                className="p-1.5 bg-red-950/80 border border-red-500/30 text-red-400 hover:bg-red-900 transition-colors cursor-pointer"
                                title="Удалить скриншот"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <label className="aspect-video bg-navy border border-dashed border-white/20 hover:border-gold/50 cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all text-muted hover:text-gold">
                          <Plus size={20} />
                          <span className="text-[10px] uppercase font-bold tracking-[1px]">Загрузить</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
                      <button type="button" onClick={() => setIsProjectFormOpen(false)} className="px-5 py-3 border border-white/15 text-muted hover:text-ink text-xs uppercase tracking-[1px] transition-colors cursor-pointer">
                        Отмена
                      </button>
                      <button type="submit" className="bg-gold hover:bg-gold-glow text-navy px-6 py-3 font-head font-[800] text-xs uppercase tracking-[1px] transition-colors cursor-pointer">
                        Сохранить кейс
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* PROJECTS LIST */}
              {projectsLoading ? (
                <div className="py-20 text-center text-muted font-mono">Загрузка проектов...</div>
              ) : projects.length === 0 ? (
                <div className="py-20 text-center text-muted border border-dashed border-white/5">Проекты не найдены. Добавьте первый.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map(p => (
                    <div key={p.id} className="bg-navy-2 border border-white/10 p-6 flex flex-col justify-between group">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <span className="text-[10px] font-mono text-muted uppercase tracking-[1.5px] border border-white/10 px-2 py-0.5">{p.category}</span>
                          <span className="text-xs text-muted font-mono">#{p.id}</span>
                        </div>
                        <h4 className="font-head font-[800] text-xl text-ink group-hover:text-gold transition-colors">{p.title}</h4>
                        <p className="text-xs text-muted font-mono mt-1">/{p.slug}</p>
                        <p className="text-sm text-muted/80 leading-[1.6] mt-4 line-clamp-2">{p.description}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-4 mt-6">
                        <button
                          onClick={() => openProjectForm(p)}
                          className="p-2.5 border border-white/10 hover:border-gold/30 text-muted hover:text-gold transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                        >
                          <Edit2 size={13} /> Изменить
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-2.5 border border-red-500/10 hover:border-red-500/40 text-red-500/60 hover:text-red-400 transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                        >
                          <Trash2 size={13} /> Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. HOMEPAGE CMS TAB */}
          {activeTab === 'home_cms' && homeForm && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-head font-[800] text-3xl text-ink">Конструктор Главной страницы</h2>
                  <p className="text-xs text-muted font-mono tracking-[1px] mt-1">Редактирование всех текстов главного экрана агентства</p>
                </div>
                <button
                  onClick={() => handleSaveCMS('homepage', homeForm)}
                  className="bg-gold hover:bg-gold-glow text-navy px-6 py-3 font-head font-[800] text-xs uppercase tracking-[1px] transition-colors cursor-pointer"
                >
                  Сохранить изменения
                </button>
              </div>

              <div className="space-y-10">
                {/* 1. HERO */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none">
                  <h3 className="text-gold font-head font-[700] text-lg uppercase tracking-[1.5px] mb-6 border-b border-white/5 pb-3">1. Главный экран (Hero)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Тег сверху</label>
                        <input type="text" value={homeForm.hero.tag} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, tag: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Заголовок 1</label>
                        <input type="text" value={homeForm.hero.headline_1} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, headline_1: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Заголовок 2 (Золотой)</label>
                        <input type="text" value={homeForm.hero.headline_2} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, headline_2: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Заголовок 3</label>
                        <input type="text" value={homeForm.hero.headline_3} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, headline_3: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Описание (Subtitle)</label>
                      <textarea value={homeForm.hero.subtitle} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, subtitle: e.target.value } })} rows={3} className="w-full bg-navy border border-white/10 p-4 text-sm text-ink focus:outline-none focus:border-gold" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Кнопка 1 (Смотреть работы)</label>
                        <input type="text" value={homeForm.hero.cta_primary} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, cta_primary: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Кнопка 2 (Обсудить проект)</label>
                        <input type="text" value={homeForm.hero.cta_secondary} onChange={e => setHomeForm({ ...homeForm, hero: { ...homeForm.hero, cta_secondary: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. STATS */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none">
                  <h3 className="text-gold font-head font-[700] text-lg uppercase tracking-[1.5px] mb-6 border-b border-white/5 pb-3">2. Блок Статистики</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {homeForm.stats && homeForm.stats.map((s, idx) => (
                      <div key={idx} className="bg-navy p-4 border border-white/5">
                        <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Показатель #{idx + 1}</label>
                        <input type="text" value={s.num} onChange={e => {
                          const newStats = [...homeForm.stats]
                          newStats[idx].num = e.target.value
                          setHomeForm({ ...homeForm, stats: newStats })
                        }} className="w-full bg-navy-2 border border-white/10 px-3 py-1.5 text-gold text-sm font-semibold mb-2 focus:outline-none focus:border-gold" />
                        
                        <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Лейбл</label>
                        <input type="text" value={s.label} onChange={e => {
                          const newStats = [...homeForm.stats]
                          newStats[idx].label = e.target.value
                          setHomeForm({ ...homeForm, stats: newStats })
                        }} className="w-full bg-navy-2 border border-white/10 px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-gold" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. SERVICES */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none">
                  <h3 className="text-gold font-head font-[700] text-lg uppercase tracking-[1.5px] mb-6 border-b border-white/5 pb-3">3. Блок услуг (Services)</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Тег секции</label>
                        <input type="text" value={homeForm.services.tag} onChange={e => setHomeForm({ ...homeForm, services: { ...homeForm.services, tag: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Заголовок секции</label>
                        <input type="text" value={homeForm.services.title} onChange={e => setHomeForm({ ...homeForm, services: { ...homeForm.services, title: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <p className="text-xs font-semibold text-muted uppercase tracking-[1px]">Список услуг (3 карточки):</p>
                      {homeForm.services.items && homeForm.services.items.map((item, idx) => (
                        <div key={item.id || idx} className="bg-navy p-5 border border-white/5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-gold uppercase tracking-[1px] font-bold">Карточка #{idx + 1}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-1">
                              <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Название услуги</label>
                              <input type="text" value={item.title} onChange={e => {
                                const newItems = [...homeForm.services.items]
                                newItems[idx].title = e.target.value
                                setHomeForm({ ...homeForm, services: { ...homeForm.services, items: newItems } })
                              }} className="w-full bg-navy-2 border border-white/10 px-3 py-2 text-ink text-sm focus:outline-none focus:border-gold font-semibold" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Спецификации / Технологии (через запятую)</label>
                              <input type="text" value={item.features ? item.features.join(', ') : ''} onChange={e => {
                                const newItems = [...homeForm.services.items]
                                newItems[idx].features = e.target.value.split(',').map(f => f.trim())
                                setHomeForm({ ...homeForm, services: { ...homeForm.services, items: newItems } })
                              }} className="w-full bg-navy-2 border border-white/10 px-3 py-2 text-gold-dim text-sm focus:outline-none focus:border-gold font-mono" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Описание услуги</label>
                            <textarea value={item.desc} onChange={e => {
                              const newItems = [...homeForm.services.items]
                              newItems[idx].desc = e.target.value
                              setHomeForm({ ...homeForm, services: { ...homeForm.services, items: newItems } })
                            }} rows={2} className="w-full bg-navy-2 border border-white/10 p-3 text-ink text-xs focus:outline-none focus:border-gold" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. PROCESS */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none">
                  <h3 className="text-gold font-head font-[700] text-lg uppercase tracking-[1.5px] mb-6 border-b border-white/5 pb-3">4. Этапы работы (Process)</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Тег секции</label>
                        <input type="text" value={homeForm.process.tag} onChange={e => setHomeForm({ ...homeForm, process: { ...homeForm.process, tag: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Заголовок секции</label>
                        <input type="text" value={homeForm.process.title} onChange={e => setHomeForm({ ...homeForm, process: { ...homeForm.process, title: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      {homeForm.process.steps && homeForm.process.steps.map((step, idx) => (
                        <div key={idx} className="bg-navy p-4 border border-white/5 space-y-2">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="text-[10px] text-gold font-bold">Шаг {step.num}</span>
                          </div>
                          <div>
                            <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Название шага</label>
                            <input type="text" value={step.title} onChange={e => {
                              const newSteps = [...homeForm.process.steps]
                              newSteps[idx].title = e.target.value
                              setHomeForm({ ...homeForm, process: { ...homeForm.process, steps: newSteps } })
                            }} className="w-full bg-navy-2 border border-white/10 px-3 py-1.5 text-ink text-sm font-semibold focus:outline-none focus:border-gold" />
                          </div>
                          <div>
                            <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Описание</label>
                            <textarea value={step.desc} onChange={e => {
                              const newSteps = [...homeForm.process.steps]
                              newSteps[idx].desc = e.target.value
                              setHomeForm({ ...homeForm, process: { ...homeForm.process, steps: newSteps } })
                            }} rows={2} className="w-full bg-navy-2 border border-white/10 p-3 text-ink text-xs focus:outline-none focus:border-gold" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. TESTIMONIALS */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none">
                  <h3 className="text-gold font-head font-[700] text-lg uppercase tracking-[1.5px] mb-6 border-b border-white/5 pb-3">5. Отзывы (Testimonials)</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Тег секции</label>
                        <input type="text" value={homeForm.testimonials.tag} onChange={e => setHomeForm({ ...homeForm, testimonials: { ...homeForm.testimonials, tag: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Заголовок секции</label>
                        <input type="text" value={homeForm.testimonials.title} onChange={e => setHomeForm({ ...homeForm, testimonials: { ...homeForm.testimonials, title: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <p className="text-xs font-semibold text-muted uppercase tracking-[1px]">Список отзывов ({homeForm.testimonials.items ? homeForm.testimonials.items.length : 0}):</p>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(homeForm.testimonials.items || [])]
                            newItems.push({ author: 'Новый автор', role: 'Должность', quote: 'Текст отзыва...' })
                            setHomeForm({
                              ...homeForm,
                              testimonials: {
                                ...homeForm.testimonials,
                                items: newItems
                              }
                            })
                          }}
                          className="border border-gold/30 hover:border-gold text-gold px-4 py-2 text-xs uppercase tracking-[1px] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus size={14} /> Добавить отзыв
                        </button>
                      </div>

                      {homeForm.testimonials.items && homeForm.testimonials.items.map((t, idx) => (
                        <div key={idx} className="bg-navy p-5 border border-white/5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-gold uppercase tracking-[1px] font-bold">Отзыв #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = homeForm.testimonials.items.filter((_, i) => i !== idx)
                                setHomeForm({
                                  ...homeForm,
                                  testimonials: {
                                    ...homeForm.testimonials,
                                    items: newItems
                                  }
                                })
                              }}
                              className="text-red-500/60 hover:text-red-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="Удалить отзыв"
                            >
                              <Trash2 size={12} /> Удалить
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Имя автора</label>
                              <input type="text" value={t.author} onChange={e => {
                                const newTest = [...homeForm.testimonials.items]
                                newTest[idx].author = e.target.value
                                setHomeForm({ ...homeForm, testimonials: { ...homeForm.testimonials, items: newTest } })
                              }} className="w-full bg-navy-2 border border-white/10 px-3 py-2 text-ink text-sm focus:outline-none focus:border-gold font-semibold" />
                            </div>
                            <div>
                              <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Должность / Компания</label>
                              <input type="text" value={t.role} onChange={e => {
                                const newTest = [...homeForm.testimonials.items]
                                newTest[idx].role = e.target.value
                                setHomeForm({ ...homeForm, testimonials: { ...homeForm.testimonials, items: newTest } })
                              }} className="w-full bg-navy-2 border border-white/10 px-3 py-2 text-muted text-sm focus:outline-none focus:border-gold" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Текст отзыва</label>
                            <textarea value={t.quote} onChange={e => {
                              const newTest = [...homeForm.testimonials.items]
                              newTest[idx].quote = e.target.value
                              setHomeForm({ ...homeForm, testimonials: { ...homeForm.testimonials, items: newTest } })
                            }} rows={3} className="w-full bg-navy-2 border border-white/10 p-3 text-ink text-xs focus:outline-none focus:border-gold" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. TECH STACK */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none">
                  <h3 className="text-gold font-head font-[700] text-lg uppercase tracking-[1.5px] mb-6 border-b border-white/5 pb-3">6. Технологии (Tech Stack)</h3>
                  
                  {/* Active techs container */}
                  <div className="mb-6">
                    <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-3">Активные технологии ({homeForm.techs ? homeForm.techs.length : 0})</label>
                    {(!homeForm.techs || homeForm.techs.length === 0) ? (
                      <div className="text-sm text-muted/60 bg-navy p-4 border border-white/5">Нет добавленных технологий. Выберите из списка ниже или создайте свою.</div>
                    ) : (
                      <div className="flex flex-wrap gap-2 bg-navy p-4 border border-white/5">
                        {homeForm.techs.map((t, idx) => (
                          <div 
                            key={t.name + '-' + idx} 
                            className="flex items-center gap-2 bg-navy-2 border border-white/10 px-3 py-1.5 hover:border-red-500/35 transition-all group"
                          >
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                            <span className="text-[13px] font-medium text-ink">{t.name}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                const newTechs = homeForm.techs.filter((_, i) => i !== idx)
                                setHomeForm({ ...homeForm, techs: newTechs })
                              }}
                              className="text-muted hover:text-red-400 ml-1 transition-colors focus:outline-none cursor-pointer"
                              title="Удалить"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add technology controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    {/* Predefined Add */}
                    <div className="space-y-3">
                      <label className="block text-[10px] text-muted uppercase tracking-[1.5px]">Выбрать готовую технологию</label>
                      <div className="flex gap-2">
                        <select 
                          onChange={(e) => {
                            const val = e.target.value
                            if (!val) return
                            const selected = PREDEFINED_TECHS.find(p => p.name === val)
                            if (selected) {
                              // Check if already in techs list
                              const exists = homeForm.techs && homeForm.techs.some(t => t.name.toLowerCase() === selected.name.toLowerCase())
                              if (exists) {
                                alert('Эта технология уже добавлена!')
                                e.target.value = ''
                                return
                              }
                              const newTechs = [...(homeForm.techs || []), selected]
                              setHomeForm({ ...homeForm, techs: newTechs })
                            }
                            e.target.value = '' // reset selection
                          }}
                          className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold cursor-pointer"
                        >
                          <option value="">-- Выберите из списка --</option>
                          {PREDEFINED_TECHS
                            .filter(pt => !(homeForm.techs && homeForm.techs.some(t => t.name.toLowerCase() === pt.name.toLowerCase())))
                            .map(pt => (
                              <option key={pt.name} value={pt.name}>
                                {pt.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        Выберите готовую современную технологию из нашего списка с предустановленным фирменным цветом бренда.
                      </p>
                    </div>

                    {/* Custom Add */}
                    <div className="space-y-3">
                      <label className="block text-[10px] text-muted uppercase tracking-[1.5px]">Создать свою технологию</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="Название (например: Bun)" 
                            value={customTechName}
                            onChange={(e) => setCustomTechName(e.target.value)}
                            className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={customTechColor}
                            onChange={(e) => setCustomTechColor(e.target.value)}
                            className="w-12 h-10 bg-transparent border-0 cursor-pointer p-0 block"
                            title="Цвет индикатора"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const trimmed = customTechName.trim()
                              if (!trimmed) {
                                alert('Введите название технологии!')
                                return
                              }
                              const exists = homeForm.techs && homeForm.techs.some(t => t.name.toLowerCase() === trimmed.toLowerCase())
                              if (exists) {
                                alert('Технология с таким названием уже существует!')
                                return
                              }
                              const newTechs = [...(homeForm.techs || []), { name: trimmed, color: customTechColor }]
                              setHomeForm({ ...homeForm, techs: newTechs })
                              setCustomTechName('')
                            }}
                            className="bg-gold hover:bg-gold-glow text-navy px-4 py-2.5 text-xs font-head font-[800] uppercase tracking-[0.5px] transition-colors cursor-pointer shrink-0"
                          >
                            Добавить
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        Укажите любое кастомное название и выберите цвет точки-индикатора с помощью палитры.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7. CONTACT FORM */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none">
                  <h3 className="text-gold font-head font-[700] text-lg uppercase tracking-[1.5px] mb-6 border-b border-white/5 pb-3">7. Форма обратной связи (Contact Form)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Тег сверху</label>
                        <input type="text" value={homeForm.contact.tag} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, tag: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Главный заголовок</label>
                        <input type="text" value={homeForm.contact.title} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, title: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Подзаголовок описания</label>
                      <textarea value={homeForm.contact.subtitle} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, subtitle: e.target.value } })} rows={2} className="w-full bg-navy border border-white/10 p-4 text-sm text-ink focus:outline-none focus:border-gold" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Плейсхолдер имени</label>
                        <input type="text" value={homeForm.contact.placeholder_name} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, placeholder_name: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Плейсхолдер контакта</label>
                        <input type="text" value={homeForm.contact.placeholder_contact} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, placeholder_contact: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Плейсхолдер сообщения</label>
                        <input type="text" value={homeForm.contact.placeholder_message} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, placeholder_message: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Текст чекбокса согласия</label>
                        <input type="text" value={homeForm.contact.checkbox_text} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, checkbox_text: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Анкор ссылки согласия</label>
                        <input type="text" value={homeForm.contact.checkbox_link} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, checkbox_link: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Текст кнопки отправки</label>
                        <input type="text" value={homeForm.contact.submit_btn} onChange={e => setHomeForm({ ...homeForm, contact: { ...homeForm.contact, submit_btn: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. FOOTER */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none">
                  <h3 className="text-gold font-head font-[700] text-lg uppercase tracking-[1.5px] mb-6 border-b border-white/5 pb-3">8. Подвал (Footer)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Описание в подвале</label>
                      <textarea value={homeForm.footer.desc} onChange={e => setHomeForm({ ...homeForm, footer: { ...homeForm.footer, desc: e.target.value } })} rows={2} className="w-full bg-navy border border-white/10 p-4 text-sm text-ink focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Текст Копирайта</label>
                      <input type="text" value={homeForm.footer.copyright} onChange={e => setHomeForm({ ...homeForm, footer: { ...homeForm.footer, copyright: e.target.value } })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => handleSaveCMS('homepage', homeForm)}
                    className="bg-gold hover:bg-gold-glow text-navy px-8 py-4 font-head font-[800] tracking-[1px] uppercase text-sm transition-colors cursor-pointer"
                  >
                    Сохранить все изменения глав. страницы
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. PRIVACY POLICY CMS TAB */}
          {activeTab === 'privacy_cms' && privacyForm && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-head font-[800] text-3xl text-ink">Конструктор Политики Конфиденциальности</h2>
                  <p className="text-xs text-muted font-mono tracking-[1px] mt-1">Редактирование разделов, статей и юридической информации</p>
                </div>
                <button
                  onClick={() => handleSaveCMS('privacy', privacyForm)}
                  className="bg-gold hover:bg-gold-glow text-navy px-6 py-3 font-head font-[800] text-xs uppercase tracking-[1px] transition-colors cursor-pointer"
                >
                  Сохранить изменения
                </button>
              </div>

              <div className="space-y-8">
                {/* HEAD DETAILS */}
                <div className="bg-navy-2 border border-white/10 p-6 md:p-8 rounded-none space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Главный заголовок</label>
                      <input type="text" value={privacyForm.title} onChange={e => setPrivacyForm({ ...privacyForm, title: e.target.value })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Дата обновления (Sub-heading)</label>
                      <input type="text" value={privacyForm.subtitle} onChange={e => setPrivacyForm({ ...privacyForm, subtitle: e.target.value })} className="w-full bg-navy border border-white/10 px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-muted uppercase tracking-[1.5px] mb-1.5">Вводный абзац (Intro text)</label>
                    <textarea value={privacyForm.intro} onChange={e => setPrivacyForm({ ...privacyForm, intro: e.target.value })} rows={3} className="w-full bg-navy border border-white/10 p-4 text-sm text-ink focus:outline-none focus:border-gold" />
                  </div>
                </div>

                {/* CLAUSES/SECTIONS EDITOR */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-muted uppercase tracking-[1px]">Разделы политики ({privacyForm.sections ? privacyForm.sections.length : 0})</p>
                    <button
                      type="button"
                      onClick={() => {
                        const newSections = [...(privacyForm.sections || [])]
                        const nextId = newSections.length + 1
                        newSections.push({ title: `${nextId}. Новая статья`, content: 'Содержимое новой статьи...' })
                        setPrivacyForm({ ...privacyForm, sections: newSections })
                      }}
                      className="border border-gold/30 hover:border-gold text-gold px-4 py-2 text-xs uppercase tracking-[1px] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus size={14} /> Добавить статью
                    </button>
                  </div>

                  {privacyForm.sections && privacyForm.sections.map((sec, idx) => (
                    <div key={idx} className="bg-navy-2 border border-white/10 p-6 space-y-4 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const newSections = privacyForm.sections.filter((_, i) => i !== idx)
                          setPrivacyForm({ ...privacyForm, sections: newSections })
                        }}
                        className="absolute top-6 right-6 text-red-500/50 hover:text-red-400 p-1 bg-red-950/20 border border-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
                        title="Удалить эту статью"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="max-w-[85%]">
                        <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Заголовок статьи</label>
                        <input type="text" value={sec.title} onChange={e => {
                          const newSections = [...privacyForm.sections]
                          newSections[idx].title = e.target.value
                          setPrivacyForm({ ...privacyForm, sections: newSections })
                        }} className="w-full bg-navy border border-white/10 px-3 py-2 text-ink text-sm font-semibold focus:outline-none focus:border-gold" />
                      </div>

                      <div>
                        <label className="block text-[9px] text-muted uppercase tracking-[1px] mb-1">Текст статьи</label>
                        <textarea value={sec.content} onChange={e => {
                          const newSections = [...privacyForm.sections]
                          newSections[idx].content = e.target.value
                          setPrivacyForm({ ...privacyForm, sections: newSections })
                        }} rows={4} className="w-full bg-navy border border-white/10 p-3 text-ink text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* SAVE BUTTON */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => handleSaveCMS('privacy', privacyForm)}
                    className="bg-gold hover:bg-gold-glow text-navy px-8 py-4 font-head font-[800] tracking-[1px] uppercase text-sm transition-colors cursor-pointer"
                  >
                    Сохранить все изменения Политики
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
