export const event = {
  edition: "5th Edition",
  date: "November 2026",
  venue: "Falkensteiner Punta Skala Resort",
  city: "Zadar, Croatia",
  contactEmail: "rediscover@rentl.io",
  website: "rentl.io",
  registerCta: "Join the waiting list",
};

export const introYears = ["2022", "2023", "2024", "2025"] as const;

export const heroCopy = {
  edition: "5th Edition · November 2026",
  question: "What now?",
  location: "Falkensteiner Punta Skala Resort · Zadar",
  scrollHint: "Scroll to discover",
};

export const stats = [
  { value: "4", label: "Editions" },
  { value: "800+", label: "Attendees" },
  { value: "300+", label: "Hotels & companies" },
];

export const valueProp = {
  eyebrow: "The biggest hotel-tech event in the region",
  bigHeadline: "Every edition opens new ground.",
  body: "Rediscover is where independent hoteliers meet the technology shaping the next decade of hospitality. Real conversations, real outcomes — no buzzwords.",
  topics: [
    "Digitalization",
    "Automation",
    "Revenue Management",
    "Artificial Intelligence (AI)",
    "Business Intelligence",
    "Data",
    "Cost Optimization",
    "Chatbots",
    "Guest Experience",
    "Payment Automation",
    "Guest Communication",
  ],
};

export const audience = {
  eyebrow: "Are you the one?",
  bigHeadline: "Made for those shaping the future of hospitality.",
  titles: [
    "Hotel Owners",
    "General Managers",
    "Revenue Managers",
    "Front Office Managers",
    "IT Managers",
  ],
};

export type Speaker = {
  slug: string;
  name: string;
  role?: string;
  session?: string;
  sessionTitle?: string;
  video?: string;
};

export const speakers = {
  eyebrow: "Speakers through the years",
  bigHeadline: "Inspiration and Change Through the Eyes of Experts",
  body: "Rediscover surfaces the operators, founders, and builders defining where hospitality goes next — with their stories and stakes attached.",
  cardLabel: "5th Edition speakers",
  cardSubtitle: "Lineup announced throughout 2026",
  byYear: {
    "2022": [
      { slug: "marko-misulic", name: "Marko Mišulić", role: "CEO, Rentlio" },
      { slug: "georg-bauser", name: "Georg Bauser" },
      { slug: "jozo-kosir", name: "Jozo Kosir" },
      { slug: "ljudevit-habjanec", name: "Ljudevit Habjanec" },
      { slug: "marko-sagi", name: "Marko Šagi" },
    ] as Speaker[],
    "2023": [
      { slug: "marko-misulic", name: "Marko Mišulić", role: "CEO, Rentlio" },
      { slug: "ana-super-matana", name: "Ana Šuper Matana" },
      { slug: "darko-bosancic", name: "Darko Bosančić" },
      { slug: "erlendur-steinn-gudnason", name: "Erlendur Steinn Gudnason" },
      { slug: "ivan-brezak-brkan", name: "Ivan Brezak Brkan" },
      { slug: "mladen-fernezir", name: "Mladen Fernežir" },
      { slug: "paul-jeszenszky", name: "Paul Jeszenszky" },
      { slug: "roberto-gobo", name: "Roberto Gobo" },
    ] as Speaker[],
    "2024": [
      { slug: "marko-misulic", name: "Marko Mišulić", role: "CEO, Rentlio" },
      { slug: "chris-willette", name: "Chris Willette" },
      { slug: "damir-knezevic", name: "Damir Knežević" },
      { slug: "diana-rubic-radman", name: "Diana Rubić Radman" },
      { slug: "elena-klouda", name: "Elena Klouda" },
      { slug: "filip-gerin", name: "Filip Gerin" },
      { slug: "ivan-brezak-brkan", name: "Ivan Brezak Brkan" },
      { slug: "joana-pires-coelho", name: "Joana Pires Coelho" },
      { slug: "kresimir-drvar", name: "Krešimir Drvar" },
      { slug: "martina-tolic", name: "Martina Tolić" },
      { slug: "pankracije-barac", name: "Pankracije Barać" },
      { slug: "roberto-gobo", name: "Roberto Gobo" },
    ] as Speaker[],
    "2025": [
      {
        slug: "marko-misulic",
        name: "Marko Mišulić",
        role: "CEO, Rentlio",
        session: "Opening keynote",
        sessionTitle: "The Consequences of Waiting",
        video: "https://youtu.be/i_ePFwcxflw",
      },
      {
        slug: "tommaso-centonze",
        name: "Tommaso Centonze",
        role: "COO & Co-Founder, Smartness",
        sessionTitle: "When AI Works, You Can Host",
        video: "https://youtu.be/8FaYD4ldVoQ",
      },
      {
        slug: "lisa-hartley",
        name: "Lisa Hartley",
        role: "Strategic Account Manager, SiteMinder",
        sessionTitle: "Turning 2026 Traveler Data into Revenue Opportunities",
        video: "https://youtu.be/X6FoXKgk77Y",
      },
      { slug: "pankracije-barac", name: "Pankracije Barać" },
      { slug: "kristina-orsanic-kopic", name: "Kristina Oršanić Kopić" },
      { slug: "neven-matas", name: "Neven Matas" },
      { slug: "filip-gerin", name: "Filip Gerin" },
      { slug: "mario-kostelac", name: "Mario Kostelac" },
      { slug: "sanja-sudar", name: "Sanja Sudar" },
      { slug: "marko-henrik-marinsek", name: "Marko Henrik Marinšek" },
    ] as Speaker[],
  },
};

/* "Voices That Shape the Industry" — 3 featured talks from past editions */
export const program = {
  eyebrow: "No buzzwords. Just real insights",
  bigHeadline: "Voices That Shape the Industry",
  body: "Forget generic keynotes. Rediscover brings together speakers with real experience, sharp ideas, and valuable lessons you can apply the moment you leave the room.",
  cards: [
    {
      image: "/voices/talk-1.png",
      title: "Today's Tech Provider Shapes Your Hotel's Tomorrow",
      author: "Marko Mišulić",
      role: "CEO · Rentlio",
      video: "https://youtu.be/i_ePFwcxflw",
    },
    {
      image: "/voices/talk-2.png",
      title: "Tech-Driven Direct Channel Growth",
      author: "Elena Klouda",
      role: "Market Director · The Hotels Network",
      video: "https://youtu.be/8FaYD4ldVoQ",
    },
    {
      image: "/voices/talk-3.png",
      title: "Learnings from a $500M budget",
      author: "Paul Jeszenszky",
      role: "Founder · Advisor ex Airbnb, Google, Ebay",
      video: "https://youtu.be/X6FoXKgk77Y",
    },
  ],
  watchPlaylists: [
    {
      label: "Watch 2025 sessions",
      href: "https://www.youtube.com/playlist?list=PL6IGyxnXxgH13uj0XDGU4DgjZ28Pi2T0i",
    },
    {
      label: "Watch 2024 sessions",
      href: "https://www.youtube.com/playlist?list=PL6IGyxnXxgH0uaKKwJs-Ct-49CCLbOtwn",
    },
  ],
};

export const testimonials = {
  eyebrow: "What our community thinks",
  bigHeadline: "Hear It From the Hoteliers",
  quotes: [
    {
      text: "Beyond expectations and truly inspiring!",
      author: "Past attendee",
      role: "Rediscover 2024",
    },
    {
      text: "All 5 stars, hope to see you next year!",
      author: "Hotelier",
      role: "Rediscover 2025",
    },
    {
      text: "Flawless organization, I have no complaints.",
      author: "General Manager",
      role: "Rediscover 2024",
    },
    {
      text: "Keep going, the event is getting better and better each year.",
      author: "Returning guest",
      role: "Rediscover 2025",
    },
    {
      text: "Keep up the great work — everything else will follow naturally.",
      author: "Hotel Owner",
      role: "Rediscover 2025",
    },
    {
      text: "The entire organization is on an incredible level.",
      author: "Revenue Manager",
      role: "Rediscover 2024",
    },
    {
      text: "Kudos to the team! See you next year.",
      author: "Attendee",
      role: "Rediscover 2025",
    },
    {
      text: "Congrats to the host for excellent organization.",
      author: "Hospitality Director",
      role: "Rediscover 2024",
    },
    {
      text: "Sve je bilo i više nego odlično — jedva čekamo iduću godinu!! (PS — Hvala :)",
      author: "Hotelijer",
      role: "Rediscover 2025",
    },
    {
      text: "Hvala na svemu, posebno na velikoj dozi pozitivne energije. Jedva čekamo sljedeću godinu!",
      author: "Direktor hotela",
      role: "Rediscover 2024",
    },
    {
      text: "Bilo je odlično. Meni osobno, bolje nego prošle godine. Hvala vam svima na svemu što ste napravili.",
      author: "Hotelijer",
      role: "Rediscover 2025",
    },
    {
      text: "Organizacija kao i uvijek dovedena do savršenstva. Čestitamo, bravoo!",
      author: "Vlasnik hotela",
      role: "Rediscover 2024",
    },
  ],
};

export type PartnerTier =
  | "general"
  | "silver"
  | "bronze"
  | "panel"
  | "digitalization"
  | "tech"
  | "chatbot"
  | "media"
  | "food"
  | "venue";

export const partnerTierMeta: Record<PartnerTier, { label: string; dot: string }> = {
  general:        { label: "General partner",        dot: "#F9E59D" },
  silver:         { label: "Silver partner",         dot: "#D2D2D2" },
  bronze:         { label: "Bronze partner",         dot: "#D9AD81" },
  panel:          { label: "Panel partner",          dot: "#A44FF2" },
  digitalization: { label: "Digitalization partner", dot: "#87D0F1" },
  tech:           { label: "Tech partner",           dot: "#87D0F1" },
  chatbot:        { label: "Chatbot partner",        dot: "#0E59EF" },
  media:          { label: "Media partner",          dot: "#F24F52" },
  food:           { label: "Food partner",           dot: "#F28E4F" },
  venue:          { label: "Venue partner",          dot: "#3A49F2" },
};

export const partners = {
  eyebrow: "Rediscover 2025 partners",
  body: "We're proud to collaborate with industry-leading partners who are shaping the future of hospitality & hotel-tech.",
  general: { name: "Mastercard", logo: "/partners/mastercard.svg" },
  list: [
    { name: "Smartness",    logo: "/partners/smartness.png",  tier: "silver"         as PartnerTier },
    { name: "Worldline",    logo: "/partners/worldline.png",  tier: "bronze"         as PartnerTier },
    { name: "T-com",        logo: "/partners/tcom.png",       tier: "panel"          as PartnerTier },
    { name: "Moj eRačun",   logo: "/partners/mojeRacun.png",  tier: "digitalization" as PartnerTier },
    { name: "Seyfor",       logo: "/partners/seyfor.png",     tier: "tech"           as PartnerTier },
    { name: "SiteMinder",   logo: "/partners/siteminder.png", tier: "tech"           as PartnerTier },
    { name: "EasyPin",      logo: "/partners/easyPin.png",    tier: "tech"           as PartnerTier },
    { name: "Infobip",      logo: "/partners/infobip.png",    tier: "chatbot"        as PartnerTier },
    { name: "Turizam",      logo: "/partners/turizam.png",    tier: "media"          as PartnerTier },
    { name: "HRTurizam",    logo: "/partners/hrturizam.png",  tier: "media"          as PartnerTier },
    { name: "Marikomerc",   logo: "/partners/marikomerc.png", tier: "food"           as PartnerTier },
    { name: "Falkensteiner",logo: "/partners/falky.png",      tier: "venue"          as PartnerTier },
  ],
};

export const register = {
  bigHeadline: "We'll soon start preparing for Rediscover 2026.",
  cta: "Join the waiting list",
  altCta: "Watch the 2025 aftermovie",
  emailPlaceholder: "you@hotel.com",
  rolePlaceholder: "Your role",
  success: "You're on the list.",
};

export const faqs = [
  {
    q: "What is Rentlio Rediscover?",
    a: "Rentlio Rediscover is the first Croatian hotel-tech networking event, and the biggest one in the region. A one-day gathering where we explore the future of hotel operations and the inevitable intersection of modern tourism and technology.",
  },
  {
    q: "Who organizes Rentlio Rediscover?",
    a: "Rentlio Rediscover is organized by Rentlio — a tech company based in Zadar that has been successfully digitalizing tourism for over a decade by developing its own Property Management, Channel Management, and Booking Engine system, and many other tools.",
  },
  {
    q: "When and where is Rentlio Rediscover held?",
    a: "Rentlio Rediscover takes place in November at the Fortis Club, located within the Falkensteiner Punta Skala Resort in Petrčane, near Zadar.",
  },
  {
    q: "How do I register and what's the cost?",
    a: "Rentlio Rediscover is an invite-only event with a limited number of guests. Participation and accommodation are free of charge for all invited attendees. If you haven't received an invitation but would like to attend the event, please join the waiting list and we will get back to you with more information.",
  },
  {
    q: "What is the Rentlio Pop-Up Office?",
    a: "Modern guests and technology go hand in hand, so we've prepared a dedicated space where you'll have the opportunity to meet with members of the Rentlio team and our technology partners.",
  },
  {
    q: "How can my company participate?",
    a: "If you'd like your company to take part in the Rediscover event as an exhibitor partner, please contact us at rediscover@rentl.io. We'll be happy to share more details about partnership packages and collaboration opportunities.",
  },
];

export const footer = {
  email: "rediscover@rentl.io",
  website: "rentl.io",
  websiteUrl: "https://www.rentl.io",
};
