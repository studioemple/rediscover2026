import type { Lang } from "@/lib/i18n";

/* Agenda (event-day programme) — all three languages in one place.
   Structure (times, tags, speaker photos) is shared; only text is translated.
   A "\n" inside a title forces a line break on desktop only. */

export type AgendaTag = "keynote" | "product" | "panel";

/** A speaker chip. `img` omitted → neutral "reveal soon" placeholder avatar. */
export type AgendaSpeaker = { name: string; img?: string };

export type AgendaItem = {
  time: string;
  tag?: AgendaTag;
  title: string;
  speakers?: AgendaSpeaker[];
  /** Small blue line under the item; the timeline turns dashed from here to
   *  the next item (used for the free time before dinner). */
  note?: string;
};

export type AgendaContent = {
  eyebrow: string;
  title: string;
  body: string;
  tags: Record<AgendaTag, string>;
  items: AgendaItem[];
};

const IMG = {
  ana: "/agenda/ana-radisic.jpg",
  marko: "/agenda/marko-misulic.jpg",
  pankracije: "/agenda/pankracije-barac.jpg",
  velic: "/agenda/marko-velic.jpg",
};

const en: AgendaContent = {
  eyebrow: "Program",
  title: "Explore the\nLineup",
  body: "Fresh perspectives on hospitality, a closer look at technology, and time to connect. Explore a day of talks, conversations and ideas to take back to your business.",
  tags: { keynote: "Keynote", product: "Product session", panel: "Panel" },
  items: [
    { time: "9:00 - 12:00", title: "Registration, welcome drinks,\nlight bites & Pop-Up Office" },
    { time: "12:00 - 12:15", title: "Opening show & welcome with Ana Radišić", speakers: [{ name: "Ana Radišić, Host of the day", img: IMG.ana }] },
    { time: "12:15 - 13:00", tag: "keynote", title: "Session details coming soon", speakers: [{ name: "Marko Mišulić, CEO Rentlio", img: IMG.marko }] },
    { time: "13:00 - 13:35", tag: "product", title: "Session details coming soon", speakers: [{ name: "Pankracije Barać, Rentlio", img: IMG.pankracije }] },
    { time: "13:35 - 15:00", title: "Lunch break, networking & Pop-Up Office" },
    { time: "15:05 - 15:45", tag: "keynote", title: "Session details coming soon", speakers: [{ name: "Marko Velić", img: IMG.velic }] },
    { time: "15:45 - 16:25", tag: "panel", title: "Topic & panelists coming soon", speakers: [{ name: "Moderator reveal soon" }, { name: "Speaker reveal soon" }, { name: "Speaker reveal soon" }, { name: "Speaker reveal soon" }] },
    { time: "16:30 - 17:15", title: "Coffee, Networking & Pop-Up Office" },
    { time: "17:15 - 17:50", tag: "keynote", title: "Session details coming soon", speakers: [{ name: "Speaker reveal soon, Smartness" }] },
    { time: "17:50 - 18:20", tag: "keynote", title: "Speaker & session details coming soon", speakers: [{ name: "Speaker reveal soon" }] },
    { time: "18:30", title: "Closing remarks & Pop-Up Office", note: "Check in, visit the Pop-Up Office or enjoy the spa" },
    { time: "20:15", title: "Dinner & closing party" },
  ],
};

const hr: AgendaContent = {
  eyebrow: "Program",
  title: "Otkrijte\nraspored",
  body: "Svježi pogledi na hotelijerstvo, detaljniji uvid u tehnologiju i vrijeme za povezivanje. Istražite dan pun predavanja, razgovora i ideja koje možete primijeniti u svom poslovanju.",
  tags: { keynote: "Keynote", product: "Predstavljanje proizvoda", panel: "Panel" },
  items: [
    { time: "9:00 - 12:00", title: "Registracija, piće dobrodošlice,\nlagani zalogaji i Pop-Up Office" },
    { time: "12:00 - 12:15", title: "Uvodni show i dobrodošlica uz Anu Radišić", speakers: [{ name: "Ana Radišić, voditeljica dana", img: IMG.ana }] },
    { time: "12:15 - 13:00", tag: "keynote", title: "Detalji predavanja uskoro", speakers: [{ name: "Marko Mišulić, CEO Rentlio", img: IMG.marko }] },
    { time: "13:00 - 13:35", tag: "product", title: "Detalji sesije uskoro", speakers: [{ name: "Pankracije Barać, Rentlio", img: IMG.pankracije }] },
    { time: "13:35 - 15:00", title: "Pauza za ručak, networking i Pop-Up Office" },
    { time: "15:05 - 15:45", tag: "keynote", title: "Detalji predavanja uskoro", speakers: [{ name: "Marko Velić", img: IMG.velic }] },
    { time: "15:45 - 16:25", tag: "panel", title: "Tema i panelisti uskoro", speakers: [{ name: "Moderator uskoro" }, { name: "Predavač uskoro" }, { name: "Predavač uskoro" }, { name: "Predavač uskoro" }] },
    { time: "16:30 - 17:15", title: "Kava, networking i Pop-Up Office" },
    { time: "17:15 - 17:50", tag: "keynote", title: "Detalji predavanja uskoro", speakers: [{ name: "Predavač uskoro, Smartness" }] },
    { time: "17:50 - 18:20", tag: "keynote", title: "Predavač i detalji predavanja uskoro", speakers: [{ name: "Predavač uskoro" }] },
    { time: "18:30", title: "Završna riječ i Pop-Up Office", note: "Smjestite se u hotel, posjetite Pop-Up Office ili uživajte u spa centru" },
    { time: "20:15", title: "Večera i završni party" },
  ],
};

const sl: AgendaContent = {
  eyebrow: "Program",
  title: "Odkrijte\nurnik",
  body: "Sveži pogledi na hotelirstvo, podrobnejši vpogled v tehnologijo in čas za povezovanje. Raziščite dan, poln predavanj, pogovorov in idej, ki jih boste prenesli v svoje poslovanje.",
  tags: { keynote: "Keynote", product: "Predstavitev izdelka", panel: "Panel" },
  items: [
    { time: "9:00 - 12:00", title: "Registracija, pijača dobrodošlice,\nlahki prigrizki in Pop-Up Office" },
    { time: "12:00 - 12:15", title: "Otvoritveni šov in pozdrav z Ano Radišić", speakers: [{ name: "Ana Radišić, voditeljica dneva", img: IMG.ana }] },
    { time: "12:15 - 13:00", tag: "keynote", title: "Podrobnosti predavanja kmalu", speakers: [{ name: "Marko Mišulić, CEO Rentlio", img: IMG.marko }] },
    { time: "13:00 - 13:35", tag: "product", title: "Podrobnosti sesije kmalu", speakers: [{ name: "Pankracije Barać, Rentlio", img: IMG.pankracije }] },
    { time: "13:35 - 15:00", title: "Odmor za kosilo, mreženje in Pop-Up Office" },
    { time: "15:05 - 15:45", tag: "keynote", title: "Podrobnosti predavanja kmalu", speakers: [{ name: "Marko Velić", img: IMG.velic }] },
    { time: "15:45 - 16:25", tag: "panel", title: "Tema in panelisti kmalu", speakers: [{ name: "Moderator kmalu" }, { name: "Govornik kmalu" }, { name: "Govornik kmalu" }, { name: "Govornik kmalu" }] },
    { time: "16:30 - 17:15", title: "Kava, mreženje in Pop-Up Office" },
    { time: "17:15 - 17:50", tag: "keynote", title: "Podrobnosti predavanja kmalu", speakers: [{ name: "Govornik kmalu, Smartness" }] },
    { time: "17:50 - 18:20", tag: "keynote", title: "Govornik in podrobnosti predavanja kmalu", speakers: [{ name: "Govornik kmalu" }] },
    { time: "18:30", title: "Zaključne besede in Pop-Up Office", note: "Nastanite se v hotelu, obiščite Pop-Up Office ali uživajte v spa centru" },
    { time: "20:15", title: "Večerja in zaključna zabava" },
  ],
};

export const agenda: Record<Lang, AgendaContent> = { en, hr, sl };
