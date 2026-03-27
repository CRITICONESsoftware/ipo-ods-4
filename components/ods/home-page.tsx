"use client"

import { Share2 } from "lucide-react"
import { useApp } from "@/lib/app-context"

export function HomePage() {
  const { setCurrentPage } = useApp()

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6 text-balance">
        ODS 4: EDUCACION DE CALIDAD
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 bg-card border border-border rounded-lg p-6 shadow-sm">
          <p className="text-foreground leading-relaxed mb-4">
            El Objetivo de Desarrollo Sostenible 4 es uno de los 17 objetivos
            establecidos por las Naciones Unidas en la Agenda 2030.
          </p>
          <p className="text-foreground leading-relaxed mb-6">
            {'La meta a conseguir es: "Garantizar una educacion inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje durante toda la vida para todos".'}
          </p>

          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-[#0080b8] transition-colors text-sm font-medium"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "ODS 4: Educacion de Calidad",
                  text: "Conoce mas sobre el Objetivo de Desarrollo Sostenible 4",
                  url: window.location.href,
                })
              }
            }}
          >
            Compartir <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-shrink-0 w-full md:w-48">
          <div className="bg-[#c5192d] rounded-lg p-4 text-center">
            <div className="text-primary-foreground">
              <span className="text-4xl font-bold text-white">4</span>
              <div className="text-xs font-bold mt-1 text-white uppercase leading-tight">
                Educacion<br />de Calidad
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
                <path d="M15 60 V20 H45 L55 30 V60 Z" stroke="white" strokeWidth="3" fill="none" />
                <path d="M25 35 H45" stroke="white" strokeWidth="2" />
                <path d="M25 42 H45" stroke="white" strokeWidth="2" />
                <path d="M25 49 H40" stroke="white" strokeWidth="2" />
                <circle cx="58" cy="55" r="14" stroke="white" strokeWidth="3" fill="none" />
                <path d="M52 55 L56 59 L64 51" stroke="white" strokeWidth="2.5" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
