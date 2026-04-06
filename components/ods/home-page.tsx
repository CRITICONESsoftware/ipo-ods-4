"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { useApp } from "@/lib/app-context"

export function HomePage() {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (!navigator.share || isSharing) return

    try {
      setIsSharing(true)
      await navigator.share({
        title: "ODS 4: Educación de Calidad",
        text: "Conoce más sobre el Objetivo de Desarrollo Sostenible 4",
        url: window.location.href,
      })
    } catch (error) {
      // Ignoramos el error si el usuario cancela (AbortError), pero registramos otros
      if ((error as Error).name !== "AbortError") {
        console.error("Error al compartir:", error)
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6 text-balance">
        ODS 4: EDUCACIÓN DE CALIDAD
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 bg-card border border-border rounded-lg p-6 shadow-sm">
          <p className="text-foreground leading-relaxed mb-4">
            El Objetivo de Desarrollo Sostenible 4 es uno de los 17 objetivos
            establecidos por las Naciones Unidas en la Agenda 2030.
          </p>
          <p className="text-foreground leading-relaxed mb-6">
            {'La meta a conseguir es: "Garantizar una educación inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje durante toda la vida para todos".'}
          </p>

          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-[#0080b8] transition-colors text-sm font-medium disabled:opacity-50"
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? "Compartiendo..." : "Compartir"} <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-shrink-0 w-full md:w-48">
          <img
            src="/ods4.jpg"
            alt="ODS 4: Educación de Calidad"
            className="w-full rounded-lg shadow-md border border-border"
          />
        </div>
      </div>
    </main>
  )
}
