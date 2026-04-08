"use client"

import { Menu, Sun, Moon, LogIn, LogOut, User as UserIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useApp } from "@/lib/app-context"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { setSidebarOpen, sidebarOpen, user, logout } = useApp()
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground shadow-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-white/10 transition-all active:scale-95"
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

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95 border border-white/5"
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-[1px] bg-white/10 mx-1 hidden xs:block" />

        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">{user.name}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${user.role === 'admin'
                  ? 'bg-[#fcc30b] text-primary border-[#fcc30b]/20 shadow-[0_0_10px_-4px_rgba(252,195,11,0.6)]'
                  : 'bg-white/10 text-white border-white/20'
                }`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={() => router.push("/profile")}
              className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm hover:bg-white/20 transition-all group overflow-hidden"
            >
              {user.avatar ? (
                <span className="group-hover:scale-110 transition-transform">{user.avatar}</span>
              ) : (
                <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-95"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-xl font-black text-sm shadow-lg hover:shadow-white/20 transition-all active:scale-95 group"
          >
            <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span>INICIAR SESIÓN</span>
          </button>
        )}
      </div>
    </header>
  )
}
