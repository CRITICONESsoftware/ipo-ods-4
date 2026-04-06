"use client"

import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useApp } from "@/lib/app-context"
import Link from "next/link"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { setSidebarOpen, sidebarOpen } = useApp()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-md hover:bg-[#0080b8] transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <Link href="/" className="flex items-center gap-1 hover:opacity-90 transition-opacity">
        <img
          src="/icon.webp"
          alt="ODS Logo"
          className="w-8 h-8 rounded-full bg-primary-foreground"
        />
        <h1 className="text-lg md:text-xl font-bold tracking-tight">
          <span className="text-primary-foreground">OBJETIV</span>
          <span className="text-[#fcc30b]">O</span>
          <span className="text-primary-foreground">S</span>
          <span className="text-sm md:text-base font-normal ml-1">
            DE DESARROLLO{"\n"}SOSTENIBLE
          </span>
        </h1>
      </Link>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
        aria-label="Cambiar tema"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </header>
  )
}
