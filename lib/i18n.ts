/**
 * Site-wide translations (EN / HR / SLO).
 *
 * English lives in `content.ts` (single source of structural data — slugs,
 * video URLs, images, tiers, hrefs). Each language bundle re-uses that
 * structural data and only overrides the visible TEXT, so links/images never
 * drift between languages.
 *
 * HR (Croatian) is not delivered yet — it temporarily falls back to English.
 * When the copy arrives, replace the `hr` bundle below (same shape as `sl`).
 */
import * as C from "@/lib/content";

export type Lang = "en" | "hr" | "sl";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hr", label: "HR" },
  { code: "sl", label: "SLO" },
];

export type Dict = {
  heroCopy: typeof C.heroCopy;
  event: typeof C.event;
  valueProp: typeof C.valueProp;
  audience: typeof C.audience;
  whyReturn: typeof C.whyReturn;
  speakers: typeof C.speakers;
  program: typeof C.program;
  testimonials: typeof C.testimonials;
  partners: typeof C.partners;
  partnerTierMeta: typeof C.partnerTierMeta;
  register: typeof C.register;
  faqHeading: string;
  faqs: typeof C.faqs;
  footer: typeof C.footer;
};

/* ───────────────────────── ENGLISH (base) ───────────────────────── */
const en: Dict = {
  heroCopy: C.heroCopy,
  event: C.event,
  valueProp: C.valueProp,
  audience: C.audience,
  whyReturn: C.whyReturn,
  speakers: C.speakers,
  program: C.program,
  testimonials: C.testimonials,
  partners: C.partners,
  partnerTierMeta: C.partnerTierMeta,
  register: C.register,
  faqHeading: C.faqHeading,
  faqs: C.faqs,
  footer: C.footer,
};

/* ───────────────────────── SLOVENIAN ───────────────────────── */
const SL_TIER_LABELS: Record<C.PartnerTier, string> = {
  general: "generalni partner",
  silver: "srebrni partner",
  bronze: "bronasti partner",
  panel: "panelni partner",
  digitalization: "partner za digitalizacijo",
  tech: "tehnološki partner",
  chatbot: "partner za chatbote",
  media: "medijski partner",
  food: "gastro partner",
  venue: "partner prizorišča",
};

// SLO program-card titles + roles (structural data reused from English).
// Program card video titles + speaker roles stay in the original English on
// the Slovenian site too (per client), same as the Croatian version.
const SL_WATCH = ["Oglejte si predavanja iz leta 2025", "Oglejte si predavanja iz leta 2024"];

const sl: Dict = {
  heroCopy: {
    ...C.heroCopy,
    edition: "5. IZDAJA",
    scrollHint: "Pomaknite se in odkrijte več",
    aftermovieLabel: "Rediscover 2025 Aftermovie",
    // date, headline, venue stay identical across languages
  },
  event: { ...C.event, registerCta: "Vpišite se na čakalni seznam" },
  valueProp: {
    ...C.valueProp,
    eyebrow: "Rediscover doslej",
    bigHeadline: "Največji hotelsko-tehnološki\ndogodek v regiji",
    body: "Edinstvena petzvezdična izkušnja za strokovnjake v hotelirstvu. Dva dneva praktičnih predavanj, delavnic in mreženja.",
    stats: [
      { ...C.valueProp.stats[0], label: "strokovnjakov iz\nhotelirstva" },
      { ...C.valueProp.stats[1], label: "hotelov in\ntehnoloških podjetij" },
      { ...C.valueProp.stats[2], label: "tehnoloških\npartnerjev" },
    ],
    topics: [
      "Digitalizacija", "Avtomatizacija", "Upravljanje prihodkov",
      "Umetna inteligenca (AI)", "Poslovna inteligenca", "Podatki",
      "Optimizacija stroškov", "Chatboti", "Izkušnja gosta",
      "Avtomatizacija plačil", "Komunikacija z gosti",
    ],
  },
  audience: {
    ...C.audience,
    eyebrow: "Je to dogodek za vas?",
    bigHeadline: "Platforma za",
    titles: ["Lastnike hotelov", "Generalne direktorje", "Revenue managerje", "Vodje recepcije", "IT managerje"],
  },
  whyReturn: {
    ...C.whyReturn,
    eyebrow: "Več kot konferenca",
    bigHeadline: "Zakaj se hotelirji vračajo",
    items: [
      { title: "Pripravite svoj hotel na prihodnost", body: "Spoznajte trende in tehnologije, ki bodo oblikovali naslednje poglavje hotelirstva." },
      { title: "Spoznajte, kaj zares deluje", body: "Brez praznih fraz. Samo praktično znanje, resnični primeri in lekcije, ki jih lahko uporabite takoj." },
      { title: "Spoznajte ljudi za idejami", body: "Povežite se neposredno z lastniki hotelov, operaterji, ponudniki tehnologije in strokovnjaki iz hotelirstva, ki spreminjajo panogo." },
      { title: "Pridobite novo konkurenčno prednost", body: "Odkrijte nova orodja, strategije in partnerstva, ki lahko vašemu podjetju pomagajo rasti hitreje in delovati pametneje." },
    ],
  },
  program: {
    ...C.program,
    eyebrow: "Brez praznih fraz. Samo resnični vpogledi",
    bigHeadline: "Spoznajte, kaj zares deluje",
    body: "Vsako predavanje temelji na praktičnih vpogledih, primerih iz prakse in izkušnjah s terena. Domov boste odšli s konkretnimi idejami, iskrenimi pogovori in primeri, ki jih lahko uporabite v svojem hotelu.",
    // cards stay in English (inherited from ...C.program)
    watchPlaylists: C.program.watchPlaylists.map((p, i) => ({ ...p, label: SL_WATCH[i] })),
  },
  speakers: {
    ...C.speakers,
    eyebrow: "Govorniki skozi leta",
    bigHeadline: "Glasovi, ki oblikujejo\nprihodnost hotelirstva",
    body: "Spoznajte operaterje, ustanovitelje in ustvarjalce, ki prihodnost hotelirstva oblikujejo z resničnimi zgodbami in praktičnimi izkušnjami.",
    viewAllCta: "Oglejte si vse govornike",
    applyCta: "Prijavite se kot predavatelj",
    // byYear + featured roles stay in English (job titles), same as source
  },
  testimonials: {
    ...C.testimonials,
    eyebrow: "Kaj pravi naša skupnost",
    bigHeadline: "Mnenja hotelirjev iz prve roke",
    quotes: [
      { text: "Nad pričakovanji in resnično navdihujoče!" },
      { text: "Pet zvezdic na vseh področjih. Upam, da se vidimo prihodnje leto!" },
      { text: "Brezhibna organizacija, nimam pripomb." },
      { text: "Kar tako naprej, dogodek je vsako leto boljši." },
      { text: "Le tako naprej, vse drugo bo sledilo samo od sebe." },
      { text: "Celotna organizacija je na izjemni ravni." },
      { text: "Pohvale ekipi! Se vidimo prihodnje leto." },
      { text: "Čestitke gostitelju za odlično organizacijo." },
      { text: "Vse je bilo več kot odlično, komaj čakamo naslednje leto!! (PS Hvala :)" },
      { text: "Hvala za vse, še posebej za ogromno pozitivne energije. Komaj čakamo naslednje leto!" },
      { text: "Bilo je odlično. Zame osebno še boljše kot lani. Hvala vsem za vse, kar ste naredili." },
      { text: "Organizacija je bila, kot vedno, pripeljana do popolnosti. Čestitke, bravo!" },
    ],
  },
  partners: {
    ...C.partners,
    eyebrow: "Rediscover partnerji doslej",
    body: "Ponosni smo, da sodelujemo z vodilnimi partnerji v panogi, ki oblikujejo prihodnost hotelirstva in hotelske tehnologije.",
  },
  partnerTierMeta: Object.fromEntries(
    (Object.keys(C.partnerTierMeta) as C.PartnerTier[]).map((k) => [
      k, { ...C.partnerTierMeta[k], label: SL_TIER_LABELS[k] },
    ]),
  ) as typeof C.partnerTierMeta,
  register: {
    ...C.register,
    bigHeadline: "Vpišite se na\nčakalni seznam za\nzgodnji dostop in\nnovosti o Rediscoverju",
    cta: "Vpišite se na čakalni seznam",
    altCta: "Oglejte si aftermovie 2025",
    emailPlaceholder: "matej.novak@hotelvista.com",
    rolePlaceholder: "Vaša vloga",
    success: "Ste na seznamu.",
  },
  faqHeading: "Pogosta vprašanja",
  faqs: [
    { q: "Kaj je Rentlio Rediscover?", a: "Rentlio Rediscover je prvi hrvaški hotelsko-tehnološki dogodek za mreženje in največji tovrstni dogodek v regiji. Gre za dvodnevno srečanje, na katerem raziskujemo prihodnost hotelske operative ter neizogibno povezavo med sodobnim turizmom in tehnologijo." },
    { q: "Kdo organizira Rentlio Rediscover?", a: "Konferenco Rentlio Rediscover organizira podjetje Rentlio, tehnološko podjetje s sedežem v Zadru. Že več kot desetletje uspešno pospešujemo digitalno preobrazbo regionalne hotelske industrije z razvojem sodobnih rešitev v oblaku – Rentlio Pro PMS, Channel Manager, Booking Engine in številnih drugih orodij." },
    { q: "Kdaj in kje poteka Rentlio Rediscover?", a: "Konferenca Rentlio Rediscover bo novembra potekala v Fortis Clubu, ki se nahaja v sklopu letovišča Falkensteiner Punta Skala v Petrčanih, v bližini Zadra. Točen datum letošnje konference bo objavljen kmalu." },
    { q: "Kako se prijavim in kakšna je cena?", a: "Konferenca Rentlio Rediscover je dogodek zaprtega tipa z omejenim številom udeležencev. Vabila pošiljamo izbrani ciljni skupini, predvsem predstavnikom neodvisnih hotelov iz regije. Če vabila niste prejeli, vendar bi se želeli udeležiti konference, se prijavite na čakalni seznam. Ko se bo dogodek približeval, vam bomo posredovali več informacij o možnostih udeležbe." },
    { q: "Kaj je Rentlio Pop-Up Office?", a: "Tehnologija je danes nepogrešljiv del izkušnje vsakega gosta, zato smo pripravili poseben prostor, kjer se lahko udeleženci srečajo z ekipo Rentlia in našimi tehnološkimi partnerji. Pop-Up Office se nahaja v preddverju Fortis Cluba, v samem središču dogajanja, kjer ste ves dan vabljeni na pogovore, predstavitve rešitev in izmenjavo znanja z našimi strokovnjaki." },
    { q: "Kako lahko sodeluje moje podjetje?", a: "Če želite, da vaše podjetje na dogodku Rediscover sodeluje kot razstavni partner, nam pišite na rediscover@rentl.io. Z veseljem vam bomo poslali več informacij o partnerskih paketih in možnostih sodelovanja." },
  ],
  footer: {
    ...C.footer,
    websiteUrl: "https://rentl.io/si",
    rights: "Vse pravice pridržane.",
    privacy: "Politika zasebnosti",
  },
};

/* ───────────────────────── CROATIAN ───────────────────────── */
const HR_TIER_LABELS: Record<C.PartnerTier, string> = {
  general: "glavni partner",
  silver: "srebrni partner",
  bronze: "brončani partner",
  panel: "panel partner",
  digitalization: "partner za digitalizaciju",
  tech: "tehnološki partner",
  chatbot: "chatbot partner",
  media: "medijski partner",
  food: "gastro partner",
  venue: "venue partner",
};
const HR_WATCH = ["Pogledajte predavanja iz 2025.", "Pogledajte predavanja iz 2024."];

const hr: Dict = {
  heroCopy: {
    ...C.heroCopy,
    edition: "5. IZDANJE",
    date: "Studeni 2026.",
    scrollHint: "Scrollaj za više informacija",
    aftermovieLabel: "Rediscover 2025 Aftermovie",
    // headline + venue stay identical across languages
  },
  event: { ...C.event, registerCta: "Prijavite se na listu čekanja" },
  valueProp: {
    ...C.valueProp,
    eyebrow: "Rediscover do sada",
    bigHeadline: "Najveći hotel-tech\ndogađaj u regiji",
    body: "Iskustvo s pet zvjezdica za profesionalce iz hotelijerstva i turizma. Dva dana praktičnih keynote predavanja, radionica i networkinga.",
    stats: [
      { ...C.valueProp.stats[0], label: "profesionalaca iz\nhotelijerstva i turizma" },
      { ...C.valueProp.stats[1], label: "hotela i\ntehnoloških kompanija" },
      { ...C.valueProp.stats[2], label: "tehnoloških\npartnera" },
    ],
    topics: [
      "Digitalizacija", "Automatizacija", "Revenue Management",
      "Umjetna inteligencija (AI)", "Business Intelligence", "Podaci",
      "Optimizacija troškova", "Chatbotovi", "Iskustvo gostiju",
      "Automatizacija plaćanja", "Komunikacija s gostima",
    ],
  },
  audience: {
    ...C.audience,
    eyebrow: "Jeste li vi među odabranima?",
    bigHeadline: "Rediscover je za",
    titles: ["Vlasnike hotela", "Direktore hotela", "Revenue managere", "Voditelje recepcije", "IT managere"],
  },
  whyReturn: {
    ...C.whyReturn,
    eyebrow: "Više od konferencije",
    bigHeadline: "Zašto se hotelijeri vraćaju",
    items: [
      { title: "Pripremite hotel za ono što dolazi", body: "Saznajte koji će trendovi i tehnologije oblikovati sljedeće poglavlje hotelijerstva." },
      { title: "Saznajte što zaista funkcionira", body: "Bez praznih fraza. Samo praktično znanje, konkretni primjeri i lekcije koje možete odmah primijeniti." },
      { title: "Upoznajte ljude iza ideja", body: "Povežite se s vlasnicima hotela, direktorima, tehnološkim partnerima i stručnjacima iz industrije koji stvarno mijenjaju hotelijerstvo." },
      { title: "Budite u prednosti pred konkurencijom", body: "Otkrijte nove alate, strategije i sklopite partnerstva koja vašem poslovanju pomažu da raste i radi efikasnije." },
    ],
  },
  program: {
    ...C.program,
    eyebrow: "Pričamo o onome što je važno, što se mijenja i što donosi rezultate",
    bigHeadline: "Saznajte što zaista funkcionira",
    body: "Od digitalizacije i revenue managementa do umjetne inteligencije i operativne izvrsnosti - poslušajte ljude koji svakodnevno stvaraju promjene u hospitality industriji.",
    // card titles + roles stay in English (as delivered in the HR doc)
    watchPlaylists: C.program.watchPlaylists.map((p, i) => ({ ...p, label: HR_WATCH[i] })),
  },
  speakers: {
    ...C.speakers,
    eyebrow: "Predavači kroz godine",
    bigHeadline: "Glasovi koji mijenjaju\nhotelsku industriju",
    body: "Upoznajte direktore, osnivače i ljude koji osmišljavaju proizvode, procese i usluge koje mijenjaju hotelijerstvo.",
    viewAllCta: "Pogledajte sve predavače",
    applyCta: "Prijavite se kao predavač",
    // byYear + featured roles stay in English (job titles), same as source
  },
  testimonials: {
    ...C.testimonials,
    eyebrow: "Što kažu dosadašnji sudionici Rediscovera",
    bigHeadline: "Iz prve ruke, od hotelijera",
    quotes: [
      { text: "Iznad svih očekivanja i zaista inspirativno!" },
      { text: "Pet zvjezdica u svim kategorijama. Vidimo se sljedeće godine!" },
      { text: "Organizacija bez greške, nemam ni jednu zamjerku." },
      { text: "Samo tako nastavite, događaj je iz godine u godinu sve bolji." },
      { text: "Nastavite s odličnim radom, sve ostalo doći će samo od sebe." },
      { text: "Cijela organizacija je na nevjerojatnoj razini." },
      { text: "Svaka čast timu! Vidimo se sljedeće godine." },
      { text: "Čestitke domaćinu na izvrsnoj organizaciji." },
      { text: "Sve je bilo više nego odlično, jedva čekamo sljedeću godinu!! (P.S. hvala :)" },
      { text: "Hvala vam na svemu, posebno na ogromnoj dozi pozitivne energije. Jedva čekamo sljedeću godinu!" },
      { text: "Bilo je odlično. Meni osobno još bolje nego prošle godine. Hvala svima na svemu što ste napravili." },
      { text: "Organizacija je, kao i uvijek, dovedena do savršenstva. Čestitke, bravo!" },
    ],
  },
  partners: {
    ...C.partners,
    eyebrow: "Rediscover partneri do sada",
    body: "Rediscover okuplja vodeće regionalne i globalne kompanije koje ulažu u hotelsku industriju i oblikuju njenu budućnost. Kroz godine su nam se pridružili partneri koji razvijaju tehnologije, usluge i rješenja na koja se hoteli svakodnevno oslanjaju.",
  },
  partnerTierMeta: Object.fromEntries(
    (Object.keys(C.partnerTierMeta) as C.PartnerTier[]).map((k) => [
      k, { ...C.partnerTierMeta[k], label: HR_TIER_LABELS[k] },
    ]),
  ) as typeof C.partnerTierMeta,
  register: {
    ...C.register,
    bigHeadline: "Prijavite se na\nlistu čekanja\ni prvi doznajte\nRediscover novosti",
    cta: "Prijavite se na listu čekanja",
    altCta: "Pogledajte aftermovie 2025.",
    emailPlaceholder: "ivan.horvat@hoteluvala.com",
    rolePlaceholder: "Vaša uloga",
    success: "Na listi ste.",
  },
  faqHeading: "Često postavljana pitanja",
  faqs: [
    { q: "Što je Rentlio Rediscover?", a: "Rentlio Rediscover je prvi hrvatski hotel-tech networking event i najveći event te vrste u regiji. Tijekom dva dana istražujemo budućnost hotelskog poslovanja i neizbježan susret modernog turizma i tehnologije." },
    { q: "Tko organizira Rentlio Rediscover?", a: "Rentlio Rediscover organizira Rentlio, tehnološka tvrtka sa sjedištem u Zadru. Već više od desetljeća uspješno potičemo digitalnu transformaciju regionalne hotelske industrije razvojem suvremenih cloud rješenja – Rentlio Pro PMS-a, Channel Managera, Booking Enginea i brojnih drugih alata." },
    { q: "Kada i gdje se održava Rentlio Rediscover?", a: "Rentlio Rediscover održava se u studenome u Fortis Clubu, koji se nalazi u sklopu resorta Falkensteiner Punta Skala u Petrčanima, nedaleko od Zadra. Točan datum ovogodišnjeg izdanja konferencije bit će objavljen uskoro." },
    { q: "Kako se mogu prijaviti i koliko košta sudjelovanje?", a: "Rentlio Rediscover konferencija je zatvorenog tipa uz ograničen broj sudionika. Pozivnice šaljemo pomno odabranoj publici, prvenstveno predstavnicima nezavisnih hotela iz regije. Ako niste primili pozivnicu, a željeli biste sudjelovati na konferenciji, prijavite se na listu čekanja. Kako se događaj bude približavao, javit ćemo vam se s više informacija o mogućnosti sudjelovanja." },
    { q: "Što je Rentlio Pop-Up Office?", a: "Tehnologija je danas neizostavan dio iskustva svakog gosta, zbog čega smo osmislili poseban prostor u kojem se sudionici mogu upoznati s Rentlio timom i našim tehnološkim partnerima. Pop-Up Office nalazi se u predvorju Fortis Cluba, u samom središtu događanja, te je tijekom cijelog dana otvoren za razgovore, demonstracije proizvoda i razmjenu iskustava sa stručnjacima." },
    { q: "Kako moja tvrtka može sudjelovati?", a: "Ako želite da vaša tvrtka sudjeluje na Rediscoveru kao izlagački partner, javite nam se na rediscover@rentl.io. Rado ćemo podijeliti više informacija o partnerskim paketima i mogućnostima suradnje." },
  ],
  footer: {
    ...C.footer,
    websiteUrl: "https://rentl.io",
    rights: "Sva prava pridržana.",
    privacy: "Pravila privatnosti",
  },
};

export const dictionaries: Record<Lang, Dict> = { en, hr, sl };

/* ───────────────────────── SEO (per language) ───────────────────────── */
export const seo: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Rentlio Rediscover 2026 | Regional Hotel-Tech Event",
    description: "The 5th Rediscover, the region's biggest hotel-tech event. November 2026, Falkensteiner Punta Skala.",
  },
  hr: {
    title: "Rentlio Rediscover 2026 | Najveći regionalni hotel-tech event",
    description: "5. izdanje Rediscovera, najvećeg hotel-tech eventa u regiji. Studeni 2026, Falkensteiner Punta Skala.",
  },
  sl: {
    title: "Rentlio Rediscover 2026 | Hotel-tech dogodek regije",
    description: "5. izdaja Rediscoverja, največjega hotel-tech dogodka v regiji. November 2026, Falkensteiner Punta Skala.",
  },
};

export const DEFAULT_LANG: Lang = "en";
