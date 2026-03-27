"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Page =
  | "home"
  | "quiz"
  | "quiz-result"
  | "video"
  | "donations"
  | "profile"
  | "forum"
  | "accessibility-1"
  | "accessibility-2"
  | "tutorial"

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
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("tutorial")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)
  const [profileTab, setProfileTab] = useState<"info" | "notifications" | "progress">("info")

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
