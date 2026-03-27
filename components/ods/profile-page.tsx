"use client"

import { Bell, Pencil } from "lucide-react"
import { useApp } from "@/lib/app-context"

const notifications = [
  {
    id: 1,
    title: "Nuevo cuestionario disponible:",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices a orci ac ullamcorper. Suspendisse libero dolor, scelerisque at imperdiet nec, vulputate egestas augue. Morbi hendrerit non lacus ut tincidunt.",
  },
  {
    id: 2,
    title: "Nuevo cuestionario disponible:",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod urna et felis cursus, in gravida magna pretium.",
  },
]

const forumMessages = [
  {
    id: 1,
    title: "Nuevo estudio:",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultrices a orci ac ullamcorper. Suspendisse libero dolor, scelerisque at imperdiet nec, vulputate egestas augue. Morbi hendrerit non lacus ut tincidunt.",
  },
]

export function ProfilePage() {
  const { profileTab, setProfileTab } = useApp()

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold italic text-foreground">Perfil:</h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setProfileTab(profileTab === "notifications" ? "info" : "notifications")
            }
            className={`p-2 rounded-lg transition-colors ${
              profileTab === "notifications"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
            aria-label="Notificaciones"
          >
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Profile info tab */}
      {profileTab === "info" && (
        <div className="border-2 border-primary rounded-xl overflow-hidden shadow-sm">
          <div className="bg-primary px-4 py-3">
            <h3 className="text-xl font-bold text-primary-foreground">Nombre Apellido Apellido</h3>
          </div>
          <div className="bg-accent/30 p-4">
            <h4 className="font-bold text-primary mb-2">Ultimos mensajes en el foro:</h4>
            {forumMessages.map((msg) => (
              <div key={msg.id} className="bg-card border border-border rounded-lg p-4 mb-3">
                <h5 className="font-bold text-foreground mb-2">{msg.title}</h5>
                <p className="text-foreground text-sm leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>

          {/* Edit icon */}
          <div className="flex justify-end p-2">
            <button className="text-primary hover:text-[#0080b8] transition-colors" aria-label="Editar perfil">
              <Pencil className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {profileTab === "notifications" && (
        <div className="border-2 border-primary rounded-xl overflow-hidden shadow-sm">
          <div className="bg-primary px-4 py-3">
            <h3 className="text-lg font-bold text-primary-foreground">Notificaciones:</h3>
          </div>
          <div className="bg-accent/30 p-4 max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className="bg-card border border-border rounded-lg p-4 mb-3">
                <h5 className="font-bold text-foreground mb-2">{notif.title}</h5>
                <p className="text-foreground text-sm leading-relaxed">{notif.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress tab */}
      {profileTab === "progress" && <ProfileProgress />}

      {/* Tab navigation at bottom */}
      <div className="flex justify-center gap-2 mt-6">
        {(["info", "notifications", "progress"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setProfileTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              profileTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {tab === "info" ? "Perfil" : tab === "notifications" ? "Notificaciones" : "Progreso"}
          </button>
        ))}
      </div>
    </main>
  )
}

function ProfileProgress() {
  return (
    <div className="border-2 border-primary rounded-xl overflow-hidden shadow-sm">
      <div className="bg-primary px-4 py-3">
        <h3 className="text-lg font-bold text-primary-foreground">Progreso en cuestionarios:</h3>
      </div>
      <div className="bg-card p-6 border border-border">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">Cuestionarios realizados:</span>
            <span className="text-foreground font-bold">20 / 30</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">Porcentaje de aciertos:</span>
            <span className="text-foreground font-bold">87 %</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">Racha de aciertos mas alta:</span>
            <span className="text-foreground font-bold">10</span>
          </div>
        </div>
      </div>
    </div>
  )
}
