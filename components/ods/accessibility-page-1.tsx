"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"

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

const fontSizes = [12, 14, 16, 18, 20, 22, 24]

export function AccessibilityPage1() {
  const { setCurrentPage } = useApp()
  const [fontSize, setFontSize] = useState(3)
  const [colorBlind, setColorBlind] = useState("Ninguno")
  const [highContrast, setHighContrast] = useState("Desactivado")

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-foreground mb-6 uppercase">
        Opciones de Accesibilidad
      </h2>

      {/* Text and buttons section */}
      <section className="mb-8">
        <h3 className="font-bold text-foreground mb-2">Texto y botones:</h3>
        <div className="ml-4">
          <p className="text-foreground mb-3 font-medium">Tamano de letra y botones:</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-xs text-foreground">A</span>
            {fontSizes.map((_, i) => (
              <label key={i} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="fontSize"
                  checked={fontSize === i}
                  onChange={() => setFontSize(i)}
                  className="w-4 h-4 accent-primary"
                />
              </label>
            ))}
            <span className="text-2xl text-foreground font-bold">A</span>
          </div>
          <p className="text-muted-foreground text-sm italic" style={{ fontSize: `${fontSizes[fontSize]}px` }}>
            El texto y los botones se veran de este tamano
          </p>
        </div>
      </section>

      {/* Color section */}
      <section>
        <h3 className="font-bold text-foreground mb-4">Color:</h3>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Color blind mode */}
          <div>
            <p className="text-foreground font-medium mb-2 ml-4">Modo daltonismo:</p>
            <div className="ml-8 flex flex-col gap-1">
              {colorBlindOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                  <input
                    type="radio"
                    name="colorBlind"
                    checked={colorBlind === option}
                    onChange={() => setColorBlind(option)}
                    className="w-4 h-4 accent-primary"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* High contrast */}
          <div>
            <p className="text-foreground font-medium mb-2">Modo alto contraste:</p>
            <div className="ml-4 flex flex-col gap-1">
              {["Desactivado", "Activado"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                  <input
                    type="radio"
                    name="highContrast"
                    checked={highContrast === option}
                    onChange={() => setHighContrast(option)}
                    className="w-4 h-4 accent-primary"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Color palette preview */}
          <div className="flex-1">
            <p className="text-foreground font-medium mb-2">La paleta de colores que se utilizara es:</p>
            <div className="flex justify-center">
              <svg viewBox="0 0 200 200" className="w-40 h-40">
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180
                  const colors = [
                    "#ff0000","#ff8000","#ffff00","#80ff00",
                    "#00ff00","#00ff80","#00ffff","#0080ff",
                    "#0000ff","#8000ff","#ff00ff","#ff0080",
                  ]
                  return (
                    <path
                      key={i}
                      d={`M100,100 L${100 + 85 * Math.cos(angle - 0.26)},${100 + 85 * Math.sin(angle - 0.26)} A85,85 0 0,1 ${100 + 85 * Math.cos(angle + 0.26)},${100 + 85 * Math.sin(angle + 0.26)} Z`}
                      fill={colors[i]}
                      opacity="0.85"
                    />
                  )
                })}
                <circle cx="100" cy="100" r="30" fill="white" className="dark:fill-[#232342]" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation to page 2 */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setCurrentPage("accessibility-2")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-[#0080b8] transition-colors font-medium"
        >
          Siguiente pagina
        </button>
      </div>
    </main>
  )
}
