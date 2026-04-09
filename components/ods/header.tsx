"use client"

import { Menu, Sun, Moon, LogOut, User as UserIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useApp } from "@/lib/app-context"
import { useRouter } from "next/navigation"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { setSidebarOpen, sidebarOpen, user, logout } = useApp()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between pl-4 pr-8 py-2 bg-primary text-primary-foreground shadow-md sticky top-0 z-30 border-b-2 border-primary-foreground/20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-white/15 focus:outline-2 focus:outline-offset-2 focus:outline-white transition-all active:scale-95"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push("/")}>
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform">
            <img
              src="/icon.webp"
              alt="ODS Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-[900] tracking-tighter leading-none">
              ODS <span className="text-[#fcc30b]">4</span>
            </h1>
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-80 leading-none">Educación de calidad</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4 md:gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-white/15 hover:bg-white/25 focus:outline-2 focus:outline-offset-2 focus:outline-white transition-all active:scale-95 border border-white/10"
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-[1px] bg-white/10 mx-1 hidden xs:block" />

        {user ? (
          <div className="ml-6 flex items-center gap-4">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 bg-white/15 border border-white/30 px-3 py-2 rounded-xl font-black text-[11px] sm:text-sm hover:bg-white/25 focus:outline-2 focus:outline-offset-2 focus:outline-white transition-all group whitespace-nowrap"
              aria-label="Perfil"
              title="Perfil"
            >
              <UserIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Perfil</span>
            </button>
            <button
              onClick={logout}
              className="ml-10 pl-8 border-l border-l-white/30 flex items-center gap-2 bg-white/15 border border-white/30 text-white px-2 sm:px-4 py-2 rounded-xl font-black text-[11px] sm:text-sm whitespace-nowrap shadow-lg hover:bg-destructive hover:border-destructive hover:text-destructive-foreground focus:outline-2 focus:outline-offset-2 focus:outline-white transition-all active:scale-95 group"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="ml-6 mr-3 flex items-center gap-2 bg-white text-primary px-2 sm:px-4 py-2 rounded-xl font-black text-[11px] sm:text-sm whitespace-nowrap shadow-lg hover:shadow-white/30 focus:outline-2 focus:outline-offset-2 focus:outline-white transition-all active:scale-95 group"
          >
            <UserIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span>Iniciar sesión</span>
          </button>
        )}
      </div>
    </header>
  )
}
