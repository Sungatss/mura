import type { Locale } from "@/lib/i18n";

type FigureCopy = { description: Record<Locale, string>; significance: Record<Locale, string> };

// Editorial paraphrases of the source IDs on the corresponding figures.
export const figureExpansionCopy = {
  burundyk: {
    description: {
      ru: "Сын Керея, хан на рубеже XV–XVI веков. Во время его правления усилилось влияние султана Касыма; около 1511 года Бурундук покинул ханство.",
      kk: "Керейдің ұлы, XV–XVI ғасырлар тоғысындағы хан. Оның билігі тұсында Қасым сұлтанның ықпалы артып, шамамен 1511 жылы Бұрындық хандықтан кетті.",
      en: "Kerei's son and a khan around the turn of the sixteenth century. Qasym Sultan's influence grew during his rule, and Burundyk left the khanate around 1511.",
    },
    significance: {
      ru: "Смена власти от Бурундука к Касыму показывает, что политическое влияние султана могло перерасти формальный ханский титул.",
      kk: "Бұрындықтан Қасымға биліктің ауысуы сұлтанның саяси ықпалы ресми хан атағынан да күштірек бола алғанын көрсетеді.",
      en: "The transition from Burundyk to Qasym shows how a sultan's political influence could outweigh the formal title of khan.",
    },
  },
  kasym: {
    description: {
      ru: "Сын Жанибека и хан начала XVI века. При нём Казахское ханство укрепило власть в степи и участвовало в борьбе за города Сырдарьи; с его именем традиционно связывают свод обычного права.",
      kk: "Жәнібектің ұлы, XVI ғасыр басындағы хан. Оның тұсында Қазақ хандығы даладағы билігін нығайтып, Сырдария бойындағы қалалар үшін күресті; дәстүрлі құқық жинағы оның есімімен байланыстырылады.",
      en: "Janibek's son and an early sixteenth-century khan. Under him the khanate strengthened its position in the steppe and contested Syr Darya towns; a body of customary law is traditionally associated with his name.",
    },
    significance: {
      ru: "Период Касыма стал этапом усиления ханства и расширения его дипломатической известности за пределами степи.",
      kk: "Қасым кезеңінде хандық күшейіп, оның атағы дала шегінен тыс дипломатиялық қатынастарда да танылды.",
      en: "Qasym's era marked a consolidation of the khanate and growing diplomatic recognition beyond the steppe.",
    },
  },
  tauekel: {
    description: {
      ru: "Казахский хан конца XVI века. Вёл борьбу за присырдарьинские города и поход против Шайбанидов в 1598 году, во время которого получил смертельное ранение.",
      kk: "XVI ғасырдың соңындағы қазақ ханы. Сырдария бойындағы қалалар үшін күресіп, 1598 жылы Шайбанилерге қарсы жорық жасады; сол жорықта ауыр жарақат алды.",
      en: "A late sixteenth-century Kazakh khan. He contested the Syr Darya towns and campaigned against the Shaybanids in 1598, receiving a fatal wound during that campaign.",
    },
    significance: {
      ru: "Его походы изменили соотношение сил на юге и предшествовали борьбе Есима за закрепление ханской власти в регионе.",
      kk: "Оның жорықтары оңтүстіктегі күштер арақатынасына әсер етіп, Есімнің өңірде хандық билікті орнықтыру әрекетінің алдында болды.",
      en: "His campaigns shifted the balance of power in the south and preceded Esim's effort to secure khanate authority there.",
    },
  },
  esim: {
    description: {
      ru: "Казахский хан первой половины XVII века, сменивший Тауекеля. Боролся за власть над городами Сырдарьи и против соперничавшего правителя Ташкента Турсуна; с ним связывают правовые установления «Есім ханның ескі жолы».",
      kk: "Тәуекелден кейін билікке келген XVII ғасырдың бірінші жартысындағы қазақ ханы. Сырдария қалалары үшін және Ташкенттегі қарсылас билеуші Тұрсынмен күресті; оның есімі «Есім ханның ескі жолы» құқықтық дәстүрімен байланысты.",
      en: "A Kazakh khan of the early seventeenth century who succeeded Tauekel. He contested the Syr Darya towns and rival Tursun in Tashkent; the legal tradition known as 'Esim Khan's Old Path' is associated with him.",
    },
    significance: {
      ru: "История Есима показывает борьбу за централизацию власти в ханстве; источники расходятся в дате его смерти.",
      kk: "Есімнің тарихы хандықтағы билікті орталықтандыру күресін көрсетеді; дереккөздер оның қайтыс болған жылын әртүрлі береді.",
      en: "Esim's history illustrates the struggle to centralize authority within the khanate; sources disagree on his year of death.",
    },
  },
  jangir: {
    description: {
      ru: "Казахский хан середины XVII века. Организовывал отпор джунгарским войскам; источники особо выделяют его командование в Орбулакском сражении 1643 года.",
      kk: "XVII ғасырдың ортасындағы қазақ ханы. Жоңғар әскеріне қарсы қорғанысты ұйымдастырды; дереккөздер оның 1643 жылғы Орбұлақ шайқасындағы қолбасшылығын ерекше атайды.",
      en: "A mid-seventeenth-century Kazakh khan. He organized resistance to Dzungar forces and is especially noted for commanding at the Battle of Orbulak in 1643.",
    },
    significance: {
      ru: "Его военные действия и поиск союзников отражают давление джунгарского наступления на ханство.",
      kk: "Оның әскери қимылдары мен одақтастар іздеуі жоңғар шабуылдарының хандыққа түсірген қысымын көрсетеді.",
      en: "His military actions and search for allies reflect the pressure of Dzungar expansion on the khanate.",
    },
  },
  tauke: {
    description: {
      ru: "Казахский хан конца XVII — начала XVIII века. Опирался на совет биев и стремился укрепить власть ханства; с его правлением связан свод обычного права «Жеті жарғы».",
      kk: "XVII ғасырдың соңы мен XVIII ғасыр басындағы қазақ ханы. Билер кеңесіне сүйеніп, хандық билікті нығайтуға ұмтылды; «Жеті жарғы» әдет-ғұрып құқығы оның дәуірімен байланысты.",
      en: "A Kazakh khan of the late seventeenth and early eighteenth centuries. He relied on councils of bi judges and sought to strengthen the khanate; the Zheti Zhargy customary-law tradition is associated with his reign.",
    },
    significance: {
      ru: "Советы биев при Тауке служили важным механизмом управления и разрешения споров в условиях внешней угрозы.",
      kk: "Тәуке тұсындағы билер кеңестері сыртқы қауіп кезінде басқару мен дауларды шешудің маңызды тетігі болды.",
      en: "The councils of bi judges under Tauke were an important means of governance and dispute resolution amid external threats.",
    },
  },
  "tole-bi": {
    description: {
      ru: "Бий Старшего жуза, общественный деятель и оратор. Поддерживал политическое объединение при Тауке и участвовал в правовой традиции «Жеті жарғы».",
      kk: "Ұлы жүздің биі, қоғам қайраткері және шешен. Тәуке тұсындағы саяси бірлікті қолдап, «Жеті жарғы» құқықтық дәстүріне қатысты.",
      en: "A bi judge of the Senior Zhuz, public leader and orator. He supported political unity under Tauke and took part in the Zheti Zhargy legal tradition.",
    },
    significance: {
      ru: "Его роль связывает суд биев, управление Старшим жузом и стремление к совместному сопротивлению джунгарским набегам.",
      kk: "Оның қызметі билер сотын, Ұлы жүздегі басқаруды және жоңғар шапқыншылығына бірлесіп қарсы тұру ұмтылысын байланыстырады.",
      en: "His work connects bi court practice, leadership in the Senior Zhuz, and efforts to resist Dzungar raids together.",
    },
  },
  "kazybek-bi": {
    description: {
      ru: "Бий Среднего жуза и дипломат. Участвовал в обсуждении «Жеті жарғы» при Тауке; позднее вёл переговоры с джунгарским правителем, в том числе по вопросу пленения Абылая.",
      kk: "Орта жүздің биі және дипломат. Тәуке тұсындағы «Жеті жарғы» талқылауына қатысып, кейін жоңғар билеушісімен, соның ішінде Абылайдың тұтқында болуы жөнінде келіссөз жүргізді.",
      en: "A bi judge of the Middle Zhuz and a diplomat. He took part in discussion of Zheti Zhargy under Tauke and later negotiated with the Dzungar ruler, including over Ablai's captivity.",
    },
    significance: {
      ru: "Казыбек совмещал судебный авторитет бия с дипломатической работой в годы джунгарского давления.",
      kk: "Қазыбек жоңғар қысымы жылдарында бидің сот беделін дипломатиялық қызметпен ұштастырды.",
      en: "Kazybek combined a bi judge's judicial authority with diplomacy during the Dzungar conflict.",
    },
  },
  "aiteke-bi": {
    description: {
      ru: "Бий Младшего жуза и государственный деятель конца XVII века. Участвовал в совете Тауке и составлении правовых установлений «Жеті жарғы».",
      kk: "XVII ғасыр соңындағы Кіші жүздің биі және мемлекет қайраткері. Тәукенің кеңесіне және «Жеті жарғы» құқықтық ережелерін жасауға қатысты.",
      en: "A bi judge of the Junior Zhuz and a late seventeenth-century statesman. He took part in Tauke's council and in compiling the legal provisions of Zheti Zhargy.",
    },
    significance: {
      ru: "Его участие в совете показывает значение представителей жузов в принятии общих политических и правовых решений.",
      kk: "Оның кеңеске қатысуы ортақ саяси және құқықтық шешімдер қабылдауда жүз өкілдерінің маңызды болғанын көрсетеді.",
      en: "His place in the council shows the role of zhuz representatives in shared political and legal decisions.",
    },
  },
  bogenbay: {
    description: {
      ru: "Казахский батыр и военачальник XVIII века. Участвовал в организации вооружённого сопротивления джунгарским войскам и приобрёл известность как полководец.",
      kk: "XVIII ғасырдағы қазақ батыры әрі қолбасшы. Жоңғар әскеріне қарсы қарулы күресті ұйымдастыруға қатысып, қолбасшы ретінде танылды.",
      en: "An eighteenth-century Kazakh batyr and commander. He helped organize armed resistance to Dzungar forces and became known for his military leadership.",
    },
    significance: {
      ru: "История Бөгенбая отражает роль батыров в совместной обороне жузов во время джунгарских войн.",
      kk: "Бөгенбайдың тарихы жоңғар соғыстары кезіндегі жүздердің бірлескен қорғанысында батырлардың рөлін көрсетеді.",
      en: "Bogenbay's story illustrates the role of batyrs in the zhuzes' joint defense during the Dzungar wars.",
    },
  },
  kabanbay: {
    description: {
      ru: "Казахский батыр и военачальник XVIII века. Источники связывают его с сопротивлением джунгарским нашествиям и походами в Жетысу и на восток ханства.",
      kk: "XVIII ғасырдағы қазақ батыры әрі қолбасшы. Дереккөздер оны жоңғар шапқыншылығына қарсы күреспен және Жетісу мен хандықтың шығысындағы жорықтармен байланыстырады.",
      en: "An eighteenth-century Kazakh batyr and commander. Sources connect him with resistance to Dzungar incursions and campaigns in Zhetysu and the eastern khanate.",
    },
    significance: {
      ru: "Его военная деятельность охватывала несколько этапов длительного противостояния с джунгарами.",
      kk: "Оның әскери қызметі жоңғарлармен ұзаққа созылған қарсыластықтың бірнеше кезеңін қамтыды.",
      en: "His military activity spanned several phases of the long confrontation with the Dzungars.",
    },
  },
  abylai: {
    description: {
      ru: "Хан и политический лидер XVIII века. Получил известность в борьбе с джунгарами, был провозглашён ханом в 1771 году и поддерживал дипломатические отношения с Россией и Цинской империей.",
      kk: "XVIII ғасырдағы хан әрі саяси көшбасшы. Жоңғарларға қарсы күресте танылып, 1771 жылы хан көтерілді; Ресеймен және Цин империясымен дипломатиялық байланыс ұстады.",
      en: "An eighteenth-century khan and political leader. He became prominent in the struggle with the Dzungars, was proclaimed khan in 1771, and maintained diplomatic relations with Russia and the Qing Empire.",
    },
    significance: {
      ru: "Его политика соединяла военное руководство и дипломатию между двумя соседними империями.",
      kk: "Оның саясаты екі көрші империя арасындағы әскери басшылық пен дипломатияны ұштастырды.",
      en: "His policy combined military leadership with diplomacy between two neighboring empires.",
    },
  },
  "bukhar-zhyrau": {
    description: {
      ru: "Казахский жырау и представитель устной поэзии XVIII века. Известен как советник Абылая; его произведения размышляли о власти, единстве и нуждах народа.",
      kk: "XVIII ғасырдағы қазақ жырауы, ауызша поэзия өкілі. Абылайдың кеңесшісі ретінде белгілі; толғауларында билік, бірлік және халық мұңын қозғады.",
      en: "An eighteenth-century Kazakh zhyrau and oral poet. Known as an adviser to Ablai, his poetry reflected on power, unity, and the needs of the people.",
    },
    significance: {
      ru: "Бұқар жырау показывает, что политическая история ханства передавалась и обсуждалась также через устную поэзию.",
      kk: "Бұқар жырау хандықтың саяси тарихы ауызша поэзия арқылы да жеткізіліп, талқыланғанын көрсетеді.",
      en: "Bukhar Zhyrau shows how the khanate's political history was also conveyed and debated through oral poetry.",
    },
  },
  kenesary: {
    description: {
      ru: "Казахский хан и руководитель восстания 1837–1847 годов против Российской империи. Стремился восстановить ханское управление; его считают последним ханом Казахского ханства.",
      kk: "1837–1847 жылдардағы Ресей империясына қарсы көтерілістің басшысы әрі қазақ ханы. Хандық басқаруды қалпына келтіруге ұмтылды; оны Қазақ хандығының соңғы ханы деп есептейді.",
      en: "A Kazakh khan who led the 1837–1847 uprising against the Russian Empire. He sought to restore khanate governance and is regarded as the last khan of the Kazakh Khanate.",
    },
    significance: {
      ru: "Его восстание стало одним из крупнейших выступлений против имперской административной экспансии в казахской степи.",
      kk: "Оның көтерілісі қазақ даласындағы империялық әкімшілік кеңеюге қарсы ірі қозғалыстардың бірі болды.",
      en: "His uprising was one of the largest movements against imperial administrative expansion in the Kazakh steppe.",
    },
  },
} satisfies Record<string, FigureCopy>;
