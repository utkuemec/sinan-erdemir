import {
  CalendarDays,
  DoorOpen,
  HandHelping,
  Heart,
  PartyPopper,
  Phone,
  PiggyBank,
  ShieldCheck,
  Signpost,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { CandidateConfig } from "./types";

/**
 * THE candidate config. Every candidate-facing string, image path, and CTA on
 * the site reads from this file.
 *
 * Campaign: Sinan Erdemir for Toronto City Council 2026 — Ward 16,
 * Don Valley East. Content sourced from the candidate's Quick Start form.
 */
export const candidate: CandidateConfig = {
  locale: "en",

  // Brand: #B80000 red + white with Archivo Black (see the campaign lockup).
  // Levers intentionally diverge from both the demo and the source campaign.
  theme: {
    palette: "victory-red",
    fonts: "archivo",
    hero: "split", // portraits are studio cutouts — no clear-space photo for overlay
    heroStyle: "photo",
    accent: "minimal", // Archivo Black is loud enough; keeps the brand's clean look
    shape: "sharp", // matches the blocky lockup
    pillars: "band",
    labels: "caps",
    showDemoThemeSwitcher: false,
  },

  identity: {
    firstName: "Sinan",
    lastName: "Erdemir",
    fullName: "Sinan Erdemir",
    logoTagline: "for City Council",
    office: "City Council",
    jurisdiction: "Toronto",
    wardLabel: "Ward 16 — Don Valley East",
    electionYear: 2026,
    campaignName: "Sinan Erdemir for City Council",
    teamName: "Team Sinan",
  },

  site: {
    url: "https://votesinan.com",
    title: "Sinan Erdemir for Toronto City Council 2026",
    description:
      "A cleaner, safer, more affordable Toronto — Sinan Erdemir for City Council in Ward 16, Don Valley East. Everyday improvements. Real results.",
    shortDescription:
      "A cleaner, safer, more affordable Toronto — Sinan Erdemir for Ward 16, Don Valley East.",
    author: "Sinan Erdemir Campaign",
    ogImage: "/images/og-image.png",
  },

  hero: {
    eyebrow: "Sinan Erdemir for Ward 16 — Don Valley East",
    headline: "Everyday Improvements.",
    subtitle: "Real Results.",
    sloganLine: "Everyday Improvements. Real Results.",
    imagePortrait: "/images/hero-portrait.jpg",
    imageLandscape: "/images/hero-landscape.jpg",
  },

  bio: {
    navLabel: "Meet Sinan",
    pageTitle: "Meet Sinan",
    metaDescription:
      "Meet Sinan Erdemir — a Don Valley East resident since 2009, community leader, and consulting-firm co-founder running for Toronto City Council in Ward 16.",
    ogTitle: "Meet Sinan Erdemir",
    ogDescription:
      "A neighbour and community builder running to put Ward 16 — Don Valley East first.",
    eyebrow: "Meet Sinan Erdemir",
    headingLines: ["A Neighbour Who", "Shows Up."],
    portrait: {
      src: "/images/candidate-portrait.jpg",
      alt: "Portrait of Sinan Erdemir",
    },
    paragraphs: [
      "Sinan Erdemir has called Don Valley East home since 2009. For nearly fifteen years he has made community service a central part of his life here — drawing on his own multicultural journey and international perspective to help neighbours overcome barriers, connect with their communities, and build meaningful lives in Canada.",
      "Professionally, Sinan is the co-founder and co-owner of a consulting firm that supports international and domestic students, newcomers, refugees, and visitors in navigating opportunities and building successful futures in Canada. That work means listening carefully, solving practical problems, and delivering results people can count on — the same skills a city councillor needs.",
      "Sinan's record of leadership runs deep: Secretary General and Board Member of the Federation of Canadian Turkish Associations, President and Board Member of the Turkish Culture and Folklore Society of Canada, member of the Community Policing Liaison Committee (CPLC) Consultative Committee with Toronto Police 32 Division, and Board Member of the Carassauga Festival of Cultures. His volunteerism has been recognized with a Certificate of Recognition from the Toronto Police Service, the Community Member Award from the Toronto Police Services Board, and the King Charles III Coronation Pin for his contributions to the community and the Province of Ontario.",
    ],
    whyRunning: {
      eyebrow: "Why I'm Running",
      quote:
        "I want to make daily life better — a cleaner, safer and more affordable city where every neighbourhood receives the attention it deserves.",
      attribution: "— Sinan",
      paragraphs: [
        "Daily life in Toronto should simply work: streets that are clean and safe, services that show up on time, and a City Hall that treats every tax dollar with respect.",
        "Sinan is running for City Council to bring that everyday, service-first focus to Ward 16 — so Don Valley East gets the attention it deserves, block by block and year after year.",
      ],
    },
  },

  priorities: {
    navLabel: "Priorities",
    pageTitle: "Priorities",
    metaDescription:
      "Sinan Erdemir's priorities for Ward 16 — Don Valley East: safer neighbourhoods, a lower cost of everyday living, and a cleaner Toronto.",
    ogTitle: "Priorities for Ward 16 — Don Valley East",
    ogDescription:
      "Safer neighbourhoods, a lower cost of everyday living, and a cleaner Toronto.",
    eyebrow: "Priorities for Ward 16",
    heading: "Everyday Improvements. Real Results.",
    intro:
      "As your councillor, Sinan will focus City Hall on the basics that make daily life better in Don Valley East — delivered well, measured honestly, and improved every year. His platform is built on three core commitments:",
    items: [
      {
        icon: ShieldCheck,
        title: "Safer Neighbourhoods",
        body: "Sinan will work with residents, police, and City services to address crime and disorder and improve public spaces. That means safer routes to schools and transit, better-maintained sidewalks and lighting, reduced dangerous speeding on residential streets, and support for effective enforcement when crimes, threats, violence, or harassment occur.",
      },
      {
        icon: PiggyBank,
        title: "Lower Cost of Everyday Living",
        body: "Life gets more affordable when City Hall works efficiently: reliable services, properly maintained infrastructure, and every taxpayer dollar used responsibly. Better-managed government means fewer unnecessary costs passed on to residents — and more value from the taxes you already pay.",
      },
      {
        icon: Sparkles,
        title: "A Cleaner Toronto",
        body: "Sinan will push for higher standards of city maintenance: faster road repairs, reliable snow removal, cleaner streets, and parks and green spaces that are properly cared for throughout the year. He will strengthen accountability for neglected properties and public spaces so our neighbourhoods stay clean, welcoming, and enjoyable for everyone.",
      },
    ],
    whyThisMatters: {
      heading: "Why This Matters",
      intro:
        "Behind each of these commitments is the same idea: local government exists to make everyday life work. That means focusing on the fundamentals residents actually share:",
      items: [
        {
          label: "Everyday Services",
          text: "Roads repaired, snow cleared, streets cleaned — the basics, done well and on time.",
        },
        {
          label: "Value for Money",
          text: "An efficient City Hall where every tax dollar is accounted for and working toward visible results.",
        },
        {
          label: "Safe Streets",
          text: "Neighbourhoods where kids walk to school safely, seniors feel secure, and dangerous driving is taken seriously.",
        },
        {
          label: "Pride in Our Neighbourhoods",
          text: "Clean parks, cared-for public spaces, and accountability for neglect — so Don Valley East looks and feels like the community we're proud of.",
        },
      ],
    },
  },

  pillars: [
    {
      icon: HandHelping,
      variant: "mustard",
      title: "Volunteer",
      body: "Join Team Sinan and help bring everyday improvements to Don Valley East. Your time and energy can make a real difference across Ward 16.",
      cta: { label: "Get Involved", to: "/get-involved" },
    },
    {
      icon: Heart,
      variant: "turquoise",
      title: "Donate to the Campaign",
      body: "Every contribution helps us reach more neighbours across Don Valley East. Support a campaign focused on real results.",
      cta: { label: "Donate Now", action: "donate" },
    },
    {
      icon: Target,
      variant: "taupe",
      title: "Our Mission",
      body: "Make daily life better in Don Valley East — cleaner streets, safer neighbourhoods, and a City Hall that respects every tax dollar.",
    },
  ],

  endorsements: {
    enabled: false,
    eyebrow: "Endorsements",
    heading: "Endorsed By Community Leaders",
    items: [],
  },

  community: {
    pageTitle: "Community",
    metaDescription:
      "Sinan Erdemir's record of community leadership across Toronto — cultural and civic events, community policing, and multicultural engagement since long before this campaign.",
    ogTitle: "A Record of Showing Up",
    ogDescription:
      "Years of community leadership and volunteerism across Toronto — recognized by the Toronto Police Service and the Province of Ontario.",
    eyebrow: "Rooted in Community",
    headingLines: ["A Record of", "Showing Up."],
    intro:
      "Long before this campaign, Sinan has been building community across Toronto. Since 2018 he has organized and led numerous large-scale cultural and civic events, bringing together thousands of community members and public officials to celebrate heritage, youth, and national milestones.",
    work: [
      {
        icon: CalendarDays,
        label:
          "Organizing large-scale cultural and civic events since 2018, bringing together thousands of residents and public officials",
      },
      {
        icon: Users,
        label:
          "Leadership in Turkish-Canadian community organizations — Federation of Canadian Turkish Associations and Turkish Culture and Folklore Society of Canada",
      },
      {
        icon: ShieldCheck,
        label:
          "Community policing through the CPLC Consultative Committee with Toronto Police 32 Division",
      },
      {
        icon: PartyPopper,
        label: "Board Member of the Carassauga Festival of Cultures",
      },
    ],
    carousel: {
      eyebrow: "Out in the Community",
      heading: "Around Don Valley East",
      photos: [
        {
          src: "/images/community/photo-01.jpg",
          alt: "Sinan Erdemir speaking with residents at a Canada Day community event",
        },
        {
          src: "/images/community/photo-02.jpg",
          alt: "Sinan Erdemir visiting a community organization's booth at a cultural event in Toronto",
        },
        {
          src: "/images/community/photo-03.jpg",
          alt: "Sinan Erdemir discussing neighbourhood priorities with a resident at a Don Valley East community pool",
        },
        {
          src: "/images/community/photo-04.jpg",
          alt: "Sinan Erdemir with residents of all ages at a park in Don Valley East",
        },
        {
          src: "/images/community/photo-05.jpg",
          alt: "Sinan Erdemir and a supporter giving thumbs up at a summer community event",
        },
        {
          src: "/images/community/photo-06.jpg",
          alt: "Sinan Erdemir speaking with a group of neighbours at a park gathering",
        },
      ],
    },
  },

  ward: {
    navLabel: "Ward 16",
    pageTitle: "Ward 16",
    metaDescription:
      "Toronto Ward 16 — Don Valley East: the neighbourhoods, parks, and boundaries of the ward Sinan Erdemir is running to represent on City Council.",
    ogTitle: "Toronto Ward 16 — Don Valley East",
    ogDescription:
      "See the map and neighbourhoods of Don Valley East, where Sinan has lived, worked, and served since 2009.",
    eyebrow: "Our Ward",
    heading: "Toronto Ward 16 — Don Valley East",
    intro:
      "Sinan Erdemir is running to represent Ward 16 — Don Valley East, the community where he has lived, worked, and served since 2009. Bounded by Highway 401 to the north, Victoria Park Avenue to the east, and the Don River valley to the south and west, the ward brings together some of Toronto's most diverse and most-loved neighbourhoods.",
    map: {
      src: "/images/ward-map.png",
      alt: "Map of Toronto Ward 16 — Don Valley East, showing the ward boundary from Highway 401 south to the Don River valley between Leslie Street and Victoria Park Avenue",
      width: 1196,
      height: 1548,
    },
    landmarks: {
      heading: "Around Don Valley East",
      groups: [
        {
          heading: "Neighbourhoods",
          items: [
            "Don Mills",
            "Parkwoods–Donalda",
            "Victoria Village",
            "Flemingdon Park",
            "Graydon Hall",
          ],
        },
        {
          heading: "Parks & Trails",
          items: [
            "E.T. Seton Park",
            "Moccasin Trail Park",
            "Brookbanks Park",
            "Charles Sauriol Conservation Area",
            "The Don River Valley ravines",
          ],
        },
        {
          heading: "Landmarks & Community Spaces",
          items: [
            "Aga Khan Museum & Park",
            "Shops at Don Mills",
            "Ontario Science Centre site",
            "Flemingdon Park Library",
            "Dennis R. Timbrell Resource Centre",
          ],
        },
      ],
    },
  },

  getInvolved: {
    pageTitle: "Get Involved",
    metaDescription:
      "Volunteer, donate, request a lawn sign, or pledge to vote for Sinan Erdemir in Ward 16 — Don Valley East. Whether you have five minutes or five hours, there's a way to help.",
    ogTitle: "Get Involved — Join Team Sinan",
    ogDescription:
      "This campaign is powered by neighbours who care about Don Valley East.",
    eyebrow: "Get Involved",
    heading: "Join Team Sinan.",
    lede: "This campaign is powered by neighbours who care about Don Valley East. Whether you have five minutes or five hours, there's a way to help.",
    cards: [
      {
        kind: "volunteer",
        body: "Help us knock on doors and reach neighbours across Ward 16.",
      },
      { kind: "donate", body: "Every contribution makes an impact." },
      { kind: "lawn-sign", body: "Show Don Valley East you're with Sinan." },
      {
        kind: "pledge",
        body: "Commit to voting in the 2026 Toronto municipal election.",
      },
    ],
    volunteerRoles: {
      heading: "Ways to Help",
      intro:
        "Every role matters, and no experience is needed — tell us what fits your schedule in the sign-up form below.",
      items: [
        {
          icon: DoorOpen,
          label: "Canvassing — knock on doors with Sinan and talk to neighbours",
        },
        {
          icon: Phone,
          label: "Phone bank — call voters from home on your own schedule",
        },
        {
          icon: Signpost,
          label: "Sign delivery — drop off and set up lawn signs across Ward 16",
        },
        {
          icon: CalendarDays,
          label: "Events — help run community meet-and-greets and campaign events",
        },
      ],
    },
  },

  contact: {
    pageTitle: "Contact",
    metaDescription:
      "Get in touch with the Sinan Erdemir campaign. Have a question, idea, or story about Don Valley East? Sinan reads every message.",
    ogTitle: "Get in Touch — Sinan Reads Every Message",
    ogDescription: "Have an idea, a concern, or a story about our city?",
    eyebrow: "Get in Touch",
    headingLines: ["Have a question?", "Sinan wants to hear it."],
    intro:
      "Have an idea, a concern, or a story about Don Valley East? The campaign inbox is open — and Sinan reads every message.",
    email: "info@votesinan.com",
    phone: "(647) 558-0364",
    socials: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=61591975916283",
      },
      { platform: "instagram", url: "https://www.instagram.com/sinanerdemirdve" },
    ],
  },

  legal: {
    authorizedBy:
      "Authorized by the Official Agent for the Sinan Erdemir Campaign.",
    copyright: "© 2026 Sinan Erdemir for City Council. All rights reserved.",
  },

  integrations: {
    // PLACEHOLDER — replace with the campaign's hosted Donorbox form URL once
    // the client provides it (they already have a Donorbox account).
    donateUrl: "https://donorbox.org/",
    donateProcessorName: "Donorbox",
    etransferEmail: "info@votesinan.com",
  },
};
