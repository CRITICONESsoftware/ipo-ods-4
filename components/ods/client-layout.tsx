"use client"

import { useEffect, useState, useRef, ReactNode } from "react"
import { useApp } from "@/lib/app-context"
import { useRouter } from "next/navigation"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { TutorialOverlay } from "./tutorial-overlay"
import { fontSizes } from "./accessibility-page"
import { Mic, X } from "lucide-react"

export function ClientLayout({ children }: { children: ReactNode }) {
  const { accessibility, setAccessibility } = useApp()
  const router = useRouter()
  const [isListening, setIsListening] = useState(false)
  const [lastTranscript, setLastTranscript] = useState("")
  const [lastAIResponse, setLastAIResponse] = useState("")
  const [dwellProgress, setDwellProgress] = useState(0)
  const lastDwellClick = useRef(0)

  useEffect(() => {
    const rootFontSize = fontSizes[accessibility.fontSizeIndex]
    if (rootFontSize) {
      document.documentElement.style.fontSize = `${rootFontSize}px`
    }

    const buttonScales = [1.0, 1.4, 1.85]
    const currentScale = buttonScales[accessibility.buttonSizeIndex] || 1
    document.documentElement.style.setProperty('--button-scale', currentScale.toString())

    return () => {
      document.documentElement.style.fontSize = ""
      document.documentElement.style.removeProperty('--button-scale')
    }
  }, [accessibility.fontSizeIndex, accessibility.buttonSizeIndex])

  // Narrator (Screen Reader) Logic
  useEffect(() => {
    if (!accessibility.contentReader || typeof window === 'undefined' || !window.speechSynthesis) {
      window.speechSynthesis?.cancel()
      return
    }
    let speechTimeout: NodeJS.Timeout
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isLayoutElement = ['MAIN', 'DIV', 'SECTION', 'NAV', 'HEADER', 'SVG', 'PATH'].includes(target.tagName)
      if (isLayoutElement && !target.getAttribute('aria-label') && !target.getAttribute('title')) return;
      window.speechSynthesis.cancel()
      let textToRead = target.getAttribute('aria-label') || target.getAttribute('title') || target.innerText || target.textContent
      if (textToRead && textToRead.trim().length > 0) {
        clearTimeout(speechTimeout)
        speechTimeout = setTimeout(() => {
          const cleanText = textToRead.trim().replace(/\s+/g, ' ').substring(0, 200)
          const utterance = new SpeechSynthesisUtterance(cleanText)
          utterance.lang = accessibility.language === "Español" ? "es-ES" : "en-US"
          window.speechSynthesis.speak(utterance)
        }, 400)
      }
    }
    document.addEventListener('mouseover', handleMouseOver)
    return () => document.removeEventListener('mouseover', handleMouseOver)
  }, [accessibility.contentReader, accessibility.language])

  // Voice Navigation (Speech Recognition) Logic
  useEffect(() => {
    if (!accessibility.voiceNav) return
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = accessibility.language === "Español" ? "es-ES" : "en-US"

    const executeVoiceAI = (transcript: string) => {
      if (!accessibility.voiceNav) return
      const finalTranscript = transcript.toLowerCase().trim()

      const speak = (text: string) => {
        setLastAIResponse(text)
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel()
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = accessibility.language === "Español" ? "es-ES" : "en-US"
          utterance.rate = 1.1
          window.speechSynthesis.speak(utterance)
        }
        setTimeout(() => setLastAIResponse(""), 6000)
      }

      const commands: Record<string, string[]> = {
        home: ['inicio', 'home', 'principal'],
        profile: ['perfil', 'cuenta', 'mis datos'],
        video: ['video', 'vídeo', 'youtube'],
        accessibility: ['accesibilidad', 'ajustes', 'ayuda'],
        forum: ['foro', 'comunid'],
        donations: ['donar', 'donaciones', 'donativo'],
        quiz: ['quiz', 'test'],
        login: ['login', 'acceder'],
        signup: ['registro', 'registrarme'],
        admin: ['administrador', 'dashboard', 'panel de control']
      }

      for (const [page, keywords] of Object.entries(commands)) {
        if (keywords.some(k => finalTranscript.includes(k))) {
          speak(`Cambiando a la sección de ${page}`)
          router.push(page === "home" ? "/" : `/${page}`)
          setTimeout(() => setLastTranscript(""), 2000)
          return
        }
      }

      // Accessibility Toggle Mode
      const accessToggles: Record<string, keyof typeof accessibility> = {
        'contraste': 'highContrast',
        'alto contraste': 'highContrast',
        'lupa': 'magnifier',
        'lector': 'contentReader',
        'narrador': 'contentReader',
        'guía de lectura': 'readingGuide',
        'guía': 'readingGuide',
        'control ocular': 'eyeControl',
        'teclado': 'keyboardOps',
        'vibración': 'vibration',
        'animaciones': 'reducedMotion',
        'movimiento': 'reducedMotion'
      }

      const words = finalTranscript.split(/\s+/)
      const actWords = ['activa', 'activar', 'enciende', 'encender', 'pon', 'poner', 'habilita', 'habilitar']
      const deactWords = ['desactiva', 'desactivar', 'apaga', 'apagar', 'quita', 'quitar', 'deshabilita', 'deshabilitar']

      const isActivating = words.some(w => actWords.includes(w))
      const isDeactivating = words.some(w => deactWords.includes(w))

      if (isActivating || isDeactivating) {
        for (const [key, prop] of Object.entries(accessToggles)) {
          if (finalTranscript.includes(key)) {
            const isMotionSettings = prop === 'reducedMotion'
            let toggleState = isActivating
            if (isDeactivating && !isActivating) toggleState = false
            if (isDeactivating && isActivating) toggleState = false // Fallback
            if (isMotionSettings) toggleState = !toggleState // Invert for reduced motion

            setAccessibility({ [prop]: toggleState })
            speak(`He ${toggleState ? 'activado' : 'desactivado'} la opción de ${key}.`)
            setLastTranscript("")
            return
          }
        }
      }

      var interactiveElements = document.querySelectorAll('button, a, [role="button"], input, textarea')
      var bestElementMatch: any = null
      var maxScore = 0

      // Dictation Mode
      const inputWords = finalTranscript.split(' ')
      if (['escribe', 'pon', 'escribir', 'digita', 'di'].includes(inputWords[0])) {
        let textToType = '', targetField = ''
        const enIndex = inputWords.indexOf('en')
        if (enIndex > 0) {
          textToType = inputWords.slice(1, enIndex).join(' '); targetField = inputWords.slice(enIndex + 1).join(' ')
        } else textToType = inputWords.slice(1).join(' ')

        if (targetField) {
          interactiveElements.forEach((el: any) => {
            if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return
            const label = (el.placeholder || el.name || el.id || el.getAttribute('aria-label') || "").toLowerCase()
            if (label.includes(targetField) || targetField.includes(label)) bestElementMatch = el
          })
        } else if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
          bestElementMatch = document.activeElement
        }

        if (bestElementMatch && textToType) {
          bestElementMatch.focus()
          const setter = Object.getOwnPropertyDescriptor(
            bestElementMatch instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype, 'value'
          )?.set
          if (setter) {
            setter.call(bestElementMatch, textToType)
            bestElementMatch.dispatchEvent(new Event('input', { bubbles: true }))
            bestElementMatch.dispatchEvent(new Event('change', { bubbles: true }))
          } else bestElementMatch.value = textToType
          speak(`¡Hecho! He escrito "${textToType}" para ti.`)
          setLastTranscript("")
          return
        }
      }

      // Screen Interaction Mode
      interactiveElements.forEach((el: any) => {
        const text = (el.innerText || el.getAttribute('aria-label') || el.placeholder || el.value || "").toLowerCase()
        if (text.length < 2) return
        if (finalTranscript.includes(text) || text.includes(finalTranscript)) {
          if (text.length > maxScore) {
            maxScore = text.length
            bestElementMatch = el
          }
        }
      })

      if (bestElementMatch && maxScore > 0) {
        bestElementMatch.scrollIntoView({ behavior: 'smooth', block: 'center' })
        bestElementMatch.classList.add('ring-4', 'ring-primary', 'ring-offset-4', 'scale-110', 'transition-all', 'duration-500')
        speak(`Entendido, pulsando ${bestElementMatch.innerText?.trim() || 'este botón'}.`)
        setTimeout(() => {
          bestElementMatch.click()
          bestElementMatch.classList.remove('ring-4', 'ring-primary', 'ring-offset-4', 'scale-110')
          setLastTranscript("")
        }, 800)
        return
      }

      // Conversation AI Mode
      const knowledge: Record<string, string> = {
        'quien eres': 'Soy tu Asistente Neural de ODS 4.',
        'ods 4': 'El objetivo cuatro busca garantizar una educación de calidad.',
        'ayuda': 'Pídeme que vaya a una sección o que pulse cualquier botón.',
        'hola': '¡Hola! ¿A qué sección te gustaría ir hoy?'
      }
      let response = "Interesante. ¿Puedo ayudarte a navegar o rellenar un campo?"
      for (const [key, answer] of Object.entries(knowledge)) {
        if (finalTranscript.includes(key)) { response = answer; break }
      }
      speak(response)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript
        else interimTranscript += event.results[i][0].transcript
      }
      setLastTranscript((finalTranscript || interimTranscript).toLowerCase().trim())
      if (finalTranscript) executeVoiceAI(finalTranscript)
    }

    try { recognition.start(); setIsListening(true) } catch (e) { }
    return () => {
      try { recognition.stop(); recognition.abort() } catch (e) { }
      setIsListening(false)
    }
  }, [accessibility.voiceNav, accessibility.language, router, setAccessibility])

  useEffect(() => {
    if (!accessibility.voiceNav) {
      setLastTranscript(""); setLastAIResponse(""); setIsListening(false)
      if (window.speechSynthesis) window.speechSynthesis.cancel()
    }
  }, [accessibility.voiceNav])

  // Keyboard Interaction Logic
  useEffect(() => {
    if (!accessibility.keyboardOps) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
      const key = e.key.toLowerCase()
      const commands: Record<string, string> = { h: '/', p: '/profile', v: '/video', a: '/accessibility', f: '/forum', d: '/donations', q: '/quiz', l: '/login', s: '/signup' }
      if (commands[key]) {
        e.preventDefault()
        router.push(commands[key])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [accessibility.keyboardOps, router])

  // Eye Control (Dwell Clicking) Logic
  useEffect(() => {
    if (!accessibility.eyeControl) {
      setDwellProgress(0)
      return
    }
    let interval: NodeJS.Timeout
    let timeout: NodeJS.Timeout
    let currentTarget: HTMLElement | null = null
    const DWELL_TIME = 1200
    const handleMouseOver = (e: MouseEvent) => {
      if (Date.now() - lastDwellClick.current < 1500) return
      const target = (e.target as HTMLElement).closest('button, [role="button"], a, input, select') as HTMLElement
      if (!target || target === currentTarget) return
      if (currentTarget) currentTarget.classList.remove('ring-4', 'ring-primary/40', 'ring-offset-2')
      currentTarget = target
      setDwellProgress(0)
      clearInterval(interval)
      clearTimeout(timeout)
      target.classList.add('ring-4', 'ring-primary/40', 'ring-offset-2', 'transition-all', 'duration-300')
      const start = Date.now()
      interval = setInterval(() => {
        const elapsed = Date.now() - start
        setDwellProgress(Math.min((elapsed / DWELL_TIME) * 100, 100))
        if (currentTarget) {
          const rect = currentTarget.getBoundingClientRect()
          document.documentElement.style.setProperty('--dwell-magnet-x', `${rect.left + rect.width / 2}px`)
          document.documentElement.style.setProperty('--dwell-magnet-y', `${rect.top + rect.height / 2}px`)
        }
      }, 16)
      timeout = setTimeout(() => {
        if (currentTarget) {
          currentTarget.click()
          currentTarget.classList.remove('ring-4', 'ring-primary/40', 'ring-offset-2')
          lastDwellClick.current = Date.now()
        }
        setDwellProgress(0)
        clearInterval(interval)
        currentTarget = null
      }, DWELL_TIME)
    }
    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement
      if (currentTarget && (!related || !currentTarget.contains(related))) {
        currentTarget.classList.remove('ring-4', 'ring-primary/40', 'ring-offset-2')
        currentTarget = null
        setDwellProgress(0)
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      if (currentTarget) currentTarget.classList.remove('ring-4', 'ring-primary/40', 'ring-offset-2')
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [accessibility.eyeControl])

  const getColorBlindFilter = () => {
    switch (accessibility.colorBlindMode) {
      case "Protanopia": return "url(#protanopia)"
      case "Protanomalia": return "url(#protanomalia)"
      case "Deuteranopia": return "url(#deuteranopia)"
      case "Deuteranomalia": return "url(#deuteranomalia)"
      case "Tritanopia": return "url(#tritanopia)"
      case "Tritanomalia": return "url(#tritanomalia)"
      case "Acromatopsia": return "grayscale(100%)"
      default: return "none"
    }
  }

  return (
    <div
      className={`min-h-screen bg-background flex flex-col transition-all duration-300 ${accessibility.highContrast ? "high-contrast" : ""} ${accessibility.keyboardOps ? "keyboard-ops" : ""}`}
      style={{ filter: getColorBlindFilter() }}
      onMouseMove={(e) => {
        if (accessibility.readingGuide || accessibility.magnifier) {
          document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
          document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
        }
      }}
    >
      <Header />
      <Sidebar />
      <TutorialOverlay />

      {accessibility.readingGuide && (
        <div className="fixed left-0 right-0 h-8 bg-primary/20 backdrop-blur-[2px] pointer-events-none z-[100] border-y border-primary/30 mix-blend-multiply flex items-center justify-center"
          style={{ top: 'var(--mouse-y, 0px)', transform: 'translateY(-50%)' }} >
          <div className="w-full h-[2px] bg-primary/50" />
        </div>
      )}

      {accessibility.voiceNav && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-4 w-full max-w-xl px-6 pointer-events-none">
          {lastAIResponse && (
            <div className="bg-[#19486a] dark:bg-primary-foreground border-4 border-white/20 p-8 rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom-8 fade-in zoom-in duration-700 w-full mb-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary animate-pulse" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center animate-pulse"> <Mic className="text-primary-foreground dark:text-primary w-5 h-5" /> </div>
                <span className="text-[10px] font-black uppercase text-white/50 tracking-[0.4em]">AI Response</span>
              </div>
              <p className="text-xl md:text-2xl font-[900] tracking-tight text-white leading-tight"> {lastAIResponse} </p>
            </div>
          )}
          {lastTranscript && (
            <div className="bg-white/40 dark:bg-card/40 backdrop-blur-3xl border-2 border-primary/20 p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] animate-in slide-in-from-bottom-4 zoom-in-95 duration-500 w-full text-center group">
              <p className="text-xl md:text-2xl font-[1000] tracking-tight text-[#19486a] dark:text-foreground leading-tight italic"> "{lastTranscript}" </p>
              <div className="mt-4 flex items-end justify-center gap-1 h-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-1 bg-primary/30 rounded-full animate-wave" style={{ animationDelay: `${i * 0.1}s`, height: `${30 + Math.random() * 70}%` }} />
                ))}
              </div>
            </div>
          )}
          <div className="relative group/ctrl pointer-events-auto">
            <div className={`px-8 py-4 rounded-full border-2 border-primary/20 shadow-2xl flex items-center gap-4 backdrop-blur-2xl transition-all duration-700 ${isListening ? 'bg-primary/90 text-white scale-110 shadow-primary/30' : 'bg-card/50 text-muted-foreground'}`}>
              <Mic className={`w-6 h-6 relative z-10 ${isListening ? 'animate-pulse scale-110' : 'opacity-40'}`} />
              <div className="flex flex-col items-start translate-y-[-1px]">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none mb-0.5">{isListening ? 'Escuchando' : 'Pausado'}</span>
                <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">{accessibility.language} Mode</span>
              </div>
              <button onClick={() => setAccessibility({ voiceNav: false })} className="ml-4 p-2 bg-white/10 hover:bg-red-500 rounded-full border border-white/20 transition-all">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`flex-1 relative w-full pt-4 pb-20 transition-all duration-[400ms] ease-out ${accessibility.reducedMotion ? "[&_*]:!transition-none [&_*]:!animation-none" : ""}`}
        style={accessibility.magnifier ? { transform: 'scale(1.35)', transformOrigin: 'var(--mouse-x, 50vw) var(--mouse-y, 50vh)' } : {}}
      >
        {children}
      </main>

      {/* Color Blindness SVG Filters (Simulated) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="protanomalia">
            <feColorMatrix type="matrix" values="0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranomalia">
            <feColorMatrix type="matrix" values="0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanomalia">
            <feColorMatrix type="matrix" values="0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
