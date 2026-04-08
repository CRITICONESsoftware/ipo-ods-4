"use client"

import { X, LayoutDashboard, Home, BookOpen, GraduationCap, DollarSign, User, MessageCircle, Settings, HelpCircle, ShieldAlert, Video } from "lucide-react"
import { useApp } from "@/lib/app-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface NavItem {
  label: string
  href: string
  group?: string
  icon?: any
}

const navItems: NavItem[] = [
  { label: "Inicio", href: "/", group: "info", icon: Home },
  { label: "Informes", href: "/", group: "info", icon: BookOpen },
  { label: "Donaciones", href: "/donations", group: "info", icon: DollarSign },
  { label: "Cuestionarios", href: "/quiz", group: "interactive", icon: GraduationCap },
  { label: "Videos", href: "/video", group: "interactive", icon: Video },
  { label: "Mi cuenta", href: "/profile", group: "account", icon: User },
  { label: "Foro", href: "/forum", group: "account", icon: MessageCircle },
  { label: "Accesibilidad", href: "/accessibility", group: "settings", icon: Settings },
  { label: "Tutorial", href: "/", group: "settings", icon: HelpCircle },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, setShowTutorial, setTutorialStep, user } = useApp()
  const router = useRouter()

  if (!sidebarOpen) return null

  const handleNav = (item: NavItem) => {
    if (item.label === "Tutorial") {
      setShowTutorial(true)
      setTutorialStep(0)
      router.push("/")
    } else {
      router.push(item.href)
    }
    setSidebarOpen(false)
  }

  const currentNavItems = [...navItems]
  if (user?.role === "admin") {
    currentNavItems.push({ label: "Administración", href: "/admin", group: "settings", icon: ShieldAlert })
  }

  const groups = [
    { key: "info", label: "INFORMACIÓN", items: currentNavItems.filter((i) => i.group === "info") },
    { key: "interactive", label: "APRENDIZAJE", items: currentNavItems.filter((i) => i.group === "interactive") },
    { key: "account", label: "COMUNIDAD", items: currentNavItems.filter((i) => i.group === "account") },
    { key: "settings", label: "CONFIGURACIÓN", items: currentNavItems.filter((i) => i.group === "settings") },
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
        <div className="py-6 space-y-5">
          {groups.map((group, gi) => group.items.length > 0 && (
            <div key={group.key}>
              <h3 className="px-6 mb-2 text-[10px] font-black tracking-[0.3em] text-muted-foreground/40 uppercase">
                {group.label}
              </h3>
              <div className="space-y-1 px-3">
                {group.items.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleNav(item); }}
                    className="w-full text-left px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-4 transition-all hover:bg-primary/10 hover:text-primary group relative overflow-hidden active:scale-95 select-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
                      {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
                    </div>
                    <span className="tracking-tight uppercase text-xs truncate">{item.label}</span>
                    <div className="absolute left-0 w-1.5 h-0 bg-primary group-hover:h-8 top-1/2 -translate-y-1/2 rounded-full transition-all" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}
