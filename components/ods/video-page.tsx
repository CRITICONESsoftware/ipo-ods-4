"use client"

import { Play, Volume2, Maximize2, Pause } from "lucide-react"
import { useState, useRef } from "react"

export function VideoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(5)
  const [duration] = useState(320)
  const progressRef = useRef<HTMLDivElement>(null)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")
    return `${m}:${s}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = x / rect.width
      setCurrentTime(Math.floor(percent * duration))
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="border-4 border-primary rounded-xl overflow-hidden bg-card shadow-lg">
        {/* Video area */}
        <div className="relative aspect-video bg-gradient-to-br from-[#e8f4f8] to-[#b8dce8] dark:from-[#1a3040] dark:to-[#0d2030] flex items-center justify-center">
          {/* ODS 4 badge */}
          <div className="absolute top-4 left-4 bg-[#c5192d] rounded-lg p-2 shadow-md">
            <span className="text-white font-bold text-lg block leading-none">4</span>
            <span className="text-white text-[8px] font-bold uppercase leading-tight block">
              Educacion<br />de Calidad
            </span>
            <svg viewBox="0 0 40 40" className="w-6 h-6 mt-1" fill="none">
              <path d="M8 30 V10 H22 L27 15 V30 Z" stroke="white" strokeWidth="1.5" />
              <circle cx="30" cy="28" r="7" stroke="white" strokeWidth="1.5" />
              <path d="M27 28 L29 30 L33 26" stroke="white" strokeWidth="1.2" />
            </svg>
          </div>

          {/* Decorative plant image representation */}
          <div className="flex flex-col items-center justify-center">
            <svg viewBox="0 0 120 150" className="w-32 h-40" fill="none">
              <path d="M60 150 V80" stroke="#0093d5" strokeWidth="3" />
              <ellipse cx="60" cy="60" rx="20" ry="30" fill="#0093d5" opacity="0.7" />
              <ellipse cx="40" cy="50" rx="15" ry="25" fill="#0093d5" opacity="0.5" transform="rotate(-20 40 50)" />
              <ellipse cx="80" cy="50" rx="15" ry="25" fill="#0093d5" opacity="0.5" transform="rotate(20 80 50)" />
              <ellipse cx="55" cy="35" rx="12" ry="20" fill="#4dc4e6" opacity="0.6" transform="rotate(-10 55 35)" />
              <ellipse cx="70" cy="40" rx="10" ry="18" fill="#4dc4e6" opacity="0.6" transform="rotate(15 70 40)" />
            </svg>
          </div>

          {/* ODS Logo in video */}
          <div className="absolute bottom-16 left-4 text-primary text-xs font-bold opacity-60">
            OBJETIVOS DE DESARROLLO SOSTENIBLE
          </div>
        </div>

        {/* Video controls */}
        <div className="bg-primary/90 px-3 py-2">
          {/* SDG color strip */}
          <div className="flex gap-0.5 mb-2">
            {["#e5243b","#dda63a","#4c9f38","#c5192d","#ff3a21","#26bde2","#fcc30b","#a21942","#fd6925","#dd1367","#fd9d24","#bf8b2e","#3f7e44","#0a97d9","#56c02b","#00689d","#19486a"].map((color, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            className="w-full h-1.5 bg-primary-foreground/30 rounded-full cursor-pointer mb-2"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary-foreground rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-primary-foreground text-xs font-mono">
                {formatTime(currentTime)} - {formatTime(duration)}
              </span>
              <button className="text-primary-foreground hover:text-primary-foreground/80" aria-label="Volumen">
                <Volume2 className="w-4 h-4" />
              </button>
              <button className="text-primary-foreground hover:text-primary-foreground/80" aria-label="Pantalla completa">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
