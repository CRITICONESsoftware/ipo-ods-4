"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useApp } from "@/lib/app-context"

const tutorialSteps = [
  {
    text: "Para acceder al menu y ver el resto de opciones, pulse en el icono de la esquina superior izquierda",
    image: "/tutorial1.png",
  },
  {
    text: "Personaliza tu experiencia: Activa la Lupa, el Narrador o filtros de color desde el panel de Accesibilidad",
    image: "/tutorial2.png",
  },
  {
    text: "¡Habla con la web! Activa el Control por Voz para navegar diciendo 'Inicio', 'Vídeo' o 'Perfil'",
    image: "/tutorial3.png",
  },
  {
    text: "Atajos Rápidos: H (Inicio), P (Perfil), V (Vídeo), A (Ajustes), F (Foro), D (Donar), Q (Quiz), L (Login), S (Registro)",
    image: "/tutorial4.png",
  },
  {
    text: "Para alternar entre modo claro y modo oscuro, pulse el boton de la esquina superior derecha",
    image: "/tutorial5.png",
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
        <div className="bg-card rounded-lg shadow-xl overflow-hidden mb-4 border-2 border-primary-foreground/30 scale-75 md:scale-90 origin-center">
          <img
            src={step?.image}
            alt={`Tutorial paso ${tutorialStep + 1}`}
            className="w-full h-auto object-cover"
          />
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
