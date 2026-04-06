"use client"

import { useState } from "react"
import { Bell, Pencil, Check, X, Award, Flame, Target, BookOpen, Clock, User, Mail, Info } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { toast, Toaster } from "sonner"

export function ProfilePage() {
  const { profileTab, setProfileTab, user, setUser, notifications, setNotifications } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio,
    email: user.email
  })

  const handleSave = () => {
    setUser(editData)
    setIsEditing(false)
    toast.success("Perfil actualizado con éxito")
  }

  const cancelEdit = () => {
    setEditData({
      name: user.name,
      bio: user.bio,
      email: user.email
    })
    setIsEditing(false)
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto pb-20">
      <Toaster position="top-right" richColors />

      {/* Profile Header Card */}
      <div className="relative mb-8 bg-card rounded-3xl overflow-hidden shadow-xl border border-border">
        <div className="h-32 bg-gradient-to-r from-primary via-accent to-primary opacity-90" />
        <div className="px-6 pb-6">
          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12 md:-mt-16">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-secondary border-4 border-card shadow-lg flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 md:w-16 md:h-16 text-primary/50" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-card">
                LVL {user.level}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>

            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isEditing ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:shadow-lg hover:scale-105"}`}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                {isEditing ? "Cancelar" : "Editar"}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-tabs inside the card */}
        <div className="flex border-t border-border bg-muted/30">
          {(["info", "progress", "notifications"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setProfileTab(tab)}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${profileTab === tab ? "text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              {tab === "info" ? "Información" : tab === "progress" ? "Estadísticas" : "Actividad"}
              {tab === "notifications" && notifications.some(n => !n.read) && (
                <span className="absolute top-1/2 -mt-4 right-1/4 w-2 h-2 bg-destructive rounded-full" />
              )}
              {profileTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-6 transition-all duration-300">
        {/* INFO TAB */}
        {profileTab === "info" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                <Info className="w-5 h-5 text-primary" />
                Sobre mí
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Nombre completo</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Email</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Biografía</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Guardar cambios
                    </button>
                    <button onClick={cancelEdit} className="px-6 bg-muted text-muted-foreground py-2 rounded-xl font-bold">
                      Descartar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed italic text-lg">
                  "{user.bio}"
                </p>
              )}
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                Logros recientes
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {user.badges.map((badge, i) => (
                  <div key={i} className="flex-shrink-0 w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all cursor-help text-center p-2 shadow-sm">
                    <Award className="w-10 h-10 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter leading-none">{badge}</span>
                  </div>
                ))}
              </div>
            </section>

            <button
              onClick={() => toast.info("Saliendo de la cuenta...")}
              className="w-full py-4 rounded-2xl border-2 border-destructive/20 text-destructive font-bold uppercase tracking-wider hover:bg-destructive hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Cerrar Sesión
            </button>
          </div>
        )}

        {/* PROGRESS TAB */}
        {profileTab === "progress" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard icon={<Flame className="text-orange-500" />} label="Racha actual" value={`${user.streak} días`} />
              <StatCard icon={<Target className="text-green-500" />} label="Precisión" value={`${user.accuracy}%`} />
              <StatCard icon={<BookOpen className="text-blue-500" />} label="Completados" value={user.quizzesCompleted} />
            </div>

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Award className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between relative z-10">
                Experiencia (XP)
                <span className="text-sm text-primary">{user.xp} / 3000 XP</span>
              </h3>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden mb-2 relative z-10">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: `${(user.xp / 3000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center relative z-10 font-medium">Faltan 550 XP para el nivel {user.level + 1}</p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Actividad SEMANAL (Minutos)</h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {[30, 60, 45, 90, 20, 10, 50].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className="w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-lg relative"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                        {h} min
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">{["L", "M", "X", "J", "V", "S", "D"][i]}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* NOTIFICATIONS / ACTIVITY TAB */}
        {profileTab === "notifications" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Forum activity section */}
            <section className="space-y-3">
              <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Tus Mensajes en el Foro
              </h3>
              {user.forumPosts.map(post => (
                <div key={post.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">{post.title}</h4>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{post.date}</span>
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed">{post.content}</p>
                </div>
              ))}
            </section>

            <div className="flex justify-between items-center px-2 pt-4">
              <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest flex items-center gap-2">
                <Bell className="w-3 h-3" /> Notificaciones
              </h3>
              <button onClick={markAllAsRead} className="text-primary text-[10px] font-bold hover:underline tracking-tight">Marcar todo como leído</button>
            </div>

            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.slice().reverse().map((notif) => (
                  <div
                    key={notif.id}
                    className={`bg-card border border-border rounded-2xl p-5 shadow-sm transition-all relative ${!notif.read ? "border-l-4 border-l-primary" : "opacity-70"}`}
                  >
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="absolute top-4 right-4 text-[10px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded-lg"
                      >
                        Marcar leída
                      </button>
                    )}
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-2xl h-fit ${notif.read ? "bg-muted" : "bg-primary/10"}`}>
                        <Bell className={`w-5 h-5 ${notif.read ? "text-muted-foreground" : "text-primary"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-bold text-foreground text-sm">{notif.title}</h5>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                            <Clock className="w-2 h-2" /> {notif.date}
                          </span>
                        </div>
                        <p className="text-foreground/80 text-xs leading-relaxed">{notif.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-20">
                  <p className="font-bold text-xs">No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
      <div className="p-3 rounded-xl bg-muted/50 text-xl font-bold">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}
