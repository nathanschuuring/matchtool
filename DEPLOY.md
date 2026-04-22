# 🚀 Matchtool Live Zetten — Stap-voor-stap Handleiding

Deze handleiding neemt je mee door het opzetten van de Matchtool op jouw domein. Reken op **30-45 minuten** voor de hele setup. Geen code kennis vereist — je kopieert en plakt.

## 📋 Wat je nodig hebt

- [ ] Een domein (heb je al)
- [ ] Een GitHub-account (gratis) — nodig om de code te hosten
- [ ] Een Vercel-account (gratis) — voor de website zelf
- [ ] Een Supabase-account (gratis) — voor database & CV-opslag
- [ ] Een Zapier-account (gratis) — voor Gmail + Trello-koppeling

---

## Stap 1: GitHub account & repository (5 min)

1. Ga naar **[github.com](https://github.com)** en maak een gratis account aan (of log in).
2. Klik rechtsboven op **`+` → New repository**.
3. Vul in:
   - **Repository name**: `matchtool-actief-werkt`
   - **Private**: ✅ aanvinken (zo blijft je code privé)
   - Laat de rest leeg
4. Klik **Create repository**.
5. Op de volgende pagina zie je instructies — laat die open staan, we komen er zo op terug.

### Upload de code

De makkelijkste manier zonder terminal:

1. Pak het bestand `matchtool-actief-werkt.zip` uit dat je van mij hebt gekregen.
2. Op je nieuwe GitHub-repo-pagina, klik op **"uploading an existing file"** (link in het midden).
3. Sleep **alle bestanden en mappen** uit de uitgepakte zip naar het upload-veld. ⚠️ Let op: niet de hoofdmap `matchtool-live` meeslepen — open die map en pak alles **binnenin** op.
4. Onderaan bij "Commit changes" klik **Commit changes**.
5. Je zou nu je code moeten zien op GitHub.

---

## Stap 2: Supabase project opzetten (10 min)

Supabase is je database (bewaart vacatures en sollicitaties) en je bestandsopslag (CVs).

1. Ga naar **[supabase.com](https://supabase.com)** en klik rechtsboven op **Start your project** → maak een account (kan via GitHub).
2. Klik op **New project**:
   - **Name**: `matchtool`
   - **Database password**: verzin een sterk wachtwoord en **sla 'm op in je wachtwoordmanager** (zoals 1Password, Bitwarden). Je hebt 'm niet direct nodig maar kwijt is kwijt.
   - **Region**: kies **West EU (Frankfurt)** — dichtstbij
   - **Pricing plan**: **Free** is genoeg
3. Klik **Create new project**. Wachten duurt ongeveer 2 minuten terwijl de database wordt aangemaakt.

### Database-tabellen aanmaken

1. In je Supabase project, klik in het linker menu op **SQL Editor** (💾 icoon).
2. Klik op **+ New query**.
3. Open het bestand `supabase-setup.sql` uit de zip in een teksteditor (Kladblok werkt).
4. Kopieer **de hele inhoud** en plak het in de Supabase SQL editor.
5. Klik rechtsonder op **Run** (of `Ctrl+Enter`).
6. Je zou nu onderaan moeten zien: "Success. No rows returned". ✅

### Haal je Supabase keys op

1. Klik in het linker menu op het tandwiel ⚙️ → **Project Settings** → **API**.
2. Je ziet drie waardes. We hebben er 3 nodig (houd dit tabblad open):
   - **Project URL** (start met `https://...supabase.co`)
   - **anon public** key (de lange string onder "Project API keys")
   - **service_role** key (klik op 👁 Reveal om 'm te zien) ⚠️ deze is geheim!

---

## Stap 3: Vercel deployment (10 min)

Vercel host je website en koppelt het aan je domein.

1. Ga naar **[vercel.com](https://vercel.com)** en klik **Sign Up** → kies **Continue with GitHub**.
2. In je Vercel dashboard, klik **Add New...** → **Project**.
3. Zoek naar `matchtool-actief-werkt` in de lijst en klik **Import**.
4. Op het configuratiescherm:
   - **Framework Preset**: Next.js (wordt automatisch herkend) ✅
   - Open **Environment Variables** (de sectie daaronder)

### Environment Variables invullen

Voeg deze variabelen één voor één toe (klik steeds op **Add**):

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | de Project URL uit Supabase stap 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | de `anon public` key uit Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | de `service_role` key uit Supabase |
| `ADMIN_PASSWORD` | verzin nu een sterk wachtwoord voor jezelf (minstens 12 tekens) |
| `NEXT_PUBLIC_SITE_URL` | `https://jouwdomein.nl` (vul je eigen domein in, zónder slash op het eind) |
| `WEBHOOK_URL` | laat leeg — we vullen dit in stap 5 in |
| `NOTIFICATION_EMAIL` | je eigen e-mailadres waar sollicitaties naartoe moeten |
| `TRELLO_BOARD` | naam van je Trello-bord (later nog nodig) |

5. Klik **Deploy**. Nu duurt het ongeveer 2-3 minuten.

Je krijgt een URL zoals `matchtool-actief-werkt-xyz.vercel.app`. **Test 'm**: open 'm, en ga naar `/admin/login`. Log in met je admin-wachtwoord.

### Eerste test: maak een testvacature

1. In het admin-scherm, klik **Nieuwe vacature**.
2. Vul alle velden in (gebruik de buitendienstmonteur of elektromonteur vacature als voorbeeld).
3. Publiceer.
4. Ga naar de publieke URL: `https://matchtool-actief-werkt-xyz.vercel.app/vacature/jouw-slug`.

Werkt? ✅ Door naar de volgende stap.

---

## Stap 4: Jouw domein koppelen (5 min)

1. In Vercel, ga naar je project → **Settings** → **Domains**.
2. Tik je domein in (bv. `matchtool.jouwdomein.nl` of gewoon `jouwdomein.nl`) → **Add**.
3. Vercel geeft je DNS-instructies. Je krijgt één van twee soorten:
   - **A-record** voor hoofddomein
   - **CNAME-record** voor subdomein
4. Log in op je domeinregistrar (bv. TransIP, Hostnet, GoDaddy, Namecheap) en voeg het record toe zoals Vercel aangeeft.
5. Het duurt 5-60 minuten voordat DNS actief is. Vercel geeft groen vinkje als het klaar is.
6. **Belangrijk**: update nu de `NEXT_PUBLIC_SITE_URL` in Vercel naar je échte domein. Vercel → Settings → Environment Variables → bewerk → **Redeploy** bovenaan de Deployments-pagina.

---

## Stap 5: Zapier automatisering (10 min)

Deze stap zorgt ervoor dat je bij élke sollicitatie een e-mail in Gmail én een kaart in Trello krijgt.

### A. Maak de webhook

1. Ga naar **[zapier.com](https://zapier.com)** → **Sign up** (gratis).
2. Klik **Create Zap**.
3. **Trigger**: zoek **Webhooks by Zapier** → kies **Catch Hook** → **Continue**.
4. Klik **Continue** (geen child key nodig).
5. Je ziet nu een **Custom Webhook URL** zoals `https://hooks.zapier.com/hooks/catch/...`. Kopieer deze.
6. Ga naar Vercel → je project → **Settings** → **Environment Variables** → zoek `WEBHOOK_URL` → klik erop → plak de URL in het value-veld → **Save**.
7. Ga naar **Deployments** → klik op de laatste → **Redeploy** (zodat de nieuwe variabele wordt opgepakt).

### B. Test de webhook

1. Ga terug naar Zapier, en klik **Test trigger**.
2. Zapier wacht nu op data. Doe nu een test-sollicitatie op je website (op een vacature → solliciteer nu → vul in → verzend).
3. Zapier zou nu de data moeten ontvangen. ✅ Klik **Continue with selected record**.

### C. Gmail actie toevoegen

1. **Action step** → zoek **Gmail** → kies **Send Email**.
2. Verbind je Gmail-account.
3. Vul het e-mail template in. Voorbeeld:
   - **To**: `{{notificationEmail}}` (uit de webhook data)
   - **From Name**: `Matchtool`
   - **Subject**: `Nieuwe sollicitatie: {{application full_name}} voor {{application vacancy_title}}`
   - **Body type**: Plain
   - **Body**:
     ```
     Er is een nieuwe sollicitatie binnengekomen!

     Naam: {{application full_name}}
     E-mail: {{application email}}
     Telefoon: {{application phone}}
     Land: {{application country}}

     Vacature: {{application vacancy_title}} ({{application vacancy_location}})
     Referentie: {{application vacancy_reference}}

     Motivatie:
     {{application motivation}}

     CV: {{application cv_url}}

     Ingediend: {{application created_at}}
     ```
4. Klik **Test step** om te kijken of de mail binnenkomt. ✅

### D. Trello kaart actie toevoegen

1. Klik op **+** onder de Gmail stap → **Action** → zoek **Trello** → kies **Create Card**.
2. Verbind je Trello account.
3. Configureer:
   - **Board**: kies je Trello bord
   - **List**: kies de kolom (bv. "Nieuwe sollicitaties")
   - **Name**: `{{application full_name}} — {{application vacancy_title}}`
   - **Description**:
     ```
     📧 {{application email}}
     📞 {{application phone}}
     📍 {{application country}}

     Vacature: {{application vacancy_title}}
     Locatie: {{application vacancy_location}}
     Ref: {{application vacancy_reference}}

     Motivatie:
     {{application motivation}}

     CV: {{application cv_url}}
     ```
4. **Test step** → controleer in Trello of de kaart is aangemaakt. ✅

### E. Activeer de Zap

Klik linksboven op **Publish Zap** → vanaf nu komt elke sollicitatie automatisch binnen!

---

## 🎉 Klaar!

Je Matchtool is live. Wat je nu kunt doen:

- **Admin login**: `https://jouwdomein.nl/admin/login`
- **Vacature aanmaken & delen** via de Deel-knop
- **Sollicitaties bekijken**: `/admin/sollicitaties`
- **CV's downloaden**: klik in een sollicitatie op de CV-link

## 📘 Veelgestelde vragen

**Q: Kan ik mijn admin-wachtwoord wijzigen?**
A: Ja, ga naar Vercel → Settings → Environment Variables → wijzig `ADMIN_PASSWORD` → **Redeploy**.

**Q: Kost Vercel/Supabase geld?**
A: Nee, de gratis plannen zijn ruim voldoende voor tot ~100.000 bezoekers/mnd en 500MB aan CV's. Zapier gratis = 100 acties/mnd (= 50 sollicitaties). Meer nodig? Zapier Starter is €20/mnd.

**Q: Waar komen de CV's te staan?**
A: Veilig in Supabase Storage. Alleen jij als admin kan ze downloaden via de beveiligde `/api/cv/[id]` route.

**Q: Werkt dit op mobiel?**
A: Ja, zowel de publieke pagina's als het admin-gedeelte zijn volledig responsive.

**Q: Hoe verwijder ik een sollicitant uit de database?**
A: In `/admin/sollicitaties`, klik op het prullenbak-icoon naast de naam. De CV wordt ook automatisch verwijderd.

**Q: Mijn wijzigingen verschijnen niet op de site.**
A: De publieke vacature-pagina's cachen 60 seconden. Ververs na een minuutje. Als je iets aan code/env vars hebt gewijzigd, moet je in Vercel een nieuwe deploy triggeren.

**Q: Iemand heeft gesolliciteerd maar geen Zapier-e-mail ontvangen.**
A: Check in Zapier of de Zap "On" staat en kijk in de Zap History. Het meest voorkomend probleem is een verkeerde `WEBHOOK_URL` in Vercel — hercontroleer die.

## 🆘 Hulp nodig?

Bij problemen, check eerst:
1. Staan alle environment variables correct in Vercel?
2. Is de laatste deploy succesvol in Vercel → Deployments?
3. Werken de API calls? Open de browser DevTools (F12) → Network tab → zoek naar rode (errored) calls.

Voor ondersteuning met Zapier koppelingen, Supabase queries, of custom aanpassingen: neem contact op met je ontwikkelaar.
