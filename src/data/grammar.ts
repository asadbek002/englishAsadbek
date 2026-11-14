import type { StageId } from './levels';
import { c, w, Question } from './types';

export interface Topic {
  id: string;
  stage: StageId;
  title: string;
  ru: string;
  theory: string[]; // **жирный** поддерживается
  formula?: string[];
  examples: [string, string][];
  tip?: string;
  exercises: Question[];
}

export const TOPICS: Topic[] = [
  // ───────────── STARTER ─────────────
  {
    id: 'to-be', stage: 0, title: 'To be: am / is / are', ru: 'Глагол «быть»',
    theory: [
      'В русском мы говорим «Я студент» без глагола. В английском глагол **to be** обязателен: «I **am** a student».',
      'Форма зависит от подлежащего: **I → am**, **he / she / it → is**, **we / you / they → are**.',
      'Отрицание: добавляем **not** после глагола. Вопрос: ставим глагол **перед** подлежащим.',
    ],
    formula: ['I am / He is / They are', 'I am not · She is not (isn\'t) · We are not (aren\'t)', 'Am I…? · Is she…? · Are they…?'],
    examples: [['I am from Uzbekistan.', 'Я из Узбекистана.'], ['She is a doctor.', 'Она врач.'], ['Are you tired?', 'Ты устал?'], ['They aren\'t at home.', 'Их нет дома.']],
    tip: 'Сокращения: I\'m, you\'re, he\'s, it\'s, we\'re, they\'re — в разговоре почти всегда используются они.',
    exercises: [
      c('My name ___ Asadbek.', 'is', 'am', 'are'),
      c('We ___ friends.', 'are', 'is', 'am'),
      c('___ she your sister?', 'Is', 'Are', 'Am'),
      w('I ___ (не) hungry. (одно слово-сокращение: am not = ?)', "'m not/am not"),
      w('They ___ students. (to be)', 'are'),
    ],
  },
  {
    id: 'articles', stage: 0, title: 'Articles: a / an / the', ru: 'Артикли',
    theory: [
      'В русском артиклей нет, поэтому это одна из главных трудностей. Перед существительным в единственном числе почти всегда нужен артикль.',
      '**a / an** — «один, какой-то», когда предмет упоминается впервые или неважно какой. **an** — перед гласным **звуком**: an apple, an hour.',
      '**the** — «тот самый», когда понятно, о каком предмете речь: уже упоминали, он единственный (the sun) или уточнён.',
      'Без артикля: имена, страны (Uzbekistan), неисчисляемые и множественные в общем смысле (I like music, Dogs are clever).',
    ],
    formula: ['a + согласный звук: a book, a university', 'an + гласный звук: an egg, an hour', 'the + конкретный/известный предмет'],
    examples: [['I have a cat. The cat is black.', 'У меня есть кошка. Эта кошка чёрная.'], ['She is an engineer.', 'Она инженер.'], ['The moon is beautiful tonight.', 'Луна сегодня красивая.']],
    exercises: [
      c('I eat ___ apple every day.', 'an', 'a', 'the'),
      c('He is ___ teacher.', 'a', 'an', '—'),
      c('Close ___ door, please.', 'the', 'a', 'an'),
      c('It takes ___ hour to get there.', 'an', 'a', 'the'),
      c('I love ___ music.', '— (без артикля)', 'a', 'an'),
    ],
  },
  {
    id: 'plural', stage: 0, title: 'Plural nouns', ru: 'Множественное число существительных',
    theory: [
      'Обычно добавляем **-s**: book → books. После s, sh, ch, x, o — **-es**: bus → buses, box → boxes.',
      'Согласная + y → **-ies**: city → cities. Но гласная + y → просто -s: day → days.',
      'Есть исключения, их нужно запомнить: man → **men**, woman → **women**, child → **children**, person → **people**, foot → **feet**, tooth → **teeth**.',
    ],
    examples: [['two books', 'две книги'], ['three children', 'трое детей'], ['many cities', 'много городов']],
    exercises: [
      w('one box → two ___', 'boxes'),
      w('one city → many ___', 'cities'),
      w('one child → three ___', 'children'),
      w('one man → two ___', 'men'),
      c('Plural of «day»:', 'days', 'daies', 'dayes'),
    ],
  },
  {
    id: 'pronouns', stage: 0, title: 'Pronouns: I / me / my', ru: 'Местоимения: личные, объектные, притяжательные',
    theory: [
      '**Личные** (кто делает): I, you, he, she, it, we, they.',
      '**Объектные** (кого/кому — после глагола или предлога): me, you, him, her, it, us, them.',
      '**Притяжательные** (чей): my, your, his, her, its, our, their — всегда перед существительным.',
    ],
    formula: ['I → me → my', 'he → him → his · she → her → her', 'we → us → our · they → them → their'],
    examples: [['She loves him.', 'Она любит его.'], ['This is our house.', 'Это наш дом.'], ['Call me tomorrow.', 'Позвони мне завтра.']],
    exercises: [
      c('Give ___ the book, please.', 'me', 'I', 'my'),
      c('This is ___ car. (наша)', 'our', 'us', 'we'),
      c('I know ___. (её)', 'her', 'she', 'hers'),
      c('___ live in Tashkent. (они)', 'They', 'Them', 'Their'),
      c('The dog wags ___ tail.', 'its', "it's", 'it'),
    ],
  },
  {
    id: 'this-that', stage: 0, title: 'This / that / these / those', ru: 'Указательные местоимения',
    theory: [
      '**this** — это (близко, ед. ч.), **these** — эти (близко, мн. ч.).',
      '**that** — то/тот (далеко, ед. ч.), **those** — те (далеко, мн. ч.).',
    ],
    examples: [['This is my phone.', 'Это мой телефон.'], ['Those people are tourists.', 'Те люди — туристы.'], ['Are these your keys?', 'Это твои ключи?']],
    exercises: [
      c('___ apples here are fresh.', 'These', 'This', 'That'),
      c('Look at ___ mountain over there!', 'that', 'these', 'this'),
      c('___ is my friend Ali. (рядом)', 'This', 'These', 'Those'),
      c('Who are ___ men over there?', 'those', 'that', 'this'),
    ],
  },

  // ───────────── A1 ─────────────
  {
    id: 'present-simple', stage: 1, title: 'Present Simple', ru: 'Настоящее простое время',
    theory: [
      'Используем для **регулярных действий, привычек и фактов**: I work every day. Water boils at 100°C.',
      'С **he / she / it** к глаголу добавляем **-s / -es**: she works, he goes, it watches.',
      'Вопросы и отрицания — с помощником **do / does**. После does глагол **без -s**: Does she work? She doesn\'t work.',
      'Маркеры: always, usually, often, sometimes, never, every day.',
    ],
    formula: ['I/you/we/they + V · he/she/it + V-s', "don't / doesn't + V", 'Do / Does + подлежащее + V?'],
    examples: [['I drink tea every morning.', 'Я пью чай каждое утро.'], ['She doesn\'t eat meat.', 'Она не ест мясо.'], ['Do you speak English?', 'Ты говоришь по-английски?']],
    tip: 'Самая частая ошибка: «She go». Помните: he/she/it → goes!',
    exercises: [
      w('He ___ (work) in a bank.', 'works'),
      w('She ___ (watch) TV every evening.', 'watches'),
      c('___ your father speak English?', 'Does', 'Do', 'Is'),
      c("They ___ like coffee.", "don't", "doesn't", 'not'),
      c('Does she ___ in Samarkand?', 'live', 'lives', 'living'),
    ],
  },
  {
    id: 'present-continuous', stage: 1, title: 'Present Continuous', ru: 'Настоящее длительное время',
    theory: [
      'Действие **происходит прямо сейчас** или в текущий период: I am reading now. She is studying for IELTS this month.',
      'Образуется: **am / is / are + глагол-ing**.',
      'Глаголы состояния (know, like, want, understand, believe) обычно **не** используются в Continuous: I know (не «I am knowing»).',
      'Маркеры: now, right now, at the moment, look!, listen!',
    ],
    formula: ['am / is / are + V-ing', 'am not / isn\'t / aren\'t + V-ing', 'Am / Is / Are + подлежащее + V-ing?'],
    examples: [['Look! It is raining.', 'Смотри! Идёт дождь.'], ['What are you doing?', 'Что ты делаешь?'], ['I am not working today.', 'Я сегодня не работаю.']],
    exercises: [
      w('Be quiet! The baby ___ (sleep).', 'is sleeping/\'s sleeping'),
      c('I ___ my homework now.', 'am doing', 'do', 'does'),
      c('Present Simple или Continuous: «I ___ the answer.»', 'know', 'am knowing', 'knowing'),
      c('___ they playing football?', 'Are', 'Do', 'Is'),
      w('She ___ (not / cook) now.', "isn't cooking/is not cooking"),
    ],
  },
  {
    id: 'there-is', stage: 1, title: 'There is / There are', ru: 'Оборот «есть, находится»',
    theory: [
      'Говорим, что что-то **есть / находится** где-то: There is a park near my house.',
      '**There is** + ед. ч. или неисчисляемое; **There are** + мн. ч.',
      'Перевод на русский часто начинают с конца: «Рядом с моим домом есть парк».',
    ],
    examples: [['There is a book on the table.', 'На столе (лежит) книга.'], ['There are many students here.', 'Здесь много студентов.'], ['Is there a bank nearby?', 'Здесь рядом есть банк?']],
    exercises: [
      c('There ___ three windows in the room.', 'are', 'is', 'be'),
      c('There ___ some milk in the fridge.', 'is', 'are', 'am'),
      c('___ there any shops here?', 'Are', 'Is', 'Do'),
      c("There ___ a problem.", "isn't", "aren't", "don't"),
    ],
  },
  {
    id: 'have-got', stage: 1, title: 'Have / has (got)', ru: 'Глагол «иметь»',
    theory: [
      'По-русски «У меня есть…», по-английски «**I have**…». С he/she/it — **has**.',
      'В британском английском часто: I have got / she has got.',
      'Вопрос и отрицание с have: Do you have…? I don\'t have…',
    ],
    examples: [['I have two brothers.', 'У меня два брата.'], ['She has a new phone.', 'У неё новый телефон.'], ['Do you have a car?', 'У тебя есть машина?']],
    exercises: [
      c('My sister ___ long hair.', 'has', 'have', 'is'),
      c('___ you have any questions?', 'Do', 'Does', 'Have'),
      c("He ___ have a car.", "doesn't", "don't", "hasn't"),
      c('We ___ got a big family.', 'have', 'has', 'are'),
    ],
  },
  {
    id: 'can', stage: 1, title: 'Can / can\'t', ru: 'Модальный глагол can (уметь, мочь)',
    theory: [
      '**can** = могу / умею. После can глагол **без to и без -s**: She can swim (не «can swims»).',
      'Отрицание: **can\'t / cannot**. Вопрос: **Can** you help me?',
      'Can также используется для просьб и разрешения: Can I open the window?',
    ],
    examples: [['I can speak three languages.', 'Я говорю на трёх языках.'], ['She can\'t drive.', 'Она не умеет водить.'], ['Can you help me?', 'Ты можешь мне помочь?']],
    exercises: [
      c('He can ___ very well.', 'sing', 'sings', 'to sing'),
      c('___ I use your phone?', 'Can', 'Do', 'Am'),
      w('I ___ (не могу) come today. (сокращение)', "can't/cannot"),
      c('Can she ___ English?', 'speak', 'speaks', 'speaking'),
    ],
  },
  {
    id: 'prepositions', stage: 1, title: 'Prepositions: in / on / at', ru: 'Предлоги места и времени',
    theory: [
      'Время: **at** — точное время (at 5 o\'clock, at night); **on** — дни и даты (on Monday, on 5 May); **in** — месяцы, годы, части дня, сезоны (in June, in 2025, in the morning).',
      'Место: **in** — внутри (in the room, in Tashkent); **on** — на поверхности (on the table); **at** — в точке/учреждении (at school, at the bus stop, at home).',
    ],
    examples: [['See you on Friday at 7.', 'Увидимся в пятницу в 7.'], ['I was born in 2001.', 'Я родился в 2001 году.'], ['She is at work.', 'Она на работе.']],
    exercises: [
      c('The lesson starts ___ 9 o\'clock.', 'at', 'in', 'on'),
      c('My birthday is ___ March.', 'in', 'on', 'at'),
      c('We have English ___ Tuesday.', 'on', 'in', 'at'),
      c('The keys are ___ the table.', 'on', 'at', 'in'),
      c('I usually stay ___ home on Sunday.', 'at', 'in', 'on'),
    ],
  },
  {
    id: 'past-simple', stage: 1, title: 'Past Simple', ru: 'Прошедшее простое время',
    theory: [
      'Завершённое действие в прошлом с указанием времени: yesterday, last week, in 2020, ago.',
      'Правильные глаголы: **+ed** (work → worked). Неправильные — **2-я форма** из таблицы: go → went, see → saw, buy → bought.',
      'Вопрос и отрицание с **did**, а глагол возвращается в **начальную форму**: Did you go? I didn\'t go (не «didn\'t went»).',
      'To be в прошлом: **was** (I, he, she, it) / **were** (we, you, they).',
    ],
    formula: ['V-ed / V2', "didn't + V", 'Did + подлежащее + V?', 'was / were'],
    examples: [['I visited Bukhara last year.', 'Я посетил Бухару в прошлом году.'], ['She didn\'t call me.', 'Она мне не позвонила.'], ['Where were you yesterday?', 'Где ты был вчера?']],
    tip: 'Выучите 50 самых частых неправильных глаголов — они встречаются постоянно.',
    exercises: [
      w('We ___ (go) to the cinema yesterday.', 'went'),
      w('She ___ (buy) a new dress last week.', 'bought'),
      c("I didn't ___ him at the party.", 'see', 'saw', 'seen'),
      c('___ you at home last night?', 'Were', 'Was', 'Did'),
      c('___ they enjoy the film?', 'Did', 'Were', 'Do'),
    ],
  },

  // ───────────── A2 ─────────────
  {
    id: 'past-continuous', stage: 2, title: 'Past Continuous', ru: 'Прошедшее длительное время',
    theory: [
      'Действие, которое **длилось в определённый момент** в прошлом: At 8 pm I was having dinner.',
      'Часто вместе с Past Simple: длинное действие (Continuous) прерывается коротким (Simple): I **was reading** when he **called**.',
      'Образуется: **was / were + V-ing**.',
    ],
    examples: [['It was raining all day.', 'Весь день шёл дождь.'], ['What were you doing at 10?', 'Что ты делал в 10?'], ['She was cooking when I arrived.', 'Она готовила, когда я пришёл.']],
    exercises: [
      c('I ___ TV when the lights went out.', 'was watching', 'watched', 'am watching'),
      c('They ___ football at 5 pm yesterday.', 'were playing', 'was playing', 'played'),
      c('While she was sleeping, someone ___.', 'knocked', 'was knock', 'knocks'),
      w('What ___ you doing at midnight? (to be)', 'were'),
    ],
  },
  {
    id: 'future', stage: 2, title: 'Future: will / going to', ru: 'Будущее время: will и going to',
    theory: [
      '**will** — спонтанное решение, обещание, прогноз-мнение: I\'ll help you! I think it will rain.',
      '**be going to** — заранее запланированное намерение или прогноз по очевидным признакам: I\'m going to study medicine. Look at the clouds — it\'s going to rain.',
      'Present Continuous для договорённостей: I\'m meeting Ali tomorrow.',
    ],
    formula: ['will + V', 'am / is / are going to + V'],
    examples: [['I\'ll call you later.', 'Я позвоню тебе позже.'], ['We are going to buy a flat.', 'Мы собираемся купить квартиру.'], ['Will you come?', 'Ты придёшь?']],
    exercises: [
      c('— The phone is ringing. — I ___ answer it!', "'ll", 'am going to', 'answer'),
      c('I have bought tickets. We ___ visit Paris.', 'are going to', 'will', 'visit'),
      c('Careful! You ___ fall!', 'are going to', 'will be', 'fall'),
      c('I promise I ___ tell anyone.', "won't", "don't", "am not"),
    ],
  },
  {
    id: 'comparatives', stage: 2, title: 'Comparatives & superlatives', ru: 'Степени сравнения прилагательных',
    theory: [
      'Короткие прилагательные: **-er / the -est**: tall → taller → the tallest. Big → bigger (удвоение), happy → happier.',
      'Длинные (2+ слога): **more / the most**: interesting → more interesting → the most interesting.',
      'Исключения: good → better → the best; bad → worse → the worst; far → further → the furthest.',
      'Сравнение с **than**: She is older than me. Равенство: **as … as**: He is as tall as his father.',
    ],
    examples: [['Tashkent is bigger than Khiva.', 'Ташкент больше Хивы.'], ['This is the best day of my life.', 'Это лучший день в моей жизни.'], ['English is easier than Chinese.', 'Английский легче китайского.']],
    exercises: [
      w('This book is ___ (interesting) than that one.', 'more interesting'),
      w('He is the ___ (good) student in the class.', 'best'),
      w('Today is ___ (hot) than yesterday.', 'hotter'),
      c('My car is as fast ___ yours.', 'as', 'than', 'like'),
      c('This is ___ film I have ever seen.', 'the worst', 'the baddest', 'worse'),
    ],
  },
  {
    id: 'quantifiers', stage: 2, title: 'some / any / much / many', ru: 'Исчисляемые и неисчисляемые, количество',
    theory: [
      '**Исчисляемые** можно посчитать: an apple, two apples. **Неисчисляемые** — нет: water, money, advice, information (у них нет мн. ч. и a/an).',
      '**many** — с исчисляемыми, **much** — с неисчисляемыми (чаще в вопросах и отрицаниях). **a lot of** — с любыми.',
      '**some** — в утверждениях и вежливых предложениях; **any** — в вопросах и отрицаниях.',
      '**a few** (исч.) / **a little** (неисч.) — немного.',
    ],
    examples: [['How much water do you drink?', 'Сколько воды ты пьёшь?'], ['There aren\'t any eggs.', 'Яиц нет.'], ['Can I have some tea?', 'Можно мне чаю?']],
    exercises: [
      c('How ___ people came?', 'many', 'much', 'little'),
      c("I don't have ___ money.", 'much', 'many', 'few'),
      c('Is there ___ sugar?', 'any', 'some a', 'many'),
      c('She gave me some good ___.', 'advice', 'advices', 'an advice'),
      c("I have ___ friends in London.", 'a few', 'a little', 'much'),
    ],
  },
  {
    id: 'present-perfect', stage: 2, title: 'Present Perfect', ru: 'Настоящее совершённое время',
    theory: [
      'Связывает прошлое и настоящее. Важен **результат или опыт**, а не время: I have lost my keys (= сейчас у меня нет ключей).',
      'Опыт в жизни: Have you ever been to Japan? Незаконченный период: I have lived here **for** 5 years / **since** 2020.',
      'Образуется: **have / has + V3** (3-я форма): do → done, see → seen, write → written.',
      'Маркеры: ever, never, already, yet, just, for, since, recently.',
      'Нельзя с точным временем в прошлом: ❌ I have seen him yesterday → ✅ I saw him yesterday.',
    ],
    formula: ['have / has + V3', "haven't / hasn't + V3", 'Have / Has + подлежащее + V3?'],
    examples: [['I have just finished.', 'Я только что закончил.'], ['She has never been abroad.', 'Она никогда не была за границей.'], ['Have you done your homework yet?', 'Ты уже сделал домашку?']],
    exercises: [
      w('I ___ (see) this film three times. (have + V3)', 'have seen/\'ve seen'),
      c('She ___ already left.', 'has', 'have', 'is'),
      c('Have you ever ___ sushi?', 'eaten', 'ate', 'eat'),
      c("I've known him ___ ten years.", 'for', 'since', 'ago'),
      c('We ___ in this city since 2018.', 'have lived', 'live', 'lived'),
    ],
  },
  {
    id: 'modals-obligation', stage: 2, title: 'must / have to / should', ru: 'Модальные глаголы долженствования',
    theory: [
      '**must** — личная необходимость или строгое правило: I must study harder. You must wear a seatbelt.',
      '**have to** — обязанность из-за внешних обстоятельств: I have to get up at 6 (у меня работа).',
      '**mustn\'t** — запрещено! **don\'t have to** — не обязательно (можно, но не нужно).',
      '**should** — совет: You should see a doctor.',
    ],
    examples: [['You mustn\'t smoke here.', 'Здесь нельзя курить.'], ['You don\'t have to come.', 'Тебе не обязательно приходить.'], ['You should rest more.', 'Тебе стоит больше отдыхать.']],
    exercises: [
      c("Tomorrow is Sunday — I ___ get up early.", "don't have to", "mustn't", "shouldn't to"),
      c('You ___ touch that — it\'s dangerous!', "mustn't", "don't have to", 'should'),
      c('You look tired. You ___ go to bed.', 'should', 'must to', 'have'),
      c('She ___ wear a uniform at work.', 'has to', 'have to', 'must to'),
    ],
  },

  // ───────────── B1 ─────────────
  {
    id: 'pp-vs-ps', stage: 3, title: 'Present Perfect vs Past Simple', ru: 'Present Perfect или Past Simple?',
    theory: [
      '**Past Simple** — когда есть (или подразумевается) **конкретное время в прошлом**, период закончился: I went to London in 2019.',
      '**Present Perfect** — время не важно или период ещё **не закончился** (today, this week, in my life): I\'ve been to London twice.',
      'Вопрос «когда?» (When…?) → всегда Past Simple: When did you arrive?',
    ],
    examples: [['I have finished the report. I finished it an hour ago.', 'Я закончил отчёт. Я закончил его час назад.'], ['Have you seen Ali today?', 'Ты видел Али сегодня?'], ['Shakespeare wrote many plays.', 'Шекспир написал много пьес.']],
    exercises: [
      c('I ___ my wallet. Can you help me find it?', 'have lost', 'lost', 'was losing'),
      c('She ___ to Dubai last summer.', 'went', 'has gone', 'has been'),
      c('When ___ you start learning English?', 'did', 'have', 'has'),
      c("I ___ him since we left school.", "haven't seen", "didn't see", "don't see"),
      c('Mozart ___ over 600 works.', 'wrote', 'has written', 'have written'),
    ],
  },
  {
    id: 'ppc', stage: 3, title: 'Present Perfect Continuous', ru: 'Настоящее совершённое длительное',
    theory: [
      'Действие началось в прошлом, **длится до сих пор** (или только что закончилось), и важна **длительность**: I have been learning English for two years.',
      'Объясняет видимый результат процесса: You\'re out of breath — have you been running?',
      'Образуется: **have / has been + V-ing**.',
    ],
    examples: [['It has been raining since morning.', 'Дождь идёт с утра.'], ['How long have you been waiting?', 'Как долго ты ждёшь?']],
    exercises: [
      c('I ___ for you for an hour!', 'have been waiting', 'am waiting', 'wait'),
      c('How long ___ she been working here?', 'has', 'have', 'is'),
      c('Your eyes are red. ___ you been crying?', 'Have', 'Are', 'Did'),
      w('They have been ___ (play) for three hours.', 'playing'),
    ],
  },
  {
    id: 'conditionals-1-2', stage: 3, title: 'Conditionals: 0, 1, 2', ru: 'Условные предложения 0, 1 и 2 типа',
    theory: [
      '**Zero** — общие истины: If you heat ice, it melts. (If + Present, Present)',
      '**First** — реальное будущее: If it rains, I **will stay** at home. После if — **Present**, не will!',
      '**Second** — нереальное/маловероятное настоящее или будущее: If I **had** a million, I **would buy** a house. С to be часто **were** для всех лиц: If I were you…',
    ],
    formula: ['0: If + Present, Present', '1: If + Present, will + V', '2: If + Past, would + V'],
    examples: [['If you study, you will pass.', 'Если будешь заниматься, сдашь.'], ['If I were you, I would apologise.', 'На твоём месте я бы извинился.'], ['What would you do if you won the lottery?', 'Что бы ты сделал, если бы выиграл в лотерею?']],
    exercises: [
      c('If it ___ tomorrow, we will cancel the picnic.', 'rains', 'will rain', 'rained'),
      c('If I ___ rich, I would travel the world.', 'were', 'am', 'will be'),
      c('If you heat water to 100°C, it ___.', 'boils', 'would boil', 'boiled'),
      c("I ___ help you if I had time.", 'would', 'will', 'am'),
      c('If she calls, I ___ you.', "'ll tell", 'would tell', 'tell'),
    ],
  },
  {
    id: 'passive-1', stage: 3, title: 'Passive Voice (basic)', ru: 'Страдательный залог',
    theory: [
      'Используем, когда важно **действие или объект**, а не тот, кто делает: The bridge was built in 1890.',
      'Образуется: **to be (в нужном времени) + V3**. Исполнитель — через **by**: The book was written by Navoi.',
      'Present: is made · Past: was made · Present Perfect: has been made · Future: will be made.',
      'В IELTS Writing (особенно Task 1 — процессы) пассив обязателен!',
    ],
    formula: ['am/is/are + V3', 'was/were + V3', 'has/have been + V3', 'will be + V3'],
    examples: [['English is spoken all over the world.', 'На английском говорят по всему миру.'], ['The thief was caught yesterday.', 'Вора поймали вчера.'], ['The results will be announced soon.', 'Результаты скоро объявят.']],
    exercises: [
      c('This house ___ in 1950.', 'was built', 'built', 'is building'),
      c('Cotton ___ in Uzbekistan.', 'is grown', 'grows by', 'is growing by'),
      w('The letters ___ (send) yesterday. (were + V3)', 'were sent'),
      c('The work ___ finished yet.', "hasn't been", "isn't been", "wasn't be"),
      c('Hamlet was written ___ Shakespeare.', 'by', 'from', 'with'),
    ],
  },
  {
    id: 'gerund-infinitive', stage: 3, title: 'Gerund vs Infinitive', ru: 'Герундий (-ing) или инфинитив (to)',
    theory: [
      'После некоторых глаголов — **-ing**: enjoy, avoid, finish, mind, suggest, keep, practise, consider: I enjoy reading.',
      'После других — **to + V**: want, decide, hope, plan, agree, refuse, manage, afford: I decided to leave.',
      'После **предлогов** — всегда -ing: I\'m interested **in learning**. Thank you **for helping**.',
      'Меняют смысл: stop doing (бросить) / stop to do (остановиться, чтобы); remember doing (помнить, что сделал) / remember to do (не забыть сделать).',
    ],
    examples: [['She avoided answering.', 'Она избегала ответа.'], ['I hope to see you soon.', 'Надеюсь скоро тебя увидеть.'], ['He stopped smoking.', 'Он бросил курить.']],
    exercises: [
      c('I enjoy ___ to music.', 'listening', 'to listen', 'listen'),
      c('They decided ___ a new car.', 'to buy', 'buying', 'buy'),
      c("I'm good at ___ problems.", 'solving', 'to solve', 'solve'),
      c("Don't forget ___ the door.", 'to lock', 'locking', 'lock'),
      c('Would you mind ___ the window?', 'opening', 'to open', 'open'),
    ],
  },
  {
    id: 'relative', stage: 3, title: 'Relative clauses', ru: 'Определительные придаточные (who, which, that)',
    theory: [
      '**who** — для людей, **which** — для предметов и животных, **that** — для обоих (в определяющих придаточных).',
      '**whose** — чей: The man whose car was stolen… **where** — где: the city where I was born.',
      'Если who/which/that — дополнение (не подлежащее), его можно опустить: The book (that) I bought is great.',
      'Неопределяющие (с запятыми) дают доп. информацию; в них **нельзя** that: My brother, who lives in Seoul, is a doctor.',
    ],
    examples: [['The girl who sits next to me is from Fergana.', 'Девушка, которая сидит рядом со мной, из Ферганы.'], ['This is the phone which I bought.', 'Это телефон, который я купил.'], ['That\'s the café where we met.', 'Это кафе, где мы познакомились.']],
    exercises: [
      c('The woman ___ called you is my aunt.', 'who', 'which', 'whose'),
      c('The film ___ we watched was boring.', 'that', 'who', 'where'),
      c('That\'s the boy ___ father is a pilot.', 'whose', 'who', 'which'),
      c('This is the hotel ___ we stayed.', 'where', 'which', 'who'),
      c('Tashkent, ___ is the capital, is huge.', 'which', 'that', 'what'),
    ],
  },

  // ───────────── B2 ─────────────
  {
    id: 'past-perfect', stage: 4, title: 'Past Perfect', ru: 'Прошедшее совершённое (предпрошедшее)',
    theory: [
      'Действие, которое произошло **раньше другого действия в прошлом**: When I arrived, the train **had left** (поезд ушёл до моего прихода).',
      'Образуется: **had + V3** (для всех лиц).',
      'Маркеры: by the time, before, after, already, when.',
      'Past Perfect Continuous (**had been + V-ing**) — длительность до момента в прошлом: She had been working for hours when he came.',
    ],
    examples: [['I had never seen snow before I moved to Moscow.', 'Я никогда не видел снега до переезда в Москву.'], ['By 2010 they had already married.', 'К 2010 году они уже поженились.']],
    exercises: [
      c('When we got to the cinema, the film ___.', 'had started', 'has started', 'starts'),
      c('She was tired because she ___ all day.', 'had been working', 'has worked', 'works'),
      c('I ___ the book before I saw the film.', 'had read', 'have read', 'was reading'),
      w('By the time he called, I ___ (already / go) to bed.', 'had already gone'),
    ],
  },
  {
    id: 'future-advanced', stage: 4, title: 'Future Continuous & Future Perfect', ru: 'Будущее длительное и совершённое',
    theory: [
      '**Future Continuous** (will be + V-ing): процесс в определённый момент в будущем: This time tomorrow I will be flying to London.',
      '**Future Perfect** (will have + V3): действие завершится **к** моменту в будущем: By 2030 I will have got my degree.',
    ],
    examples: [['At 8 pm I\'ll be having dinner.', 'В 8 вечера я буду ужинать.'], ['By June she will have finished the course.', 'К июню она закончит курс.']],
    exercises: [
      c('Don\'t call at 9 — I ___ my exam.', "'ll be taking", "'ll have taken", 'take'),
      c('By next year, I ___ here for a decade.', 'will have worked', 'will be work', 'work'),
      c('By the time you arrive, we ___ dinner.', 'will have finished', 'will finishing', 'finish'),
      c('This time next week we ___ on the beach.', 'will be lying', 'will have lain', 'lie'),
    ],
  },
  {
    id: 'conditionals-3', stage: 4, title: 'Third & mixed conditionals', ru: 'Условные 3 типа и смешанные',
    theory: [
      '**Third** — нереальное прошлое, сожаление: If I **had studied**, I **would have passed** (но я не учил и не сдал).',
      '**Mixed** — прошлое условие → настоящий результат: If I had taken the job, I **would be** rich now.',
      'Или настоящее условие → прошлый результат: If I were braver, I would have said something.',
    ],
    formula: ['3: If + had V3, would have V3', 'Mixed: If + had V3, would + V'],
    examples: [['If you had told me, I would have helped.', 'Если бы ты сказал мне, я бы помог.'], ['If I hadn\'t missed the bus, I wouldn\'t be late now.', 'Если бы я не опоздал на автобус, я бы сейчас не опаздывал.']],
    exercises: [
      c('If she ___ harder, she would have passed.', 'had worked', 'worked', 'would work'),
      c("If I had known, I ___ come.", "would have", "will have", "had"),
      c('If he had saved money, he ___ a car now.', 'would have', 'would have had', 'has'),
      w("If we ___ (not / miss) the train, we would have arrived on time.", "hadn't missed/had not missed"),
    ],
  },
  {
    id: 'reported-speech', stage: 4, title: 'Reported speech', ru: 'Косвенная речь',
    theory: [
      'При пересказе после **said / told** время «сдвигается назад»: Present → Past, Past → Past Perfect, will → would, can → could.',
      '«I am tired» → He said (that) he **was** tired.',
      'Вопросы — **прямой порядок слов**, без do/did: «Where do you live?» → She asked me where I **lived**. Общий вопрос — через **if/whether**.',
      'Меняются указатели: now → then, today → that day, tomorrow → the next day, here → there.',
      '**say** something / **tell** somebody something.',
    ],
    examples: [['She said she would come.', 'Она сказала, что придёт.'], ['He asked if I was ready.', 'Он спросил, готов ли я.'], ['They told me they had seen the film.', 'Они сказали мне, что видели этот фильм.']],
    exercises: [
      c('"I like pizza." → He said he ___ pizza.', 'liked', 'likes', 'is liking'),
      c('She asked me where ___.', 'I worked', 'did I work', 'do I work'),
      c('He ___ me that he was busy.', 'told', 'said', 'spoke'),
      c('"I will help." → She said she ___ help.', 'would', 'will', 'can'),
      c('He asked ___ I could swim.', 'if', 'that', 'what'),
    ],
  },
  {
    id: 'modals-deduction', stage: 4, title: 'Modals of deduction', ru: 'Модальные глаголы предположения',
    theory: [
      '**must** — уверен, что да (≈ 90%): He must be at home — the lights are on.',
      '**might / may / could** — возможно (≈ 50%): She might be ill.',
      '**can\'t** — уверен, что нет: That can\'t be true!',
      'О прошлом: **must / might / can\'t + have + V3**: He must have forgotten. She can\'t have seen us.',
    ],
    examples: [['You must be tired after the flight.', 'Ты, должно быть, устал после перелёта.'], ['They might have missed the bus.', 'Возможно, они опоздали на автобус.']],
    exercises: [
      c("She's not answering. She ___ be asleep.", 'must', "can't", 'should to'),
      c("That ___ be Ali — he's in London now.", "can't", 'must', 'might to'),
      c('The ground is wet. It ___ rained.', 'must have', 'must', 'can have'),
      c("I'm not sure. He ___ come later.", 'might', 'must', "can't"),
    ],
  },
  {
    id: 'passive-2', stage: 4, title: 'Passive: advanced', ru: 'Пассив: сложные формы',
    theory: [
      'Модальные: **can / must / should be + V3**: The rules must be followed.',
      'Continuous: **is being / was being + V3**: The road is being repaired.',
      'Безличные конструкции для академического стиля: **It is believed that…**, **He is said to be…**, **It has been argued that…**',
      '**have something done** — кто-то делает для вас: I had my hair cut.',
    ],
    examples: [['It is widely believed that exercise improves memory.', 'Широко распространено мнение, что упражнения улучшают память.'], ['The house is being painted.', 'Дом красят (сейчас).'], ['I had my car repaired.', 'Мне починили машину.']],
    exercises: [
      c('The project must ___ by Friday.', 'be finished', 'finished', 'be finish'),
      c('The bridge ___ repaired at the moment.', 'is being', 'is been', 'being'),
      c('She is said ___ very rich.', 'to be', 'being', 'be'),
      c('I need to have my eyes ___.', 'tested', 'test', 'testing'),
    ],
  },

  // ───────────── C1 ─────────────
  {
    id: 'inversion', stage: 5, title: 'Inversion', ru: 'Инверсия (обратный порядок слов)',
    theory: [
      'После отрицательных/ограничительных наречий в начале предложения — **порядок как в вопросе**: Never **have I** seen such beauty.',
      'Слова-триггеры: Never, Rarely, Seldom, Hardly … when, No sooner … than, Not only … but also, Under no circumstances, Little, Only then.',
      'Инверсия в условиях без if: **Had I known** = If I had known; **Were I** you = If I were you; **Should you** need help = If you need help.',
      'Даёт эмфазу и высокий стиль — отличный способ показать Grammatical Range в IELTS.',
    ],
    examples: [['Not only did he lie, but he also stole.', 'Он не только солгал, но и украл.'], ['No sooner had I arrived than it began to rain.', 'Едва я приехал, как пошёл дождь.'], ['Had I known, I would have come.', 'Знай я, я бы пришёл.']],
    exercises: [
      c('Never ___ such a beautiful place.', 'have I seen', 'I have seen', 'I saw'),
      c('Not only ___ smart, but she is also kind.', 'is she', 'she is', 'she'),
      c('___ I known, I would have helped.', 'Had', 'If', 'Have'),
      c('Under no circumstances ___ open this door.', 'should you', 'you should', 'you'),
      c('No sooner had we sat down ___ the phone rang.', 'than', 'when', 'then'),
    ],
  },
  {
    id: 'cleft', stage: 5, title: 'Cleft sentences', ru: 'Расщеплённые предложения (выделение)',
    theory: [
      'Позволяют выделить часть предложения: **It was** John **who** broke the window (а не кто-то другой).',
      '**What** I need **is** a holiday. — «Что мне нужно, так это отпуск».',
      '**The reason why…is that…**, **All I want is…**',
    ],
    examples: [['It was in 2015 that I first visited London.', 'Именно в 2015 году я впервые побывал в Лондоне.'], ['What surprised me was his reaction.', 'Что меня удивило, так это его реакция.']],
    exercises: [
      c('It was my sister ___ told me the news.', 'who', 'what', 'which'),
      c('___ I really need is some sleep.', 'What', 'That', 'Which'),
      c('It ___ the price that worried us.', 'was', 'were', 'did'),
      c('All I want ___ a quiet life.', 'is', 'are', 'be'),
    ],
  },
  {
    id: 'wish', stage: 5, title: 'Wish / If only', ru: 'Сожаления и пожелания',
    theory: [
      'О настоящем (хотел бы, чтобы было иначе): **wish + Past**: I wish I **knew** the answer. I wish I **were** taller.',
      'О прошлом (сожаление): **wish + Past Perfect**: I wish I **had studied** harder.',
      'Раздражение / желание изменения от другого: **wish + would**: I wish you would stop talking.',
      '**If only** — то же, но эмоциональнее. **It\'s time** + Past: It\'s time we left.',
    ],
    examples: [['I wish I lived near the sea.', 'Жаль, что я не живу у моря.'], ['If only I hadn\'t said that!', 'Если бы я только этого не говорил!']],
    exercises: [
      c('I wish I ___ more free time. (сейчас)', 'had', 'have', 'would have'),
      c("I wish I ___ to the party yesterday.", 'had gone', 'went', 'would go'),
      c('I wish you ___ stop interrupting me!', 'would', 'will', 'had'),
      c("It's time we ___ home.", 'went', 'go', 'will go'),
    ],
  },
  {
    id: 'participle-clauses', stage: 5, title: 'Participle clauses', ru: 'Причастные обороты',
    theory: [
      'Сокращают придаточные и делают текст плотнее: **Feeling tired**, I went to bed (= Because I felt tired…).',
      '**Having + V3** — действие произошло раньше: **Having finished** the report, she went home.',
      'Пассивное значение — **V3**: **Built** in 1900, the house needs repair.',
      'Подлежащее оборота и главного предложения должно совпадать! ❌ Walking home, the rain started.',
    ],
    examples: [['Not knowing what to do, he called his father.', 'Не зная, что делать, он позвонил отцу.'], ['Written in simple language, the book is easy to read.', 'Написанная простым языком, книга легко читается.']],
    exercises: [
      c('___ the email, he closed his laptop.', 'Having sent', 'Sent', 'Have sent'),
      c('___ in 1889, the tower is a symbol of Paris.', 'Built', 'Building', 'Having building'),
      c('___ nothing about it, I kept silent.', 'Knowing', 'Known', 'Know'),
      c('The man ___ to the manager is my uncle.', 'talking', 'talked', 'to talk'),
    ],
  },
  {
    id: 'linking', stage: 5, title: 'Linking & cohesion for IELTS', ru: 'Связки для эссе (Coherence & Cohesion)',
    theory: [
      'Добавление: **Moreover, Furthermore, In addition, Not only… but also**.',
      'Контраст: **However, Nevertheless, On the other hand, Whereas, Although, Despite + noun/-ing**.',
      'Причина/следствие: **Therefore, Consequently, As a result, Due to + noun, Owing to**.',
      'Пример: **For instance, For example, Such as, A case in point is…**',
      'Важно: Despite/In spite of + существительное или -ing (не + подлежащее с глаголом); Although + полное предложение.',
      'Не перегружайте текст связками — экзаменатор снижает балл за механическое использование.',
    ],
    examples: [['Despite the rain, we went out.', 'Несмотря на дождь, мы вышли.'], ['Although it was raining, we went out.', 'Хотя шёл дождь, мы вышли.'], ['Many people own cars; consequently, traffic has increased.', 'Многие владеют машинами; следовательно, движение выросло.']],
    exercises: [
      c('___ the high cost, many students choose to study abroad.', 'Despite', 'Although', 'However'),
      c('___ it was late, she continued working.', 'Although', 'Despite', 'In spite'),
      c('Cars are convenient. ___, they pollute the air.', 'However', 'Therefore', 'Moreover'),
      c('He did not study. ___, he failed.', 'Consequently', 'Nevertheless', 'Whereas'),
      c('Some prefer cities, ___ others prefer villages.', 'whereas', 'moreover', 'despite'),
    ],
  },

  // ───────────── C2 ─────────────
  {
    id: 'subjunctive', stage: 6, title: 'Subjunctive', ru: 'Сослагательное наклонение (формальное)',
    theory: [
      'После глаголов и выражений требования/рекомендации — **базовая форма глагола без -s** для всех лиц: It is essential that he **be** present. I suggest that she **study** more.',
      'Триггеры: suggest, recommend, insist, demand, propose, it is essential/vital/crucial that…',
      'Британский вариант: **should + V**: I suggest that she should study.',
      'Устойчивые формы: **Were it not for…**, **Be that as it may…**, **as it were**.',
    ],
    examples: [['The doctor recommended that he take a break.', 'Врач рекомендовал ему сделать перерыв.'], ['It is vital that every child have access to education.', 'Крайне важно, чтобы каждый ребёнок имел доступ к образованию.']],
    exercises: [
      c('They insisted that he ___ immediately.', 'leave', 'leaves', 'left'),
      c('It is crucial that she ___ informed.', 'be', 'is', 'was'),
      c('___ it not for your help, I would have failed.', 'Were', 'Was', 'Had'),
      c('I propose that the meeting ___ postponed.', 'be', 'is', 'will be'),
    ],
  },
  {
    id: 'nominalisation', stage: 6, title: 'Nominalisation', ru: 'Номинализация — академический стиль',
    theory: [
      'Академический английский предпочитает **существительные вместо глаголов**: «The government decided…» → «The government\'s **decision**…».',
      'Это делает текст объективным и плотным — ключ к Band 8 в Writing.',
      'Частые пары: analyse → analysis, increase → an increase, fail → failure, develop → development, reduce → reduction, grow → growth, introduce → introduction.',
    ],
    examples: [['Prices rose sharply. → There was a sharp rise in prices.', 'Цены резко выросли. → Произошёл резкий рост цен.'], ['Because people consume more… → Increased consumption…', 'Поскольку люди больше потребляют… → Рост потребления…']],
    exercises: [
      w('reduce → a ___ in costs', 'reduction'),
      w('fail → the ___ of the project', 'failure'),
      w('grow → economic ___', 'growth'),
      c('Most academic version:', 'The introduction of the law caused debate.', 'They introduced the law and people argued.', 'People argued because they introduced a law.'),
      w('analyse → a detailed ___', 'analysis'),
    ],
  },
  {
    id: 'hedging', stage: 6, title: 'Hedging', ru: 'Смягчение утверждений (хеджирование)',
    theory: [
      'В академическом тексте избегают категоричности. Вместо «This causes cancer» → «This **may contribute to** cancer».',
      'Средства: модальные (may, might, could), глаголы (suggest, appear, tend to, seem), наречия (arguably, possibly, largely, to some extent), конструкции (It could be argued that…, There is evidence to suggest that…).',
      'Используйте в IELTS Task 2 для позиции «взвешенного автора» — это повышает Lexical Resource и Task Response.',
    ],
    examples: [['It could be argued that technology isolates people.', 'Можно утверждать, что технологии изолируют людей.'], ['Young people tend to be more open to change.', 'Молодые люди, как правило, более открыты переменам.']],
    exercises: [
      c('Most hedged version:', 'The data suggest that the policy may be ineffective.', 'The policy is ineffective.', 'The policy is totally useless.'),
      c('Young people ___ to spend more time online.', 'tend', 'are tend', 'tending'),
      c('It ___ be argued that cities offer more opportunities.', 'could', 'must to', 'is'),
      c('This is, ___, the most important factor.', 'arguably', 'surely definitely', 'absolutely 100%'),
    ],
  },
];

export const topicsOfStage = (s: number) => TOPICS.filter((t) => t.stage === s);
export const TOPIC_BY_ID = new Map(TOPICS.map((t) => [t.id, t]));
