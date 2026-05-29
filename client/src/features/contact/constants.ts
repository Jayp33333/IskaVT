import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

export type ContactInfoItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export const CONTACT_INFO_ITEMS: ContactInfoItem[] = [
  { icon: Mail, label: "General Email", value: "support@pup-lopez.edu" },
  { icon: Phone, label: "Campus Hotline", value: "+63 (042) 123 4567" },
  {
    icon: MapPin,
    label: "Address",
    value: "Yumul St., Brgy. Burgos, Lopez, Quezon 4316",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon–Fri, 8:00 AM – 5:00 PM",
  },
];

export type ContactDepartment = {
  name: string;
  email: string;
  phone: string;
  description: string;
};

export const CONTACT_DEPARTMENTS: ContactDepartment[] = [
  {
    name: "Registrar's Office",
    email: "registrar@pup-lopez.edu",
    phone: "+63 (042) 123 4568",
    description:
      "Enrollment, transcripts, credentials, and student records.",
  },
  {
    name: "Guidance & Counseling",
    email: "guidance@pup-lopez.edu",
    phone: "+63 (042) 123 4569",
    description:
      "Student wellness, career advising, and personal development support.",
  },
  {
    name: "IT & Virtual Tour Support",
    email: "it-support@pup-lopez.edu",
    phone: "+63 (042) 123 4570",
    description:
      "Technical help with the 3D campus tour, account access, and platform bugs.",
  },
  {
    name: "Campus Director's Office",
    email: "director@pup-lopez.edu",
    phone: "+63 (042) 123 4571",
    description:
      "Partnerships, campus-wide concerns, and official correspondence.",
  },
];

export type ContactFaqItem = {
  question: string;
  answer: string;
};

export const CONTACT_FAQ_ITEMS: ContactFaqItem[] = [
  {
    question: "How do I access the 3D campus tour?",
    answer:
      'Click "Launch 3D Tour" in the navigation bar. No account is required for the public preview.',
  },
  {
    question: "Who should I contact for enrollment questions?",
    answer:
      "Reach out to the Registrar's Office using the contact details above. Include your full name, program of interest, and any supporting documents.",
  },
  {
    question: "How long does it take to get a response?",
    answer:
      "We aim to reply within 1–2 business days. Messages sent during weekends or holidays are handled on the next working day.",
  },
  {
    question: "Can I visit the campus in person?",
    answer:
      "Yes. Walk-in visitors are welcome during office hours. For group tours or official visits, email the Campus Director's Office in advance.",
  },
];

export const CONTACT_PAGE_INTRO = {
  headline: "We're Here to Help",
  description:
    "Whether you need enrollment guidance, technical support for the virtual tour, or general campus information, our offices are ready to assist. Browse department contacts below or send us a message directly.",
};

/** Official PUP Lopez campus location (Wikipedia / PUP Lopez contact info). */
export const CAMPUS_LOCATION = {
  name: "Polytechnic University of the Philippines Lopez",
  address: "Yumul St., Brgy. Burgos, Lopez, Quezon 4316, Philippines",
  latitude: 13.88086,
  longitude: 122.25987,
  mapZoom: 17,
} as const;

export const CAMPUS_MAP_EMBED_URL = `https://maps.google.com/maps?q=${CAMPUS_LOCATION.latitude},${CAMPUS_LOCATION.longitude}&z=${CAMPUS_LOCATION.mapZoom}&hl=en&output=embed`;

export const CAMPUS_MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${CAMPUS_LOCATION.latitude}%2C${CAMPUS_LOCATION.longitude}`;

export const CONTACT_SUCCESS_MESSAGE =
  "Thanks! Your message has been delivered. We'll be in touch soon.";

export const CONTACT_FORM_IDS = {
  name: "contact-name",
  email: "contact-email",
  message: "contact-message",
} as const;

export const CONTACT_INPUT_CLASS =
  "bg-[#F5F5F5] border-2 border-black p-3 sm:border-4 sm:p-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold focus:bg-[#FFD700]/10 focus:outline-none transition-colors placeholder:opacity-30 disabled:opacity-60";
