"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useApp } from "@/lib/app-context"

const tutorialSteps = [
  {
    text: "Para acceder al menu y ver el resto de opciones, pulse en el icono de la esquina superior izquierda",
    highlight: "menu",
  },
  {
    text: "Para alternar entre modo claro y modo oscuro, pulse el boton de la esquina superior derecha",
    highlight: "theme",
  },
]

export function TutorialOverlay() {
  const { showTutorial, setShowTutorial, tutorialStep, setTutorialStep } = useApp()

  if (!showTutorial) return null

  const step = tutorialSteps[tutorialStep]

  const handleNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1)
    } else {
      setShowTutorial(false)
    }
  }

  const handlePrev = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1)
    }
  }

  const handleSkip = () => {
    setShowTutorial(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative z-10 mx-4 max-w-lg w-full">
        {/* Mini preview of the app */}
        <div className="bg-card rounded-lg shadow-xl overflow-hidden mb-4 border-2 border-primary-foreground/30 scale-75 md:scale-90 origin-center">
          <div className="flex items-center justify-between px-3 py-2 bg-primary text-primary-foreground">
            <div className={`p-1 rounded ${step?.highlight === "menu" ? "ring-4 ring-[#c5192d] ring-offset-2 ring-offset-primary" : ""}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </div>
            <span className="text-xs font-bold">OBJETIVOS DE DESARROLLO SOSTENIBLE</span>
            <div className={`p-1 rounded ${step?.highlight === "theme" ? "ring-4 ring-[#c5192d] ring-offset-2 ring-offset-primary" : ""}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-bold text-center text-card-foreground mb-2">ODS 4: EDUCACION DE CALIDAD</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              El Objetivo de Desarrollo Sostenible 4 es uno de los 17 objetivos establecidos por las Naciones Unidas en la Agenda 2030.
            </p>
          </div>
        </div>

        {/* Tutorial instruction card */}
        <div className="bg-primary text-primary-foreground rounded-xl p-6 text-center shadow-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={tutorialStep === 0}
              className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors disabled:opacity-30"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <p className="text-lg font-bold leading-relaxed px-4 text-balance">
              {step?.text}
            </p>

            <button
              onClick={handleNext}
              className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${i === tutorialStep ? "bg-primary-foreground" : "bg-primary-foreground/40"
                  }`}
              />
            ))}
          </div>

          <button
            onClick={handleSkip}
            className="mt-4 text-sm underline hover:no-underline text-primary-foreground/80"
          >
            Saltar tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
