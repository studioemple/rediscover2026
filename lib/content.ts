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
  edition: "5th EDITION",
  date: "November 2026",
  headline: "The Next Chapter",
  venue: "Falkensteiner Punta Skala Resort  •  Zadar, Petrčane",
  scrollHint: "Scroll to discover",
  aftermovieLabel: "Rediscover 2025 Aftermovie",
};

export const stats = [
  { value: "4", label: "Editions" },
  { value: "800+", label: "Attendees" },
  { value: "300+", label: "Hotels & companies" },
];

export const valueProp = {
  eyebrow: "Rediscover so far",
  bigHeadline: "The largest hotel tech\nevent in the region",
  body: "A unique five-star experience for hospitality professionals. Two days of practical keynotes, workshops, and networking.",
  stats: [
    { value: 1100, suffix: "+", label: "hospitality\nprofessionals" },
    { value: 300, suffix: "+", label: "hotels and\ntech companies" },
    { value: 20, suffix: "+", label: "technology\npartners" },
  ],
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
  bigHeadline: "The Platform For",
  titles: [
    "Hotel Owners",
    "General Managers",
    "Revenue Managers",
    "Front Office Managers",
    "IT Managers",
  ],
};

export const whyReturn = {
  eyebrow: "More than a conference",
  bigHeadline: "Why Hoteliers Keep Coming Back",
  items: [
    {
      title: "Future-Proof Your Hotel",
      body: "Gain insights into the trends and technologies that will define hospitality's next chapter.",
    },
    {
      title: "Learn What Actually Works",
      body: "No buzzwords. Just practical knowledge, real examples, and lessons you can apply immediately.",
    },
    {
      title: "Meet the People Behind the Ideas",
      body: "Connect directly with hotel owners, operators, technology providers, and hospitality professionals who are driving change across the industry.",
    },
    {
      title: "Gain Your Next Competitive Advantage",
      body: "Discover new tools, strategies, and partnerships that can help your business grow faster and operate smarter.",
    },
  ],
};

export type Speaker = {
  slug: string;
  name: string;
  role?: string;
  /** Featured cards split the role into position + company (each on its
   *  own line). Falls back to `role` when these are absent. */
  position?: string;
  company?: string;
  session?: string;
  sessionTitle?: string;
  video?: string;
};

export const speakers = {
  eyebrow: "Speakers through the years",
  bigHeadline: "Voices That Shape the\nHospitality Industry",
  body: "Meet the operators, founders, and builders shaping the future of hospitality through real stories and hands-on experience.",
  viewAllCta: "View All Speakers",
  applyCta: "Apply to Be a Speaker",
  cardLabel: "5th Edition speakers",
  cardSubtitle: "Lineup announced throughout 2026",
  byYear: {
    "2022": [
      { slug: "marko-misulic", name: "Marko Mišulić", role: "CEO, Rentlio", video: "https://youtu.be/G4_9HPlzUnI" },
      { slug: "georg-bauser", name: "Georg Bauser", role: "Entrepreneur, Operator, Advisor", video: "https://youtu.be/G4_9HPlzUnI" },
      { slug: "jozo-kosir", name: "Jozo Kosir", role: "Service enthusiast, Consultant, Entrepreneur", video: "https://youtu.be/G4_9HPlzUnI" },
      { slug: "ljudevit-habjanec", name: "Ljudevit Habjanec", role: "POS Systems Architect", video: "https://youtu.be/G4_9HPlzUnI" },
    ] as Speaker[],
    "2023": [
      { slug: "marko-misulic", name: "Marko Mišulić", role: "CEO, Rentlio", video: "https://youtu.be/CG8_aoMeNt4" },
      { slug: "ana-super-matana", name: "Ana Šuper Matana", role: "Leadership Coach" },
      { slug: "darko-bosancic", name: "Darko Bosančić", role: "Commercial Director, Sciant EAD", video: "https://youtu.be/9SYzZJkdyok" },
      { slug: "erlendur-steinn-gudnason", name: "Erlendur Steinn Gudnason", role: "Co-Founder & COO, Sweeply", video: "https://youtu.be/Y1voTXyBkp8" },
      { slug: "mladen-fernezir", name: "Mladen Fernežir", role: "Co-Founder & Lead Data Scientist, Velebit AI", video: "https://youtu.be/9SYzZJkdyok" },
      { slug: "ivan-brezak-brkan", name: "Ivan Brezak Brkan", role: "Director of Developer Content, Infobip", video: "https://youtu.be/9SYzZJkdyok" },
      { slug: "roberto-gobo", name: "Roberto Gobo", role: "Director of Digitalization, Valamar Riviera", video: "https://youtu.be/9SYzZJkdyok" },
      { slug: "paul-jeszenszky", name: "Paul Jeszenszky", role: "Founder, Advisor, ex Airbnb, Google, eBay", video: "https://youtu.be/cuXeyMYCNJo" },
    ] as Speaker[],
    "2024": [
      { slug: "marko-misulic", name: "Marko Mišulić", role: "CEO, Rentlio", video: "https://youtu.be/MITcRT-CBas" },
      { slug: "chris-willette", name: "Chris Willette", role: "Business Development, Worldline", video: "https://youtu.be/E0SkDW-2QCs" },
      { slug: "damir-knezevic", name: "Damir Knežević", role: "CEO, Hoteza Europe", video: "https://youtu.be/E0SkDW-2QCs" },
      { slug: "filip-gerin", name: "Filip Gerin", role: "Product Manager, Rentlio", video: "https://youtu.be/E0SkDW-2QCs" },
      { slug: "diana-rubic-radman", name: "Diana Rubić Radman", role: "General Manager, Hotel Marvie", video: "https://youtu.be/ul4PtX0MQJs" },
      { slug: "pankracije-barac", name: "Pankracije Barać", role: "Head of Engineering, Rentlio", video: "https://youtu.be/ul4PtX0MQJs" },
      { slug: "elena-klouda", name: "Elena Klouda", role: "Market Director, The Hotels Network", video: "https://youtu.be/WHj1Pj5Up7U" },
      { slug: "ivan-brezak-brkan", name: "Ivan Brezak Brkan", role: "Director of Developer Content, Infobip", video: "https://youtu.be/yx-E7G7kV_g" },
      { slug: "joana-pires-coelho", name: "Joana Pires Coelho", role: "Solutions Consultant", video: "https://youtu.be/4oyKwecs9Pg" },
      { slug: "kresimir-drvar", name: "Krešimir Drvar", role: "Growth Hacker & Digital Marketing Manager", video: "https://youtu.be/j0KMO1kQb_Y" },
      { slug: "martina-tolic", name: "Martina Tolić", role: "Product Success Manager, Infobip", video: "https://youtu.be/yx-E7G7kV_g" },
      { slug: "roberto-gobo", name: "Roberto Gobo", role: "Director of Digitalization, Valamar Riviera", video: "https://youtu.be/E0SkDW-2QCs" },
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
      { slug: "tommaso-centonze", name: "Tommaso Centonze", role: "COO & Co-Founder, Smartness", video: "https://youtu.be/8FaYD4ldVoQ" },
      { slug: "lisa-hartley", name: "Lisa Hartley", role: "Strategic Account Manager, SiteMinder", video: "https://youtu.be/X6FoXKgk77Y" },
      { slug: "pankracije-barac", name: "Pankracije Barać", role: "Head of Engineering, Rentlio", video: "https://youtu.be/NLF1KxDmk6o" },
      { slug: "kristina-orsanic-kopic", name: "Kristina Oršanić Kopić", role: "Cybersecurity Advisor, Combis", video: "https://youtu.be/5siTFe_V4Go" },
      { slug: "neven-matas", name: "Neven Matas", role: "Cybersecurity Director, Infinum", video: "https://youtu.be/5siTFe_V4Go" },
      { slug: "filip-gerin", name: "Filip Gerin", role: "Product Manager, Rentlio", video: "https://youtu.be/5siTFe_V4Go" },
      { slug: "mario-kostelac", name: "Mario Kostelac", role: "Principal Machine Learning Engineer, Intercom", video: "https://youtu.be/i-eGGjkb2d8" },
      { slug: "sanja-sudar", name: "Sanja Sudar", role: "Head of Business Development, Rentlio", video: "https://youtu.be/MTn4CiOhme0" },
      { slug: "marko-henrik-marinsek", name: "Marko Henrik Marinšek", role: "Country Manager, Worldline", video: "https://youtu.be/MTn4CiOhme0" },
    ] as Speaker[],
  },
  /* Curated "highlight reel" — these speakers appear in the main strip.
     Each item points at the (year, slug) pair so the existing image lookup
     under /public/speakers/{year}/{slug}.png keeps working. */
  featured: [
    { year: "2025", slug: "marko-misulic",          name: "Marko Mišulić",         position: "CEO",                        company: "Rentlio",              video: "https://youtu.be/i_ePFwcxflw" },
    { year: "2025", slug: "tommaso-centonze",       name: "Tommaso Centonze",      position: "COO & Co-Founder",           company: "Smartness",            video: "https://youtu.be/8FaYD4ldVoQ" },
    { year: "2025", slug: "lisa-hartley",           name: "Lisa Hartley",          position: "Strategic Account Manager",  company: "SiteMinder",           video: "https://youtu.be/X6FoXKgk77Y" },
    { year: "2025", slug: "mario-kostelac",         name: "Mario Kostelac",        position: "Principal ML Engineer",      company: "Intercom",             video: "https://youtu.be/i-eGGjkb2d8" },
    { year: "2024", slug: "chris-willette",         name: "Chris Willette",        position: "Business Development",       company: "Worldline",            video: "https://youtu.be/E0SkDW-2QCs" },
    { year: "2024", slug: "elena-klouda",           name: "Elena Klouda",          position: "Market Director",            company: "The Hotels Network",   video: "https://youtu.be/WHj1Pj5Up7U" },
    { year: "2024", slug: "joana-pires-coelho",     name: "Joana Pires Coelho",    position: "Solutions Consultant",       company: "PriceLabs",            video: "https://youtu.be/4oyKwecs9Pg" },
    { year: "2023", slug: "erlendur-steinn-gudnason", name: "Erlendur Steinn Gudnason", position: "Co-Founder & COO",       company: "Sweeply",              video: "https://youtu.be/Y1voTXyBkp8" },
    { year: "2023", slug: "paul-jeszenszky",        name: "Paul Jeszenszky",       position: "Founder · Advisor",          company: "ex Airbnb, Google, eBay", video: "https://youtu.be/cuXeyMYCNJo" },
  ] as Array<{ year: "2022" | "2023" | "2024" | "2025" } & Speaker>,
};

/* "Voices That Shape the Industry" — 3 featured talks from past editions */
export const program = {
  eyebrow: "No buzzwords. Just real insights",
  bigHeadline: "Learn What Actually Works",
  body: "Every session is built around practical insights, real-world examples, and lessons learned in the field. You'll leave with practical ideas, honest conversations, and examples you can apply in your own hotel.",
  cards: [
    {
      image: "/voices/talk-1.png",
      title: "Today's Tech Provider Shapes Your Hotel's Tomorrow",
      author: "Marko Mišulić",
      role: "CEO · Rentlio",
      year: "2025",
      video: "https://www.youtube.com/watch?v=i_ePFwcxflw",
    },
    {
      image: "/voices/talk-4.png",
      title: "Turning 2026 Traveler Data into Revenue Opportunities",
      author: "Lisa Hartley",
      role: "Strategic Account Manager · SiteMinder",
      year: "2025",
      video: "https://www.youtube.com/watch?v=X6FoXKgk77Y",
    },
    {
      image: "/voices/talk-2.png",
      title: "Tech-Driven Direct Channel Growth",
      author: "Elena Klouda",
      role: "Market Director · The Hotels Network",
      year: "2024",
      video: "https://www.youtube.com/watch?v=WHj1Pj5Up7U",
      // Elena stands on the right of the photo — shift the crop right so she
      // stays in frame instead of being cut by the default centre crop.
      imgFocus: "70% 50%",
    },
    {
      image: "/voices/talk-3.png",
      title: "Learnings from a $500M budget",
      author: "Paul Jeszenszky",
      role: "Founder, Ex-Airbnb, Google, eBay",
      year: "2023",
      video: "https://www.youtube.com/watch?v=cuXeyMYCNJo",
    },
  ],
  watchPlaylists: [
    {
      label: "Watch the 2025 sessions",
      href: "https://www.youtube.com/playlist?list=PL6IGyxnXxgH13uj0XDGU4DgjZ28Pi2T0i",
    },
    {
      label: "Watch the 2024 sessions",
      href: "https://www.youtube.com/playlist?list=PL6IGyxnXxgH0uaKKwJs-Ct-49CCLbOtwn",
    },
  ],
};

export const testimonials = {
  eyebrow: "What our community thinks",
  bigHeadline: "Hear It From the Hoteliers",
  quotes: [
    { text: "Beyond expectations and truly inspiring!" },
    { text: "Five stars across the board. Hope to see you next year!" },
    { text: "Flawless organization, I have no complaints." },
    { text: "Keep going, the event is getting better and better each year." },
    { text: "Keep up the great work, everything else will follow naturally." },
    { text: "The entire organization is on an incredible level." },
    { text: "Kudos to the team! See you next year." },
    { text: "Congrats to the host for excellent organization." },
    { text: "Everything was more than excellent, we can't wait for next year!! (PS Thank you :)" },
    { text: "Thank you for everything, especially for the huge dose of positive energy. We can't wait for next year!" },
    { text: "It was excellent. For me personally, even better than last year. Thank you all for everything you did." },
    { text: "The organization was, as always, brought to perfection. Congratulations, bravo!" },
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
  eyebrow: "Rediscover partners so far",
  body: "We're proud to collaborate with industry-leading partners who are shaping the future of hospitality & hotel-tech.",
  general: { name: "Mastercard", logo: "/partners/mastercard.svg" },
  list: [
    { name: "Mastercard",   logo: "/partners/mastercard.svg", tier: "general"        as PartnerTier },
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
  bigHeadline: "Join the\nwaitlist to get\nearly access and\nRediscover updates",
  cta: "Join the waiting list",
  altCta: "Watch the 2025 aftermovie",
  emailPlaceholder: "john.smith@hotelarena.com",
  rolePlaceholder: "Your role",
  success: "You're on the list.",
};

export const faqHeading = "Frequently Asked Questions";

export const faqs = [
  {
    q: "What is Rentlio Rediscover?",
    a: "Rentlio Rediscover is the first Croatian hotel-tech networking event, and the biggest one in the region. A 2-day gathering where we explore the future of hotel operations and the inevitable intersection of modern tourism and technology.",
  },
  {
    q: "Who organizes Rentlio Rediscover?",
    a: "Rentlio Rediscover is organized by Rentlio, a tech company based in Zadar. We have been successfully digitizing the regional hospitality industry for over a decade by developing modern cloud solutions - Rentlio Pro PMS, Channel Manager, Booking Engine, and many other tools.",
  },
  {
    q: "When and where is Rentlio Rediscover held?",
    a: "Rentlio Rediscover takes place in November at the Fortis Club, located within the Falkensteiner Punta Skala Resort in Petrčane, near Zadar. The exact date of this year's event will be announced soon.",
  },
  {
    q: "How do I register and what's the cost?",
    a: "Rentlio Rediscover is an invite-only event with a limited number of guests. We send invitations to specific audiences - primarily the independent hoteliers from the region. If you haven't received an invitation but would like to get an opportunity to attend the event, please join the waiting list and we will get back to you with more information as the event approaches.",
  },
  {
    q: "What is the Rentlio Pop-Up Office?",
    a: "Technology is now an essential part of the guest experience, which is why we've created a dedicated space where attendees can meet the Rentlio team and our technology partners. The Pop-Up Office is located in the Fortis Club lobby, right at the heart of the event, making it easy to stop by for conversations, product demos, and expert advice throughout the day.",
  },
  {
    q: "How can my company participate?",
    a: "If you'd like your company to take part in the Rediscover event as an exhibitor partner, please contact us at rediscover@rentl.io. We'll be happy to share more details about partnership packages and collaboration opportunities.",
  },
];

export const footer = {
  email: "rediscover@rentl.io",
  website: "www.rentl.io",
  // EN edition links to the English Rentlio site. HR/SL override this in i18n.ts.
  websiteUrl: "https://rentl.io/en",
  rights: "All rights reserved.",
  privacy: "Privacy Policy",
};
