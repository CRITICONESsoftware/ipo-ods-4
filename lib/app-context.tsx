"use client"

import { createContext, useContext, useState, type ReactNode } from "react"


export interface AccessibilitySettings {
  fontSizeIndex: number
  colorBlindMode: string
  highContrast: boolean
  contentReader: boolean
  voiceNav: boolean
  vibration: boolean
}

interface AppContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  tutorialStep: number
  setTutorialStep: (step: number) => void
  showTutorial: boolean
  setShowTutorial: (show: boolean) => void
  profileTab: "info" | "notifications" | "progress"
  setProfileTab: (tab: "info" | "notifications" | "progress") => void
  accessibility: AccessibilitySettings
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void
  user: UserProfile
  setUser: (user: Partial<UserProfile>) => void
  notifications: AppNotification[]
  setNotifications: (notifications: AppNotification[]) => void
}

export interface UserProfile {
  name: string
  email: string
  bio: string
  avatar: string
  xp: number
  level: number
  quizzesCompleted: number
  accuracy: number
  streak: number
  badges: string[]
  forumPosts: { id: number; title: string; content: string; date: string }[]
}

export interface AppNotification {
  id: number
  title: string
  content: string
  read: boolean
  date: string
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)
  const [profileTab, setProfileTab] = useState<"info" | "notifications" | "progress">("info")
  const [user, setUserState] = useState<UserProfile>({
    name: "Alex García",
    email: "alex.garcia@example.com",
    bio: "Apasionado por la educación y la sostenibilidad. Aprendiendo cada día sobre los ODS.",
    avatar: "/avatar.png",
    xp: 2450,
    level: 12,
    quizzesCompleted: 15,
    accuracy: 85,
    streak: 4,
    badges: ["Estudiante Brillante", "Maestro de ODS", "Corazón de Oro"],
    forumPosts: [
      { id: 1, title: "¿Cómo ayudar en el ODS 4?", content: "He estado pensando en formas de mejorar la educación en mi comunidad local...", date: "2 d ago" }
    ]
  })

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 1,
      title: "Nuevo cuestionario: ODS 4",
      content: "Se ha añadido un nuevo cuestionario sobre Educación de Calidad. ¡Ven a probar tus conocimientos!",
      read: false,
      date: "Hoy, 10:30"
    },
    {
      id: 2,
      title: "Logro desbloqueado",
      content: "¡Has completado 5 cuestionarios con un 100% de aciertos! Has ganado el emblema 'Estudiante Brillante'.",
      read: true,
      date: "Ayer"
    }
  ])

  const setUser = (newUserData: Partial<UserProfile>) => {
    setUserState(prev => ({ ...prev, ...newUserData }))
  }

  const [accessibility, setAccessibilityState] = useState<AccessibilitySettings>({
    fontSizeIndex: 3,
    colorBlindMode: "Ninguno",
    highContrast: false,
    contentReader: false,
    voiceNav: false,
    vibration: false,
  })

  const setAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibilityState(prev => ({ ...prev, ...newSettings }))
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
        profileTab,
        setProfileTab,
        accessibility,
        setAccessibility,
        user,
        setUser,
        notifications,
        setNotifications,
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
