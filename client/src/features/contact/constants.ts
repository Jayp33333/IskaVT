import { Mail, Phone, type LucideIcon } from "lucide-react";

export type ContactInfoItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export const CONTACT_INFO_ITEMS: ContactInfoItem[] = [
  { icon: Mail, label: "Email", value: "support@pup-lopez.edu" },
  { icon: Phone, label: "Hotline", value: "+63 (042) 123 4567" },
];

export const CONTACT_SUCCESS_MESSAGE =
  "Thanks! Your message has been delivered. We'll be in touch soon.";

export const CONTACT_FORM_IDS = {
  name: "contact-name",
  email: "contact-email",
  message: "contact-message",
} as const;

export const CONTACT_INPUT_CLASS =
  "bg-[#F5F5F5] border-2 border-black p-3 sm:border-4 sm:p-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold focus:bg-[#FFD700]/10 focus:outline-none transition-colors placeholder:opacity-30 disabled:opacity-60";
