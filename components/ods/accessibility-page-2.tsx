"use client"

import { toast, Toaster } from "sonner"
import { useApp } from "@/lib/app-context"

export function AccessibilityPage2() {
  const { setCurrentPage, accessibility, setAccessibility } = useApp()

  const handleSettingChange = (setting: keyof typeof accessibility, value: boolean) => {
    setAccessibility({ [setting]: value })
    toast.info("Ajuste actualizado", {
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} cambiado a ${value ? "Activado" : "Desactivado"}`,
      duration: 2000,
    })
  }

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <Toaster position="top-right" richColors />
      <h2 className="text-2xl font-bold text-center text-foreground mb-6 uppercase tracking-wider">
        Opciones de Accesibilidad
      </h2>

      {/* Sound section */}
      <section className="mb-10 bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Sonido y Audio:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lector de contenido */}
          <div className="bg-muted/30 p-5 rounded-xl">
            <p className="text-foreground font-semibold mb-3">Lector de contenido:</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Desactivado", value: false },
                { label: "Activado", value: true }
              ].map((option) => (
                <label key={option.label} className="flex items-center gap-3 cursor-pointer group hover:bg-white/50 dark:hover:bg-black/20 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="contentReader"
                    checked={accessibility.contentReader === option.value}
                    onChange={() => handleSettingChange("contentReader", option.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className={`text-sm ${accessibility.contentReader === option.value ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground italic">
              Activa la lectura automática de los textos de la página por voz sintetizada.
            </p>
          </div>

          {/* Navegación por voz */}
          <div className="bg-muted/30 p-5 rounded-xl">
            <p className="text-foreground font-semibold mb-3">Navegación por voz:</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Desactivado", value: false },
                { label: "Activado", value: true }
              ].map((option) => (
                <label key={option.label} className="flex items-center gap-3 cursor-pointer group hover:bg-white/50 dark:hover:bg-black/20 p-2 rounded-lg transition-colors">
                  <input
                    type="radio"
                    name="voiceNav"
                    checked={accessibility.voiceNav === option.value}
                    onChange={() => handleSettingChange("voiceNav", option.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className={`text-sm ${accessibility.voiceNav === option.value ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground italic">
              Permite navegar por el menú diciendo comandos de voz.
            </p>
          </div>
        </div>
      </section>

      {/* Vibration section */}
      <section className="mb-10 bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Vibración:
        </h3>
        <div className="ml-4 max-w-sm">
          <p className="text-foreground font-medium mb-3">Vibración al pulsar botones:</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Desactivado", value: false },
              { label: "Activado", value: true }
            ].map((option) => (
              <label key={option.label} className="flex items-center gap-3 cursor-pointer group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                <input
                  type="radio"
                  name="vibration"
                  checked={accessibility.vibration === option.value}
                  onChange={() => handleSettingChange("vibration", option.value)}
                  className="w-4 h-4 accent-primary"
                />
                <span className={`text-sm ${accessibility.vibration === option.value ? "font-bold text-primary" : "text-muted-foreground"}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation back to page 1 */}
      <div className="mt-8 flex justify-start">
        <button
          onClick={() => setCurrentPage("accessibility-1")}
          className="px-8 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all font-bold flex items-center gap-2 border border-border"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Página anterior
        </button>
      </div>
    </main>
  )
}
