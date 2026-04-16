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

const INVALID_TRACK_KEYS = new Set([
  "reload",
  "fontsize",
  "track",
  "tracklist",
  "translationlanguages",
  "samplesubtitle",
])

const isLikelyLanguageCode = (value: string) => /^[a-z]{2}(-[A-Z]{2})?$/.test(value)

const isValidTrackEntry = (entry: any) => {
  if (!entry) return false
  if (typeof entry === "string") {
    const normalized = entry.trim().toLowerCase()
    if (!normalized || INVALID_TRACK_KEYS.has(normalized)) return false
    return isLikelyLanguageCode(normalized)
  }

  const code = String(entry.languageCode || entry.language || entry.id || "").trim()
  const normalizedCode = code.toLowerCase()
  return !!normalizedCode && !INVALID_TRACK_KEYS.has(normalizedCode)
}

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
  }).filter((track) => !!track && isValidTrackEntry(track))
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
  const [selectedFontSize, setSelectedFontSize] = useState(1)
  
  const progressRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const ytWrapperRef = useRef<HTMLDivElement>(null)
  const [vttUrls, setVttUrls] = useState<Record<string, string>>({})
  const videoRef = useRef<HTMLVideoElement>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
      const vttEn = `WEBVTT

00:00:00.480 --> 00:00:04.190 line:5%
Are you familiar with the 2030 Agenda? In September

00:00:04.200 --> 00:00:06.710 line:5%
2015, the UN General Assembly

00:00:06.720 --> 00:00:08.750 line:5%
adopted the International Agenda for

00:00:08.759 --> 00:00:11.330 line:5%
Sustainable Development, an action plan

00:00:11.339 --> 00:00:13.400 line:5%
to achieve sustainable development

00:00:13.409 --> 00:00:15.860 line:5%
worldwide and realize

00:00:15.869 --> 00:00:18.910 line:5%
human rights without leaving anyone behind.

00:00:18.920 --> 00:00:21.070 line:5%
UN member states

00:00:21.080 --> 00:00:23.110 line:5%
committed to fulfilling the agenda by

00:00:23.119 --> 00:00:25.480 line:5%
2030.

00:00:25.490 --> 00:00:29.650 line:5%
This agenda contains 17 goals and 169

00:00:29.660 --> 00:00:33.190 line:5%
targets that, since 2016, have served as a guide for

00:00:33.200 --> 00:00:35.920 line:5%
countries to promote

00:00:35.930 --> 00:00:37.840 line:5%
social and economic development while

00:00:37.850 --> 00:00:40.780 line:5%
protecting the planet, ending

00:00:40.790 --> 00:00:43.210 line:5%
poverty and inequality, combating

00:00:43.220 --> 00:00:45.670 line:5%
climate change, building

00:00:45.680 --> 00:00:48.270 line:5%
peaceful, just, and inclusive societies,

00:00:48.280 --> 00:00:50.920 line:5%
and creating partnerships among all

00:00:50.930 --> 00:00:53.410 line:5%
people to achieve a better world together.`;

      const vttEs = `WEBVTT

00:00:00.480 --> 00:00:04.190 line:5%
¿Conoces la Agenda 2030? En septiembre

00:00:04.200 --> 00:00:06.710 line:5%
de 2015, la Asamblea General de la ONU

00:00:06.720 --> 00:00:08.750 line:5%
aprobó la Agenda Internacional para

00:00:08.759 --> 00:00:11.330 line:5%
el Desarrollo Sostenible, un plan de acción

00:00:11.339 --> 00:00:13.400 line:5%
para lograr el desarrollo sostenible en

00:00:13.409 --> 00:00:15.860 line:5%
todo el mundo y hacer realidad los

00:00:15.869 --> 00:00:18.910 line:5%
derechos humanos sin dejar a nadie atrás.

00:00:18.920 --> 00:00:21.070 line:5%
Los estados miembros de la ONU

00:00:21.080 --> 00:00:23.110 line:5%
se comprometieron a cumplir la agenda para

00:00:23.119 --> 00:00:25.480 line:5%
2030.

00:00:25.490 --> 00:00:29.650 line:5%
Esta agenda contiene 17 objetivos y 169

00:00:29.660 --> 00:00:33.190 line:5%
metas que, desde 2016, han servido de

00:00:33.200 --> 00:00:35.920 line:5%
guía para que los países promuevan

00:00:35.930 --> 00:00:37.840 line:5%
el desarrollo social y económico al

00:00:37.850 --> 00:00:40.780 line:5%
tiempo que protegen el planeta, acaban

00:00:40.790 --> 00:00:43.210 line:5%
con la pobreza y la desigualdad, combaten

00:00:43.220 --> 00:00:45.670 line:5%
el cambio climático, construyen

00:00:45.680 --> 00:00:48.270 line:5%
sociedades pacíficas, justas e inclusivas,

00:00:48.280 --> 00:00:50.920 line:5%
y crean alianzas entre todas las

00:00:50.930 --> 00:00:53.410 line:5%
personas para lograr juntos un mundo mejor.`;

      const blobEn = new Blob([vttEn], { type: 'text/vtt' });
      const blobEs = new Blob([vttEs], { type: 'text/vtt' });
      const urlEn = URL.createObjectURL(blobEn);
      const urlEs = URL.createObjectURL(blobEs);
      
      setVttUrls({ en: urlEn, es: urlEs });
      setAvailableTracks([
        { uid: 'es', languageCode: 'es', displayName: 'Español', languageName: 'Español' },
        { uid: 'en', languageCode: 'en', displayName: 'English', languageName: 'English' }
      ]);
      setCurrentTrack({ uid: 'es', languageCode: 'es', displayName: 'Español' });

      return () => {
        URL.revokeObjectURL(urlEn);
        URL.revokeObjectURL(urlEs);
      };
    }
  }, []);

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
        enablejsapi: 1,
        origin: window.location.protocol === 'file:' ? 'http://localhost' : window.location.origin
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
    if (!playerRef.current && window.location.protocol !== 'file:') return
    const newState = accessibility.subtitles
    if (newState === captionsEnabledRef.current) return // No change needed

    setCaptionsEnabled(newState)
    captionsEnabledRef.current = newState
    
    if (window.location.protocol === 'file:' && videoRef.current) {
      const tracks = videoRef.current.textTracks
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].language === currentTrack?.languageCode) {
          tracks[i].mode = newState ? 'showing' : 'hidden'
        } else {
          tracks[i].mode = 'disabled'
        }
      }
      return
    }

    try {
      if (newState && playerRef.current) {
        playerRef.current.loadModule?.("captions")
        if (currentTrack?.languageCode === 'en') {
          playerRef.current.setOption?.("captions", "track", {
            languageCode: "es",
            translationLanguage: { languageCode: "en" }
          });
        } else {
          playerRef.current.setOption?.("captions", "track", { languageCode: currentTrack?.languageCode || 'es' });
        }
      } else if (playerRef.current) {
        playerRef.current.unloadModule?.("captions")
      }
    } catch(e) {
      console.error(e)
    }
  }, [accessibility.subtitles, currentTrack?.languageCode])

  const handlePlayPause = () => {
    if (window.location.protocol === 'file:' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
      return
    }
    if (!playerRef.current) return
    if (isPlaying) {
      playerRef.current.pauseVideo?.()
    } else {
      playerRef.current.playVideo?.()
    }
  }

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = Math.max(0, Math.min(percent * duration, duration))
    
    if (window.location.protocol === 'file:' && videoRef.current) {
      videoRef.current.currentTime = newTime
    } else if (playerRef.current) {
      playerRef.current.seekTo?.(newTime, true)
    }
    setCurrentTime(newTime)
  }

  const handleMuteToggle = () => {
    if (window.location.protocol === 'file:' && videoRef.current) {
      const targetMute = !isMuted
      videoRef.current.muted = targetMute
      setIsMuted(targetMute)
      return
    }
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
    if (window.location.protocol === 'file:' && videoRef.current) {
      videoRef.current.volume = vol / 100
      setIsMuted(vol === 0)
      return
    }
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
    const newState = !captionsEnabled
    setCaptionsEnabled(newState)
    captionsEnabledRef.current = newState

    if (window.location.protocol === 'file:' && videoRef.current) {
      const tracks = videoRef.current.textTracks
      const lang = currentTrack?.languageCode || 'es'
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].language === lang) {
          tracks[i].mode = newState ? 'showing' : 'hidden'
        } else {
          tracks[i].mode = 'disabled'
        }
      }
      return
    }
    
    if (!playerRef.current) return
    
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
    setCurrentTrack(track)
    setCaptionsEnabled(true)
    captionsEnabledRef.current = true

    if (window.location.protocol === 'file:' && videoRef.current) {
      const tracks = videoRef.current.textTracks
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].language === track.languageCode) {
          tracks[i].mode = 'showing'
        } else {
          tracks[i].mode = 'disabled'
        }
      }
      return
    }
    
    if (!playerRef.current) return
    
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
    setSelectedFontSize(size)
    if (window.location.protocol === 'file:' && videoRef.current) {
      // Direct styling for native video cues via CSS variable
      const scale = size === 1 ? '70%' : size === 2 ? '100%' : size === 3 ? '130%' : '160%';
      videoRef.current.style.setProperty('--cue-font-size', scale);
      return
    }
    if (!playerRef.current) return
    playerRef.current.setOption?.("captions", "fontSize", size)
  }

  const fetchTracks = useCallback(() => {
    if (window.location.protocol === 'file:') return // Already set in useEffect
    if (!playerRef.current) return
    
    try {
      // Always prefer the explicit track list to avoid caption module option keys.
      const possibleTracks = [
        playerRef.current.getOption?.("captions", "tracklist"),
        (playerRef.current as any).getAvailableTracks?.(),
        (playerRef.current as any).getAvailableTranslationLanguages?.()
      ]

      const rawTracks = possibleTracks.find((t) => Array.isArray(t) && t.some(isValidTrackEntry))
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
      <style>{`
        video::cue {
          font-size: var(--cue-font-size, 100%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          font-family: inherit;
        }
      `}</style>
      <div ref={containerRef} className="border-4 border-primary rounded-xl overflow-hidden bg-card shadow-lg flex flex-col">
          {/* Video area */}
          <div className="relative aspect-video bg-black w-full group">
            {typeof window !== 'undefined' && window.location.protocol === 'file:' ? (
              <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full bg-black cursor-pointer"
                src="./videoplayback.mp4"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                onLoadedMetadata={() => {
                   setDuration(videoRef.current?.duration || 0);
                   // Set initial state of track
                   const tracks = videoRef.current?.textTracks
                   if (tracks) {
                     for (let i = 0; i < tracks.length; i++) {
                       if (tracks[i].language === (currentTrack?.languageCode || 'es')) {
                         tracks[i].mode = captionsEnabled ? 'showing' : 'hidden';
                       } else {
                         tracks[i].mode = 'disabled';
                       }
                     }
                   }
                }}
                onClick={handlePlayPause}
              >
                <track 
                  kind="subtitles" 
                  src={vttUrls.es} 
                  srcLang="es" 
                  label="Español" 
                  default={currentTrack?.languageCode === 'es'} 
                />
                <track 
                  kind="subtitles" 
                  src={vttUrls.en} 
                  srcLang="en" 
                  label="English" 
                  default={currentTrack?.languageCode === 'en'} 
                />
                Tu navegador no soporta el formato de vídeo.
              </video>
            ) : (
              /* YouTube player mount point wrapper */
              <div ref={ytWrapperRef} className="absolute inset-0 w-full h-full">
                <div id="yt-player" className="absolute inset-0 w-full h-full" />
              </div>
            )}

            {/* ODS 4 badge */}
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

          {/* Video controls (SHARED) */}
          <div className="bg-primary/95 px-4 py-3 shrink-0">
            <div className="flex gap-0 mb-3 rounded-full overflow-hidden h-1.5 opacity-90">
              {["#e5243b","#dda63a","#4c9f38","#c5192d","#ff3a21","#26bde2","#fcc30b","#a21942","#fd6925","#dd1367","#fd9d24","#bf8b2e","#3f7e44","#0a97d9","#56c02b","#00689d","#19486a"].map((color, i) => (
                <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }} />
              ))}
            </div>

            <div ref={progressRef} className="w-full h-2 bg-primary-foreground/20 rounded-full cursor-pointer mb-3 relative group" onClick={handleProgressClick}>
              <div className="absolute top-0 left-0 h-full bg-primary-foreground rounded-full transition-all group-hover:bg-accent" style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }} />
            </div>

            <div className="flex items-center justify-between">
              <button onClick={handlePlayPause} className="text-primary-foreground hover:scale-110 active:scale-95 transition-all p-1">
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
              </button>

              <div className="flex items-center gap-4">
                <span className="text-primary-foreground text-sm font-mono opacity-90 hidden sm:block">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <div className="flex items-center gap-2 group/vol">
                  <button onClick={handleMuteToggle} className="text-primary-foreground hover:scale-110 transition-transform p-1">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="w-16 sm:w-24 flex items-center h-full">
                    <Slider value={[isMuted ? 0 : volume]} min={0} max={100} step={1} onValueChange={(vals) => handleVolumeChange(vals[0])} className="cursor-pointer [&_[data-slot=slider-track]]:bg-white/75 [&_[data-slot=slider-range]]:bg-white/75 [&_[data-slot=slider-thumb]]:bg-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 group/captions relative">
                  <button onClick={handleCaptionsToggle} className={`transition-all p-1 hover:scale-110 ${captionsEnabled ? "text-primary-foreground" : "text-primary-foreground/40"}`}>
                    <Captions className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowSettings(!showSettings)} className={`text-primary-foreground/30 hover:text-primary-foreground transition-all p-1`}>
                    <Settings className={`w-3.5 h-3.5 transition-transform duration-500 ${showSettings ? 'rotate-90' : ''}`} />
                  </button>
                  {showSettings && (
                    <div className="fixed top-1/2 left-1/2 z-50 w-[min(24rem,calc(100vw-1rem))] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-card border-2 border-primary rounded-2xl shadow-2xl p-4 text-foreground animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/70">
                        <h3 className="font-black text-xs uppercase">Ajustes de Subtítulos</h3>
                        <button onClick={() => setShowSettings(false)}><X className="w-5 h-5" /></button>
                      </div>
                      
                      <div className="space-y-4 mb-2 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Idioma de los subtítulos</label>
                          <div className="grid grid-cols-1 gap-2">
                            {availableTracks.length > 0 ? (
                              availableTracks.map((track) => (
                                <button
                                  key={track.uid}
                                  onClick={() => handleTrackChange(track)}
                                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all border-2 ${
                                    currentTrack?.uid === track.uid 
                                      ? "bg-primary/10 border-primary text-primary font-bold shadow-sm" 
                                      : "bg-muted/50 border-transparent hover:bg-muted text-foreground/70"
                                  }`}
                                >
                                  <span className="text-xs uppercase tracking-tight">{track.displayName || track.languageName}</span>
                                  {currentTrack?.uid === track.uid && (
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                  )}
                                </button>
                              ))
                            ) : (
                              <p className="text-[10px] text-muted-foreground italic text-center py-2">No hay pistas disponibles</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tamaño de los subtítulos</label>
                          <div className="flex gap-2 p-1 bg-muted rounded-xl">
                            {[1, 2, 3, 4].map((size) => (
                              <button
                                key={size}
                                onClick={() => handleFontSizeChange(size)}
                                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-lg transition-all ${
                                  selectedFontSize === size 
                                    ? "bg-primary text-primary-foreground shadow-sm" 
                                    : "hover:bg-background/80 text-muted-foreground"
                                }`}
                              >
                                <span className="font-bold" style={{ fontSize: `${10 + size * 4}px` }}>A</span>
                                <span className="text-[9px] mt-1 font-bold uppercase">{size === 1 ? 'S' : size === 2 ? 'M' : size === 3 ? 'L' : 'XL'}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-[9px] text-muted-foreground italic mb-4">Los cambios se aplican automáticamente</p>
                        <button 
                          onClick={() => { 
                            setAccessibility({ subtitles: captionsEnabled }); 
                            setShowSettings(false); 
                          }} 
                          className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-[10px] font-black uppercase transition-colors shadow-lg shadow-primary/20"
                        >
                          Confirmar y Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={handleFullscreen} className="text-primary-foreground hover:scale-110 transition-transform p-1 ml-1"><Maximize2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
      </div>
    </main>
  )
}

