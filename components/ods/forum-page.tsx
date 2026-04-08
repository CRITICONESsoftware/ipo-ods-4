"use client"

import { Paperclip, Send } from "lucide-react"
import { useState } from "react"

const initialPosts = [
  {
    id: 1,
    title: "Lorem ipsum",
    author: "",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec nunc ac augue eleifend eleifend vitae nec nunc. Phasellus mauris dui, dictum ac arcu ac, venenatis imperdiet mi.",
    isCurrentUser: true,
  },
  {
    id: 2,
    title: "",
    author: "@Nombre_Apellido_Apellido",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec nunc ac augue eleifend eleifend vitae nec nunc. Phasellus mauris dui, dictum ac arcu ac, venenatis imperdiet mi.",
    isCurrentUser: false,
  },
]

export function ForumPage() {
  const [posts, setPosts] = useState(initialPosts)
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim()) {
      setPosts([
        ...posts,
        {
          id: posts.length + 1,
          title: "",
          author: "",
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
        {posts.map((post) => (
          <div key={post.id} className="border-2 border-primary rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            {(post.title || post.author) && (
              <div className="bg-primary px-4 py-2">
                <h3 className="text-lg font-bold text-primary-foreground">
                  {post.title || post.author}
                </h3>
              </div>
            )}

            {/* Content */}
            <div className="bg-secondary p-4">
              <p className="text-foreground leading-relaxed">{post.content}</p>

              {post.isCurrentUser && (
                <div className="flex justify-end gap-2 mt-3">
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Adjuntar">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Enviar">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New message input container with extra padding for scaled buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pb-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-6 py-4 bg-card text-foreground border-2 border-primary rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 min-h-[3rem]"
        />
        <button
          onClick={handleSend}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-[#0080b8] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          aria-label="Enviar mensaje"
        >
          <span className="font-bold sm:hidden">ENVIAR</span>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </main>
  )
}
