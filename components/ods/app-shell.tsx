"use client"

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
import { AccessibilityPage1 } from "./accessibility-page-1"
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
  const { currentPage } = useApp()

  const PageComponent = pageComponents[currentPage] || HomePage

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
    </div>
  )
}
