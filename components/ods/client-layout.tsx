"use client"

import { useEffect, ReactNode } from "react"
import { useApp } from "@/lib/app-context"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { TutorialOverlay } from "./tutorial-overlay"
import { fontSizes } from "./accessibility-page"

export function ClientLayout({ children }: { children: ReactNode }) {
    const { accessibility } = useApp()

    useEffect(() => {
        // Set the base font size on the html element so rem units scale correctly
        const rootFontSize = fontSizes[accessibility.fontSizeIndex]
        if (rootFontSize) {
            document.documentElement.style.fontSize = `${rootFontSize}px`
        }

        // Clean up if needed (optional but good practice)
        return () => {
            document.documentElement.style.fontSize = ""
        }
    }, [accessibility.fontSizeIndex])

    // Mapping color blindness to CSS filter values
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
            className={`min-h-screen bg-background flex flex-col transition-all duration-300 ${accessibility.highContrast ? "high-contrast" : ""}`}
            style={{
                filter: getColorBlindFilter()
            }}
        >
            <Header />
            <Sidebar />
            <TutorialOverlay />

            <div className="flex-1 relative overflow-hidden">
                <div className="h-full overflow-y-auto">
                    {children}
                </div>
            </div>

            {/* Color Blindness SVG Filters (Simulated) */}
            <svg className="hidden" aria-hidden="true">
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
