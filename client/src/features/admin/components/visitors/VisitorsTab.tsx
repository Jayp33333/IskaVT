import { Plus } from "lucide-react";
import { useState } from "react";

import type { LogbookEntry } from "../../../../services/api";
import { useAdmin } from "../../context/AdminContext";
import type { ExportRange, VisitorRecord } from "../../types";
import { exportVisitors, PopupBlockedError } from "../../utils/exporters";
import { ConfirmDialog } from "../common/ConfirmDialog";
import {
  AdminButton,
  AdminCard,
  AdminCardHeader,
  AdminEmptyState,
  AdminPagination,
  AdminSearchInput,
  PageHeader,
} from "../common/adminUi";
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
      <PageHeader
        description="Manage and view all visitor records and logbook entries."
        actions={
          <>
            <AdminSearchInput
              placeholder="Search visitors..."
              value={visitors.searchQuery}
              onChange={visitors.setSearchQuery}
            />
            <ExportDropdown
              onExport={handleExport}
              onChangeDefault={onChangeExportDefault}
            />
            <AdminButton
              variant="primary"
              onClick={() => {
                setAddError(null);
                setAddOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Visitor
            </AdminButton>
          </>
        }
      />

      <AdminCard padding="none">
        <div className="border-b border-gray-100 p-4 sm:p-5 sm:pb-4">
          <AdminCardHeader
            title="Visitor Records"
            action={
              <AdminPagination
                page={visitors.visitorsPage}
                totalPages={visitors.visitorsTotalPages}
                onPrev={() =>
                  visitors.loadVisitors(Math.max(1, visitors.visitorsPage - 1))
                }
                onNext={() =>
                  visitors.loadVisitors(
                    Math.min(
                      visitors.visitorsTotalPages,
                      visitors.visitorsPage + 1
                    )
                  )
                }
                size="sm"
              />
            }
          />

          {visitors.searchQuery && (
            <div className="rounded-xl bg-[#660B05]/8 px-3 py-2">
              <p className="text-sm text-gray-700">
                Found{" "}
                <span className="font-semibold text-[#660B05]">
                  {visitors.filteredVisitors.length}
                </span>{" "}
                visitor{visitors.filteredVisitors.length !== 1 ? "s" : ""}{" "}
                matching &ldquo;{visitors.searchQuery}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 sm:pt-0">
          {visitors.filteredVisitors.length === 0 ? (
            <AdminEmptyState
              message={
                visitors.searchQuery
                  ? "No visitors found matching your search."
                  : "No visitors logged yet."
              }
            />
          ) : (
            <VisitorsTable
              visitors={visitors.filteredVisitors}
              onEdit={openEditFor}
              onDelete={openDeleteFor}
            />
          )}
        </div>
      </AdminCard>

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
              <div className="mt-1 text-xs text-gray-600">
                {visitorToDelete.visitorType} • {visitorToDelete.destination}
              </div>
              <div className="mt-1 text-xs text-gray-500">
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
