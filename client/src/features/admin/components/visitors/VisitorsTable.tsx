import { Pencil, Trash2 } from "lucide-react";
import type { VisitorRecord } from "../../types";

type VisitorsTableProps = {
  visitors: VisitorRecord[];
  onEdit: (visitor: VisitorRecord) => void;
  onDelete: (visitor: VisitorRecord) => void;
};

const HEADERS = [
  "Full Name",
  "Visitor Type",
  "Destination",
  "Purpose",
  "Time In",
  "Time Out",
  "Actions",
] as const;

export function VisitorsTable({ visitors, onEdit, onDelete }: VisitorsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {HEADERS.map((label, index) => (
              <th
                key={label}
                className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                  index === HEADERS.length - 1 ? "text-right" : "text-left"
                }`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <VisitorRow
              key={v._id}
              visitor={v}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type VisitorRowProps = {
  visitor: VisitorRecord;
  onEdit: (v: VisitorRecord) => void;
  onDelete: (v: VisitorRecord) => void;
};

function VisitorRow({ visitor, onEdit, onDelete }: VisitorRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-[#660B05]/10 transition">
      <td className="px-4 py-3 font-semibold text-gray-900">{visitor.fullName}</td>
      <td className="px-4 py-3 text-gray-700">
        <span className="px-2 py-1 rounded-md bg-gray-100 text-xs font-medium">
          {visitor.visitorType}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-700">{visitor.destination}</td>
      <td className="px-4 py-3 text-gray-700 max-w-[260px]">
        <div className="truncate" title={visitor.purpose}>
          {visitor.purpose}
        </div>
      </td>
      <td className="px-4 py-3 text-gray-600">
        {new Date(visitor.timeIn).toLocaleString()}
      </td>
      <td className="px-4 py-3">
        {visitor.timeOut ? (
          <span className="text-gray-600">
            {new Date(visitor.timeOut).toLocaleString()}
          </span>
        ) : (
          <span className="px-2 py-1 rounded-md bg-[#660B05]/10 text-[#660B05] text-xs font-medium">
            In Progress
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(visitor)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] text-gray-700 text-sm font-medium transition-all duration-200"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(visitor)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-800 text-red-700 text-sm font-medium transition-all duration-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
