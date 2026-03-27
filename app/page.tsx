"use client"

import { AppProvider } from "@/lib/app-context"
import { AppShell } from "@/components/ods/app-shell"

export default function Page() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
