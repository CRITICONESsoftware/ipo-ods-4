"use client"

import { useApp } from "@/lib/app-context"
import { Users, User, UserCog, UserMinus, ShieldAlert, LayoutDashboard, Search, Filter, MoreHorizontal, UserCheck, UserX } from "lucide-react"
import { useState } from "react"

export function AdminDashboard() {
  const { allUsers, user: currentUser, updateUserRole, deleteUser } = useApp()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (currentUser?.role !== "admin") {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-destructive/10 border border-destructive/20 rounded-2xl p-12 text-center backdrop-blur-sm animate-in zoom-in-95 duration-500">
          <ShieldAlert className="w-20 h-20 text-destructive mx-auto mb-6 transform hover:scale-110 transition-transform" />
          <h1 className="text-3xl font-black text-destructive mb-4 uppercase tracking-tighter">Acceso Restringido</h1>
          <p className="text-destructive/80 font-bold leading-tight">Esta sección requiere permisos de administrador. Tu actividad ha sido registrada.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-lg shadow-primary/20 rotate-3 transform hover:rotate-0 transition-transform">
              <LayoutDashboard size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-[900] tracking-tighter uppercase line-clamp-1">Panel de Control</h1>
          </div>
          <p className="text-muted-foreground font-bold text-sm ml-1 opacity-70">GESTIÓN CENTRALIZADA DE USUARIOS Y ROLES (ODS 4)</p>
        </div>
        
        <div className="flex items-center gap-3 bg-card p-1.5 rounded-2xl border border-border shadow-sm">
          <div className="px-5 py-2 text-center border-r border-border/50">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Total</p>
            <p className="text-2xl font-black leading-none">{allUsers.length}</p>
          </div>
          <div className="px-5 py-2 text-center text-primary">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Admins</p>
            <p className="text-2xl font-black leading-none">{allUsers.filter(u => u.role === "admin").length}</p>
          </div>
        </div>
      </header>

      <div className="bg-card border-2 border-border/60 rounded-3xl overflow-hidden shadow-2xl relative backdrop-blur-sm">
        {/* Table header with shadow/glass effect */}
        <div className="p-6 bg-muted/30 border-b border-border/60 flex flex-col sm:flex-row items-center justify-between gap-6">
           <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background/50 border-2 border-border/60 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-primary transition-all font-bold placeholder:text-muted-foreground/50 placeholder:font-bold"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-background border-2 border-border/60 hover:bg-muted text-sm font-black px-6 py-3 rounded-2xl transition-all active:scale-95">
              <Filter size={16} /> FILTRAR
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-black px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group">
              <Users size={16} className="group-hover:translate-y-[-1px]" /> EXPORTAR
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/10">Usuario</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/10">Estado / Rol</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/10 text-right">Acciones de Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-primary/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center border-2 border-primary/20 text-primary font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                        {u.avatar || u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-lg tracking-tight group-hover:text-primary transition-colors leading-none mb-1">{u.name}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase opacity-60 tracking-wider">ID: #{u.id} • {u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl border-2 uppercase tracking-widest transition-all ${
                        u.role === "admin" 
                        ? "bg-[#fcc30b]/20 text-[#fcc30b] border-[#fcc30b]/30 shadow-[0_0_20px_-5px_rgba(252,195,11,0.4)]" 
                        : "bg-muted text-muted-foreground border-border/60"
                      }`}>
                        {u.role === "admin" ? <ShieldAlert size={14} /> : <User size={14} />}
                        {u.role}
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground/60 ml-1 uppercase">Miembro Activo</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2 group-hover:translate-x-[-4px] transition-transform">
                      {u.role === "admin" ? (
                        <button
                          onClick={() => updateUserRole(u.id, "visitor")}
                          className="p-3 bg-muted border-2 border-border/40 hover:bg-background rounded-xl transition-all group/btn flex items-center gap-2"
                          title="Demover a visitante"
                        >
                          <UserX className="w-5 h-5 text-muted-foreground group-hover/btn:rotate-12 transition-transform" />
                          <span className="text-[9px] font-black sr-only">DEMOVER</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserRole(u.id, "admin")}
                          className="p-3 bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 rounded-xl transition-all group/btn flex items-center gap-2"
                          title="Promover a admin"
                        >
                          <UserCheck className="w-5 h-5 text-primary group-hover/btn:rotate-[-12px] transition-transform" />
                          <span className="text-[9px] font-black sr-only">PROMOVER</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteUser(u.id)}
                        disabled={u.id === currentUser.id}
                        className="p-3 bg-destructive/10 border-2 border-destructive/20 hover:bg-destructive text-destructive hover:text-destructive-foreground rounded-xl transition-all group/btn disabled:opacity-30 flex items-center gap-2"
                        title="Eliminar usuario"
                      >
                        <UserMinus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[9px] font-black sr-only">ELIMINAR</span>
                      </button>
                      
                      <button className="p-3 bg-muted border-2 border-border/20 rounded-xl hover:bg-muted/80 transition-all opacity-40 hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-4 bg-muted/5">
              <div className="p-6 bg-muted rounded-full animate-bounce">
                <Search size={40} className="text-muted-foreground/40" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Sin coincidencias</h3>
                <p className="text-muted-foreground font-bold">Ajusta tu búsqueda para encontrar lo que buscas.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative footer with SDG colors */}
      <footer className="pt-10 flex flex-col items-center gap-4 border-t border-border/40 opacity-40 hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
           {["#e5243b","#dda63a","#4c9f38","#c5192d"].map((color, i) => (
            <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          ))}
        </div>
        <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase">SISTEMA INTEGRAL DE GESTIÓN ODS 4</p>
      </footer>
    </main>
  )
}
