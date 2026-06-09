import { createContext, useContext, useState, useEffect } from 'react'
import i18n from '../i18n'
import { defaultHomepageContentMap, defaultPrivacyContentMap, defaultHomepageContentRU, defaultPrivacyContentRU } from '../constants/defaultContent'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng') || 'ru')
  const [homepageContent, setHomepageContent] = useState(defaultHomepageContentMap[language] || defaultHomepageContentRU)
  const [privacyContent, setPrivacyContent] = useState(defaultPrivacyContentMap[language] || defaultPrivacyContentRU)
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
    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
      })
    } else {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }
  }

  const fetchContent = async (lang = language) => {
    try {
      const homeKey = `homepage_${lang}`
      const privacyKey = `privacy_${lang}`

      const [homeRes, privacyRes, testimonialsRes] = await Promise.all([
        fetch(`/api/projects/settings/${homeKey}`).then(r => r.json()).catch(() => ({})),
        fetch(`/api/projects/settings/${privacyKey}`).then(r => r.json()).catch(() => ({})),
        fetch('/api/projects/settings/testimonials').then(r => r.json()).catch(() => ({}))
      ])

      const defaultHome = defaultHomepageContentMap[lang] || defaultHomepageContentRU
      const defaultPriv = defaultPrivacyContentMap[lang] || defaultPrivacyContentRU

      const testimonialsData = (testimonialsRes.ok && testimonialsRes.value)
        ? {
            tag: testimonialsRes.value.tag || defaultHome.testimonials.tag,
            title: testimonialsRes.value.title || defaultHome.testimonials.title,
            items: Array.isArray(testimonialsRes.value.items) 
              ? testimonialsRes.value.items 
              : (Array.isArray(testimonialsRes.value) ? testimonialsRes.value : defaultHome.testimonials.items)
          }
        : defaultHome.testimonials

      if (homeRes.ok && homeRes.value) {
        setHomepageContent({
          ...defaultHome,
          ...homeRes.value,
          hero: { ...defaultHome.hero, ...homeRes.value.hero },
          services: { ...defaultHome.services, ...homeRes.value.services },
          process: { ...defaultHome.process, ...homeRes.value.process },
          testimonials: testimonialsData,
          contact: { ...defaultHome.contact, ...homeRes.value.contact },
          footer: { ...defaultHome.footer, ...homeRes.value.footer },
          techs: homeRes.value.techs || defaultHome.techs,
        })
      } else {
        setHomepageContent({
          ...defaultHome,
          testimonials: testimonialsData
        })
      }

      if (privacyRes.ok && privacyRes.value) {
        setPrivacyContent({
          ...defaultPriv,
          ...privacyRes.value
        })
      } else {
        setPrivacyContent(defaultPriv)
      }
    } catch (err) {
      console.error('Failed to fetch site content settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
    localStorage.setItem('i18nextLng', lang)
  }

  useEffect(() => {
    fetchContent(language)
  }, [language])

  return (
    <ContentContext.Provider value={{
      language,
      changeLanguage,
      homepageContent,
      privacyContent,
      refreshContent: () => fetchContent(language),
      loading,
      theme,
      toggleTheme
    }}>
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
