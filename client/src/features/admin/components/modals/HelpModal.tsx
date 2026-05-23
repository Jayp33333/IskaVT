import { HelpCircle } from "lucide-react";
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
      "Welcome to the ISKA Visitor Monitor admin dashboard. Use this panel to manage visitor records, view analytics, and export reports.",
  },
  {
    heading: "Dashboard",
    body: "",
    bullets: [
      "View visitor statistics and trends",
      "Monitor daily, weekly, and monthly visitor counts",
      "Analyze visitor patterns with interactive charts",
    ],
  },
  {
    heading: "Visitors",
    body: "",
    bullets: [
      "Add new visitor entries manually",
      "Edit existing visitor records",
      "Delete visitor entries",
      "Export reports in PDF format",
    ],
  },
  {
    heading: "Export Reports",
    body: "Export visitor data by selecting a time range:",
    bullets: [
      "Today: All visitors who logged in today",
      "This Week: Visitors from Monday until today",
      "This Month: All visitors for the current month",
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

        <div className="pt-3 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Need More Help?</h3>
          <div className="space-y-2">
            <a
              href="mailto:support@iska.edu"
              className="block text-xs text-[#660B05] hover:underline"
            >
              Email: support@iska.edu
            </a>
            <p className="text-xs text-gray-600">Phone: (02) 123-4567</p>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
