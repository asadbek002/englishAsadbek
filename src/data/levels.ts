export type StageId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Stage {
  id: StageId;
  code: string;
  name: string;
  uz: string;
  band: string;
  bandValue: number; // IELTS shkalasidagi o'rtacha qiymat (lenta uchun)
  goal: string;
}

export const STAGES: Stage[] = [
  { id: 0, code: '0', name: 'Starter', uz: 'Noldan', band: '0–2.0', bandValue: 1.5, goal: "Eng oddiy so'zlar, «to be», artikllar. Oddiy jumla tuza olasiz." },
  { id: 1, code: 'A1', name: 'Beginner', uz: "Boshlang'ich", band: '2.5–3.0', bandValue: 3, goal: "O'zingiz, kuningiz haqida oddiy gaplar. Hozirgi zamon." },
  { id: 2, code: 'A2', name: 'Elementary', uz: 'Elementar', band: '3.5–4.0', bandValue: 4, goal: "O'tgan va kelasi zamon, taqqoslash. Kundalik vaziyatlarda muloqot." },
  { id: 3, code: 'B1', name: 'Intermediate', uz: "O'rta", band: '4.5–5.0', bandValue: 5, goal: "Fikr bildirish, shart gaplar, passiv. IELTS'ga tayyorgarlik boshlanadi." },
  { id: 4, code: 'B2', name: 'Upper-Intermediate', uz: "O'rtadan yuqori", band: '5.5–6.5', bandValue: 6.5, goal: "Murakkab zamonlar, ko'chirma gap. Akademik so'z boyligi." },
  { id: 5, code: 'C1', name: 'Advanced', uz: 'Yuqori', band: '7.0–7.5', bandValue: 7.5, goal: "Inversiya, murakkab konstruksiyalar. Erkin va aniq yozish." },
  { id: 6, code: 'C2', name: 'Proficiency', uz: 'Mukammal', band: '8.0+', bandValue: 8.5, goal: "Akademik uslub, nozik ma'nolar. IELTS 8.0 darajasi." },
];

export const TARGET_BAND = 8;
