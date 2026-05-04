# Matchtool — Actief Werkt!

Een complete vacature- en sollicitatiebeheertool in de huisstijl van Actief Werkt!.

## ✨ Wat doet het?

- **Vacatures aanmaken** via admin-dashboard (titel, locatie, salaris, omschrijving, etc.)
- **Publiceren** op eigen domein in Actief Werkt! huisstijl
- **Delen op Meta** (Facebook + Instagram) met één klik
- **Sollicitatieformulier** inclusief CV-upload
- **Automatische e-mail naar Gmail** bij elke sollicitatie (via Zapier)
- **Automatische Trello-kaart** bij elke sollicitatie (via Zapier)
- **Veilige CV-opslag** — alleen downloadbaar door admin

## 🚀 Live zetten

Zie **[DEPLOY.md](./DEPLOY.md)** voor een complete stap-voor-stap handleiding. Reken op 30-45 minuten.

## 🛠 Tech stack

- **Next.js 14** (App Router) — framework
- **TypeScript + Tailwind CSS** — type-safe styling
- **Supabase** — database + file storage
- **Vercel** — hosting
- **Zapier** — automatisering naar Gmail & Trello

## 📁 Project structuur

```
matchtool-live/
├── app/
│   ├── page.tsx                    # Homepage met vacaturelijst
│   ├── vacature/[slug]/            # Publieke vacaturepagina + sollicitatieformulier
│   ├── admin/                      # Beveiligd admin-gedeelte
│   │   ├── login/                  # Login-pagina
│   │   ├── page.tsx                # Dashboard
│   │   ├── vacatures/              # Vacature CRUD
│   │   ├── sollicitaties/          # Sollicitaties inzien
│   │   └── instellingen/           # Settings info
│   └── api/                        # API routes
│       ├── auth/                   # Login/logout
│       ├── vacancies/              # Vacature CRUD
│       ├── applications/           # Sollicitatie ontvangst + webhook trigger
│       ├── cv/[id]/                # Beveiligde CV-download
│       └── upload/                 # CV-upload
├── components/                     # Herbruikbare componenten
├── lib/                            # Helpers (Supabase, auth, utilities)
├── middleware.ts                   # Admin-beveiliging
└── supabase-setup.sql              # Database schema
```

## 🔐 Beveiliging

- Admin-gedeelte beschermd met wachtwoord (instelbaar via env var)
- Row-Level Security op Supabase voor database
- CV's staan in privé-bucket — alleen admin kan downloaden
- Service role key alleen server-side gebruikt
- Cookies zijn HttpOnly + Secure in productie

## 🎨 Huisstijl

De tool gebruikt de Actief Werkt! kleuren:
- **Primair**: donkerblauw `#0F3A7A`
- **Accent**: geel `#FFE81A`
- **Typografie**: Inter (weight 400-900)

## 📝 Licentie

Gemaakt voor Actief Werkt. Niet voor commercieel gebruik door derden.
