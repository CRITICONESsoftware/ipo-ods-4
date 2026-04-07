import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Eye, Ear, Pointer, Type, Square, ZoomIn, 
  Palette, Contrast, Volume2, Headphones, MessageSquare, 
  Layout, Mic, Keyboard as KeyboardIcon, MousePointer, ScanEye, Languages,
  ChevronRight, X, HelpCircle
} from "lucide-react"
import { toast, Toaster } from "sonner"

export const fontSizes = [10, 12, 14, 16, 18, 20, 22]

export function AccessibilityPage() {
  const { setCurrentPage, accessibility, setAccessibility, t } = useApp()
  const router = useRouter()
  const [activeOption, setActiveOption] = useState<string | null>(null)

  const handleToggle = (setting: string) => {
    const newVal = !((accessibility as any)[setting])
    setAccessibility({ [setting]: newVal })
    toast.info(t('updated'), {
      description: `${t(setting as any)} ${newVal ? t('on') : t('off')}`,
      duration: 2000
    })
  }

  const getOptionsFor = (option: string) => {
    if (option === "fontSizeIndex") {
      return [
        { label: "1", value: 0, color: "bg-[#e5243b]" },
        { label: "2", value: 1, color: "bg-[#dda63a]" },
        { label: "3", value: 2, color: "bg-[#4c9f38]" },
        { label: "4", value: 3, color: "bg-[#c5192d]" },
        { label: "5", value: 4, color: "bg-[#ff3a21]" },
        { label: "6", value: 5, color: "bg-[#26bde2]" },
        { label: "7", value: 6, color: "bg-[#fcc30b]" },
      ]
    }
    if (option === "colorBlindMode") {
      return [
        { label: "None", value: "Ninguno", color: "bg-[#a21942]" },
        { label: "Protan", value: "Protanopia", color: "bg-[#fd6925]" },
        { label: "Deuter", value: "Deuteranopia", color: "bg-[#bf8b2e]" },
        { label: "Tritan", value: "Tritanopia", color: "bg-[#407f46]" },
      ]
    }
    if (option === "elementsLayout") {
      return [
        { label: "Std", value: "Standard", color: "bg-[#0a97d9]" },
        { label: "Cmp", value: "Compact", color: "bg-[#56c02b]" },
        { label: "Grd", value: "Grid", color: "bg-[#00689d]" },
      ]
    }
    if (option === "buttonSizeIndex") {
      return [
        { label: "PEQ", value: 0, color: "bg-[#e5243b]" },
        { label: "MED", value: 1, color: "bg-[#dda63a]" },
        { label: "GRD", value: 2, color: "bg-[#4c9f38]" },
      ]
    }
    if (option === "language") {
      return [
        { label: "ESPAÑOL", value: "Español", color: "bg-[#e5243b]" },
        { label: "ENGLISH", value: "English", color: "bg-[#0a97d9]" },
      ]
    }
    return []
  }

  const toggleSubMenu = (option: string) => {
    setActiveOption(activeOption === option ? null : option)
  }

  return (
    <main className="w-full relative overflow-x-hidden animate-in fade-in duration-700">
      <Toaster position="top-right" richColors />

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="p-4 md:p-6 relative z-10 space-y-8 w-full max-w-5xl lg:max-w-[70%] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="relative group mx-auto mb-2">
            <div className="absolute -inset-2 bg-primary/20 rounded-[1.5rem] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-primary p-4 rounded-2xl shadow-xl shadow-primary/30 transform transition-transform duration-500 hover:scale-105 cursor-default">
               <div className="w-8 h-8 border-4 border-white/90 rounded-full flex items-center justify-center relative">
                  <div className="w-5 h-1 bg-white/90 rounded-full rotate-45 absolute" />
                  <div className="w-5 h-1 bg-white/90 rounded-full -rotate-45 absolute" />
                  <div className="w-2 h-2 bg-white/90 rounded-full absolute -top-1" />
               </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-[900] tracking-tighter uppercase text-foreground leading-none">
              {t('accessibility')}
            </h1>
            <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] opacity-80">
              Personalización Total ODS 4
            </p>
          </div>

          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); router.push("/"); }}
            className="mt-2 px-5 py-2 rounded-xl bg-card border-2 border-border hover:bg-muted text-foreground transition-all font-black uppercase text-[10px] tracking-widest flex items-center gap-2 active:scale-95 select-none"
          >
            <ArrowLeft size={14} className="stroke-[3px]" /> {t('back')}
          </a>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: VISIÓN */}
          <section className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg transition-all duration-300 hover:border-primary/40 group/card">
            <SectionHeader icon={<Eye className="w-6 h-6 text-primary" />} label={t('vision')} />
            <div className="space-y-5">
              <AccessItem 
                icon={<Type size={18} />} label={t('fontSize')} active={accessibility.fontSizeIndex > 3} 
                onClick={() => toggleSubMenu('fontSizeIndex')} subtext={`${t('level')} ${accessibility.fontSizeIndex + 1}`}
                isOpen={activeOption === 'fontSizeIndex'} options={getOptionsFor('fontSizeIndex')}
                onSelect={(val) => { setAccessibility({ fontSizeIndex: val }); setActiveOption(null); }} currentValue={accessibility.fontSizeIndex}
              />
              <AccessItem 
                icon={<Square size={18} />} label={t('buttonsSize')} active={accessibility.buttonSizeIndex > 0} 
                onClick={() => toggleSubMenu('buttonSizeIndex')} isOpen={activeOption === 'buttonSizeIndex'}
                options={getOptionsFor('buttonSizeIndex')} onSelect={(val) => { 
                  setAccessibility({ buttonSizeIndex: val }); 
                  setActiveOption(null);
                }}
                currentValue={accessibility.buttonSizeIndex} subtext={`${t('level')} ${accessibility.buttonSizeIndex + 1}`}
              />
              <AccessItem icon={<ZoomIn size={18} />} label={t('magnifier')} active={accessibility.magnifier} onClick={() => handleToggle('magnifier')} />
              <AccessItem 
                icon={<Palette size={18} />} label={t('filters')} active={accessibility.colorBlindMode !== "Ninguno"}
                onClick={() => toggleSubMenu('colorBlindMode')} subtext={accessibility.colorBlindMode}
                isOpen={activeOption === 'colorBlindMode'} options={getOptionsFor('colorBlindMode')}
                onSelect={(val) => { setAccessibility({ colorBlindMode: val }); setActiveOption(null); }} currentValue={accessibility.colorBlindMode}
              />
              <AccessItem icon={<Contrast size={18} />} label={t('contrast')} active={accessibility.highContrast} onClick={() => handleToggle('highContrast')} />
              <AccessItem icon={<Volume2 size={18} />} label={t('narrator')} active={accessibility.contentReader} onClick={() => handleToggle('contentReader')} />
            </div>
          </section>

          {/* Column 2: AUDICIÓN */}
          <section className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg transition-all duration-300 hover:border-primary/40 group/card">
            <SectionHeader icon={<Ear className="w-6 h-6 text-primary" />} label={t('hearing')} />
            <div className="space-y-5">
              <AccessItem icon={<Volume2 size={18} />} label={t('audio')} active={accessibility.audioEnabled} onClick={() => handleToggle('audioEnabled')} />
              <AccessItem icon={<Headphones size={18} />} label={t('hearingAids')} active={accessibility.hearingAids} onClick={() => handleToggle('hearingAids')} />
              <AccessItem icon={<MessageSquare size={18} />} label={t('subtitles')} active={accessibility.subtitles} onClick={() => handleToggle('subtitles')} />
            </div>
          </section>

          {/* Column 3: INTERACCIÓN */}
          <section className="bg-card border-2 border-border rounded-3xl p-6 shadow-lg transition-all duration-300 hover:border-primary/40 group/card">
            <SectionHeader icon={<Pointer className="w-6 h-6 text-primary" />} label={t('interaction')} />
            <div className="space-y-5">
              <AccessItem 
                icon={<Layout size={18} />} label={t('layout')} active={accessibility.elementsLayout !== "Standard"}
                onClick={() => toggleSubMenu('elementsLayout')} subtext={accessibility.elementsLayout}
                isOpen={activeOption === 'elementsLayout'} options={getOptionsFor('elementsLayout')}
                onSelect={(val) => { setAccessibility({ elementsLayout: val }); setActiveOption(null); }} currentValue={accessibility.elementsLayout}
              />
              <AccessItem icon={<Mic size={18} />} label={t('voice')} active={accessibility.voiceNav} onClick={() => handleToggle('voiceNav')} />
              <AccessItem icon={<KeyboardIcon size={18} />} label={t('keyboard')} active={accessibility.keyboardOps} onClick={() => handleToggle('keyboardOps')} />
              <AccessItem icon={<ScanEye size={18} />} label={t('eyeControl')} active={accessibility.eyeControl} onClick={() => handleToggle('eyeControl')} />
              <AccessItem 
                icon={<Languages size={18} />} label={t('language')} active={true} 
                onClick={() => toggleSubMenu('language')} subtext={accessibility.language}
                isOpen={activeOption === 'language'} options={getOptionsFor('language')}
                onSelect={(val) => { setAccessibility({ language: val }); setActiveOption(null); }} currentValue={accessibility.language}
              />
            </div>
          </section>

        </div>

        {/* New Help & Commands Section */}
        <section className="mt-8 bg-card border-2 border-border rounded-3xl overflow-hidden shadow-lg relative group/help animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover/help:scale-150" />
          
          <div className="p-6 md:p-8 relative z-10 flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-1/3 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                <HelpCircle size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-[900] uppercase tracking-tighter text-foreground leading-none mb-2">Centro de Ayuda</h2>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Optimiza tu navegación usando los atajos globales y comandos de voz diseñados para la máxima eficiencia y accesibilidad.
                </p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Keyboard Help Card */}
              <div className="bg-muted/30 border-2 border-border/50 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white dark:bg-muted/10 rounded-2xl shadow-sm text-primary">
                    <KeyboardIcon size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs">Atajos de Teclado</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { k: 'H', v: 'Inicio' }, { k: 'P', v: 'Perfil' },
                    { k: 'V', v: 'Vídeo' }, { k: 'A', v: 'Ajustes' },
                    { k: 'F', v: 'Foro' }, { k: 'D', v: 'Donar' },
                    { k: 'Q', v: 'Quiz' }, { k: 'L', v: 'Login' },
                    { k: 'S', v: 'Registro' }
                  ].map(sc => (
                    <div key={sc.k} className="flex items-center gap-2 group/key">
                      <kbd className="min-w-[32px] h-8 bg-card border-b-4 border-primary/20 rounded-lg flex items-center justify-center font-black text-primary text-xs shadow-sm transition-all group-hover/key:border-primary/50 group-hover/key:translate-y-0.5">{sc.k}</kbd>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{sc.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Help Card */}
              <div className="bg-muted/30 border-2 border-border/50 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white dark:bg-muted/10 rounded-2xl shadow-sm text-primary">
                    <Mic size={20} />
                  </div>
                  <h3 className="font-black uppercase tracking-widest text-xs">Comandos de Voz</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">Ejemplos destacados:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      '"Ir a Inicio"', '"Abre mi Perfil"', '"Ver Vídeo"', 
                      '"Cuestionario"', '"Mensajes Foro"', '"Quiero Donar"',
                      '"Cerrar Sesión"', '"Accesibilidad"'
                    ].map((v, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/50 dark:bg-card/20 px-4 py-2 rounded-xl border border-border/50">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        <span className="text-[11px] font-black italic text-[#19486a] dark:text-foreground/80 tracking-tight">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

function SectionHeader({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="mb-12 text-center">
      <div className="inline-block relative mb-4">
        <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
        <div className="relative w-16 h-16 bg-muted dark:bg-muted/10 rounded-[1.8rem] flex items-center justify-center mx-auto transition-transform duration-500 group-hover/card:rotate-[360deg] shadow-lg border border-border/50">
          {icon}
        </div>
      </div>
      <h2 className="text-xl font-[1000] uppercase tracking-[0.25em] text-[#19486a] dark:text-primary">{label}</h2>
    </div>
  )
}

function AccessItem({ 
  icon, label, subtext, active, onClick, isOpen, options, onSelect, currentValue 
}: { 
  icon: React.ReactNode, 
  label: string, 
  subtext?: string,
  active?: boolean,
  onClick?: () => void,
  isOpen?: boolean,
  options?: { label: string, value: any, color: string }[],
  onSelect?: (val: any) => void,
  currentValue?: any
}) {
  return (
    <div className={`transition-all duration-700 rounded-[2.5rem] p-1.5 ${isOpen ? 'bg-primary/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border-2 border-primary/10' : 'hover:bg-muted/50'}`}>
      <a 
        href="#"
        onClick={(e) => { e.preventDefault(); onClick?.(); }}
        className={`w-full group text-left p-3.5 rounded-3xl flex items-center gap-4 transition-all duration-300 active:scale-[0.98] border-2 border-transparent select-none ${
          onClick ? 'cursor-pointer' : 'cursor-default'
        } ${isOpen ? 'bg-card shadow-xl scale-[1.03] border-primary/20' : ''}`}
      >
        <div className={`p-3.5 rounded-2xl transition-all duration-500 shrink-0 ${
          active ? 'bg-primary text-white shadow-lg shadow-primary/30 rotate-3' : 'bg-muted dark:bg-muted/10 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10'
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-[900] text-[13px] uppercase tracking-tight leading-tight truncate">{label}</p>
          {subtext && (
            <div className="flex items-center gap-2 mt-1.5 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em] truncate">{subtext}</p>
            </div>
          )}
        </div>
        
        {/* Modern Toggle Switch */}
        {active !== undefined && !options && !isOpen && (
          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-[9px] font-black tracking-widest ${active ? 'text-primary' : 'text-muted-foreground/50'}`}>
              {active ? 'SÍ' : 'NO'}
            </span>
            <div className={`w-14 h-7 rounded-full p-1 transition-all duration-500 relative flex items-center ${active ? 'bg-primary/20 ring-2 ring-primary/30' : 'bg-muted dark:bg-muted/10'}`}>
              <div className={`w-5 h-5 rounded-full shadow-lg transition-all duration-500 ${active ? 'bg-primary translate-x-7 scale-110 shadow-primary/40' : 'bg-muted-foreground/30 translate-x-0'}`} />
            </div>
          </div>
        )}
        
        {options && (
          <div className={`p-2 rounded-xl transition-all duration-500 shrink-0 ${isOpen ? 'bg-primary/10 text-primary rotate-90' : 'text-muted-foreground'}`}>
            <ChevronRight size={18} className="stroke-[3.5px]" />
          </div>
        )}
      </a>
      
      {isOpen && options && (
        <div className="px-4 py-8 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-6 duration-700">
          {options.map((opt, i) => (
            <a
              key={i}
              href="#"
              onClick={(e) => { e.preventDefault(); onSelect?.(opt.value); }}
              className={`
                group/opt relative px-6 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-500 active:scale-95 block text-center select-none
                bg-gradient-to-br ${opt.color} 
                ${currentValue === opt.value ? 'ring-[6px] ring-primary/20 ring-offset-4 scale-110 z-10' : 'opacity-80 hover:opacity-100 hover:scale-105'}
              `}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/opt:opacity-100 transition-opacity duration-500 rounded-[1.8rem]" />
              <span className="relative z-10">{opt.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
