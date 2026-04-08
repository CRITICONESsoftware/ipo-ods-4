"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "visitor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export type Page =
  | "home"
  | "quiz"
  | "quiz-result"
  | "video"
  | "donations"
  | "profile"
  | "forum"
  | "accessibility"
  | "tutorial"
  | "login"
  | "signup"
  | "admin"

export interface AccessibilitySettings {
  fontSizeIndex: number
  colorBlindMode: string
  highContrast: boolean
  contentReader: boolean
  voiceNav: boolean
  vibration: boolean
  reducedMotion: boolean
  screenReaderMode: boolean
  readingGuide: boolean
  // New settings for full functionality
  magnifier: boolean
  audioEnabled: boolean
  hearingAids: boolean
  subtitles: boolean
  elementsLayout: string
  keyboardOps: boolean
  eyeControl: boolean
  language: string
  buttonSizeIndex: number
}

export interface Notification {
  id: string
  title: string
  content: string
  href: Page
  date: string
}

const TRANSLATIONS = {
  Español: {
    accessibility: "Opciones de Accesibilidad",
    vision: "Visión",
    hearing: "Audición",
    interaction: "Interacción",
    back: "Volver al inicio",
    fontSize: "Tamaño de letra",
    buttonsSize: "Tamaño de botones",
    magnifier: "Lupa",
    filters: "Filtros de color",
    contrast: "Temas de contraste",
    narrator: "Narrador",
    audio: "Audio",
    hearingAids: "Audífonos",
    subtitles: "Subtítulos",
    layout: "Disposición",
    voice: "Voz",
    keyboard: "Teclado",
    eyeControl: "Control ocular",
    language: "Idioma",
    level: "Nivel",
    updated: "Ajuste actualizado",
    on: "activado",
    off: "desactivado"
  },
  English: {
    accessibility: "Accessibility Options",
    vision: "Vision",
    hearing: "Hearing",
    interaction: "Interaction",
    back: "Back to home",
    fontSize: "Font Size",
    buttonsSize: "Button Size",
    magnifier: "Magnifier",
    filters: "Color Filters",
    contrast: "Contrast Themes",
    narrator: "Narrator",
    audio: "Audio",
    hearingAids: "Hearing Aids",
    subtitles: "Subtitles",
    layout: "Layout",
    voice: "Voice",
    keyboard: "Keyboard",
    eyeControl: "Eye Control",
    language: "Language",
    level: "Level",
    updated: "Setting updated",
    on: "on",
    off: "off"
  }
}

interface AppContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  tutorialStep: number
  setTutorialStep: (step: number) => void
  showTutorial: boolean
  setShowTutorial: (show: boolean) => void
  currentPage: Page
  setCurrentPage: (page: Page) => void
  profileTab: "info" | "notifications" | "progress"
  setProfileTab: (tab: "info" | "notifications" | "progress") => void
  accessibility: AccessibilitySettings
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void
  t: (key: keyof typeof TRANSLATIONS.Español) => string
  // Auth state
  user: User | null
  token: string | null
  allUsers: User[]
  login: (email: string, pass: string) => boolean
  signup: (userData: Omit<User, "id">) => void
  logout: () => void
  updateUserRole: (id: string, role: UserRole) => void
  deleteUser: (id: string) => void
  // Progress & Notifications
  completedQuizzes: string[]
  completeQuiz: (quizId: string) => void
  notifications: Notification[]
  addNotification: (title: string, content: string, href: Page) => void
}

const AppContext = createContext<AppContextType | null>(null)

const MOCK_USERS: User[] = [
  { id: "1", name: "Admin User", email: "admin@ods.org", role: "admin", avatar: "A" },
  { id: "2", name: "Juan Perez", email: "juan@example.com", role: "visitor", avatar: "JP" },
  { id: "3", name: "Maria Garcia", email: "maria@example.com", role: "visitor", avatar: "MG" },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "¡Bienvenido!",
    content: "Comienza tu formación con el primer cuestionario de ODS 4.",
    href: "quiz" as Page,
    date: new Date().toISOString()
  }
]

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontSizeIndex: 3,
  colorBlindMode: "Ninguno",
  highContrast: false,
  contentReader: false,
  voiceNav: false,
  vibration: false,
  reducedMotion: false,
  screenReaderMode: false,
  readingGuide: false,
  magnifier: false,
  audioEnabled: true,
  hearingAids: false,
  subtitles: false,
  elementsLayout: "Standard",
  keyboardOps: false,
  eyeControl: false,
  language: "Español",
  buttonSizeIndex: 1,
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>("tutorial")
  const [profileTab, setProfileTab] = useState<"info" | "notifications" | "progress">("info")
  const [user, setUserState] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS)
  const [mounted, setMounted] = useState(false)
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY)

  // Helper to load user-specific data
  const loadUserData = (userId: string | null) => {
    const suffix = userId ? `user_${userId}` : "guest"

    console.log(`Loading data for scope: ${suffix}`)

    const savedQuizzes = localStorage.getItem(`ods_completed_quizzes_${suffix}`)
    setCompletedQuizzes(savedQuizzes ? JSON.parse(savedQuizzes) : [])

    const savedNotifications = localStorage.getItem(`ods_notifications_${suffix}`)
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      setNotifications(userId ? [] : INITIAL_NOTIFICATIONS)
    }

    const savedAccessibility = localStorage.getItem(`ods_accessibility_${suffix}`)
    if (savedAccessibility) {
      try {
        setAccessibilityState(JSON.parse(savedAccessibility))
      } catch (e) {
        setAccessibilityState(DEFAULT_ACCESSIBILITY)
      }
    } else {
      setAccessibilityState(DEFAULT_ACCESSIBILITY)
    }

    const savedPage = localStorage.getItem(`ods_current_page_${suffix}`)
    if (savedPage) {
      setCurrentPage(savedPage as Page)
    } else {
      setCurrentPage(userId ? "home" : "tutorial")
    }

    const savedShowTutorial = localStorage.getItem(`ods_show_tutorial_${suffix}`)
    if (savedShowTutorial === null) {
      setShowTutorial(userId ? false : true)
    } else {
      setShowTutorial(savedShowTutorial === "true")
    }

    const savedTutorialStep = localStorage.getItem(`ods_tutorial_step_${suffix}`)
    setTutorialStep(savedTutorialStep ? parseInt(savedTutorialStep) : 0)
  }

  // 1. Initial Mount - Recover users and auth session
  useEffect(() => {
    setMounted(true)
    const savedUsers = localStorage.getItem("ods_all_users")
    let currentUsers = MOCK_USERS
    if (savedUsers) {
      try {
        currentUsers = JSON.parse(savedUsers)
        setAllUsers(currentUsers)
      } catch (e) {
        console.error("Error loading users:", e)
      }
    }

    // Recover Auth Session
    const savedToken = localStorage.getItem("ods_jwt_token")
    if (savedToken && savedToken.includes(".")) {
      try {
        const parts = savedToken.split(".")
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          if (payload.exp > Date.now()) {
            setToken(savedToken)
            const found = currentUsers.find((u: User) => u.id === payload.id)
            if (found) {
              setUserState(found)
              loadUserData(found.id)
              return
            }
          } else {
            localStorage.removeItem("ods_jwt_token")
          }
        }
      } catch (e) {
        console.error("JWT Decode Error:", e)
        localStorage.removeItem("ods_jwt_token")
      }
    }

    loadUserData(null)
  }, [])

  // 2. Persistence Sync - Scoped by current user ID
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("ods_all_users", JSON.stringify(allUsers))
  }, [allUsers, mounted])

  const curId = user?.id ? `user_${user.id}` : "guest"

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(`ods_accessibility_${curId}`, JSON.stringify(accessibility))
  }, [accessibility, mounted, curId])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(`ods_current_page_${curId}`, currentPage)
  }, [currentPage, mounted, curId])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(`ods_show_tutorial_${curId}`, showTutorial.toString())
  }, [showTutorial, mounted, curId])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(`ods_tutorial_step_${curId}`, tutorialStep.toString())
  }, [tutorialStep, mounted, curId])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(`ods_completed_quizzes_${curId}`, JSON.stringify(completedQuizzes))
  }, [completedQuizzes, mounted, curId])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(`ods_notifications_${curId}`, JSON.stringify(notifications))
  }, [notifications, mounted, curId])

  const login = (email: string, _: string) => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (found) {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
      const payload = btoa(JSON.stringify({ id: found.id, name: found.name, role: found.role, exp: Date.now() + 86400000 }))
      const signature = btoa("mock_signature")
      const newToken = `${header}.${payload}.${signature}`

      localStorage.setItem("ods_jwt_token", newToken)
      setToken(newToken)
      setUserState(found)
      loadUserData(found.id)
      return true
    }
    return false
  }

  const signup = (userData: Omit<User, "id">) => {
    const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9) }
    setAllUsers(prev => [...prev, newUser])

    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payload = btoa(JSON.stringify({ id: newUser.id, name: newUser.name, role: newUser.role, exp: Date.now() + 86400000 }))
    const signature = btoa("mock_signature")
    const newToken = `${header}.${payload}.${signature}`

    localStorage.setItem("ods_jwt_token", newToken)
    setToken(newToken)
    setUserState(newUser)
    loadUserData(newUser.id)
  }

  const logout = () => {
    localStorage.removeItem("ods_jwt_token")
    setToken(null)
    setUserState(null)
    loadUserData(null)
  }

  const updateUserRole = (id: string, role: UserRole) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
  }

  const deleteUser = (id: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== id))
  }

  const setAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibilityState(prev => ({ ...prev, ...newSettings }))
  }

  const completeQuiz = (quizId: string) => {
    if (!completedQuizzes.includes(quizId)) {
      setCompletedQuizzes(prev => [...prev, quizId])
    }
  }

  const addNotification = (title: string, content: string, href: Page) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      href,
      date: new Date().toISOString()
    }
    setNotifications(prev => [newNotif, ...prev])
  }

  const t = (key: keyof typeof TRANSLATIONS.Español): string => {
    const lang = (accessibility.language as "Español" | "English") || "Español"
    return TRANSLATIONS[lang][key] || key
  }

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        tutorialStep,
        setTutorialStep,
        showTutorial,
        setShowTutorial,
        currentPage,
        setCurrentPage,
        profileTab,
        setProfileTab,
        accessibility,
        setAccessibility,
        t,
        user,
        token,
        allUsers,
        login,
        signup,
        logout,
        updateUserRole,
        deleteUser,
        completedQuizzes,
        completeQuiz,
        notifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}
