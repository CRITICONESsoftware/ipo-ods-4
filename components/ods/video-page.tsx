"use client"

import { Play, Volume2, VolumeX, Maximize2, Pause, Captions, X, Settings } from "lucide-react"
import { useState, useRef, useEffect, useCallback, MouseEvent } from "react"
import { Slider } from "@/components/ui/slider"
import { useApp } from "@/lib/app-context"
import { toast } from "sonner"
// Minimal inline types for the YouTube IFrame API so we don't need @types/youtube
interface YTPlayer {
  playVideo?: () => void
  pauseVideo?: () => void
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime?: () => number
  getDuration?: () => number
  setVolume?: (volume: number) => void
  getVolume?: () => number
  mute?: () => void
  unMute?: () => void
  isMuted?: () => boolean
  destroy?: () => void
  loadModule?: (name: string) => void
  unloadModule?: (name: string) => void
  setOption?: (module: string, option: string, value: any) => void
  getOption?: (module: string, option: string) => any
  getOptions?: (module: string, option?: string) => any
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

const VIDEO_ID = "xYUF3BLlTkw"

const processTracks = (rawTracks: any) => {
  if (!Array.isArray(rawTracks)) return []
  return rawTracks.map((t, idx) => {
    if (typeof t === 'string') return { uid: t, languageCode: t, displayName: t.toUpperCase(), languageName: t.toUpperCase() }
    if (t && typeof t === 'object') {
      const code = t.languageCode || t.language || t.id || '';
      const nameStr = t.displayName || t.languageName || t.name || code || `Pista ${idx + 1}`;
      const uid = t.vss_id || t.id || t.name || code || `track_${idx}`;
      return { ...t, uid, languageCode: code, displayName: nameStr }
    }
    return null
  }).filter(Boolean)
}

export function VideoPage() {
  const { accessibility, setAccessibility } = useApp()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [captionsEnabled, setCaptionsEnabled] = useState(accessibility.subtitles || accessibility.hearingAids)
  const captionsEnabledRef = useRef(accessibility.subtitles || accessibility.hearingAids)
  const [availableTracks, setAvailableTracks] = useState<any[]>([])
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsTab, setSettingsTab] = useState<'tracks' | 'size'>('tracks')
  
  const progressRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ytWrapperRef = useRef<HTMLDivElement>(null)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0")
    const s = Math.floor(seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const startTimeTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime?.() || 0)
      }
    }, 500)
  }, [])

  const stopTimeTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const initPlayer = useCallback((langCode: string = 'es', startSeconds: number = 0, shouldPlay: boolean = false) => {
    // Si la API cambia yt-player por iframe, lo restauramos si es necesario
    if (ytWrapperRef.current && !document.getElementById("yt-player")) {
      ytWrapperRef.current.innerHTML = '<div id="yt-player" class="absolute inset-0 w-full h-full"></div>'
    }

    if (!document.getElementById("yt-player")) return

    const isCapsOn = captionsEnabledRef.current

    playerRef.current = new window.YT.Player("yt-player", {
      videoId: VIDEO_ID,
      host: 'https://www.youtube.com',
      playerVars: { 
        autoplay: shouldPlay ? 1 : 0,
        start: Math.floor(startSeconds),
        cc_load_policy: isCapsOn ? 1 : 0, // Enforce subtitle state at load time
        hl: langCode,
        cc_lang_pref: langCode,
        modestbranding: 1,
        rel: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1
      },
      events: {
        onReady: (event) => {
          playerRef.current = event.target
          setDuration(event.target.getDuration?.() || 0)
          setVolume(event.target.getVolume?.() || 100)
          setIsMuted(event.target.isMuted?.() || false)
          
          // Initial Captions check
          if (isCapsOn) {
            event.target.loadModule?.("captions")
          } else {
            event.target.unloadModule?.("captions")
          }

          // Fetch available tracks (wait a bit for module to load)
          setTimeout(() => {
            if (playerRef.current) {
              try {
                // Solo si no tenemos pistas limpias previas
                setAvailableTracks((prev: any[]) => {
                  if (prev.length > 0) return prev;
                  const tracks = playerRef.current?.getOption?.("captions", "tracklist") || []
                  return processTracks(Array.isArray(tracks) ? tracks : [])
                })
                
                setCurrentTrack((prev: any) => {
                  if (prev) return prev; // Keep the active one if we already selected it
                  const current = playerRef.current?.getOption?.("captions", "track")
                  if (current) {
                    const cleanCurrent = processTracks([current])[0]
                    if (cleanCurrent) return cleanCurrent;
                  }
                  return prev;
                })
              } catch (e) {
                console.error("Error fetching tracks:", e)
              }
            }
          }, 1500)
        },
        onStateChange: (event) => {
          const { PLAYING, ENDED } = window.YT.PlayerState
          if (event.data === PLAYING) {
            setIsPlaying(true)
            setDuration(event.target.getDuration?.() || playerRef.current?.getDuration?.() || 0)
            startTimeTracking()
          } else {
            setIsPlaying(false)
            stopTimeTracking()
            if (event.data === ENDED) setCurrentTime(0)
          }
        },
      },
    })
  }, [startTimeTracking, stopTimeTracking, accessibility.hearingAids, accessibility.subtitles])

  useEffect(() => {
    // If API already loaded (e.g. hot-reload)
    if (window.YT?.Player) {
      initPlayer(currentTrack?.languageCode || 'es', currentTime, isPlaying)
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
      playerRef.current?.destroy?.()
    }
  }, [initPlayer, stopTimeTracking])

  useEffect(() => {
    if (!playerRef.current) return
    const newState = accessibility.subtitles
    if (newState === captionsEnabledRef.current) return // No change needed

    setCaptionsEnabled(newState)
    captionsEnabledRef.current = newState
    
    try {
      if (newState) {
        playerRef.current.loadModule?.("captions")
        if (currentTrack?.languageCode === 'en') {
          playerRef.current.setOption?.("captions", "track", {
            languageCode: "es",
            translationLanguage: { languageCode: "en" }
          });
        } else {
          playerRef.current.setOption?.("captions", "track", { languageCode: currentTrack?.languageCode || 'es' });
        }
      } else {
        playerRef.current.unloadModule?.("captions")
      }
    } catch(e) {
      console.error(e)
    }
  }, [accessibility.subtitles, currentTrack?.languageCode])

  const handlePlayPause = () => {
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo?.()
    } else {
      playerRef.current.playVideo?.()
    }
  }

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !playerRef.current || duration === 0) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(percent * duration, duration))
    playerRef.current.seekTo?.(newTime, true)
    setCurrentTime(newTime)
  }

  const handleMuteToggle = () => {
    if (!playerRef.current) return
    if (isMuted || volume === 0) {
      playerRef.current.unMute?.()
      const newVol = volume === 0 ? 50 : volume
      playerRef.current.setVolume?.(newVol)
      setVolume(newVol)
      setIsMuted(false)
    } else {
      playerRef.current.mute?.()
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (vol: number) => {
    setVolume(vol)
    if (!playerRef.current) return
    playerRef.current.setVolume?.(vol)
    if (vol === 0) {
      playerRef.current.mute?.()
      setIsMuted(true)
    } else {
      playerRef.current.unMute?.()
      setIsMuted(false)
    }
  }

  const handleFullscreen = () => {
    containerRef.current?.requestFullscreen?.()
  }

  const handleCaptionsToggle = () => {
    if (!playerRef.current) return
    const newState = !captionsEnabled
    setCaptionsEnabled(newState)
    captionsEnabledRef.current = newState
    
    try {
      if (newState) {
        playerRef.current.loadModule?.("captions")
        // If track is English, try to apply translation
        if (currentTrack?.languageCode === 'en') {
          playerRef.current.setOption?.("captions", "track", {
            languageCode: "es",
            translationLanguage: {
              languageCode: "en"
            }
          });
        } else {
          const lang = currentTrack?.languageCode || 'es'
          playerRef.current.setOption?.("captions", "track", { languageCode: lang });
        }
      } else {
        playerRef.current.unloadModule?.("captions")
      }
    } catch(e) {
      console.error(e)
    }
  }

  const handleTrackChange = (track: any) => {
    if (!playerRef.current) return
    
    setCurrentTrack(track)
    setCaptionsEnabled(true)
    captionsEnabledRef.current = true
    
    try {
      playerRef.current.loadModule?.("captions")
      if (track.languageCode === 'en') {
        playerRef.current.setOption?.("captions", "track", {
          languageCode: "es",
          translationLanguage: {
            languageCode: "en",
            languageName: "English"
          }
        });
      } else {
        playerRef.current.setOption?.("captions", "track", {
          languageCode: track.languageCode
        });
      }
    } catch(err) {
      console.error(err);
    }
  }

  const handleFontSizeChange = (size: number) => {
    if (!playerRef.current) return
    playerRef.current.setOption?.("captions", "fontSize", size)
  }

  const fetchTracks = useCallback(() => {
    if (!playerRef.current) return
    
    try {
      // Try multiple possible ways to get the tracks
      const possibleTracks = [
        playerRef.current.getOption?.("captions", "tracklist"),
        playerRef.current.getOptions?.("captions", "tracklist"),
        (playerRef.current as any).getAvailableTracks?.(),
        (playerRef.current as any).getAvailableTranslationLanguages?.()
      ]
      
      const rawTracks = possibleTracks.find(t => t && Array.isArray(t) && t.length > 0)
      const cleanTracks = processTracks(rawTracks || [])

      if (cleanTracks.length > 0) {
        setAvailableTracks(cleanTracks)
        const current = playerRef.current.getOption?.("captions", "track") || 
                        playerRef.current.getOptions?.("captions", "track")
        if (current) {
          const cleanCurrent = processTracks([current])[0]
          if (cleanCurrent) setCurrentTrack(cleanCurrent)
        }
      } else {
        // Force reload module and try again
        playerRef.current.loadModule?.("captions")
        setTimeout(() => {
          if (!playerRef.current) return
          const retryRaw = playerRef.current.getOption?.("captions", "tracklist") || 
                             playerRef.current.getOptions?.("captions", "tracklist")
          const cleanRetry = processTracks(retryRaw || [])
          
          if (cleanRetry.length > 0) {
            setAvailableTracks(cleanRetry)
            const current = playerRef.current.getOption?.("captions", "track")
            if (current) {
              const cleanCurrent = processTracks([current])[0]
              if (cleanCurrent) setCurrentTrack(cleanCurrent)
            }
          } else {
            // Ultimate fallback: If YouTube API still fails, provide Spanish/English manually 
            // so the UX doesn't break, and set Spanish as default if it's the ODS demo video
            const defaults = [
              { uid: "es", languageCode: "es", languageName: "Español", displayName: "Español" },
              { uid: "en", languageCode: "en", languageName: "Inglés", displayName: "Inglés" }
            ]
            setAvailableTracks(defaults)
            setCurrentTrack(defaults[0])
            playerRef.current.setOption?.("captions", "track", defaults[0])
          }
        }, 1500)
      }
    } catch (e) {
      console.error("Critical error in fetchTracks:", e)
    }
  }, [])

  // Fetch tracks when menu opens
  useEffect(() => {
    if (showSettings && availableTracks.length === 0) {
      fetchTracks()
    }
  }, [showSettings, availableTracks.length, fetchTracks])

  return (
    <main className="p-4 md:p-8 max-w-5xl mx-auto">
      <div ref={containerRef} className="border-4 border-primary rounded-xl overflow-hidden bg-card shadow-lg flex flex-col">
        {/* Video area */}
        <div className="relative aspect-video bg-black w-full">
          {/* YouTube player mount point wrapper */}
          <div ref={ytWrapperRef} className="absolute inset-0 w-full h-full">
            <div id="yt-player" className="absolute inset-0 w-full h-full" />
          </div>

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
                  aria-label={(isMuted || volume === 0) ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted || volume === 0
                    ? <VolumeX className="w-5 h-5" />
                    : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="w-16 sm:w-24 flex items-center h-full">
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
              <div className="flex items-center gap-1 group/captions relative">
                <button
                  onClick={handleCaptionsToggle}
                  className={`transition-all p-1 hover:scale-110 ${captionsEnabled ? "text-primary-foreground" : "text-primary-foreground/40"}`}
                  aria-label={captionsEnabled ? "Desactivar subtítulos" : "Activar subtítulos"}
                >
                  <Captions className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-primary-foreground/30 hover:text-primary-foreground transition-all p-1"
                >
                  <Settings className={`w-3.5 h-3.5 transition-transform duration-500 ${showSettings ? 'rotate-90' : ''}`} />
                </button>
                
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-4 w-72 bg-card border-2 border-primary rounded-2xl shadow-2xl p-4 z-50 text-foreground animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <h3 className="font-black text-xs uppercase tracking-widest">Personalizar Subtítulos</h3>
                        <p className="text-[9px] text-muted-foreground font-bold">AJUSTES LOCALES DEL VÍDEO</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={fetchTracks}
                          className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-primary"
                          title="Actualizar idiomas"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-foreground p-1">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4 bg-muted p-1 rounded-xl">
                      <button 
                        onClick={() => setSettingsTab('tracks')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${settingsTab === 'tracks' ? 'bg-primary text-white shadow-md' : 'hover:bg-card'}`}
                      >
                        Idiomas
                      </button>
                      <button 
                        onClick={() => setSettingsTab('size')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${settingsTab === 'size' ? 'bg-primary text-white shadow-md' : 'hover:bg-card'}`}
                      >
                        Tamaño
                      </button>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1 pr-2 thin-scrollbar mb-4">
                      {settingsTab === 'tracks' ? (
                        availableTracks.length > 0 ? (
                          availableTracks.map((track, i) => (
                            <button
                              key={track.uid || i}
                              onClick={() => handleTrackChange(track)}
                              className={`w-full text-left px-4 py-3 rounded-[1.2rem] text-[11px] font-[900] uppercase tracking-tight transition-all flex items-center justify-between ${currentTrack?.uid === track.uid ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'hover:bg-muted'}`}
                            >
                              {track.displayName}
                              {currentTrack?.uid === track.uid && (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                  <span className="text-[8px] font-black">ACTIVO</span>
                                </div>
                              )}
                            </button>
                          ))
                        ) : (
                          <p className="text-[10px] text-muted-foreground text-center py-6 italic font-medium">Buscando pistas disponibles...</p>
                        )
                      ) : (
                        <div className="grid grid-cols-2 gap-2 py-2">
                          {[
                            { label: 'Pequeño', val: 0 },
                            { label: 'Normal', val: 1 },
                            { label: 'Grande', val: 2 },
                            { label: 'Extra', val: 3 },
                          ].map((s) => (
                            <button
                              key={s.val}
                              onClick={() => handleFontSizeChange(s.val)}
                              className="px-3 py-4 rounded-2xl border-2 border-border text-[10px] font-black uppercase tracking-tight hover:border-primary hover:bg-primary/5 transition-all"
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border flex flex-col gap-2">
                      <button 
                        onClick={() => {
                          setAccessibility({ subtitles: captionsEnabled });
                          setShowSettings(false);
                          toast.success("Ajustes guardados en tu perfil de accesibilidad");
                        }}
                        className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/30 active:scale-95 transition-all"
                      >
                        Guardar como predeterminado
                      </button>
                      <p className="text-[8px] text-center text-muted-foreground font-bold italic">
                        * Esto actualizará tu configuración global
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
