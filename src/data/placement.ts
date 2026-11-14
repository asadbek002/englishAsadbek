import { c, Question } from './types';

/**
 * Daraja testi: har bir daraja (A1…C2) uchun 6 ta savol.
 * Qoida: blokda kamida 4/6 to'g'ri bo'lsa — keyingi darajaga o'tiladi, aks holda test to'xtaydi.
 */
export const PLACEMENT: { level: 1 | 2 | 3 | 4 | 5 | 6; questions: Question[] }[] = [
  { level: 1, questions: [
    c('I ___ a student.', 'am', 'is', 'are'),
    c('She ___ to school every day.', 'goes', 'go', 'going'),
    c("What is the opposite of 'big'?", 'small', 'tall', 'long'),
    c('There ___ two cats in the room.', 'are', 'is', 'be'),
    c('___ you like coffee?', 'Do', 'Does', 'Are'),
    c('My brother ___ 20 years old.', 'is', 'has', 'have'),
  ] },
  { level: 2, questions: [
    c('Yesterday I ___ to the cinema.', 'went', 'go', 'have gone'),
    c('She is ___ than her sister.', 'taller', 'more tall', 'tallest'),
    c('We ___ dinner when the phone rang.', 'were having', 'had', 'are having'),
    c("I've lived here ___ 2015.", 'since', 'for', 'from'),
    c('How ___ money do you have?', 'much', 'many', 'lot'),
    c("Look at those clouds! It ___ rain.", 'is going to', 'shall', 'is raining to'),
  ] },
  { level: 3, questions: [
    c('If I ___ more time, I would learn Japanese.', 'had', 'have', 'will have'),
    c('This bridge ___ in 1890.', 'was built', 'built', 'has built'),
    c("I'm not used to ___ up early.", 'getting', 'get', 'got'),
    c('Have you ever ___ to London?', 'been', 'go', 'went'),
    c('The man ___ lives next door is a doctor.', 'who', 'which', 'what'),
    c("I've been waiting ___ two hours.", 'for', 'since', 'during'),
  ] },
  { level: 4, questions: [
    c('By the time we arrived, the film ___.', 'had already started', 'already starts', 'has already started'),
    c('She asked me where ___.', 'I lived', 'did I live', 'do I live'),
    c('If you had told me, I ___ you.', 'would have helped', 'would help', 'had helped'),
    c("He must ___ the keys at home — they're not here.", 'have left', 'leave', 'left'),
    c("Closest meaning of 'reluctant':", 'unwilling', 'eager', 'careful'),
    c('This time tomorrow I ___ on the beach.', 'will be lying', 'lie', 'am lain'),
  ] },
  { level: 5, questions: [
    c('Not only ___ late, but he also forgot the tickets.', 'was he', 'he was', 'he were'),
    c('___ the report, she sent it to her boss.', 'Having finished', 'Finished', 'Have finished'),
    c("I wish I ___ that — it was rude.", "hadn't said", "didn't say", "wouldn't say"),
    c('It was John ___ broke the window.', 'who', 'what', 'whom'),
    c("'Ubiquitous' means:", 'found everywhere', 'very rare', 'extremely old'),
    c('The government has introduced measures to ___ unemployment.', 'tackle', 'make', 'do'),
  ] },
  { level: 6, questions: [
    c('It is essential that every candidate ___ on time.', 'arrive', 'arrives to', 'will arriving'),
    c('Hardly ___ the house when it started to rain.', 'had I left', 'I had left', 'I left'),
    c('Academic style: "The ___ of the policy led to protests."', 'implementation', 'doing', 'making'),
    c("'To take something with a pinch of salt' means:", 'to be sceptical about it', 'to accept it fully', 'to make it better'),
    c('The findings ___ that the hypothesis may be flawed.', 'suggest', 'say', 'tell'),
    c('Seldom ___ such a remarkable performance.', 'have I seen', 'I have seen', 'I saw'),
  ] },
];

export const PASS_PER_BLOCK = 4;

/** Natijadan boshlanish bosqichini aniqlash. passed — oxirgi muvaffaqiyatli o'tilgan daraja (0 = hech biri). */
export function startStageFrom(passed: number, firstBlockScore: number): number {
  if (passed === 0) return firstBlockScore >= 2 ? 1 : 0;
  return Math.min(passed + 1, 6);
}
