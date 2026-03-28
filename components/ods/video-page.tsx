"use client"

import { Play, Volume2, VolumeX, Maximize2, Pause } from "lucide-react"
import { useState, useRef, useEffect, useCallback, MouseEvent } from "react"
import { Slider } from "@/components/ui/slider"

// Minimal inline types for the YouTube IFrame API so we don't need @types/youtube
interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  destroy: () => void
}
interface YTPlayerEvent {
  target: YTPlayer
  data: number
}
interface YTPlayerOptions {
  videoId: string
  playerVars?: Record<string, number | string>
  events?: {
    onReady?: (e: YTPlayerEvent) => void
    onStateChange?: (e: YTPlayerEvent) => void
  }
}
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

const VIDEO_ID = "4WeJDw9eVQA"

export function VideoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = Math.floor(seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const startTimeTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime())
      }
    }, 500)
  }, [])

  const stopTimeTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const initPlayer = useCallback(() => {
    playerRef.current = new window.YT.Player("yt-player", {
      videoId: VIDEO_ID,
      playerVars: { rel: 0, modestbranding: 1, controls: 0, disablekb: 1 },
      events: {
        onReady: (event) => {
          setDuration(event.target.getDuration())
        },
        onStateChange: (event) => {
          const { PLAYING, ENDED } = window.YT.PlayerState
          if (event.data === PLAYING) {
            setIsPlaying(true)
            setDuration(event.target.getDuration())
            startTimeTracking()
          } else {
            setIsPlaying(false)
            stopTimeTracking()
            if (event.data === ENDED) setCurrentTime(0)
          }
        },
      },
    })
  }, [startTimeTracking, stopTimeTracking])

  useEffect(() => {
    // If API already loaded (e.g. hot-reload)
    if (window.YT?.Player) {
      initPlayer()
      return
    }

    // Otherwise load the script and init on ready
    window.onYouTubeIframeAPIReady = initPlayer

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
    }

    return () => {
      stopTimeTracking()
      playerRef.current?.destroy()
    }
  }, [initPlayer, stopTimeTracking])

  const handlePlayPause = () => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !playerRef.current || duration === 0) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(percent * duration, duration))
    playerRef.current.seekTo(newTime, true)
    setCurrentTime(newTime)
  }

  const handleMuteToggle = () => {
    if (!playerRef.current) return
    if (isMuted) {
      playerRef.current.unMute()
      playerRef.current.setVolume(volume)
      setIsMuted(false)
    } else {
      playerRef.current.mute()
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (vol: number) => {
    setVolume(vol)
    if (!playerRef.current) return
    playerRef.current.setVolume(vol)
    if (vol === 0) {
      playerRef.current.mute()
      setIsMuted(true)
    } else {
      playerRef.current.unMute()
      setIsMuted(false)
    }
  }

  const handleFullscreen = () => {
    containerRef.current?.requestFullscreen?.()
  }

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="border-4 border-primary rounded-xl overflow-hidden bg-card shadow-lg">
        {/* Video area */}
        <div ref={containerRef} className="relative aspect-video bg-black">
          {/* YouTube player mount point – the API replaces this div with an iframe */}
          <div id="yt-player" className="absolute inset-0 w-full h-full" />

          {/* ODS 4 badge */}
          <div className="absolute top-4 left-4 bg-[#c5192d] rounded-lg p-2 shadow-md pointer-events-none z-10">
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

          {/* ODS Logo in video */}
          <div className="absolute bottom-4 left-4 text-white text-xs font-bold opacity-60 pointer-events-none z-10">
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
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePlayPause}
              className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-primary-foreground text-xs font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              {/* Volume control: icon toggles mute; slider adjusts level on hover */}
              <div className="flex items-center gap-1 group">
                <button
                  onClick={handleMuteToggle}
                  className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0
                    ? <VolumeX className="w-4 h-4" />
                    : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="w-0 group-hover:w-20 transition-all duration-300 overflow-hidden px-1">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(vals) => handleVolumeChange(vals[0])}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <button
                onClick={handleFullscreen}
                className="text-primary-foreground hover:text-primary-foreground/80"
                aria-label="Pantalla completa"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
