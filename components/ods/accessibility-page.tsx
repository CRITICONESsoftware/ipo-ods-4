"use client"

import { toast, Toaster } from "sonner"
import { useApp } from "@/lib/app-context"
import { ArrowLeft } from "lucide-react"

const colorBlindOptions = [
    "Ninguno",
    "Protanopia",
    "Protanomalia",
    "Deuteranopia",
    "Deuteranomalia",
    "Tritanopia",
    "Tritanomalia",
    "Acromatopsia",
]

export const fontSizes = [12, 14, 16, 18, 20, 22, 24]

export function AccessibilityPage() {
    const { setCurrentPage, accessibility, setAccessibility } = useApp()

    const handleSettingChange = (setting: string, value: any) => {
        setAccessibility({ [setting]: value })
        toast.info("Ajuste actualizado", {
            description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} cambiado a ${typeof value === "boolean" ? (value ? "Activado" : "Desactivado") : value}`,
            duration: 2000,
        })
    }

    return (
        <main className="p-4 md:p-8 max-w-4xl mx-auto">
            <Toaster position="top-right" richColors />

            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setCurrentPage("home")}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Volver al inicio"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-foreground uppercase tracking-wider">
                    Opciones de Accesibilidad
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Text and buttons section */}
                <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                        Texto y botones:
                    </h3>
                    <div className="ml-4">
                        <p className="text-foreground mb-4 font-medium">Tamaño de letra y botones:</p>
                        <div className="flex items-center gap-3 mb-4 p-4 bg-muted/30 rounded-xl w-fit">
                            <span className="text-xs text-muted-foreground font-bold">A</span>
                            <div className="flex items-center gap-1.5">
                                {fontSizes.map((_, i) => (
                                    <label key={i} className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="fontSizeIndex"
                                            checked={accessibility.fontSizeIndex === i}
                                            onChange={() => handleSettingChange("fontSizeIndex", i)}
                                            className="sr-only"
                                        />
                                        <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                      ${accessibility.fontSizeIndex === i
                                                ? "bg-primary border-primary text-primary-foreground scale-110 shadow-md"
                                                : "bg-background border-border text-muted-foreground group-hover:border-primary/50"}
                    `}>
                                            {i + 1}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <span className="text-2xl text-foreground font-bold">A</span>
                        </div>
                        <p
                            className="text-primary font-medium italic transition-all duration-300"
                            style={{ fontSize: `${fontSizes[accessibility.fontSizeIndex]}px` }}
                        >
                            Este es un ejemplo del tamaño de letra actual.
                        </p>
                    </div>
                </section>

                {/* Color section */}
                <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                        Color y Contraste:
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Color blind mode */}
                        <div className="bg-muted/30 p-4 rounded-xl">
                            <p className="text-foreground font-semibold mb-4 text-sm uppercase tracking-tight">Modo daltonismo:</p>
                            <div className="flex flex-col gap-2">
                                {colorBlindOptions.map((option) => (
                                    <label key={option} className="flex items-center gap-3 cursor-pointer group hover:bg-white/50 dark:hover:bg-black/20 p-1.5 rounded-lg transition-colors">
                                        <input
                                            type="radio"
                                            name="colorBlindMode"
                                            checked={accessibility.colorBlindMode === option}
                                            onChange={() => handleSettingChange("colorBlindMode", option)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <span className={`text-sm ${accessibility.colorBlindMode === option ? "font-bold text-primary" : "text-muted-foreground"}`}>
                                            {option}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* High contrast */}
                        <div className="bg-muted/30 p-4 rounded-xl h-fit">
                            <p className="text-foreground font-semibold mb-4 text-sm uppercase tracking-tight">Alto contraste:</p>
                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Desactivado", value: false },
                                    { label: "Activado", value: true }
                                ].map((option) => (
                                    <label key={option.label} className="flex items-center gap-3 cursor-pointer group hover:bg-white/50 dark:hover:bg-black/20 p-2 rounded-lg transition-colors">
                                        <input
                                            type="radio"
                                            name="highContrast"
                                            checked={accessibility.highContrast === option.value}
                                            onChange={() => handleSettingChange("highContrast", option.value)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <span className={`text-sm ${accessibility.highContrast === option.value ? "font-bold text-primary" : "text-muted-foreground"}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Color palette preview */}
                        <div className="flex flex-col items-center">
                            <p className="text-foreground font-semibold mb-4 text-sm text-center uppercase tracking-tight">Vista previa de paleta:</p>
                            <div className="relative">
                                <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-lg">
                                    {[...Array(12)].map((_, i) => {
                                        const angle = (i * 30 * Math.PI) / 180
                                        const colors = [
                                            "#ff0000", "#ff8000", "#ffff00", "#80ff00",
                                            "#00ff00", "#00ff80", "#00ffff", "#0080ff",
                                            "#0000ff", "#8000ff", "#ff00ff", "#ff0080",
                                        ]
                                        return (
                                            <path
                                                key={i}
                                                d={`M100,100 L${100 + 85 * Math.cos(angle - 0.26)},${100 + 85 * Math.sin(angle - 0.26)} A85,85 0 0,1 ${100 + 85 * Math.cos(angle + 0.26)},${100 + 85 * Math.sin(angle + 0.26)} Z`}
                                                fill={colors[i]}
                                                className="opacity-90 hover:opacity-100 transition-opacity cursor-help"
                                            >
                                                <title>Color {i + 1}</title>
                                            </path>
                                        )
                                    })}
                                    <circle cx="100" cy="100" r="30" fill="white" className="dark:fill-[#232342] shadow-inner" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sound section */}
                <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                        Sonido y Audio:
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Lector de contenido */}
                        <div className="bg-muted/30 p-5 rounded-xl">
                            <p className="text-foreground font-semibold mb-3">Lector de contenido:</p>
                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Desactivado", value: false },
                                    { label: "Activado", value: true }
                                ].map((option) => (
                                    <label key={option.label} className="flex items-center gap-3 cursor-pointer group hover:bg-white/50 dark:hover:bg-black/20 p-2 rounded-lg transition-colors">
                                        <input
                                            type="radio"
                                            name="contentReader"
                                            checked={accessibility.contentReader === option.value}
                                            onChange={() => handleSettingChange("contentReader", option.value)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <span className={`text-sm ${accessibility.contentReader === option.value ? "font-bold text-primary" : "text-muted-foreground"}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <p className="mt-4 text-xs text-muted-foreground italic">
                                Activa la lectura automática de los textos de la página por voz sintetizada.
                            </p>
                        </div>

                        {/* Navegación por voz */}
                        <div className="bg-muted/30 p-5 rounded-xl">
                            <p className="text-foreground font-semibold mb-3">Navegación por voz:</p>
                            <div className="flex flex-col gap-3">
                                {[
                                    { label: "Desactivado", value: false },
                                    { label: "Activado", value: true }
                                ].map((option) => (
                                    <label key={option.label} className="flex items-center gap-3 cursor-pointer group hover:bg-white/50 dark:hover:bg-black/20 p-2 rounded-lg transition-colors">
                                        <input
                                            type="radio"
                                            name="voiceNav"
                                            checked={accessibility.voiceNav === option.value}
                                            onChange={() => handleSettingChange("voiceNav", option.value)}
                                            className="w-4 h-4 accent-primary"
                                        />
                                        <span className={`text-sm ${accessibility.voiceNav === option.value ? "font-bold text-primary" : "text-muted-foreground"}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <p className="mt-4 text-xs text-muted-foreground italic">
                                Permite navegar por el menú diciendo comandos de voz.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Vibration section */}
                <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                        Vibración:
                    </h3>
                    <div className="ml-4 max-w-sm">
                        <p className="text-foreground font-medium mb-3">Vibración al pulsar botones:</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Desactivado", value: false },
                                { label: "Activado", value: true }
                            ].map((option) => (
                                <label key={option.label} className="flex items-center gap-3 cursor-pointer group hover:bg-muted/50 p-2 rounded-lg transition-colors">
                                    <input
                                        type="radio"
                                        name="vibration"
                                        checked={accessibility.vibration === option.value}
                                        onChange={() => handleSettingChange("vibration", option.value)}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    <span className={`text-sm ${accessibility.vibration === option.value ? "font-bold text-primary" : "text-muted-foreground"}`}>
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
