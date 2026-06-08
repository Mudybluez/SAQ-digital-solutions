import { createContext, useContext, useState, useEffect } from 'react'
import { defaultHomepageContent, defaultPrivacyContent } from '../constants/defaultContent'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [homepageContent, setHomepageContent] = useState(defaultHomepageContent)
  const [privacyContent, setPrivacyContent] = useState(defaultPrivacyContent)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const fetchContent = async () => {
    try {
      const [homeRes, privacyRes] = await Promise.all([
        fetch('/api/projects/settings/homepage').then(r => r.json()).catch(() => ({})),
        fetch('/api/projects/settings/privacy').then(r => r.json()).catch(() => ({}))
      ])

      if (homeRes.ok && homeRes.value) {
        setHomepageContent({
          ...defaultHomepageContent,
          ...homeRes.value,
          hero: { ...defaultHomepageContent.hero, ...homeRes.value.hero },
          services: { ...defaultHomepageContent.services, ...homeRes.value.services },
          process: { ...defaultHomepageContent.process, ...homeRes.value.process },
          testimonials: { ...defaultHomepageContent.testimonials, ...homeRes.value.testimonials },
          contact: { ...defaultHomepageContent.contact, ...homeRes.value.contact },
          footer: { ...defaultHomepageContent.footer, ...homeRes.value.footer },
          techs: homeRes.value.techs || defaultHomepageContent.techs,
        })
      }
      if (privacyRes.ok && privacyRes.value) {
        setPrivacyContent({
          ...defaultPrivacyContent,
          ...privacyRes.value
        })
      }
    } catch (err) {
      console.error('Failed to fetch site content settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return (
    <ContentContext.Provider value={{ homepageContent, privacyContent, refreshContent: fetchContent, loading, theme, toggleTheme }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return ctx
}
