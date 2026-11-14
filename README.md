# Lapis English

Ingliz tilini o'zbek tilida **0 dan IELTS 8.0 gacha** o'rganish uchun PWA (telefonga o'rnatiladi, kompyuterda ham ishlaydi).

## Imkoniyatlar
- **Daraja testi** — A1…C2, har darajada 6 savol. Blokda ≥4/6 → keyingi daraja. Natijaga qarab boshlanish bosqichi belgilanadi.
- **O'quv yo'li** — 7 bosqich (Starter, A1, A2, B1, B2, C1, C2). Darslar ≥80% → bosqich imtihoni ≥80% → keyingi bosqich.
- **Grammatika** — 36 mavzu, tushuntirishlar **rus tilida**, misollar, mashqlar, 12 zamon jadvali.
- **So'zlar** — 210 so'z (EN ↔ UZ ↔ RU), 5 yo'nalish, 3 rejim (test, kartochka, yozish), Leitner spaced repetition, talaffuz.
- **Tinglash** — diktant (so'zma-so'z xato tahlili).
- **IELTS markazi** — tuzilma, mezonlar; **Writing va Speaking'ni AI (Claude) baholaydi**: band, mezonlar, xatolar (ruscha izoh), yaxshilangan variant.
- **AI ustoz** — istalgan savolga javob.
- **Hisob va sinxronlash** — progress serverda saqlanadi, offline ham ishlaydi.

## Tuzilma
```
src/        React + TypeScript frontend (Vite, PWA)
  data/     kontent: placement, grammar, words, ielts
server/     Node 22 + Fastify + SQLite (node:sqlite) + Claude API
```

## Lokal ishga tushirish
```bash
npm install && (cd server && npm install)
cp .env.example .env    # ANTHROPIC_API_KEY va JWT_SECRET ni to'ldiring
```
Ikki terminalda:
```bash
cd server && set -a && . ../.env && set +a && npm run dev     # API: http://localhost:8787
npm run dev                                                    # Frontend: http://localhost:5173
```

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
| `ANTHROPIC_API_KEY` | Claude API kaliti. Bo'lmasa AI funksiyalari o'chiq, qolgani ishlaydi |
| `JWT_SECRET` | Login tokenlari uchun maxfiy kalit (`openssl rand -hex 32`) |
| `CLAUDE_MODEL` | Standart `claude-opus-5-5` |
| `AI_DAILY_LIMIT` | Bir foydalanuvchiga kunlik AI so'rovlar soni (standart 40) |
| `DB_PATH`, `PORT`, `CORS_ORIGIN` | Ixtiyoriy |

Frontend boshqa domenda bo'lsa, build paytida `VITE_API_URL=https://api.example.uz` bering.

## API
`POST /api/auth/register|login`, `GET /api/me`, `GET|PUT /api/progress`,
`POST /api/ai/writing|speaking|tutor`, `GET /api/submissions`, `GET /api/health`.
