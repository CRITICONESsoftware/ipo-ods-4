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

      {/* New message input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-3 bg-card text-foreground border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSend}
          className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-[#0080b8] transition-colors"
          aria-label="Enviar mensaje"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </main>
  )
}
