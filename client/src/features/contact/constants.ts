import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

export const PUP_LOPEZ_OFFICIAL_EMAIL = "lopez@pup.edu.ph";

export const PUP_LOPEZ_CAMPUS_HOTLINES = [
  "(042) 302-5249",
  "(042) 841-1149",
  "(042) 841-1890",
] as const;

export const PUP_TRUNK_LINE = "+63 2 5335-1787";

export const PUP_LOPEZ_HOTLINE_TEXT = PUP_LOPEZ_CAMPUS_HOTLINES.join("\n");

export const PUP_LOPEZ_FULL_PHONE_TEXT = [
  ...PUP_LOPEZ_CAMPUS_HOTLINES,
  `${PUP_TRUNK_LINE} (PUP trunk line — connects all campuses including Lopez)`,
].join("\n");

export const PUP_LOPEZ_OFFICE_HOURS_TEXT = [
  "Monday – Friday: 8:00 AM – 5:00 PM",
  "Saturday: 8:00 AM – 5:00 PM (limited offices only)",
  "Sunday: Closed",
  "Lunch break: usually 12:00 NN – 1:00 PM (some offices pause operations)",
].join("\n");

export type ContactInfoItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  multiline?: boolean;
};

export const CONTACT_INFO_ITEMS: ContactInfoItem[] = [
  {
    icon: Mail,
    label: "Official Email",
    value: PUP_LOPEZ_OFFICIAL_EMAIL,
  },
  {
    icon: Phone,
    label: "Campus Hotline",
    value: PUP_LOPEZ_FULL_PHONE_TEXT,
    multiline: true,
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Yumul St., Brgy. Burgos, Lopez, Quezon 4316",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: PUP_LOPEZ_OFFICE_HOURS_TEXT,
    multiline: true,
  },
];

export type ContactFaqStep = {
  title: string;
  description?: string;
  link?: { label: string; href: string };
  image?: string;
  imageAlt?: string;
  images?: { src: string; alt?: string }[];
  requirements?: string[];
  exampleLabel?: string;
};

export type ContactFaqSubItem = {
  question: string;
  answer?: string;
  steps?: ContactFaqStep[];
};

export type ContactFaqItem = {
  question: string;
  answer: string;
  subItems?: ContactFaqSubItem[];
  requirementsHeading?: string;
  requirements?: string[];
};

export type ContactFaqSection = {
  title: string;
  items: ContactFaqItem[];
};

const REGULAR_ENROLLMENT_STEPS: ContactFaqStep[] = [
  {
    title: "Log in to your SIS account",
    link: { label: "sis1.pup.edu.ph", href: "https://sis1.pup.edu.ph/" },
    image: "/images/faqs/regular/step1-regular-enrollment.png",
    imageAlt: "SIS login screen",
  },
  {
    title: "Check if your grades are complete",
    description: "Open the Grades section and confirm all grades are posted.",
    image: "/images/faqs/regular/step2-regular-enrollment.jpg",
    imageAlt: "Grades section in SIS",
  },
  {
    title: "Go to the Enrollment section",
    image: "/images/faqs/regular/step3-regular-enrollment.jpg",
    imageAlt: "Enrollment section in SIS",
  },
  {
    title: "Review subjects and schedule",
    description: "Check all subjects and class schedules before enrolling.",
    image: "/images/faqs/regular/step4-regular-enrollment.jpg",
    imageAlt: "Subject and schedule selection",
  },
  {
    title: "Click Save and Assess",
    image: "/images/faqs/regular/step5-regular-enrollment.jpg",
    imageAlt: "Save and Assess button",
  },
  {
    title: "Review and confirm",
    description: 'Review the details, then click "Okay" to confirm.',
  },
  {
    title: "Review the assessment",
    description: "Verify your enrollment assessment and fee summary.",
  },
  {
    title: "Print the confirmation slip",
    image: "/images/faqs/regular/step8-regular-enrollment.jpg",
    imageAlt: "Enrollment confirmation slip",
  },
];

const IRREGULAR_ENROLLMENT_STEPS: ContactFaqStep[] = [
  {
    title: "Meet with your adviser",
    description: "Go to your adviser and ask to evaluate your subjects.",
  },
  {
    title: "Visit the Registrar's Office",
    description:
      "Ask for your R0 form and confirm how many units you may take for the coming semester.",
  },
  {
    title: "Complete your R0",
    description:
      "Fill out your R0 and list the subjects to enroll in based on your adviser's evaluation.",
  },
  {
    title: "Submit R0 to the Academic Office",
    description:
      "Pass your R0 for subject tagging. Make sure it includes your adviser's signature.",
  },
  {
    title: "Return to the Registrar's Office",
    description: "Submit your fully signed R0. Sample RO:",
    image: "/images/faqs/irregular/step5-irregular-enrollment.jpg",
    imageAlt: "Sample R0 form",
  },
  {
    title: "Verify enrollment on SIS",
    description: "Check your SIS account to confirm you are officially enrolled.",
    images: [
      {
        src: "/images/faqs/irregular/step6-irregular-enrollment-1.jpeg",
        alt: "SIS enrollment status — view 1",
      },
      {
        src: "/images/faqs/irregular/step6-irregular-enrollment-2.jpg",
        alt: "SIS enrollment status — view 2",
      },
    ],
  },
];

const FRESHMEN_ENROLLMENT_STEPS: ContactFaqStep[] = [
  {
    title: "Go to the PUP iApply PUPCET page",
    description: "Read the information provided on the page before applying.",
    link: {
      label: "pup.edu.ph/iapply/pupcet",
      href: "https://www.pup.edu.ph/iapply/pupcet",
    },
    image: "/images/faqs/freshmen/step1-freshmen-enrollment.png",
    imageAlt: "PUP iApply PUPCET page",
  },
  {
    title: 'Scroll down and click "Apply Now"',
    description: "This will take you to PUP iApply.",
    images: [
      {
        src: "/images/faqs/freshmen/step2-freshmen-enrollment-1.jpg",
        alt: "PUPCET page — scroll to Apply Now",
      },
      {
        src: "/images/faqs/freshmen/step2-freshmen-enrollment-2.png",
        alt: "Apply Now button",
      },
    ],
  },
  {
    title: 'Click "Register Here"',
    description: "Create your PUP iApply account.",
    image: "/images/faqs/freshmen/step3-freshmen-enrollment.png",
    imageAlt: "Register Here button",
  },
  {
    title: "Accept the service agreement and select PUPCET",
    description:
      'Read the service agreement, scroll down, click "I have read…", then on the next page select PUPCET to begin creating your account.',
    images: [
      {
        src: "/images/faqs/freshmen/step4-freshmen-enrollment-1.png",
        alt: "Service agreement",
      },
      {
        src: "/images/faqs/freshmen/step4-freshmen-enrollment-2.png",
        alt: "I have read confirmation",
      },
      {
        src: "/images/faqs/freshmen/step4-freshmen-enrollment-3.png",
        alt: "Select PUPCET",
      },
    ],
  },
  {
    title: "Answer the prequalification questions",
    description:
      "Complete the questions to determine if you qualify for PUPCET, then click Next.",
    image: "/images/faqs/freshmen/step5-freshmen-enrollment.png",
    imageAlt: "Prequalification questions",
  },
  {
    title: "Fill up the registration form",
    description: "Type or select the required information in the form.",
    image: "/images/faqs/freshmen/step6-freshmen-enrollment.png",
    imageAlt: "Registration form",
  },
  {
    title: "Submit and sign in again",
    description: "Click Submit to create your account, then sign in again.",
    image: "/images/faqs/freshmen/step7-freshmen-enrollment.jpg",
    imageAlt: "Submit registration",
  },
  {
    title: "PUP iApply Applicant's page",
    description:
      "After signing in, you will see options to manage your PUPCET application.",
    image: "/images/faqs/freshmen/step8-freshmen-enrollment.jpg",
    imageAlt: "Applicant's page",
  },
  {
    title: "Complete the application form",
    description:
      "Fill up, update, or complete your application by entering all required information.",
    image: "/images/faqs/freshmen/step9-freshmen-enrollment.jpg",
    imageAlt: "Application form",
  },
  {
    title: "Print ePermit",
    description:
      "Once your online application is finalized, download and print your system-generated ePermit. Present it on your scheduled examination date. Allow 6–20 working days after finalizing your application before downloading.",
    image: "/images/faqs/freshmen/step10-freshmen-enrollment.jpg",
    imageAlt: "Print ePermit",
  },
  {
    title: "Wait for application approval",
    description:
      "Due to the large number of applications, allow 6–20 working days for photo and document validation. Sign in again to check if your application is approved, then download and print your ePermit.",
    image: "/images/faqs/freshmen/step11-freshmen-enrollment.jpg",
    imageAlt: "Application approval status",
  },
  {
    title: "Check PUPCET results",
    description:
      "This link appears only during the official release of test results. Check the PUP website regularly for PUPCET result announcements.",
    image: "/images/faqs/freshmen/step12-freshmen-enrollment.png",
    imageAlt: "PUPCET results",
  },
  {
    title: "Sign out",
    description:
      "Always sign out from PUP iApply after use. Sign in again with your email address and password when needed.",
    image: "/images/faqs/freshmen/step13-freshmen-enrollment.jpg",
    imageAlt: "Sign out",
  },
];

const TRANSFEREE_ENROLLMENT_STEPS: ContactFaqStep[] = [
  {
    title: "Submit transfer credentials for evaluation",
    image: "/images/faqs/transferee/step1-transferee-enrollment.png",
    imageAlt: "Transfer credentials submission",
  },
  {
    title: "Schedule your Psychological Examination",
    description:
      "Once the Office has approved your evaluated credentials, proceed to the Office of Student Affairs and Services (OSAS) for your Psychological Examination schedule.",
  },
  {
    title: "Pay for the Psychological Exam",
    description: "Proceed to the Cashier's Office to pay for the Psychological Exam.",
  },
  {
    title: "Take the Psychological Exam",
    description: "Complete the Psychological Examination on your scheduled date.",
  },
  {
    title: "Submit admission credentials to the Registrar",
    description:
      "Proceed to the Registrar's Office and submit your admission credentials for evaluation.",
    image: "/images/faqs/transferee/step5-transferee-enrollment-1.png",
    imageAlt: "Registrar admission credentials",
    requirements: [
      "Honorable Dismissal",
      "Transcript of Records",
      "Certificate of Good Moral Character",
      "Course/Subject Description taken from other school",
      "PSA (NSO) Copy of Birth Certificate",
      "Medical Clearance from the University Clinic",
      "Two (2) pcs. 2×2 picture with name tag",
      "Receipt of Admission fee",
      "Curriculum Sheet",
    ],
    exampleLabel: "Example:",
    images: [
      {
        src: "/images/faqs/transferee/step5-transferee-enrollment-2.png",
        alt: "Admission requirements example — view 1",
      },
      {
        src: "/images/faqs/transferee/step5-transferee-enrollment-3.png",
        alt: "Admission requirements example — view 2",
      },
    ],
  },
  {
    title: "Copy subjects at your College of choice",
    description:
      "Proceed to the Office of the Academic Programs or College of your choice and copy the subjects.",
  },
  {
    title: "Send R-zero to OVPBC",
    description: "Send your R-zero to OVPBC for tagging of subjects.",
  },
  {
    title: "Pay tuition fees",
    description: "Proceed to the Cashier's Office for payment of tuition fee.",
    image: "/images/faqs/transferee/step8-transferee-enrollment.jpg",
    imageAlt: "Tuition fee payment",
  },
  {
    title: "Get your Registration Certificate and ID",
    description:
      "Proceed to the Admission Office for printing of your Registration Certificate and ID processing.",
  },
];

const GRADUATION_REQUIREMENTS = [
  "A candidate for graduation should file their application for graduation with the University Registrar's Office at the start of their last semester.",
  "A student shall be recommended for graduation when they have satisfied all academic and other requirements prescribed by the University.",
  "No student shall be allowed to graduate from the University unless they have earned therein more than fifty percent (50%) of the academic units required in their curriculum.",
  "A candidate for graduation should have their deficiencies made up and their record cleared not later than two weeks before the end of their semester.",
  "No student will be issued a diploma and a transcript of records unless they have been cleared of all accountabilities.",
];

export const TOUR_FAQ_SECTIONS: ContactFaqSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        question: "How do I access the 3D campus tour?",
        answer:
          'Click "Visit App" in the navigation bar. No account is required for the public preview.',
      },
      {
        question: "Do I need to create an account?",
        answer:
          "No. The public campus tour works without login. Visit history is saved locally on your device only.",
      },
      {
        question: "How do I learn the controls?",
        answer:
          "A guided walkthrough runs the first time you enter the tour. Replay it anytime from the book icon in the toolbar, or open the Campus Guide for help on movement, the map, and settings.",
      },
    ],
  },
  {
    title: "Using the Tour",
    items: [
      {
        question: "How do I move around?",
        answer:
          "On desktop, use WASD or arrow keys to walk and hold Shift to sprint. Move the mouse to look around. On mobile, use the on-screen joystick and hold landscape orientation.",
      },
      {
        question: "How do I find a specific building?",
        answer:
          "Open the pin icon in the toolbar to search buildings and start guided wayfinding with distance arrows. You can also use the mini-map to teleport to pinned destinations.",
      },
      {
        question: "How do I switch my avatar or camera view?",
        answer:
          "Click your portrait in the toolbar to change avatars. Open Settings (gear icon) and choose 1st Person or 3rd Person under Camera View.",
      },
      {
        question: "How do I send feedback about the tour?",
        answer:
          "Click the chat bubble icon in the toolbar to rate your visit and share comments. You can also use the Contact page for longer inquiries.",
      },
    ],
  },
  {
    title: "Troubleshooting",
    items: [
      {
        question: "Why is there no sound?",
        answer:
          "Browsers block audio until you interact with the page. Click or tap inside the tour once it loads. Check Settings → Audio and confirm volume is turned up.",
      },
      {
        question: "Why is the tour slow or not loading?",
        answer:
          "The 3D campus uses large models and needs a stable internet connection and a device with WebGL support. Try refreshing, closing other tabs, or using a newer browser such as Chrome or Edge.",
      },
      {
        question: "Why does mobile ask for landscape orientation?",
        answer:
          "The tour is designed for landscape on phones so controls and the mini-map fit on screen. Rotate your device or use a tablet or desktop for the best experience.",
      },
      {
        question: "Who should I contact for technical tour issues?",
        answer:
          "Use the feedback button inside the tour or send a message through the Contact page. Include your device, browser, and a short description of the problem.",
      },
    ],
  },
];

export const PUPLQ_FAQ_SECTIONS: ContactFaqSection[] = [
  {
    title: "General",
    items: [
      {
        question: "Who should I contact for enrollment questions?",
        answer:
          "Reach out to the Registrar's Office through the Contact page. Include your full name, program of interest, and any supporting documents.",
      },
      {
        question: "How long does it take to get a response?",
        answer:
          "We aim to reply within 1–2 business days. Messages sent during weekends or holidays are handled on the next working day.",
      },
      {
        question: "Can I visit the campus in person?",
        answer:
          "Yes. Walk-in visitors are welcome during office hours — Monday to Friday, 8:00 AM to 5:00 PM, and Saturday 8:00 AM to 5:00 PM for limited offices only. The campus is closed on Sundays. Note that some offices pause during lunch break, usually 12:00 NN to 1:00 PM. For group tours or official visits, email lopez@pup.edu.ph in advance.",
      },
    ],
  },
  {
    title: "Enrollment",
    items: [
      {
        question: "How to enroll?",
        answer:
          "Enrollment at PUP Lopez is handled by the Registrar's Office during the official enrollment period. Select your student type below and prepare the required documents before visiting the campus.",
        subItems: [
          {
            question: "Regular",
            answer:
              "For continuing students following the prescribed curriculum. Complete enrollment online through the PUP Student Information System (SIS).",
            steps: REGULAR_ENROLLMENT_STEPS,
          },
          {
            question: "Irregular",
            answer:
              "For students with back subjects or a non-standard load. Follow the steps below to complete enrollment with your adviser, Registrar, and Academic Office.",
            steps: IRREGULAR_ENROLLMENT_STEPS,
          },
          {
            question: "Freshmen",
            answer:
              "For first-time college entrants. Apply for PUPCET through PUP iApply by following the steps below.",
            steps: FRESHMEN_ENROLLMENT_STEPS,
          },
          {
            question: "Transferee",
            answer:
              "For students transferring from another school. Follow the steps below to complete credential evaluation, admission, and enrollment.",
            steps: TRANSFEREE_ENROLLMENT_STEPS,
          },
        ],
      },
      {
        question: "How to apply as an academic achiever?",
        answer:
          "Submit your application to the Registrar's Office with proof of academic honors (report cards, certificates, or equivalent documents). Requirements and slots may vary by program — confirm the latest criteria and deadlines with the Registrar before applying.",
      },
      {
        question: "How to get a Good Moral?",
        answer:
          "Request a Certificate of Good Moral Character from the Guidance and Counseling Office. Bring a valid school ID, fill out the request form, and allow processing time as advised by the office.",
      },
      {
        question: "How to apply for graduation?",
        answer:
          "Apply through the University Registrar's Office at the start of your last semester. Review the graduation requirements below.",
        requirementsHeading: "Graduation Requirements",
        requirements: GRADUATION_REQUIREMENTS,
      },
    ],
  },
];

/** @deprecated Use TOUR_FAQ_SECTIONS or PUPLQ_FAQ_SECTIONS */
export const CONTACT_FAQ_SECTIONS: ContactFaqSection[] = [
  ...TOUR_FAQ_SECTIONS,
  ...PUPLQ_FAQ_SECTIONS,
];

/** @deprecated Use TOUR_FAQ_SECTIONS or PUPLQ_FAQ_SECTIONS */
export const CONTACT_FAQ_ITEMS: ContactFaqItem[] = CONTACT_FAQ_SECTIONS.flatMap(
  (section) => section.items,
);

export const CONTACT_PAGE_INTRO = {
  headline: "We're Here to Help",
  description:
    "Whether you need enrollment guidance, technical support for the virtual tour, or general campus information, our offices are ready to assist. Send us a message directly using the form below.",
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
  "bg-muted border border-ink p-3 text-ink sm:p-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold focus:bg-gold/10 focus:outline-none transition-colors placeholder:text-ink/30 disabled:opacity-60";
