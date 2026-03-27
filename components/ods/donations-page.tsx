"use client"

const organizations = [
  {
    name: "ONG 1",
    phone: "+34 912 345 678",
    location: "c/ Gran Via, 28, Madrid",
  },
  {
    name: "ONG 2",
    phone: "+34 933 456 789",
    location: "c/ Diagonal, 15, Barcelona",
  },
  {
    name: "ONG 3",
    phone: "+34 954 567 890",
    location: "c/ Sierpes, 42, Sevilla",
  },
]

export function DonationsPage() {
  return (
    <main className="p-4 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">Donaciones:</h2>

      <div className="flex flex-col gap-4">
        {organizations.map((org, i) => (
          <div
            key={i}
            className="bg-accent text-accent-foreground rounded-xl p-5 border-2 border-primary shadow-sm"
          >
            <h3 className="text-xl font-bold mb-2 text-foreground">{org.name}:</h3>
            <p className="text-foreground mb-1">
              <span className="font-semibold">Telefono:</span> {org.phone}
            </p>
            <p className="text-foreground mb-4">
              <span className="font-semibold">Localizacion:</span> {org.location}
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-card text-foreground border border-border rounded-md hover:bg-muted transition-colors text-sm font-medium">
                Donar
              </button>
              <button className="px-4 py-2 bg-card text-foreground border border-border rounded-md hover:bg-muted transition-colors text-sm font-medium">
                Mas informacion
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
