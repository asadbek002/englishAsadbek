export const IELTS_PARTS = [
  { name: 'Listening', time: '30 daqiqa', what: "4 qism, 40 savol. Audio faqat bir marta eshittiriladi.", tip: "Savollarni audio boshlanishidan oldin o'qib, kalit so'zlarni belgilang. Sinonimlarga e'tibor bering — audio savoldagi so'zni deyarli hech qachon aynan takrorlamaydi." },
  { name: 'Reading', time: '60 daqiqa', what: "3 ta uzun matn, 40 savol (True/False/Not Given, sarlavha tanlash, bo'sh joy to'ldirish).", tip: "Har bir matnga 20 daqiqa ajrating. Avval savolni o'qing, keyin matndan skimming/scanning bilan javob qidiring." },
  { name: 'Writing', time: '60 daqiqa', what: "Task 1 — grafik/jarayon tavsifi (150+ so'z, 20 daq). Task 2 — esse (250+ so'z, 40 daq). Task 2 balli ikki baravar og'irroq.", tip: "Task 2 dan boshlang. Reja tuzishga 5 daqiqa sarflang: kirish → 2 ta asosiy paragraf → xulosa." },
  { name: 'Speaking', time: '11–14 daqiqa', what: "Part 1 — o'zingiz haqingizda savollar. Part 2 — kartochka bo'yicha 2 daqiqa monolog (1 daq tayyorgarlik). Part 3 — mavhum muhokama.", tip: "Javoblarni kengaytiring: fikr + sabab + misol. Jim qolmang — o'ylash uchun «That's an interesting question…» kabi iboralardan foydalaning." },
];

export const BAND_GUIDE = [
  { band: '5.0–5.5', text: "Oddiy fikrni tushuntira olasiz, lekin xatolar ko'p, so'z boyligi cheklangan. Asosiy zamonlar va oddiy bog'lovchilar." },
  { band: '6.0–6.5', text: "Fikrlar aniq, tuzilma bor. Murakkab gaplar ishlatiladi, ammo xatolar uchraydi. B2 grammatikasi to'liq kerak." },
  { band: '7.0–7.5', text: "Kam xato, moslashuvchan so'z boyligi (collocations, kam uchraydigan so'zlar). Murakkab tuzilmalar tez-tez va to'g'ri." },
  { band: '8.0+', text: "Deyarli xatosiz, tabiiy va aniq til. Nozik ma'no farqlari, idiomalar o'rinli. Akademik uslub (nominalisation, hedging) erkin." },
];

export const WRITING_CRITERIA = [
  ['Task Response', 'Savolga to\'liq javob, aniq pozitsiya, fikrlarni rivojlantirish'],
  ['Coherence & Cohesion', 'Mantiqiy tuzilma, paragraflar, bog\'lovchilarni tabiiy ishlatish'],
  ['Lexical Resource', 'So\'z boyligi, collocations, imlo'],
  ['Grammatical Range & Accuracy', 'Turli xil murakkab gaplar va ulardagi aniqlik'],
];

export const WRITING_TASKS: { task: 'task1' | 'task2'; title: string; prompt: string }[] = [
  { task: 'task2', title: 'Ta\'lim', prompt: 'Some people believe that university education should be free for everyone. Others think students should pay for their own studies. Discuss both views and give your own opinion.' },
  { task: 'task2', title: 'Texnologiya', prompt: 'Many people now spend more time communicating online than face to face. Do the advantages of this development outweigh the disadvantages?' },
  { task: 'task2', title: 'Atrof-muhit', prompt: 'Some people think that environmental problems are too big for individuals to solve and should be dealt with by governments. To what extent do you agree or disagree?' },
  { task: 'task2', title: 'Shahar hayoti', prompt: 'In many countries, people are moving from rural areas to cities. What are the causes of this trend, and what problems does it create?' },
  { task: 'task2', title: 'Ish', prompt: 'Some people prefer to work for a large company, while others prefer a small one. Discuss both options and give your opinion.' },
  { task: 'task2', title: 'Sport', prompt: 'Professional athletes earn much more money than people in other important professions such as nurses or teachers. Is this justified?' },
  { task: 'task1', title: 'Chiziqli grafik', prompt: 'The line graph shows the percentage of households with internet access in three countries (A, B and C) from 2000 to 2020. Country A: 40% → 95%. Country B: 10% → 80% (sharp rise after 2010). Country C: 5% → 45% (steady growth). Summarise the information by selecting and reporting the main features, and make comparisons where relevant.' },
  { task: 'task1', title: 'Jarayon', prompt: 'The diagram shows how tea is produced: 1) leaves are picked by hand, 2) withered for 12–18 hours, 3) rolled, 4) fermented for 2 hours, 5) dried at 120°C, 6) sorted and packed. Summarise the information by selecting and reporting the main features.' },
];

export const SPEAKING_QUESTIONS: { part: 1 | 2 | 3; q: string }[] = [
  { part: 1, q: 'Do you work or are you a student? What do you like about it?' },
  { part: 1, q: 'Tell me about your hometown. What is it famous for?' },
  { part: 1, q: 'How do you usually spend your weekends?' },
  { part: 1, q: 'Do you prefer reading books or watching films? Why?' },
  { part: 2, q: 'Describe a person who has influenced you. You should say: who this person is, how you know them, what they have done, and explain why they influenced you.' },
  { part: 2, q: 'Describe a place you visited that you would like to visit again. You should say: where it is, when you went there, what you did there, and explain why you would like to go back.' },
  { part: 2, q: 'Describe a skill you learned that was difficult. You should say: what the skill is, when you learned it, how you learned it, and explain why it was difficult.' },
  { part: 3, q: 'Do you think technology has made people more or less sociable? Why?' },
  { part: 3, q: 'Should governments spend more money on public transport or on roads?' },
  { part: 3, q: 'How has education changed in your country in the last 20 years?' },
];

/** 12 zamon — rus tilida. */
export const TENSES = [
  { group: 'Present', name: 'Present Simple', ru: 'Факты, привычки, регулярность', f: 'V / V-s', ex: 'She works every day.' },
  { group: 'Present', name: 'Present Continuous', ru: 'Происходит сейчас / временно', f: 'am/is/are + V-ing', ex: 'She is working now.' },
  { group: 'Present', name: 'Present Perfect', ru: 'Результат к настоящему, опыт', f: 'have/has + V3', ex: 'She has worked here since 2020.' },
  { group: 'Present', name: 'Present Perfect Continuous', ru: 'Длится до сих пор, важна длительность', f: 'have/has been + V-ing', ex: 'She has been working for 3 hours.' },
  { group: 'Past', name: 'Past Simple', ru: 'Завершилось в прошлом', f: 'V-ed / V2', ex: 'She worked yesterday.' },
  { group: 'Past', name: 'Past Continuous', ru: 'Длилось в момент в прошлом', f: 'was/were + V-ing', ex: 'She was working at 5 pm.' },
  { group: 'Past', name: 'Past Perfect', ru: 'Раньше другого действия в прошлом', f: 'had + V3', ex: 'She had worked before he came.' },
  { group: 'Past', name: 'Past Perfect Continuous', ru: 'Длилось до момента в прошлом', f: 'had been + V-ing', ex: 'She had been working for hours.' },
  { group: 'Future', name: 'Future Simple', ru: 'Решение, обещание, прогноз', f: 'will + V', ex: 'She will work tomorrow.' },
  { group: 'Future', name: 'Future Continuous', ru: 'Будет в процессе в момент в будущем', f: 'will be + V-ing', ex: 'She will be working at 5.' },
  { group: 'Future', name: 'Future Perfect', ru: 'Завершится к моменту в будущем', f: 'will have + V3', ex: 'She will have finished by 6.' },
  { group: 'Future', name: 'Future Perfect Continuous', ru: 'Будет длиться до момента в будущем', f: 'will have been + V-ing', ex: 'By May she will have been working here for a year.' },
];
