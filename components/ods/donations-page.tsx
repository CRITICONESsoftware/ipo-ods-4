"use client"

import { Phone, MapPin, Heart, Info, ExternalLink } from "lucide-react"
import { toast, Toaster } from "sonner"

const organizations = [
  {
    name: "UNICEF España",
    phone: "+34 913 729 000",
    location: "Calle Mauricio Legendre, 36, Madrid",
    description: "Trabaja en más de 190 países para que todos los niños tengan educación.",
    mapsUrl: "https://www.google.com/maps/search/UNICEF+Madrid",
  },
  {
    name: "Save the Children",
    phone: "+34 915 130 500",
    location: "Calle Dr. Esquerdo, 138, Madrid",
    description: "Lucha contra la pobreza infantil y garantiza el derecho a aprender.",
    mapsUrl: "https://www.google.com/maps/search/Save+the+Children+Madrid",
  },
  {
    name: "Plan International",
    phone: "+34 915 241 120",
    location: "Calle de Luis de Góngora, 8, Madrid",
    description: "Promueve los derechos de la infancia y la igualdad de las niñas.",
    mapsUrl: "https://www.google.com/maps/search/Plan+International+España",
  },
]

export function DonationsPage() {
  const handleDonate = (orgName: string) => {
    toast.success(`Gracias por tu interés en ${orgName}. Te estamos redirigiendo a su pasarela de pago segura.`, {
      description: "Operación de donación simulada por motivos educativos.",
    })
  }

  const handleInfo = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <Toaster position="top-right" richColors />
      <h2 className="text-2xl font-bold text-foreground mb-2">Donaciones para ODS 4:</h2>
      <p className="text-muted-foreground mb-8 text-sm">
        Colabora con organizaciones que garantizan una educación de calidad en todo el mundo.
      </p>

      <div className="flex flex-col gap-5">
        {organizations.map((org, i) => (
          <div
            key={i}
            className="group bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                {org.name}
              </h3>
              <div className="p-2 bg-primary/10 rounded-full">
                <Heart className="w-5 h-5 text-primary fill-none group-hover:fill-primary transition-all" />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {org.description}
            </p>

            <div className="space-y-2 mb-6">
              <a 
                href={`tel:${org.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-medium mr-1">Teléfono:</span> {org.phone}
              </a>
              <button 
                onClick={() => handleInfo(org.mapsUrl)}
                className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium mr-1">Localización:</span> {org.location}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleDonate(org.name)}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-md transition-all text-sm font-semibold"
              >
                <Heart className="w-4 h-4 fill-primary-foreground" />
                Donar ahora
              </button>
              <button 
                onClick={() => handleInfo(org.mapsUrl)}
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all text-sm font-semibold border border-border"
              >
                <Info className="w-4 h-4" />
                Saber más
                <ExternalLink className="w-3 h-3 opacity-50" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-muted/50 rounded-2xl border border-dashed border-border text-center">
        <p className="text-xs text-muted-foreground italic">
          * Esta página es una simulación de interfaz. Los botones de donación no procesan pagos reales.
        </p>
      </div>
    </main>
  )
}
