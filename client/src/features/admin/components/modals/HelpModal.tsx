import { HelpCircle } from "lucide-react";
import {
  ADMIN_SUPPORT_CONTACT,
  hasAdminSupportContact,
} from "../../../../config/adminSupport";
import { ModalShell } from "../common/ModalShell";

type HelpModalProps = {
  open: boolean;
  onClose: () => void;
};

type HelpSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

const SECTIONS: HelpSection[] = [
  {
    heading: "Getting Started",
    body:
      "Welcome to the ISKA Visitor Monitor admin dashboard. Use the tabs in the sidebar to review visitor activity, manage visitor records, answer contact messages, and read tour feedback.",
  },
  {
    heading: "Dashboard",
    body: "",
    bullets: [
      "See visitor statistics and trends at a glance",
      "Monitor daily, weekly, and monthly visitor counts",
      "Explore visitor patterns with interactive charts",
    ],
  },
  {
    heading: "Visitors",
    body: "",
    bullets: [
      "Add new visitor entries manually",
      "Edit or delete existing visitor records",
      "Export visitor reports as PDF or CSV for today, this week, or this month",
      "Set your default export format in Settings",
    ],
  },
  {
    heading: "Messages",
    body: "Messages sent through the public contact form arrive in this inbox.",
    bullets: [
      "Open a message to read it in full",
      "Mark messages as read or unread to keep track of follow-ups",
      "Reply by email using the sender's address",
      "Delete messages you no longer need",
    ],
  },
  {
    heading: "Tour Feedback",
    body: "Feedback submitted by visitors after the virtual tour.",
    bullets: [
      "Review star ratings and visitor comments",
      "Mark feedback as read or unread, or delete it",
    ],
  },
  {
    heading: "Settings",
    body: "Open Settings from the account menu. Preferences are saved on this device.",
    bullets: [
      "New activity alerts when visitors sign in or messages arrive",
      "Auto-refresh interval for dashboard data",
      "Default export format (PDF or CSV)",
    ],
  },
];

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <ModalShell
      open={open}
      title="Help & Support"
      subtitle="Get help with using the admin dashboard"
      onClose={onClose}
      icon={<HelpCircle className="w-4 h-4 text-[#660B05]" />}
      footer={
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#660B05] text-white hover:bg-[#8C1007] transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {section.heading}
            </h3>
            {section.body && (
              <p className="text-xs text-gray-600 mb-2">{section.body}</p>
            )}
            {section.bullets && (
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {hasAdminSupportContact() && (
          <div className="pt-3 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Need More Help?
            </h3>
            <div className="space-y-2">
              {ADMIN_SUPPORT_CONTACT.email && (
                <a
                  href={`mailto:${ADMIN_SUPPORT_CONTACT.email}`}
                  className="block text-xs text-[#660B05] hover:underline"
                >
                  Email: {ADMIN_SUPPORT_CONTACT.email}
                </a>
              )}
              {ADMIN_SUPPORT_CONTACT.phone && (
                <p className="text-xs text-gray-600">
                  Phone: {ADMIN_SUPPORT_CONTACT.phone}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
