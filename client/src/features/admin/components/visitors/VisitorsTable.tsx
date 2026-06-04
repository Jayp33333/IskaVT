import { Pencil, Trash2 } from "lucide-react";
import type { VisitorRecord } from "../../types";
import { AdminButton } from "../common/adminUi";

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
    <>
      <div className="space-y-3 md:hidden">
        {visitors.map((v) => (
          <VisitorCard
            key={v._id}
            visitor={v}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="-mx-1 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              {HEADERS.map((label, index) => (
                <th
                  key={label}
                  className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500 ${
                    index === HEADERS.length - 1 ? "text-right" : ""
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
    </>
  );
}

type VisitorCardProps = {
  visitor: VisitorRecord;
  onEdit: (v: VisitorRecord) => void;
  onDelete: (v: VisitorRecord) => void;
};

function VisitorCard({ visitor, onEdit, onDelete }: VisitorCardProps) {
  return (
    <article className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">{visitor.fullName}</h3>
          <span className="mt-1 inline-block rounded-lg bg-white px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
            {visitor.visitorType}
          </span>
        </div>
        {!visitor.timeOut && (
          <span className="shrink-0 rounded-full bg-[#660B05]/10 px-2 py-1 text-[10px] font-bold uppercase text-[#660B05]">
            Active
          </span>
        )}
      </div>

      <dl className="mb-4 space-y-2 text-xs">
        <div>
          <dt className="font-semibold text-gray-500">Destination</dt>
          <dd className="text-gray-800">{visitor.destination}</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-500">Purpose</dt>
          <dd className="line-clamp-2 text-gray-800">{visitor.purpose}</dd>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <dt className="font-semibold text-gray-500">Time in</dt>
            <dd className="text-gray-800">
              {new Date(visitor.timeIn).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-500">Time out</dt>
            <dd className="text-gray-800">
              {visitor.timeOut
                ? new Date(visitor.timeOut).toLocaleString()
                : "—"}
            </dd>
          </div>
        </div>
      </dl>

      <div className="flex gap-2">
        <AdminButton
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(visitor)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </AdminButton>
        <AdminButton
          variant="danger"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(visitor)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </AdminButton>
      </div>
    </article>
  );
}

type VisitorRowProps = {
  visitor: VisitorRecord;
  onEdit: (v: VisitorRecord) => void;
  onDelete: (v: VisitorRecord) => void;
};

function VisitorRow({ visitor, onEdit, onDelete }: VisitorRowProps) {
  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-[#660B05]/5">
      <td className="px-4 py-3 font-semibold text-gray-900">{visitor.fullName}</td>
      <td className="px-4 py-3 text-gray-700">
        <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium">
          {visitor.visitorType}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-700">{visitor.destination}</td>
      <td className="max-w-[260px] px-4 py-3 text-gray-700">
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
          <span className="rounded-full bg-[#660B05]/10 px-2 py-1 text-xs font-semibold text-[#660B05]">
            In Progress
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <AdminButton variant="secondary" size="sm" onClick={() => onEdit(visitor)}>
            <Pencil className="h-4 w-4" />
            Edit
          </AdminButton>
          <AdminButton variant="danger" size="sm" onClick={() => onDelete(visitor)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </AdminButton>
        </div>
      </td>
    </tr>
  );
}
