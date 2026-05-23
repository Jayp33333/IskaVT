import { ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import type { ExportRange } from "../../types";

type ExportDropdownProps = {
  onExport: (range: ExportRange) => void;
  onChangeDefault: () => void;
};

const RANGES: { range: ExportRange; label: string }[] = [
  { range: "today", label: "Export Today" },
  { range: "week", label: "Export This Week" },
  { range: "month", label: "Export This Month" },
];

export function ExportDropdown({ onExport, onChangeDefault }: ExportDropdownProps) {
  const { settings } = useAdmin();
  const [open, setOpen] = useState(false);
  const format = settings.settings.defaultExportFormat;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] text-gray-700 transition-all duration-200"
        title={`Default format: ${format.toUpperCase()}`}
      >
        <Download className="w-4 h-4" />
        Export
        <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
          {format}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
              Export as {format.toUpperCase()}
            </div>
            {RANGES.map(({ range, label }) => (
              <button
                key={range}
                onClick={() => {
                  setOpen(false);
                  onExport(range);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#660B05]/10 hover:text-[#660B05] transition-all duration-200"
              >
                {label}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button
                onClick={() => {
                  setOpen(false);
                  onChangeDefault();
                }}
                className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-[#660B05] transition-all duration-200"
              >
                Change default format…
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
