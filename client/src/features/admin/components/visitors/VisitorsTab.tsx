import { Plus, Search, X } from "lucide-react";
import { useState } from "react";

import type { LogbookEntry } from "../../../../services/api";
import { useAdmin } from "../../context/AdminContext";
import type { ExportRange, VisitorRecord } from "../../types";
import { exportVisitors, PopupBlockedError } from "../../utils/exporters";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { AddVisitorModal } from "./AddVisitorModal";
import { EditVisitorModal } from "./EditVisitorModal";
import { ExportDropdown } from "./ExportDropdown";
import { VisitorsTable } from "./VisitorsTable";

type Props = {
  onChangeExportDefault: () => void;
};

export function VisitorsTab({ onChangeExportDefault }: Props) {
  const { visitors, data, settings, toast } = useAdmin();

  const [addOpen, setAddOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<VisitorRecord | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [visitorToDelete, setVisitorToDelete] = useState<VisitorRecord | null>(null);

  const refreshAfterMutation = async () => {
    await Promise.all([
      data.loadDashboard(),
      visitors.loadVisitors(visitors.visitorsPage),
    ]);
  };

  const handleAdd = async (entry: LogbookEntry) => {
    try {
      setAddSaving(true);
      setAddError(null);
      await visitors.createVisitor(entry);
      setAddOpen(false);
      await refreshAfterMutation();
      toast.showToast("Visitor added successfully!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add visitor";
      setAddError(msg);
    } finally {
      setAddSaving(false);
    }
  };

  const handleEdit = async (id: string, patch: Partial<LogbookEntry>) => {
    try {
      setEditSaving(true);
      setEditError(null);
      await visitors.updateVisitor(id, patch);
      setEditOpen(false);
      setEditEntry(null);
      await refreshAfterMutation();
      toast.showToast("Visitor updated successfully!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update visitor";
      setEditError(msg);
      toast.showToast(msg, "error");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!visitorToDelete) return;
    try {
      setDeleteLoading(true);
      await visitors.deleteVisitor(visitorToDelete._id);
      setDeleteOpen(false);
      setVisitorToDelete(null);
      await refreshAfterMutation();
      toast.showToast("Visitor deleted successfully!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete visitor";
      toast.showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async (range: ExportRange) => {
    try {
      const all = await visitors.fetchAllVisitors();
      exportVisitors(all, range, settings.settings.defaultExportFormat);
    } catch (err) {
      if (err instanceof PopupBlockedError) {
        toast.showToast(err.message, "error");
        return;
      }
      const msg = err instanceof Error ? err.message : "Failed to export visitors";
      toast.showToast(msg, "error");
    }
  };

  const openEditFor = (v: VisitorRecord) => {
    setEditEntry(v);
    setEditError(null);
    setEditOpen(true);
  };

  const openDeleteFor = (v: VisitorRecord) => {
    setVisitorToDelete(v);
    setDeleteOpen(true);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Visitors</h1>
            <p className="text-sm text-gray-500">
              Manage and view all visitor records and logbook entries.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              value={visitors.searchQuery}
              onChange={visitors.setSearchQuery}
            />
            <ExportDropdown
              onExport={handleExport}
              onChangeDefault={onChangeExportDefault}
            />
            <button
              onClick={() => {
                setAddError(null);
                setAddOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#660B05] text-white hover:bg-[#8C1007] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Visitor
            </button>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Visitor Records</h2>
          <Pagination
            page={visitors.visitorsPage}
            totalPages={visitors.visitorsTotalPages}
            onPrev={() =>
              visitors.loadVisitors(Math.max(1, visitors.visitorsPage - 1))
            }
            onNext={() =>
              visitors.loadVisitors(
                Math.min(visitors.visitorsTotalPages, visitors.visitorsPage + 1)
              )
            }
          />
        </div>

        {visitors.searchQuery && (
          <div className="mb-4 p-3 bg-[#660B05]/10 rounded-lg">
            <p className="text-sm text-gray-700">
              Found{" "}
              <span className="font-semibold text-[#660B05]">
                {visitors.filteredVisitors.length}
              </span>{" "}
              visitor{visitors.filteredVisitors.length !== 1 ? "s" : ""} matching
              "{visitors.searchQuery}"
            </p>
          </div>
        )}

        {visitors.filteredVisitors.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">
            {visitors.searchQuery
              ? "No visitors found matching your search."
              : "No visitors logged yet."}
          </p>
        ) : (
          <VisitorsTable
            visitors={visitors.filteredVisitors}
            onEdit={openEditFor}
            onDelete={openDeleteFor}
          />
        )}
      </section>

      <AddVisitorModal
        open={addOpen}
        saving={addSaving}
        error={addError}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <EditVisitorModal
        open={editOpen}
        saving={editSaving}
        error={editError}
        entry={editEntry}
        onClose={() => {
          setEditOpen(false);
          setEditEntry(null);
        }}
        onSubmit={handleEdit}
      />

      <ConfirmDialog
        open={deleteOpen && !!visitorToDelete}
        title="Delete Visitor"
        prompt="Are you sure you want to delete this visitor record?"
        confirmLabel={deleteLoading ? "Deleting…" : "Delete Visitor"}
        loading={deleteLoading}
        detail={
          visitorToDelete && (
            <>
              <div className="text-sm font-semibold text-gray-900">
                {visitorToDelete.fullName}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {visitorToDelete.visitorType} • {visitorToDelete.destination}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {visitorToDelete.timeIn
                  ? new Date(visitorToDelete.timeIn).toLocaleString()
                  : "No time in"}
              </div>
            </>
          )
        }
        onCancel={() => {
          setDeleteOpen(false);
          setVisitorToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}

type SearchInputProps = {
  value: string;
  onChange: (next: string) => void;
};

function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search visitors..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05] min-w-[250px]"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#660B05]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Prev
      </button>
      <span className="text-sm text-gray-600 px-3">
        Page {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
      </button>
    </div>
  );
}
