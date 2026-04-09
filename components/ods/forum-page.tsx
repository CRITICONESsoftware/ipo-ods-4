"use client"

import { Paperclip, Pencil, Send } from "lucide-react"
import { useState } from "react"
import { useApp } from "@/lib/app-context"

type ForumPost = {
  id: number
  title: string
  author: string
  content: string
  isCurrentUser: boolean
}

export function ForumPage() {
  const { user } = useApp()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim()) {
      setPosts([
        ...posts,
        {
          id: posts.length + 1,
          title: "",
          author: "@" + user?.name + " [Tú]" || "Usuario [Tú]",
          content: newMessage,
          isCurrentUser: true,
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <main className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Foro:</h2>

      <div className="flex flex-col gap-4 mb-6">
        <h5 className="text-muted-foreground font-bold italic">Próximamente</h5>
      </div>
    </main>
  )
}
