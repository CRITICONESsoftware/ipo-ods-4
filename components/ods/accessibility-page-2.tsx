"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"

export function AccessibilityPage2() {
  const { setCurrentPage } = useApp()
  const [contentReader, setContentReader] = useState("Desactivado")
  const [voiceNav, setVoiceNav] = useState("Desactivado")
  const [vibration, setVibration] = useState("Desactivado")

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-foreground mb-6 uppercase">
        Opciones de Accesibilidad
      </h2>

      {/* Sound section */}
      <section className="mb-8">
        <h3 className="font-bold text-foreground mb-4">Sonido:</h3>

        <div className="ml-4 mb-6">
          <p className="text-foreground font-medium mb-2">Lector de contenido:</p>
          <div className="ml-4 flex flex-col gap-1">
            {["Desactivado", "Activado"].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                <input
                  type="radio"
                  name="contentReader"
                  checked={contentReader === option}
                  onChange={() => setContentReader(option)}
                  className="w-4 h-4 accent-primary"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="ml-4 mb-6">
          <p className="text-foreground font-medium mb-2">Navegacion por voz:</p>
          <div className="ml-4 flex flex-col gap-1">
            {["Desactivado", "Activado"].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                <input
                  type="radio"
                  name="voiceNav"
                  checked={voiceNav === option}
                  onChange={() => setVoiceNav(option)}
                  className="w-4 h-4 accent-primary"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Vibration section */}
      <section className="mb-8">
        <h3 className="font-bold text-foreground mb-4">Vibracion al pulsar:</h3>
        <div className="ml-4 flex flex-col gap-1">
          {["Desactivado", "Activado"].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="radio"
                name="vibration"
                checked={vibration === option}
                onChange={() => setVibration(option)}
                className="w-4 h-4 accent-primary"
              />
              {option}
            </label>
          ))}
        </div>
      </section>

      {/* Navigation back to page 1 */}
      <div className="mt-8 flex justify-start">
        <button
          onClick={() => setCurrentPage("accessibility-1")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-[#0080b8] transition-colors font-medium"
        >
          Pagina anterior
        </button>
      </div>
    </main>
  )
}
