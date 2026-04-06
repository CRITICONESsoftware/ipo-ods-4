"use client"

import { Bell, Pencil, LogIn, User as UserIcon, ShieldCheck, Mail, Calendar, Award, MessageCircle, ExternalLink } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { QUIZZES } from "@/lib/quizzes"

const forumMessages = [
  {
    id: 1,
    title: "Iniciativa local:",
    content: "¿Alguien sabe de bibliotecas comunitarias en la zona norte?",
  },
]

export function ProfilePage() {
  const { profileTab, setProfileTab, user, setCurrentPage, notifications } = useApp()

  if (!user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="bg-card border-2 border-dashed border-border rounded-3xl p-12 text-center max-w-sm animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Sesión Requerida</h2>
          <p className="text-muted-foreground font-medium mb-8">Inicia sesión para ver y gestionar tu perfil personal.</p>
          <button 
            onClick={() => setCurrentPage("login")}
            className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            IR AL LOGIN
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-card border-2 border-border p-6 rounded-3xl shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/60 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
            {user.avatar || user.name.charAt(0).toUpperCase()}
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-card border-2 border-border rounded-2xl text-primary hover:bg-primary hover:text-primary-foreground shadow-lg transition-all active:scale-90">
            <Pencil size={18} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <h2 className="text-3xl font-[900] tracking-tighter uppercase">{user.name}</h2>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 ${
              user.role === 'admin' 
              ? 'bg-[#fcc30b]/20 text-[#fcc30b] border-[#fcc30b]/30' 
              : 'bg-primary/10 text-primary border-primary/20'
            }`}>
              {user.role}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
             <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
              <Mail size={14} className="text-primary" /> {user.email}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
              <Calendar size={14} className="text-primary" /> Miembro desde 2024
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setProfileTab(profileTab === "notifications" ? "info" : "notifications")}
            className={`p-4 rounded-2xl transition-all shadow-md active:scale-95 border-2 ${
              profileTab === "notifications"
                ? "bg-primary border-primary text-primary-foreground shadow-primary/20"
                : "bg-card border-border text-foreground hover:bg-muted"
            }`}
            aria-label="Notificaciones"
          >
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-1 bg-card border-2 border-border rounded-3xl p-3 flex flex-col gap-2 shadow-lg">
          {(["info", "notifications", "progress"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setProfileTab(tab)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
                profileTab === tab
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {tab === "info" && <UserIcon size={18} />}
              {tab === "notifications" && <Bell size={18} />}
              {tab === "progress" && <Award size={18} />}
              {tab === "info" ? "Perfil" : tab === "notifications" ? "Avisos" : "Logros"}
            </button>
          ))}
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          {profileTab === "info" && (
            <div className="bg-card border-2 border-border rounded-3xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-500">
               <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Tu actividad en el foro</h3>
                </div>
                
                {forumMessages.length > 0 ? (
                  <div className="space-y-4">
                    {forumMessages.map((msg) => (
                      <div key={msg.id} className="bg-muted/30 border-2 border-border p-6 rounded-3xl group hover:border-primary/30 transition-colors">
                        <h5 className="font-black text-lg mb-2 flex items-center gap-2">
                          <MessageCircle size={18} className="text-primary" />
                          {msg.title}
                        </h5>
                        <p className="text-foreground/80 font-medium leading-relaxed italic">"{msg.content}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground font-bold italic p-8 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border">No has participado en debates todavía.</p>
                )}
              </div>
            </div>
          )}

          {profileTab === "notifications" && (
             <div className="bg-card border-2 border-border rounded-[2rem] overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-500">
               <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-[#fcc30b] rounded-full" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Buzón de Notificaciones</h3>
                </div>
                
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <button 
                      key={notif.id} 
                      onClick={() => setCurrentPage(notif.href)}
                      className="w-full text-left bg-[#fcc30b]/5 border-2 border-[#fcc30b]/20 p-6 rounded-3xl relative overflow-hidden group hover:border-[#fcc30b] transition-all active:scale-[0.99]"
                    >
                      <div className="absolute top-0 right-0 p-2 bg-[#fcc30b] text-primary rounded-bl-2xl">
                        <ShieldCheck size={14} />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-black text-lg text-[#a21942] uppercase tracking-tight">{notif.title}</h5>
                        <span className="text-[10px] font-black opacity-50">{new Date(notif.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-foreground/80 font-bold mb-4">{notif.content}</p>
                      <div className="flex items-center gap-2 text-[#a21942] font-black text-[10px] uppercase tracking-widest">
                        Ir a la actividad <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}

                  {notifications.length === 0 && (
                    <p className="text-muted-foreground text-center py-8 font-medium">No tienes avisos nuevos.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {profileTab === "progress" && <ProfileProgress />}
        </div>
      </div>
    </main>
  )
}

function ProfileProgress() {
  const { completedQuizzes } = useApp()
  const totalQuizzes = QUIZZES.length
  const completedCount = completedQuizzes.length
  const completionPercent = Math.round((completedCount / totalQuizzes) * 100)

  return (
    <div className="bg-card border-2 border-border rounded-[2rem] overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-primary rounded-full" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Progreso de Formación</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Cuestionarios", value: completedCount.toString(), total: totalQuizzes.toString(), color: "bg-primary" },
            { label: "Completado", value: completionPercent.toString(), unit: "%", color: "bg-[#4c9f38]" },
            { label: "Racha", value: completedCount > 0 ? "3" : "0", color: "bg-[#fcc30b]" },
            { label: "Nivel", value: completedCount === totalQuizzes ? "Maestro ODS" : completedCount > 1 ? "Iniciado" : "Novato", color: "bg-[#00689d]" }
          ].map((stat, i) => (
            <div key={i} className="bg-muted p-6 rounded-3xl border border-border shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter leading-none">{stat.value}</span>
                {stat.total && <span className="text-muted-foreground font-bold">/ {stat.total}</span>}
                {stat.unit && <span className="text-muted-foreground font-black">{stat.unit}</span>}
              </div>
              <div className="w-full h-1.5 bg-background rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full ${stat.color} transition-all duration-1000`} 
                  style={{ width: stat.total ? `${(Number(stat.value)/Number(stat.total))*100}%` : stat.unit ? `${stat.value}%` : '80%' }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
