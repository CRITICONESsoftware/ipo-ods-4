"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, UserPlus, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react"

export function SignupPage() {
  const { signup, setCurrentPage } = useApp()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden")
        return
      }
      signup({ name, email, role: "visitor", avatar: name.charAt(0).toUpperCase() })
      router.push("/")
    } else {
      setError("Por favor rellena todos los campos")
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#c5192d]/10 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="w-full max-w-lg bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden relative z-10 grid md:grid-cols-2 group hover:border-primary/50 transition-all">
        {/* Decorative side */}
        <div className="hidden md:flex flex-col justify-center p-8 bg-primary text-primary-foreground relative overflow-hidden group-hover:bg-primary/95 transition-colors">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full scale-150 rotate-12">
              <path d="M10 10 H90 V90 H10 Z" fill="white" stroke="white" strokeWidth="5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 relative z-10 leading-tight">Únete al movimiento ODS 4</h2>
          <p className="text-primary-foreground/80 mb-6 relative z-10 text-sm">
            Educación inclusiva, equitativa y de calidad para todos. Comienza tu viaje hoy mismo.
          </p>
          <ul className="space-y-4 relative z-10">
            <li className="flex items-center gap-2 text-xs font-semibold">
              <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 className="w-3 h-3" /></div>
              Acceso a los cuestionarios
            </li>
            <li className="flex items-center gap-2 text-xs font-semibold">
              <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 className="w-3 h-3" /></div>
              Acceso a los foros
            </li>
            <li className="flex items-center gap-2 text-xs font-semibold">
              <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 className="w-3 h-3" /></div>
              Seguimiento de progreso
            </li>
          </ul>
        </div>

        <div className="p-8">
          <div className="md:hidden flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">4</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Crear Cuenta</h2>
          <p className="text-muted-foreground mb-6 text-xs font-medium">Empieza gratis en menos de un minuto</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirmar Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-destructive text-[11px] bg-destructive/10 p-2 rounded-md font-bold">{error}</p>
            )}

            <div className="w-full flex justify-center py-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 rounded-lg shadow-md hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group text-sm active:scale-[0.98]"
              >
                Registrarse
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <p className="mt-6 text-[11px] text-center text-muted-foreground">
            Al registrarte aceptas nuestros{" "}
            <button className="text-primary font-bold hover:underline">Términos y Condiciones</button>
          </p>

          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <p className="text-[11px] text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Inicia sesión
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
