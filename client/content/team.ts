/** Leadership and team content, taken from the live About page. */
import { MEDIA_BASE as TEAM_MEDIA_BASE, photos } from "@/lib/site";

export interface TeamMember {
  name: string;
  role: string;
  quote: string;
  photo: string;
  photoAlt: string;
  expertise: string[];
  values: string[];
}

export const founder = {
  name: "Elias Karisa Baya PhD CBS",
  shortName: "Dr. Baya",
  role: "Founder & CEO",
  quote: "Your Trusted Partner in Business & Financial Growth",
  bio: "As founder and CEO of Mwamunda Investment Limited, Dr. Baya leads our mission to deliver microfinance services, savings and loans, and practical financial solutions to businesses and entrepreneurs across Kenya.",
  photo: `${TEAM_MEDIA_BASE}/team/elias-karisa-baya.jpg`,
  photoAlt:
    "Elias Karisa Baya PhD CBS, Founder and CEO of Mwamunda Investment Limited",
  values: ["Integrity", "Transparency", "Trust"],
} as const;

export const team: TeamMember[] = [
  {
    name: founder.name,
    role: founder.role,
    quote: founder.quote,
    photo: founder.photo,
    photoAlt: founder.photoAlt,
    expertise: [
      "Microfinance Services",
      "Savings & Loans",
      "Financial Solutions",
    ],
    values: [...founder.values],
  },
  {
    name: "Antonnina Neema",
    role: "Human Resource Manager",
    quote: "People are our greatest asset",
    photo: `${TEAM_MEDIA_BASE}/team/neema.jpeg`,
    photoAlt:
      "Antonnina Neema, Human Resource Manager at Mwamunda Investment Limited",
    expertise: ["Human Resources", "Recruitment", "Employee Relations"],
    values: ["Dedication", "Professionalism", "Growth"],
  },
];

export const teamGallery = [
  { src: photos.teamBench.src, alt: photos.teamBench.alt },
  { src: photos.branchDesk.src, alt: photos.branchDesk.alt },
  { src: photos.fieldVisit.src, alt: photos.fieldVisit.alt },
] as const;
