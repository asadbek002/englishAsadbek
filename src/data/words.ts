import type { StageId } from './levels';

export interface Word { id: string; en: string; uz: string; ru: string; stage: StageId }

// Format: english | o'zbekcha | русский  (sinonimlar vergul bilan)
const RAW: Record<StageId, string> = {
  0: `hello|salom|привет
goodbye|xayr|до свидания
yes|ha|да
no|yo'q|нет
please|iltimos|пожалуйста
thank you|rahmat|спасибо
mother|ona|мать, мама
father|ota|отец, папа
brother|aka, uka|брат
sister|opa, singil|сестра
friend|do'st|друг
house|uy|дом
water|suv|вода
bread|non|хлеб
apple|olma|яблоко
book|kitob|книга
pen|ruchka|ручка
table|stol|стол
chair|stul|стул
door|eshik|дверь
window|deraza|окно
cat|mushuk|кошка
dog|it|собака
car|mashina|машина
one|bir|один
two|ikki|два
three|uch|три
red|qizil|красный
white|oq|белый
black|qora|чёрный
big|katta|большой
small|kichik|маленький`,
  1: `work|ishlamoq|работать
study|o'qimoq, o'rganmoq|учиться
eat|yemoq|есть, кушать
drink|ichmoq|пить
sleep|uxlamoq|спать
read|o'qimoq|читать
write|yozmoq|писать
speak|gapirmoq|говорить
go|bormoq|идти, ехать
come|kelmoq|приходить
buy|sotib olmoq|покупать
morning|ertalab|утро
evening|kechqurun|вечер
today|bugun|сегодня
tomorrow|ertaga|завтра
yesterday|kecha|вчера
week|hafta|неделя
city|shahar|город
street|ko'cha|улица
shop|do'kon|магазин
school|maktab|школа
money|pul|деньги
food|ovqat|еда
weather|ob-havo|погода
happy|xursand, baxtli|счастливый
tired|charchagan|уставший
hungry|och|голодный
cheap|arzon|дешёвый
expensive|qimmat|дорогой
always|doim, har doim|всегда
never|hech qachon|никогда`,
  2: `journey|sayohat, safar|путешествие, поездка
ticket|chipta|билет
airport|aeroport|аэропорт
luggage|yuk, bagaj|багаж
borrow|qarzga olmoq|брать взаймы
lend|qarzga bermoq|одалживать
decide|qaror qilmoq|решать
forget|unutmoq|забывать
remember|eslamoq|помнить
explain|tushuntirmoq|объяснять
invite|taklif qilmoq|приглашать
improve|yaxshilamoq|улучшать
health|sog'liq|здоровье
disease|kasallik|болезнь
medicine|dori|лекарство
neighbour|qo'shni|сосед
customer|mijoz|клиент, покупатель
salary|maosh|зарплата
experience|tajriba|опыт
advice|maslahat|совет
dangerous|xavfli|опасный
famous|mashhur|знаменитый
quiet|tinch, jim|тихий
noisy|shovqinli|шумный
crowded|gavjum|многолюдный
probably|ehtimol|вероятно
enough|yetarli|достаточно
already|allaqachon|уже
recently|yaqinda|недавно
abroad|chet elda|за границей`,
  3: `achieve|erishmoq|достигать
avoid|qochmoq, chetlab o'tmoq|избегать
consider|ko'rib chiqmoq|рассматривать
require|talab qilmoq|требовать
suggest|taklif qilmoq|предлагать
reduce|kamaytirmoq|сокращать, уменьшать
increase|oshirmoq|увеличивать
compare|solishtirmoq|сравнивать
environment|atrof-muhit|окружающая среда
pollution|ifloslanish|загрязнение
opportunity|imkoniyat|возможность
ability|qobiliyat|способность
behaviour|xulq-atvor|поведение
knowledge|bilim|знание
research|tadqiqot|исследование
society|jamiyat|общество
government|hukumat|правительство
employee|xodim|сотрудник
benefit|foyda|польза, выгода
disadvantage|kamchilik|недостаток
reliable|ishonchli|надёжный
available|mavjud|доступный
responsible|mas'uliyatli|ответственный
significant|muhim, sezilarli|значительный
obvious|aniq, ravshan|очевидный
however|biroq|однако
therefore|shuning uchun|поэтому
although|garchi|хотя
despite|qaramay|несмотря на
whereas|holbuki|тогда как`,
  4: `acknowledge|tan olmoq|признавать
assess|baholamoq|оценивать
contribute|hissa qo'shmoq|вносить вклад
emphasise|ta'kidlamoq|подчёркивать
enhance|kuchaytirmoq, yaxshilamoq|улучшать, усиливать
ensure|ta'minlamoq|обеспечивать
maintain|saqlab qolmoq|поддерживать
tackle|hal qilmoq|решать (проблему)
undermine|zaiflashtirmoq|подрывать
justify|oqlamoq|оправдывать
approach|yondashuv|подход
consequence|oqibat|последствие
evidence|dalil|доказательство
issue|masala|проблема, вопрос
trend|tendensiya|тенденция
shortage|tanqislik|нехватка
growth|o'sish|рост
decline|pasayish|спад, снижение
workforce|ishchi kuch|рабочая сила
urban|shaharga oid|городской
rural|qishloqqa oid|сельский
crucial|hal qiluvchi|решающий
sustainable|barqaror|устойчивый
controversial|bahsli|спорный
inevitable|muqarrar|неизбежный
considerable|anchagina|значительный
moreover|bundan tashqari|более того
consequently|natijada|следовательно
nevertheless|shunga qaramay|тем не менее
to some extent|ma'lum darajada|в некоторой степени`,
  5: `alleviate|yengillashtirmoq|облегчать
exacerbate|yomonlashtirmoq|усугублять
advocate|yoqlamoq|выступать за
curb|cheklamoq|сдерживать
foster|rivojlantirmoq|способствовать
mitigate|yumshatmoq|смягчать
scrutinise|sinchiklab tekshirmoq|тщательно изучать
deteriorate|yomonlashmoq|ухудшаться
prevalent|keng tarqalgan|распространённый
ubiquitous|hamma joyda uchraydigan|вездесущий
detrimental|zararli|вредный
feasible|amalga oshirsa bo'ladigan|осуществимый
viable|hayotiy, yaroqli|жизнеспособный
profound|chuqur|глубокий
arbitrary|o'zboshimcha|произвольный
coherent|izchil|связный
disparity|tafovut|неравенство, разрыв
drawback|kamchilik|недостаток
incentive|rag'bat|стимул
notion|tushuncha|понятие
phenomenon|hodisa|явление
implication|oqibat, xulosa|последствие, вывод
legislation|qonunchilik|законодательство
compelling|ishonarli|убедительный
substantial|salmoqli|существенный
albeit|garchi|хотя и
thereby|shu tariqa|тем самым
in light of|hisobga olib|в свете
by and large|umuman olganda|в целом
paradigm|paradigma|парадигма`,
  6: `ameliorate|yaxshilamoq|улучшать
corroborate|tasdiqlamoq|подтверждать
delineate|aniq belgilamoq|очерчивать
elucidate|oydinlashtirmoq|разъяснять
obfuscate|chalkashtirmoq|запутывать
proliferate|tez ko'paymoq|быстро распространяться
circumvent|aylanib o'tmoq|обходить
epitomise|timsoli bo'lmoq|олицетворять
galvanise|harakatga undamoq|побуждать к действию
juxtapose|yonma-yon qo'ymoq|сопоставлять
ambivalent|ikkilangan|двойственный
pragmatic|amaliy|прагматичный
tenuous|zaif, ishonchsiz|слабый, неубедительный
salient|ko'zga tashlanadigan|заметный, основной
intrinsic|ichki, tabiiy|присущий
ostensibly|go'yoki|якобы
inexorable|to'xtatib bo'lmas|неумолимый
pervasive|hamma yoqqa singan|всепроникающий
nuanced|nozik farqli|нюансированный
unprecedented|misli ko'rilmagan|беспрецедентный
dichotomy|ikkiga bo'linish|дихотомия
caveat|shart, ogohlantirish|оговорка
impetus|turtki|импульс, толчок
quandary|boshi berk ko'cha|затруднение
conundrum|jumboq|головоломка
paucity|kamlik|нехватка
plethora|ko'plik|изобилие
notwithstanding|qaramasdan|несмотря на
insofar as|...darajada|поскольку
hitherto|shu vaqtgacha|до сих пор`,
};

export const WORDS: Word[] = (Object.keys(RAW) as unknown as StageId[]).flatMap((k) => {
  const stage = Number(k) as StageId;
  return RAW[stage].trim().split('\n').map((line) => {
    const [en, uz, ru] = line.split('|').map((s) => s.trim());
    return { id: en, en, uz, ru, stage };
  });
});

export const wordsOfStage = (s: number) => WORDS.filter((x) => x.stage === s);
export const WORD_BY_ID = new Map(WORDS.map((x) => [x.id, x]));
