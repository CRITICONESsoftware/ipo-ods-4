"use client"

import { useEffect } from "react"
import { useApp } from "@/lib/app-context"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { TutorialOverlay } from "./tutorial-overlay"
import { HomePage } from "./home-page"
import { QuizPage } from "./quiz-page"
import { VideoPage } from "./video-page"
import { DonationsPage } from "./donations-page"
import { ProfilePage } from "./profile-page"
import { ForumPage } from "./forum-page"
import { AccessibilityPage1, fontSizes } from "./accessibility-page-1"
import { AccessibilityPage2 } from "./accessibility-page-2"

const pageComponents: Record<string, React.ComponentType> = {
  home: HomePage,
  quiz: QuizPage,
  "quiz-result": QuizPage,
  video: VideoPage,
  donations: DonationsPage,
  profile: ProfilePage,
  forum: ForumPage,
  "accessibility-1": AccessibilityPage1,
  "accessibility-2": AccessibilityPage2,
  tutorial: HomePage,
}

export function AppShell() {
  const { currentPage, accessibility } = useApp()

  useEffect(() => {
    // Set the base font size on the html element so rem units scale correctly
    const rootFontSize = fontSizes[accessibility.fontSizeIndex]
    document.documentElement.style.fontSize = `${rootFontSize}px`

    // Clean up if needed (optional but good practice)
    return () => {
      document.documentElement.style.fontSize = ""
    }
  }, [accessibility.fontSizeIndex])

  const PageComponent = pageComponents[currentPage] || HomePage

  // Mapping color blindness to CSS filter values
  const getColorBlindFilter = () => {
    switch (accessibility.colorBlindMode) {
      case "Protanopia": return "url(#protanopia)"
      case "Protanomalia": return "url(#protanomalia)"
      case "Deuteranopia": return "url(#deuteranopia)"
      case "Deuteranomalia": return "url(#deuteranomalia)"
      case "Tritanopia": return "url(#tritanopia)"
      case "Tritanomalia": return "url(#tritanomalia)"
      case "Acromatopsia": return "grayscale(100%)"
      default: return "none"
    }
  }

  return (
    <div
      className={`min-h-screen bg-background flex flex-col transition-all duration-300 ${accessibility.highContrast ? "high-contrast" : ""}`}
      style={{
        filter: getColorBlindFilter()
      }}
    >
      <Header />
      <Sidebar />
      <TutorialOverlay />

      {/* Scrollbar decoration */}
      <div className="flex-1 relative overflow-hidden">
        <div className="h-full overflow-y-auto">
          <PageComponent />
        </div>

        {/* Right side decorative scrollbar */}
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-primary/10 hidden md:block">
          <div className="w-full h-1/3 bg-primary/30 rounded-full" />
        </div>
      </div>

      {/* Color Blindness SVG Filters (Simulated) */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="protanomalia">
            <feColorMatrix type="matrix" values="0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranomalia">
            <feColorMatrix type="matrix" values="0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanomalia">
            <feColorMatrix type="matrix" values="0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
