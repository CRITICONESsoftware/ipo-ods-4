"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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

export interface AccessibilitySettings {
  fontSizeIndex: number
  colorBlindMode: string
  highContrast: boolean
  contentReader: boolean
  voiceNav: boolean
  vibration: boolean
}

interface AppContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
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
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("tutorial")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)
  const [profileTab, setProfileTab] = useState<"info" | "notifications" | "progress">("info")

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
        currentPage,
        setCurrentPage,
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
