import type { Locale } from "@/lib/i18n";

type Localized = Record<Locale, string>;

export type FigureArtwork = {
  src: string;
  sourceUrl: string;
  creator: string;
  license: string;
  licenseUrl: string;
  label: Localized;
  caption: Localized;
  position?: string;
};

const commons = (name: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name).replaceAll("%20", "_")}`;
const bySa4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const publicDomain = "https://creativecommons.org/publicdomain/mark/1.0/";

// Images are contextual material unless the source identifies the sitter. They are never presented as authentic likenesses.
export const figureArtwork: Record<string, FigureArtwork> = {
  kerei: {
    src: "/figures/kerei.jpg",
    sourceUrl: commons("Астана, нацмузей, орден Керей хана.jpg"),
    creator: "Nikolai Bulykin", license: "CC BY-SA 4.0", licenseUrl: bySa4,
    label: { ru: "Музейный экспонат", kk: "Музей жәдігері", en: "Museum object" },
    caption: {
      ru: "Современный орден Керея из Национального музея Казахстана. Рельеф не является прижизненным портретом.",
      kk: "Қазақстан Ұлттық музейіндегі Керей хан ордені. Бедер ханның көзі тірісіндегі портреті емес.",
      en: "Modern Order of Kerei at Kazakhstan's National Museum. Its relief is not a portrait made during his lifetime.",
    },
  },
  janibek: {
    src: "/figures/janibek.jpg",
    sourceUrl: commons("Астана, нацмузей, орден Жанибек хана.jpg"),
    creator: "Nikolai Bulykin", license: "CC BY-SA 4.0", licenseUrl: bySa4,
    label: { ru: "Музейный экспонат", kk: "Музей жәдігері", en: "Museum object" },
    caption: {
      ru: "Современный орден Жанибека из Национального музея Казахстана. Рельеф не является прижизненным портретом.",
      kk: "Қазақстан Ұлттық музейіндегі Жәнібек хан ордені. Бедер ханның көзі тірісіндегі портреті емес.",
      en: "Modern Order of Janibek at Kazakhstan's National Museum. Its relief is not a portrait made during his lifetime.",
    },
  },
  tahir: {
    src: "/figures/tahir.jpg",
    sourceUrl: commons("Казахстан, нацпарк Алтын Эмель, пейзажи (15).jpg"),
    creator: "ElenaLitera", license: "CC BY-SA 4.0", licenseUrl: bySa4,
    label: { ru: "Пейзаж Жетысу", kk: "Жетісу пейзажы", en: "Zhetysu landscape" },
    caption: {
      ru: "Современный вид Алтын-Эмеля в Жетысу — географический контекст позднего правления Тахира, не его портрет.",
      kk: "Жетісудағы Алтын-Емелдің қазіргі көрінісі — Тахир билігінің соңғы кезеңіне қатысты өңірлік контекст, оның портреті емес.",
      en: "A present-day view of Altyn-Emel in Zhetysu: regional context for Tahir's later rule, not his portrait.",
    },
  },
  buidash: {
    src: "/figures/buidash.png",
    sourceUrl: commons("Kazakh warriors 15th-18th century Kazakhstan National Encyclopedia.png"),
    creator: "Kazakhstan National Encyclopedia", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    label: { ru: "Историческая иллюстрация", kk: "Тарихи иллюстрация", en: "Historical illustration" },
    caption: {
      ru: "Иллюстрация казахских воинов XV–XVIII веков из Казахстанской национальной энциклопедии. Буйдаш на ней не идентифицирован.",
      kk: "Қазақстан ұлттық энциклопедиясындағы XV–XVIII ғасырлардағы қазақ жауынгерлерінің иллюстрациясы. Бұйдаш онда анықталмаған.",
      en: "Illustration of Kazakh warriors from the 15th–18th centuries in the Kazakhstan National Encyclopedia. Buidash is not identified in it.",
    },
  },
  haknazar: {
    src: "/figures/haknazar.jpg",
    sourceUrl: commons('"Padishah (Emperor) of Dast-i Qipchaq". Tabriz or Qavin, circa 1550. British Museum, 1948-10-9-056.jpg'),
    creator: "Unknown artist, c. 1550", license: "Public domain", licenseUrl: publicDomain,
    label: { ru: "Неустановленный правитель", kk: "Анықталмаған билеуші", en: "Unidentified ruler" },
    caption: {
      ru: "Миниатюра «Падишах Дешт-и-Кыпчака», около 1550 года. Личность изображённого неизвестна; связь с Хакназаром не подтверждена.",
      kk: "«Дешті Қыпшақ падишахы» миниатюрасы, шамамен 1550 жыл. Бейнеленген адамның кім екені белгісіз; Хақназар екені расталмаған.",
      en: "Miniature titled ‘Padishah of Desht-i Qipchaq’, c. 1550. The sitter is unidentified; a link to Haqnazar is unconfirmed.",
    },
  },
  "abulkhair-younger": {
    src: "/figures/abulkhair-younger.jpg",
    sourceUrl: commons("Abulkhair Khan.jpg"),
    creator: "John Castle", license: "Public domain", licenseUrl: publicDomain,
    label: { ru: "Историческая гравюра", kk: "Тарихи гравюра", en: "Historical engraving" },
    caption: {
      ru: "Изображение Абулхаира Младшего жуза по рисунку Джона Касла, опубликованное в 1784 году.",
      kk: "Кіші жүз Әбілқайырының Джон Касл суреті негізіндегі, 1784 жылы жарияланған бейнесі.",
      en: "Depiction of Abulkhair of the Junior Zhuz after a drawing by John Castle, published in 1784.",
    },
    position: "center 18%",
  },
};
