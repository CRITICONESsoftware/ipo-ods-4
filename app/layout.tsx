import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AppProvider } from '@/lib/app-context'
import { ClientLayout } from '@/components/ods/client-layout'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: 'ODS - Objetivos de Desarrollo Sostenible',
  description: 'Plataforma educativa sobre los Objetivos de Desarrollo Sostenible de las Naciones Unidas',
  icons: {
    icon: "/icon.webp",
  },
}

export const viewport: Viewport = {
  themeColor: '#0093d5',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AppProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AppProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
