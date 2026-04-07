"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { useRouter } from "next/navigation"
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from "lucide-react"

export function LoginPage() {
  const { login, setCurrentPage } = useApp()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:", email)
    if (login(email, password)) {
      setError("")
      router.push("/")
    } else {
      console.log("Login call returned false")
      setError("Email o contraseña incorrectos. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#c5192d]/10 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden relative z-10 transition-all hover:border-primary/50 group">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0">
              <span className="text-white font-bold text-3xl">4</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">Bienvenido de nuevo</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Accede a tu cuenta para continuar con tu aprendizaje
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-2xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-2xl py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="w-full flex justify-center py-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                Iniciar Sesión
                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-primary font-bold hover:underline transition-all cursor-pointer inline-block"
              >
                Regístrate gratis
              </span>
            </p>
          </div>
        </div>

        {/* SDG Color Bar */}
        <div className="flex h-1.5">
          {["#e5243b","#dda63a","#4c9f38","#c5192d","#ff3a21","#26bde2","#fcc30b","#a21942","#fd6925","#dd1367","#fd9d24","#bf8b2e","#3f7e44","#0a97d9","#56c02b","#00689d","#19486a"].map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
    </main>
  )
}
