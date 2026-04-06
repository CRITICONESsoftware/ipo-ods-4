"use client"

import { Play, Volume2, VolumeX, Maximize2, Pause, Captions } from "lucide-react"
import { useState, useRef, useEffect, useCallback, MouseEvent } from "react"
import { Slider } from "@/components/ui/slider"
import { useApp } from "@/lib/app-context"
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
  loadModule: (name: string) => void
  unloadModule: (name: string) => void
  setOption: (module: string, option: string, value: any) => void
  getOptions: (module: string) => string[]
}
interface YTPlayerEvent {
  target: YTPlayer
  data: number
}
interface YTPlayerOptions {
  videoId: string
  host?: string
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

const VIDEO_ID = "WJoUZ1SLAHw"

export function VideoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [captionsEnabled, setCaptionsEnabled] = useState(false)
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

  const { accessibility } = useApp()

  const initPlayer = useCallback(() => {
    // Si el div contenedor ya no está, abortamos
    if (!document.getElementById("yt-player")) return

    playerRef.current = new window.YT.Player("yt-player", {
      videoId: VIDEO_ID,
      host: 'https://www.youtube-nocookie.com',
      playerVars: { 
        origin: window.location.origin,
        rel: 0, 
        modestbranding: 1, 
        controls: 0, 
        disablekb: 1, 
        cc_load_policy: accessibility.hearingAids || captionsEnabled ? 1 : 0 
      },
      events: {
        onReady: (event) => {
          setDuration(event.target.getDuration())
          if (accessibility.hearingAids) {
            event.target.setVolume(100)
            setVolume(100)
            event.target.loadModule?.("captions")
            setCaptionsEnabled(true)
          }
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
  }, [startTimeTracking, stopTimeTracking, accessibility.hearingAids, captionsEnabled])

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

  // React to hearingAids toggle while playing
  useEffect(() => {
    if (playerRef.current && accessibility.hearingAids) {
        playerRef.current.loadModule?.("captions")
        setCaptionsEnabled(true)
    }
  }, [accessibility.hearingAids])

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

  const handleCaptionsToggle = () => {
    if (!playerRef.current) return
    if (captionsEnabled) {
      playerRef.current.unloadModule("captions")
      setCaptionsEnabled(false)
    } else {
      playerRef.current.loadModule("captions")
      setCaptionsEnabled(true)
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto">
      <div ref={containerRef} className="border-4 border-primary rounded-xl overflow-hidden bg-card shadow-lg flex flex-col">
        {/* Video area */}
        <div className="relative aspect-video bg-black w-full">
          {/* YouTube player mount point – the API replaces this div with an iframe */}
          <div id="yt-player" className="absolute inset-0 w-full h-full" />

          {/* ODS 4 badge - Moved to top-right to avoid overlapping YouTube's built-in title/controls */}
          <div className="absolute top-4 right-4 bg-[#c5192d] rounded-lg p-2 shadow-md pointer-events-none z-10">
            <span className="text-white font-bold text-lg block leading-none text-center">4</span>
            <span className="text-white text-[8px] font-bold uppercase leading-tight block text-center mt-0.5">
              Educacion<br />de Calidad
            </span>
          </div>

          {/* ODS Logo in video */}
          <div className="absolute top-4 left-4 text-white text-xs font-bold opacity-80 pointer-events-none z-10 flex flex-col drop-shadow-md">
            <span>OBJETIVOS DE</span>
            <span>DESARROLLO SOSTENIBLE</span>
          </div>
        </div>

        {/* Video controls */}
        <div className="bg-primary/95 px-4 py-3 shrink-0">
          {/* SDG color strip */}
          <div className="flex gap-0 mb-3 rounded-full overflow-hidden h-1.5 opacity-90">
            {["#e5243b","#dda63a","#4c9f38","#c5192d","#ff3a21","#26bde2","#fcc30b","#a21942","#fd6925","#dd1367","#fd9d24","#bf8b2e","#3f7e44","#0a97d9","#56c02b","#00689d","#19486a"].map((color, i) => (
              <div
                key={i}
                className="flex-1 h-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            className="w-full h-2 bg-primary-foreground/20 rounded-full cursor-pointer mb-3 relative group"
            onClick={handleProgressClick}
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary-foreground rounded-full transition-all group-hover:bg-accent"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePlayPause}
              className="text-primary-foreground hover:scale-110 active:scale-95 transition-all p-1"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>

            <div className="flex items-center gap-4">
              <span className="text-primary-foreground text-sm font-mono opacity-90 hidden sm:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              {/* Volume control */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={handleMuteToggle}
                  className="text-primary-foreground hover:scale-110 transition-transform p-1"
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0
                    ? <VolumeX className="w-5 h-5" />
                    : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="w-0 sm:group-hover/vol:w-24 group-hover/vol:w-16 transition-all duration-300 overflow-hidden flex items-center h-full">
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
                onClick={handleCaptionsToggle}
                className={`transition-all p-1 hover:scale-110 ${captionsEnabled ? "text-primary-foreground" : "text-primary-foreground/40"}`}
                aria-label={captionsEnabled ? "Desactivar subtítulos" : "Activar subtítulos"}
              >
                <Captions className="w-5 h-5" />
              </button>
              <button
                onClick={handleFullscreen}
                className="text-primary-foreground hover:scale-110 transition-transform p-1 ml-1"
                aria-label="Pantalla completa"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
