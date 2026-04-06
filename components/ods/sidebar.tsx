"use client"

import { X } from "lucide-react"
import { useApp } from "@/lib/app-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface NavItem {
  label: string
  href: string
  page?: string
  group?: string
}

const navItems: NavItem[] = [
  { label: "Noticias", href: "/", group: "info" },
  { label: "Informes", href: "/", group: "info" },
  { label: "Donaciones", href: "/donations", group: "info" },
  { label: "Cuestionarios", href: "/quiz", group: "interactive" },
  { label: "Videos", href: "/video", group: "interactive" },
  { label: "Mi cuenta", href: "/profile", group: "account" },
  { label: "Foro", href: "/forum", group: "account" },
  { label: "Opciones de accesibilidad", href: "/accessibility", group: "settings" },
  { label: "Tutorial de uso", href: "", page: "tutorial", group: "settings" },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, setShowTutorial, setTutorialStep, notifications } = useApp()
  const router = useRouter()

  if (!sidebarOpen) return null

  const handleNav = (item: NavItem) => {
    if (item.page === "tutorial") {
      setShowTutorial(true)
      setTutorialStep(0)
    }
    setSidebarOpen(false)
  }

  const groups = [
    { key: "info", items: navItems.filter((i) => i.group === "info") },
    { key: "interactive", items: navItems.filter((i) => i.group === "interactive") },
    { key: "account", items: navItems.filter((i) => i.group === "account") },
    { key: "settings", items: navItems.filter((i) => i.group === "settings") },
  ]

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/40 z-40"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <nav
        className="fixed left-0 top-0 bottom-0 w-64 bg-card text-card-foreground border-r border-border z-50 shadow-lg overflow-y-auto"
        role="navigation"
        aria-label="Menu principal"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold text-lg text-primary">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Cerrar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="py-2">
          {groups.map((group, gi) => (
            <div key={group.key}>
              {group.items.map((item) => {
                const isTutorial = item.page === "tutorial"
                const content = (
                  <>
                    {item.label}
                    {item.href === "/profile" && notifications.some(n => !n.read) && (
                      <span className="w-2 h-2 bg-destructive rounded-full" />
                    )}
                  </>
                )
                const className = "w-full text-left px-6 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-between"

                if (isTutorial) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNav(item)}
                      className={className}
                    >
                      {content}
                    </button>
                  )
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => handleNav(item)}
                    className={className}
                  >
                    {content}
                  </Link>
                )
              })}
              {gi < groups.length - 1 && (
                <div className="mx-4 my-1 border-t border-border" />
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}
