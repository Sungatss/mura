import type { HistoricalFigure } from "@/lib/atlas/types";

// Relationships are explicit so content can be translated without changing map data.
export const figures: HistoricalFigure[] = [
  {
    id: "kerei", name: { ru: "Керей хан", kk: "Керей хан", en: "Kerei Khan" },
    description: { ru: "Один из основателей Казахского ханства. После смерти Абулхаира участвовал в борьбе с Шибанидами за Восточный Дешт-и-Кыпчак." },
    eraIds: ["kazakh-1465-1467", "kazakh-1468-1474"], eventIds: ["khanate-formation", "shaybanid-struggle", "kerei-last-record"], sourceIds: ["eh-kerei"],
  },
  {
    id: "janibek", name: { ru: "Жанибек хан", kk: "Жәнібек хан", en: "Janibek Khan" },
    description: { ru: "Один из основателей Казахского ханства; вместе с Кереем возглавил отделение кочевых групп от власти Абулхаира и последующую борьбу с Шибанидами." },
    eraIds: ["kazakh-1465-1467", "kazakh-1468-1474"], eventIds: ["khanate-formation", "shaybanid-struggle"], sourceIds: ["eh-janibek", "eh-kerei"],
  },
  {
    id: "tahir", name: { ru: "Тахир хан", kk: "Тахир хан", en: "Tahir Khan" },
    description: { ru: "Правитель Казахского ханства в период междоусобиц и ослабления центральной власти; поздний этап его правления связан с Жетысу." },
    eraIds: ["kazakh-1529-1555"], eventIds: ["tahir-late-rule"], sourceIds: ["eh-tahir", "eh-sixteenth"],
  },
  {
    id: "buidash", name: { ru: "Буйдаш хан", kk: "Бұйдаш хан", en: "Buidash Khan" },
    description: { ru: "После Тахира возглавил часть казахско-кыргызского объединения в Жетысу; одновременно существовали и другие казахские ханы." },
    eraIds: ["kazakh-1529-1555"], eventIds: ["buidash-zhetysu"], sourceIds: ["eh-sixteenth"],
  },
  {
    id: "haknazar", name: { ru: "Хакназар хан", kk: "Хақназар хан", en: "Haqnazar Khan" },
    description: { ru: "Казахский правитель XVI века, с именем которого источники связывают усиление ханства в середине столетия. Датировки начала его ханской власти расходятся." },
    eraIds: ["kazakh-1529-1555"], eventIds: ["haknazar-1555"], sourceIds: ["eh-aknazar", "eh-sixteenth"],
  },
  {
    id: "abulkhair-younger", name: { ru: "Абулхаир хан (Младший жуз)", kk: "Әбілқайыр хан (Кіші жүз)", en: "Abulkhair Khan (Junior Zhuz)" },
    description: { ru: "Хан Младшего жуза; участвовал в организации сопротивления джунгарам и в переговорах с Российской империей в 1731 году." },
    eraIds: ["kazakh-1721-1737"], eventIds: ["ordabasy-kurultai", "bulanty-battle", "anyrakay-battle", "oath-1731"], sourceIds: ["eh-abulkhair", "eh-chronology", "eh-oath"],
  },
  {
    id: "burundyk", name: {"ru":"Бурундук хан","kk":"Бұрындық хан","en":"Burundyk Khan"},
    description: {"ru":"Сын Керея, хан на рубеже XV–XVI веков. Во время его правления усилилось влияние султана Касыма; около 1511 года Бурундук покинул ханство.","kk":"Керейдің ұлы, XV–XVI ғасырлар тоғысындағы хан. Оның билігі тұсында Қасым сұлтанның ықпалы артып, шамамен 1511 жылы Бұрындық хандықтан кетті.","en":"Kerei's son and a khan around the turn of the sixteenth century. Qasym Sultan's influence grew during his rule, and Burundyk left the khanate around 1511."},
    eraIds: ["kazakh-1510-1521"], eventIds: ["burundyk-qasym-transition"], sourceIds: ["eh-burundyk"],
  },
  {
    id: "kasym", name: {"ru":"Касым хан","kk":"Қасым хан","en":"Qasym Khan"},
    description: {"ru":"Сын Жанибека и хан начала XVI века. При нём Казахское ханство укрепило власть в степи и участвовало в борьбе за города Сырдарьи; с его именем традиционно связывают свод обычного права.","kk":"Жәнібектің ұлы, XVI ғасыр басындағы хан. Оның тұсында Қазақ хандығы даладағы билігін нығайтып, Сырдария бойындағы қалалар үшін күресті; дәстүрлі құқық жинағы оның есімімен байланыстырылады.","en":"Janibek's son and an early sixteenth-century khan. Under him the khanate strengthened its position in the steppe and contested Syr Darya towns; a body of customary law is traditionally associated with his name."},
    eraIds: ["kazakh-1510-1521"], eventIds: ["qasym-sygnak-1510","burundyk-qasym-transition","qasym-sairam-1513","qasym-zhetysu-1514"], sourceIds: ["eh-kasym"],
  },
  {
    id: "tauekel", name: {"ru":"Тауекель хан","kk":"Тәуекел хан","en":"Tauekel Khan"},
    description: {"ru":"Казахский хан конца XVI века. Вёл борьбу за присырдарьинские города и поход против Шайбанидов в 1598 году, во время которого получил смертельное ранение.","kk":"XVI ғасырдың соңындағы қазақ ханы. Сырдария бойындағы қалалар үшін күресіп, 1598 жылы Шайбанилерге қарсы жорық жасады; сол жорықта ауыр жарақат алды.","en":"A late sixteenth-century Kazakh khan. He contested the Syr Darya towns and campaigned against the Shaybanids in 1598, receiving a fatal wound during that campaign."},
    eraIds: ["kazakh-1556-1598"], eventIds: ["shigay-campaign-1582","tauekel-cities-1586","kazakh-embassy-moscow-1594","tauekel-final-campaign-1598"], sourceIds: ["eh-tauekel"],
  },
  {
    id: "esim", name: {"ru":"Есим хан","kk":"Есім хан","en":"Esim Khan"},
    description: {"ru":"Казахский хан первой половины XVII века, сменивший Тауекеля. Боролся за власть над городами Сырдарьи и против соперничавшего правителя Ташкента Турсуна; с ним связывают правовые установления «Есім ханның ескі жолы».","kk":"Тәуекелден кейін билікке келген XVII ғасырдың бірінші жартысындағы қазақ ханы. Сырдария қалалары үшін және Ташкенттегі қарсылас билеуші Тұрсынмен күресті; оның есімі «Есім ханның ескі жолы» құқықтық дәстүрімен байланысты.","en":"A Kazakh khan of the early seventeenth century who succeeded Tauekel. He contested the Syr Darya towns and rival Tursun in Tashkent; the legal tradition known as 'Esim Khan's Old Path' is associated with him."},
    eraIds: ["kazakh-1599-1628"], eventIds: ["esim-turkestan-agreement","esim-tashkent-rivalry"], sourceIds: ["eh-esim"],
  },
  {
    id: "jangir", name: {"ru":"Жангир хан","kk":"Жәңгір хан","en":"Jangir Khan"},
    description: {"ru":"Казахский хан середины XVII века. Организовывал отпор джунгарским войскам; источники особо выделяют его командование в Орбулакском сражении 1643 года.","kk":"XVII ғасырдың ортасындағы қазақ ханы. Жоңғар әскеріне қарсы қорғанысты ұйымдастырды; дереккөздер оның 1643 жылғы Орбұлақ шайқасындағы қолбасшылығын ерекше атайды.","en":"A mid-seventeenth-century Kazakh khan. He organized resistance to Dzungar forces and is especially noted for commanding at the Battle of Orbulak in 1643."},
    eraIds: ["kazakh-1629-1679"], eventIds: ["orbulak-1643"], sourceIds: ["eh-jangir"],
  },
  {
    id: "tauke", name: {"ru":"Тауке хан","kk":"Тәуке хан","en":"Tauke Khan"},
    description: {"ru":"Казахский хан конца XVII — начала XVIII века. Опирался на совет биев и стремился укрепить власть ханства; с его правлением связан свод обычного права «Жеті жарғы».","kk":"XVII ғасырдың соңы мен XVIII ғасыр басындағы қазақ ханы. Билер кеңесіне сүйеніп, хандық билікті нығайтуға ұмтылды; «Жеті жарғы» әдет-ғұрып құқығы оның дәуірімен байланысты.","en":"A Kazakh khan of the late seventeenth and early eighteenth centuries. He relied on councils of bi judges and sought to strengthen the khanate; the Zheti Zhargy customary-law tradition is associated with his reign."},
    eraIds: ["kazakh-1680-1720"], eventIds: ["zheti-zhargy-tradition","tashim-embassy-1687","tuman-embassy-1689"], sourceIds: ["eh-tauke"],
  },
  {
    id: "tole-bi", name: {"ru":"Толе би","kk":"Төле би","en":"Tole Bi"},
    description: {"ru":"Бий Старшего жуза, общественный деятель и оратор. Поддерживал политическое объединение при Тауке и участвовал в правовой традиции «Жеті жарғы».","kk":"Ұлы жүздің биі, қоғам қайраткері және шешен. Тәуке тұсындағы саяси бірлікті қолдап, «Жеті жарғы» құқықтық дәстүріне қатысты.","en":"A bi judge of the Senior Zhuz, public leader and orator. He supported political unity under Tauke and took part in the Zheti Zhargy legal tradition."},
    eraIds: ["kazakh-1680-1720"], eventIds: ["zheti-zhargy-tradition"], sourceIds: ["eh-tole-bi"],
  },
  {
    id: "kazybek-bi", name: {"ru":"Казыбек би","kk":"Қазыбек би","en":"Kazybek Bi"},
    description: {"ru":"Бий Среднего жуза и дипломат. Участвовал в обсуждении «Жеті жарғы» при Тауке; позднее вёл переговоры с джунгарским правителем, в том числе по вопросу пленения Абылая.","kk":"Орта жүздің биі және дипломат. Тәуке тұсындағы «Жеті жарғы» талқылауына қатысып, кейін жоңғар билеушісімен, соның ішінде Абылайдың тұтқында болуы жөнінде келіссөз жүргізді.","en":"A bi judge of the Middle Zhuz and a diplomat. He took part in discussion of Zheti Zhargy under Tauke and later negotiated with the Dzungar ruler, including over Ablai's captivity."},
    eraIds: ["kazakh-1680-1720","kazakh-1738-1781"], eventIds: ["zheti-zhargy-tradition","abylai-release-1743"], sourceIds: ["eh-kazybek-bi", "eh-kazybek-diplomacy"],
  },
  {
    id: "aiteke-bi", name: {"ru":"Айтеке би","kk":"Әйтеке би","en":"Aiteke Bi"},
    description: {"ru":"Бий Младшего жуза и государственный деятель конца XVII века. Участвовал в совете Тауке и составлении правовых установлений «Жеті жарғы».","kk":"XVII ғасыр соңындағы Кіші жүздің биі және мемлекет қайраткері. Тәукенің кеңесіне және «Жеті жарғы» құқықтық ережелерін жасауға қатысты.","en":"A bi judge of the Junior Zhuz and a late seventeenth-century statesman. He took part in Tauke's council and in compiling the legal provisions of Zheti Zhargy."},
    eraIds: ["kazakh-1680-1720"], eventIds: ["zheti-zhargy-tradition"], sourceIds: ["eh-aiteke-bi"],
  },
  {
    id: "bogenbay", name: {"ru":"Богенбай батыр","kk":"Бөгенбай батыр","en":"Bogenbay Batyr"},
    description: {"ru":"Казахский батыр и военачальник XVIII века. Участвовал в организации вооружённого сопротивления джунгарским войскам и приобрёл известность как полководец.","kk":"XVIII ғасырдағы қазақ батыры әрі қолбасшы. Жоңғар әскеріне қарсы қарулы күресті ұйымдастыруға қатысып, қолбасшы ретінде танылды.","en":"An eighteenth-century Kazakh batyr and commander. He helped organize armed resistance to Dzungar forces and became known for his military leadership."},
    eraIds: ["kazakh-1680-1720"], eventIds: ["karakum-1710"], sourceIds: ["eh-bogenbay"],
  },
  {
    id: "kabanbay", name: {"ru":"Кабанбай батыр","kk":"Қабанбай батыр","en":"Kabanbay Batyr"},
    description: {"ru":"Казахский батыр и военачальник XVIII века. Источники связывают его с сопротивлением джунгарским нашествиям и походами в Жетысу и на восток ханства.","kk":"XVIII ғасырдағы қазақ батыры әрі қолбасшы. Дереккөздер оны жоңғар шапқыншылығына қарсы күреспен және Жетісу мен хандықтың шығысындағы жорықтармен байланыстырады.","en":"An eighteenth-century Kazakh batyr and commander. Sources connect him with resistance to Dzungar incursions and campaigns in Zhetysu and the eastern khanate."},
    eraIds: ["kazakh-1680-1720"], eventIds: ["ayagoz-1718"], sourceIds: ["eh-kabanbay"],
  },
  {
    id: "abylai", name: {"ru":"Абылай хан","kk":"Абылай хан","en":"Abylai Khan"},
    description: {"ru":"Хан и политический лидер XVIII века. Получил известность в борьбе с джунгарами, был провозглашён ханом в 1771 году и поддерживал дипломатические отношения с Россией и Цинской империей.","kk":"XVIII ғасырдағы хан әрі саяси көшбасшы. Жоңғарларға қарсы күресте танылып, 1771 жылы хан көтерілді; Ресеймен және Цин империясымен дипломатиялық байланыс ұстады.","en":"An eighteenth-century khan and political leader. He became prominent in the struggle with the Dzungars, was proclaimed khan in 1771, and maintained diplomatic relations with Russia and the Qing Empire."},
    eraIds: ["kazakh-1738-1781"], eventIds: ["abylai-orenburg-1740","abylai-captivity-1741","abylai-release-1743","abylai-qing-1756","abylai-elected-1771","bukhar-oral-poetry"], sourceIds: ["eh-abylai"],
  },
  {
    id: "bukhar-zhyrau", name: {"ru":"Бухар жырау","kk":"Бұқар жырау","en":"Bukhar Zhyrau"},
    description: {"ru":"Казахский жырау и представитель устной поэзии XVIII века. Известен как советник Абылая; его произведения размышляли о власти, единстве и нуждах народа.","kk":"XVIII ғасырдағы қазақ жырауы, ауызша поэзия өкілі. Абылайдың кеңесшісі ретінде белгілі; толғауларында билік, бірлік және халық мұңын қозғады.","en":"An eighteenth-century Kazakh zhyrau and oral poet. Known as an adviser to Ablai, his poetry reflected on power, unity, and the needs of the people."},
    eraIds: ["kazakh-1738-1781"], eventIds: ["bukhar-oral-poetry"], sourceIds: ["eh-bukhar-zhyrau","gov-bukhar"],
  },
  {
    id: "kenesary", name: {"ru":"Кенесары хан","kk":"Кенесары хан","en":"Kenesary Khan"},
    description: {"ru":"Казахский хан и руководитель восстания 1837–1847 годов против Российской империи. Стремился восстановить ханское управление; его считают последним ханом Казахского ханства.","kk":"1837–1847 жылдардағы Ресей империясына қарсы көтерілістің басшысы әрі қазақ ханы. Хандық басқаруды қалпына келтіруге ұмтылды; оны Қазақ хандығының соңғы ханы деп есептейді.","en":"A Kazakh khan who led the 1837–1847 uprising against the Russian Empire. He sought to restore khanate governance and is regarded as the last khan of the Kazakh Khanate."},
    eraIds: ["kazakh-1837-1847"], eventIds: ["kenesary-uprising-1837","akmola-siege-1838","kenesary-elected-1841","kenesary-victory-1844","kenesary-death-1847"], sourceIds: ["eh-kenesary"],
  },
];
