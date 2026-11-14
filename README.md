# Lapis English

Ingliz tilini o'zbek tilida **0 dan IELTS 8.0 gacha** o'rganish uchun PWA (telefonga o'rnatiladi, kompyuterda ham ishlaydi).

## Imkoniyatlar
- **Daraja testi** — A1…C2, har darajada 6 savol. Blokda ≥4/6 → keyingi daraja. Natijaga qarab boshlanish bosqichi belgilanadi.
- **O'quv yo'li** — 7 bosqich (Starter, A1, A2, B1, B2, C1, C2). Darslar ≥80% → bosqich imtihoni ≥80% → keyingi bosqich.
- **Grammatika** — 36 mavzu, tushuntirishlar **rus tilida**, misollar, mashqlar, 12 zamon jadvali.
- **So'zlar** — 210 so'z (EN ↔ UZ ↔ RU), 5 yo'nalish, 3 rejim (test, kartochka, yozish), Leitner spaced repetition, talaffuz.
- **Tinglash** — diktant (so'zma-so'z xato tahlili).
- **IELTS markazi** — tuzilma, mezonlar; **Writing va Speaking'ni AI baholaydi** (Gemini yoki Claude): band, mezonlar, xatolar (ruscha izoh), yaxshilangan variant.
- **AI ustoz** — istalgan savolga javob.
- **Hisob va sinxronlash** — progress serverda saqlanadi, offline ham ishlaydi.

## Tuzilma
```
src/        React + TypeScript frontend (Vite, PWA)
  data/     kontent: placement, grammar, words, ielts
server/     Node 22 + Fastify + SQLite (node:sqlite)
  src/providers/  gemini.ts, claude.ts — AI provayderlari
```

## Lokal ishga tushirish (Node.js 22.13+)
```bash
npm run setup           # bog'liqliklarni o'rnatish (bir marta)
cp .env.example .env    # GEMINI_API_KEY va JWT_SECRET ni to'ldiring
npm run app             # yig'ish va ishga tushirish → http://localhost:8787
```
Dasturlash rejimi (o'zgarishlar darhol ko'rinadi): bir terminalda `npm run dev:server`, ikkinchisida `npm run dev` → http://localhost:5173

## O'z serveringizga joylash (Docker)
```bash
cp .env.example .env    # kalitlarni yozing
docker compose up -d --build
```
Ilova `http://SERVER:8787` da ochiladi. Ma'lumotlar bazasi `./data/app.db` da saqlanadi (zaxira nusxa oling).
PWA telefonga o'rnatilishi uchun **HTTPS** kerak: oldiga Nginx/Caddy qo'ying, masalan Caddy:
```
english.example.uz {
  reverse_proxy localhost:8787
}
```

## Muhit o'zgaruvchilari
| Nomi | Tavsif |
|---|---|
| `AI_PROVIDER` | `auto` (avval Gemini, ishlamasa Claude), `gemini` yoki `claude` |
| `GEMINI_API_KEY` | Google AI Studio kaliti — tekin tarif bor |
| `GEMINI_MODEL` | Standart `gemini-2.5-flash` |
| `ANTHROPIC_API_KEY` | Claude kaliti (zaxira). Ikkala kalit ham bo'lmasa, AI o'chiq, qolgani ishlaydi |
| `JWT_SECRET` | Login tokenlari uchun maxfiy kalit (`openssl rand -hex 32`) |
| `CLAUDE_MODEL` | Standart `claude-opus-5-5`; arzon zaxira uchun `claude-haiku-5-5` |
| `AI_DAILY_LIMIT` | Bir foydalanuvchiga kunlik AI so'rovlar soni (standart 40) |
| `DB_PATH`, `PORT`, `CORS_ORIGIN` | Ixtiyoriy |

Frontend boshqa domenda bo'lsa, build paytida `VITE_API_URL=https://api.example.uz` bering.

## API
`POST /api/auth/register|login`, `GET /api/me`, `GET|PUT /api/progress`,
`POST /api/ai/writing|speaking|tutor`, `GET /api/submissions`, `GET /api/health`.

## AI qanday tanlanadi
`AI_PROVIDER=auto` bo'lsa, har bir so'rov avval **Gemini**ga yuboriladi. Tekin limit tugasa (429), Gemini xato bersa
yoki javob noto'g'ri formatda kelsa, o'sha so'rov avtomatik **Claude**ga yuboriladi. Qaysi AI javob bergani
`x-ai-provider` sarlavhasida qaytariladi va server logida ko'rinadi.

Eslatma: Gemini tekin tarifida yuborilgan matnlar Google tomonidan mahsulotni yaxshilash uchun ishlatiladi.
