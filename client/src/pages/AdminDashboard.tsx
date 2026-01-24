import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  logbookAPI,
  type LogbookRecord,
  type LogbookStatsSummary,
  type LogbookEntry,
} from "../services/api";
import {
  Bell,
  ChevronDown,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  Pencil,
  Search,
  Settings,
  Trash2,
  Users,
  X,
  Plus,
  Download,
  ArrowUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type AdminTab = "dashboard" | "visitors";

const visitorTypes = ["Student", "Faculty", "Staff", "Parent", "Visitor", "Alumni", "Other"];
const destinations = [
  "Grandstand",
  "Lab 1",
  "Lab 2",
  "Lab 3",
  "Library",
  "Administration Building",
  "Classroom Building",
  "Cafeteria",
  "Gymnasium",
  "Auditorium",
  "Computer Lab",
  "Science Lab",
  "Main Building",
  "Student Center",
  "Other",
];

// Vibrant color palette for charts
const CHART_COLORS = [
  "#FFC107", // Yellow
  "#F44336", // Red
  "#FF9800", // Orange
  "#2196F3", // Blue
  "#4CAF50", // Green
  "#9C27B0", // Purple
  "#009688", // Teal
  "#E91E63", // Pink
  "#00BCD4", // Cyan
  "#FF5722", // Deep Orange
  "#3F51B5", // Indigo
  "#8BC34A", // Light Green
  "#FFEB3B", // Bright Yellow
  "#795548", // Brown
  "#607D8B", // Blue Grey
];

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("dashboard");

  const [stats, setStats] = useState<LogbookStatsSummary | null>(null);
  const [latestEntries, setLatestEntries] = useState<LogbookRecord[]>([]);

  const [visitors, setVisitors] = useState<LogbookRecord[]>([]);
  const [visitorsPage, setVisitorsPage] = useState(1);
  const [visitorsTotalPages, setVisitorsTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<LogbookRecord | null>(null);
  const [editForm, setEditForm] = useState<Partial<LogbookEntry>>({});

  const [addOpen, setAddOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState<Partial<LogbookEntry>>({
    fullName: "",
    visitorType: "",
    destination: "",
    purpose: "",
    date: new Date().toISOString().split("T")[0],
    timeIn: new Date().toISOString(),
  });
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [, setAllVisitors] = useState<LogbookRecord[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [visitorToDelete, setVisitorToDelete] = useState<LogbookRecord | null>(null);
  const [visitorPeriod, setVisitorPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

  // Helper function to aggregate timeline data by period
  const aggregateTimelineData = (
    timeline: { date: string; count: number }[],
    period: "daily" | "weekly" | "monthly" | "yearly"
  ): { date: string; count: number; label: string }[] => {
    if (timeline.length === 0) return [];

    if (period === "daily") {
      return timeline.slice(-7).map((item) => ({
        ...item,
        label: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
      }));
    }

    if (period === "weekly") {
      const weeklyMap = new Map<string, { count: number; startDate: string; weekNum: number }>();
      
      timeline.forEach((item) => {
        const date = new Date(item.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        const weekKey = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
        
        if (!weeklyMap.has(weekKey)) {
          // Calculate week number within the year
          const yearStart = new Date(date.getFullYear(), 0, 1);
          const daysSinceYearStart = Math.floor((date.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
          const weekNum = Math.ceil((daysSinceYearStart + yearStart.getDay() + 1) / 7);
          
          weeklyMap.set(weekKey, { 
            count: 0, 
            startDate: weekKey,
            weekNum: weekNum
          });
        }
        const weekData = weeklyMap.get(weekKey)!;
        weekData.count += item.count;
      });

      return Array.from(weeklyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([_, data]) => {
          const weekStartDate = new Date(data.startDate);
          const weekEndDate = new Date(weekStartDate);
          weekEndDate.setDate(weekStartDate.getDate() + 6);
          return {
            date: data.startDate,
            count: data.count,
            label: `${weekStartDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEndDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          };
        });
    }

    if (period === "monthly") {
      const monthlyMap = new Map<string, number>();
      
      timeline.forEach((item) => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + item.count);
      });

      return Array.from(monthlyMap.entries())
        .slice(-12)
        .map(([key, count]) => ({
          date: `${key}-01`,
          count,
          label: new Date(`${key}-01`).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        }));
    }

    if (period === "yearly") {
      const yearlyMap = new Map<number, number>();
      
      timeline.forEach((item) => {
        const year = new Date(item.date).getFullYear();
        yearlyMap.set(year, (yearlyMap.get(year) || 0) + item.count);
      });

      return Array.from(yearlyMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([year, count]) => ({
          date: `${year}-01-01`,
          count,
          label: year.toString(),
        }));
    }

    return [];
  };

  const loadDashboard = async () => {
    const [statsRes, entriesRes] = await Promise.all([
      logbookAPI.getStatsSummary(),
      logbookAPI.getEntries(1, 10),
    ]);
    setStats(statsRes.data);
    setLatestEntries(entriesRes.data || []);
  };

  const loadVisitors = async (page: number) => {
    const res = await logbookAPI.getEntries(page, 200);
    setVisitors(res.data || []);
    setAllVisitors(res.data || []);
    setVisitorsPage(res.pagination?.page || page);
    setVisitorsTotalPages(res.pagination?.pages || 1);
  };

  // Filter visitors based on search query
  const filteredVisitors = useMemo(() => {
    if (!searchQuery.trim()) return visitors;
    const query = searchQuery.toLowerCase();
    return visitors.filter(
      (v) =>
        v.fullName.toLowerCase().includes(query) ||
        v.visitorType.toLowerCase().includes(query) ||
        v.destination.toLowerCase().includes(query) ||
        v.purpose.toLowerCase().includes(query)
    );
  }, [visitors, searchQuery]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([loadDashboard(), loadVisitors(1)]);
      } catch (err: any) {
        setError(err?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab !== "visitors") return;
    loadVisitors(visitorsPage).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const sidebarItems = useMemo(
    () => [
      { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
      { id: "visitors" as const, label: "Visitors", icon: Users },
    ],
    []
  );

  const handleLogout = () => {
    navigate("/");
  };

  const openAdd = () => {
    setAddError(null);
    setAddForm({
      fullName: "",
      visitorType: "",
      destination: "",
      purpose: "",
      date: new Date().toISOString().split("T")[0],
      timeIn: new Date().toISOString(),
    });
    setAddOpen(true);
  };

  const saveAdd = async () => {
    try {
      setAddSaving(true);
      setAddError(null);

      if (!addForm.fullName?.trim() || !addForm.visitorType?.trim() || !addForm.destination?.trim() || !addForm.purpose?.trim()) {
        setAddError("Please fill in all required fields");
        return;
      }

      const entry: LogbookEntry = {
        fullName: addForm.fullName.trim(),
        visitorType: addForm.visitorType.trim(),
        destination: addForm.destination.trim(),
        purpose: addForm.purpose.trim(),
        date: addForm.date || new Date().toISOString().split("T")[0],
        timeIn: addForm.timeIn || new Date().toISOString(),
        timeOut: addForm.timeOut || undefined,
      };

      await logbookAPI.createEntry(entry);
      setAddOpen(false);
      setAddForm({
        fullName: "",
        visitorType: "",
        destination: "",
        purpose: "",
        date: new Date().toISOString().split("T")[0],
        timeIn: new Date().toISOString(),
      });
      await Promise.all([loadDashboard(), loadVisitors(visitorsPage)]);
    } catch (err: any) {
      setAddError(err?.message || "Failed to add visitor");
    } finally {
      setAddSaving(false);
    }
  };

  const openEdit = (e: LogbookRecord) => {
    setEditEntry(e);
    setEditError(null);
    setEditForm({
      fullName: e.fullName,
      visitorType: e.visitorType,
      destination: e.destination,
      purpose: e.purpose,
      date: e.date,
      timeIn: e.timeIn,
      timeOut: e.timeOut ?? "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editEntry) return;
    try {
      setEditSaving(true);
      setEditError(null);

      // Normalize datetime-local strings if user edited them
      const patch: Partial<LogbookEntry> = {
        fullName: editForm.fullName?.trim(),
        visitorType: editForm.visitorType?.trim(),
        destination: editForm.destination?.trim(),
        purpose: editForm.purpose?.trim(),
      };

      // Optional ISO fields
      if (editForm.date !== undefined) patch.date = editForm.date;
      if (editForm.timeIn !== undefined) patch.timeIn = editForm.timeIn;
      if (editForm.timeOut !== undefined) patch.timeOut = editForm.timeOut;

      await logbookAPI.updateEntry(editEntry._id, patch);
      setEditOpen(false);
      setEditEntry(null);
      setToast({ message: "Visitor updated successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
      await Promise.all([loadDashboard(), loadVisitors(visitorsPage)]);
    } catch (err: any) {
      setEditError(err?.message || "Failed to update visitor");
      setToast({ message: err?.message || "Failed to update visitor", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setEditSaving(false);
    }
  };

  const openDeleteConfirm = (e: LogbookRecord) => {
    setVisitorToDelete(e);
    setDeleteConfirmOpen(true);
  };

  const deleteEntry = async () => {
    if (!visitorToDelete) return;
    try {
      setLoading(true);
      await logbookAPI.deleteEntry(visitorToDelete._id);
      setDeleteConfirmOpen(false);
      setVisitorToDelete(null);
      setToast({ message: "Visitor deleted successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
      await Promise.all([loadDashboard(), loadVisitors(Math.max(1, visitorsPage))]);
    } catch (err: any) {
      setError(err?.message || "Failed to delete visitor");
      setToast({ message: err?.message || "Failed to delete visitor", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEntries = async (): Promise<LogbookRecord[]> => {
    const all: LogbookRecord[] = [];
    let page = 1;
    // Fetch pages of 200 until we reach the last page
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const res = await logbookAPI.getEntries(page, 200);
      all.push(...(res.data || []));
      const pages = res.pagination?.pages || 1;
      if (page >= pages) break;
      page += 1;
    }
    return all;
  };

  const exportVisitorsPdf = async (range: "today" | "week" | "month") => {
    try {
      setLoading(true);
      const all = await fetchAllEntries();
      const now = new Date();

      let start: Date;
      if (range === "today") {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
      } else if (range === "week") {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
        const day = start.getDay();
        const diffToMonday = (day + 6) % 7;
        start.setDate(start.getDate() - diffToMonday);
      } else {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const filtered = all.filter((v) => {
        const t = new Date(v.timeIn);
        return t >= start && t <= now;
      });

      const title =
        range === "today"
          ? "Visitor Records - Today"
          : range === "week"
          ? "Visitor Records - This Week"
          : "Visitor Records - This Month";

      const win = window.open("", "_blank");
      if (!win) {
        alert("Popup blocked. Please allow popups to export PDF.");
        return;
      }

      const style = `
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 12px; padding: 16px; }
        h1 { font-size: 18px; margin-bottom: 8px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 4px 6px; text-align: left; }
        th { background: #f3f3f3; }
        .meta { font-size: 11px; color: #555; margin-bottom: 12px; }
      `;

      win.document.write("<html><head><title>" + title + "</title>");
      win.document.write("<style>" + style + "</style>");
      win.document.write("</head><body>");
      win.document.write("<h1>" + title + "</h1>");
      win.document.write(
        `<div class="meta">Generated: ${now.toLocaleString()} &mdash; Total records: ${filtered.length}</div>`
      );

      win.document.write("<table><thead><tr>");
      ["Full Name", "Visitor Type", "Destination", "Purpose", "Date", "Time In", "Time Out"].forEach(
        (h) => win.document!.write("<th>" + h + "</th>")
      );
      win.document.write("</tr></thead><tbody>");

      filtered.forEach((v) => {
        win.document!.write("<tr>");
        win.document!.write("<td>" + (v.fullName || "") + "</td>");
        win.document!.write("<td>" + (v.visitorType || "") + "</td>");
        win.document!.write("<td>" + (v.destination || "") + "</td>");
        win.document!.write("<td>" + (v.purpose || "") + "</td>");
        win.document!.write(
          "<td>" + (v.date ? new Date(v.date).toLocaleDateString() : "") + "</td>"
        );
        win.document!.write(
          "<td>" +
            (v.timeIn
              ? new Date(v.timeIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "") +
            "</td>"
        );
        win.document!.write(
          "<td>" +
            (v.timeOut
              ? new Date(v.timeOut).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "In Progress") +
            "</td>"
        );
        win.document!.write("</tr>");
      });

      win.document.write("</tbody></table>");
      win.document.write("</body></html>");
      win.document.close();
      win.focus();
      win.print();
    } catch (err: any) {
      alert(err?.message || "Failed to export visitors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[260px] hidden md:flex flex-col border-r border-gray-200 bg-white fixed left-0 top-0 h-screen overflow-y-auto">
          {/* Logo */}
          <div className="px-5 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#660B05] flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">ISKA</div>
                <div className="text-[11px] text-gray-500">Visitor Monitor</div>
              </div>
            </div>
          </div>

          {/* MENU Section */}
          <div className="px-3 py-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              MENU
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      active
                        ? "bg-[#660B05] text-white shadow-sm"
                        : "hover:bg-[#660B05]/10 hover:text-[#660B05] text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 md:ml-[260px]">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="px-6 py-4 flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-6 flex-1">
                <div className="md:hidden">
                  <div className="w-8 h-8 rounded-full bg-[#660B05] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Right side icons and user */}
              <div className="flex items-center gap-4">
                {/* Email Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setEmailOpen(!emailOpen);
                      setNotificationsOpen(false);
                      setAccountDropdownOpen(false);
                    }}
                    className="relative p-2 hover:bg-[#660B05]/10 rounded-lg transition-all duration-200 group"
                  >
                    <Mail className="w-5 h-5 text-gray-600 group-hover:text-[#660B05] transition-colors" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#660B05] rounded-full"></span>
                  </button>
                  {emailOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setEmailOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
                        </div>
                        <div className="p-2">
                          <div className="p-3 hover:bg-[#660B05]/10 rounded-lg cursor-pointer transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#660B05] flex items-center justify-center text-white text-xs font-semibold">
                                S
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900">New Visitor Alert</div>
                                <div className="text-xs text-gray-500 truncate">
                                  A new visitor has been registered in the system
                                </div>
                                <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 hover:bg-[#660B05]/10 rounded-lg cursor-pointer transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                                S
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900">Weekly Report Ready</div>
                                <div className="text-xs text-gray-500 truncate">
                                  Your weekly visitor report is now available
                                </div>
                                <div className="text-xs text-gray-400 mt-1">1 day ago</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 hover:bg-[#660B05]/10 rounded-lg cursor-pointer transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                                S
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900">System Update</div>
                                <div className="text-xs text-gray-500 truncate">
                                  The admin dashboard has been updated with new features
                                </div>
                                <div className="text-xs text-gray-400 mt-1">3 days ago</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border-t border-gray-200">
                          <button className="w-full text-center text-sm text-[#660B05] hover:underline">
                            View All Messages
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Notifications Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setEmailOpen(false);
                      setAccountDropdownOpen(false);
                    }}
                    className="relative p-2 hover:bg-[#660B05]/10 rounded-lg transition-all duration-200 group"
                  >
                    <Bell className="w-5 h-5 text-gray-600 group-hover:text-[#660B05] transition-colors" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#660B05] rounded-full"></span>
                  </button>
                  {notificationsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="p-2">
                          <div className="p-3 hover:bg-[#660B05]/10 rounded-lg cursor-pointer transition-colors border-l-2 border-[#660B05]">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#660B05]/10 flex items-center justify-center">
                                <Users className="w-4 h-4 text-[#660B05]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900">5 New Visitors Today</div>
                                <div className="text-xs text-gray-500">
                                  You have 5 new visitor entries today
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Just now</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 hover:bg-[#660B05]/10 rounded-lg cursor-pointer transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900">Report Generated</div>
                                <div className="text-xs text-gray-500">
                                  Monthly report has been generated successfully
                                </div>
                                <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-3 hover:bg-[#660B05]/10 rounded-lg cursor-pointer transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Bell className="w-4 h-4 text-yellow-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900">Reminder</div>
                                <div className="text-xs text-gray-500">
                                  Don't forget to review visitor logs
                                </div>
                                <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border-t border-gray-200">
                          <button className="w-full text-center text-sm text-[#660B05] hover:underline">
                            Mark All as Read
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Account Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setAccountDropdownOpen(!accountDropdownOpen);
                      setEmailOpen(false);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#660B05] flex items-center justify-center text-white text-sm font-semibold">
                      A
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-semibold text-gray-900">Admin</div>
                      <div className="text-xs text-gray-500">admin@iska.edu</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                  </button>
                  {accountDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAccountDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#660B05] flex items-center justify-center text-white text-sm font-semibold">
                              A
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">Admin User</div>
                              <div className="text-xs text-gray-500">admin@iska.edu</div>
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSettingsOpen(true);
                              setAccountDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#660B05]/10 hover:text-[#660B05] transition-all duration-200 flex items-center gap-2"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </button>
                          <button
                            onClick={() => {
                              setHelpOpen(true);
                              setAccountDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#660B05]/10 hover:text-[#660B05] transition-all duration-200 flex items-center gap-2"
                          >
                            <HelpCircle className="w-4 h-4" />
                            Help & Support
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="px-6 py-6">
            {loading && (
              <div className="w-full flex justify-center py-10 text-gray-500 text-sm">
                Loading…
              </div>
            )}

            {error && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!loading && !error && tab === "dashboard" && stats && (
              <>
                {/* Dashboard Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
                  <p className="text-sm text-gray-500">
                    Monitor, analyze, and manage visitor data with comprehensive insights.
                  </p>
                </div>

                {/* Summary cards - Donezo style */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Total Visitors - Large maroon card */}
                  <div className="bg-[#660B05] rounded-xl shadow-sm p-6 flex flex-col gap-3 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/80 uppercase tracking-wide">
                        Total Visitors
                      </span>
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <ArrowUp className="w-3 h-3" />
                        <span>Increased</span>
                      </div>
                    </div>
                    <div className="text-4xl font-bold">{stats.monthCount}</div>
                    <p className="text-xs text-white/70">Total visitors this month</p>
                  </div>

                  {/* Today */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Today
                      </span>
                      <div className="flex items-center gap-1 text-xs text-[#660B05]">
                        <ArrowUp className="w-3 h-3" />
                        <span>Increased</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.todayCount}</div>
                    <p className="text-xs text-gray-500">Visitors logged in today</p>
                  </div>

                  {/* This Week */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        This Week
                      </span>
                      <div className="flex items-center gap-1 text-xs text-[#660B05]">
                        <ArrowUp className="w-3 h-3" />
                        <span>Increased</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.weekCount}</div>
                    <p className="text-xs text-gray-500">Visitors from Monday until today</p>
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Active Sessions
                      </span>
                      <div className="text-xs text-gray-500">In Progress</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {latestEntries.filter((e) => !e.timeOut).length}
                    </div>
                    <p className="text-xs text-gray-500">Currently active visitors</p>
                  </div>
                </section>

                {/* Charts: Visitors Bar Chart with Period Dropdown */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  {/* Visitors Bar Chart - Large */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">
                          {visitorPeriod === "daily"
                            ? "Daily Visitors"
                            : visitorPeriod === "weekly"
                            ? "Weekly Visitors"
                            : visitorPeriod === "monthly"
                            ? "Monthly Visitors"
                            : "Yearly Visitors"}
                        </h2>
                        <span className="text-xs text-gray-500">
                          {visitorPeriod === "daily"
                            ? "Last 7 days"
                            : visitorPeriod === "weekly"
                            ? "Last 12 weeks"
                            : visitorPeriod === "monthly"
                            ? "Last 12 months"
                            : "All years"}
                        </span>
                      </div>
                      <div className="relative">
                        <select
                          value={visitorPeriod}
                          onChange={(e) => setVisitorPeriod(e.target.value as "daily" | "weekly" | "monthly" | "yearly")}
                          className="px-4 py-2 rounded-lg text-sm font-medium border-2 border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:border-[#660B05] hover:text-[#660B05] focus:outline-none focus:ring-0 focus:border-[#660B05] appearance-none pr-8 cursor-pointer"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                      </div>
                    </div>

                    {stats.visitsTimeline.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        No data available for {visitorPeriod === "daily" ? "the last 7 days" : visitorPeriod === "weekly" ? "the last 12 weeks" : visitorPeriod === "monthly" ? "the last 12 months" : "any year"}.
                      </p>
                    ) : (
                      (() => {
                        const chartData = aggregateTimelineData(stats.visitsTimeline, visitorPeriod);
                        return chartData.length === 0 ? (
                          <p className="text-sm text-gray-400">No data available for the selected period.</p>
                        ) : (
                          <ResponsiveContainer width="100%" height={450}>
                            <BarChart
                              data={chartData}
                              margin={{ top: 10, right: 15, left: 5, bottom: visitorPeriod === "monthly" || visitorPeriod === "yearly" ? 60 : 10 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis
                                dataKey="label"
                                stroke="#666"
                                fontSize={11} 
                                tick={{ fill: "#666" }}
                                angle={visitorPeriod === "monthly" || visitorPeriod === "yearly" ? -45 : 0}
                                textAnchor={visitorPeriod === "monthly" || visitorPeriod === "yearly" ? "end" : "middle"}
                                height={visitorPeriod === "monthly" || visitorPeriod === "yearly" ? 60 : undefined}
                              />
                              <YAxis stroke="#666" fontSize={11} tick={{ fill: "#666" }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "white",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                }}
                                cursor={{ fill: "rgba(102, 11, 5, 0.1)" }}
                                formatter={(value: any) => [`${value ?? 0} visits`, "Count"]}
                                labelFormatter={(label) => {
                                  if (visitorPeriod === "daily") {
                                    return new Date(chartData.find((d) => d.label === label)?.date || "").toLocaleDateString("en-US", {
                                      weekday: "long",
                                      month: "short",
                                      day: "numeric",
                                    });
                                  }
                                  return label;
                                }}
                              />
                              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#660B05">
                                {chartData.map((entry, index) => {
                                  const isActive = entry.count > 0;
                                  return (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={isActive ? "#660B05" : "#e5e7eb"}
                                      stroke={isActive ? "#8C1007" : "#d1d5db"}
                                      strokeWidth={isActive ? 0 : 1}
                                      strokeDasharray={isActive ? "0" : "4 4"}
                                    />
                                  );
                                })}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        );
                      })()
                    )}
                  </div>

                  {/* Visitor Type Pie Chart */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Visitor Types</h2>
                    {stats.visitsByVisitorType && stats.visitsByVisitorType.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                          <Pie
                            data={stats.visitsByVisitorType}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={140}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="visitorType"
                            label={(entry: any) => {
                              const visitorTypes = stats.visitsByVisitorType || [];
                              const total = visitorTypes.reduce((sum: number, v: any) => sum + v.count, 0);
                              const percent = total > 0 ? ((entry.count / total) * 100) : 0;
                              
                              // Calculate position in the middle of the slice
                              const RADIAN = Math.PI / 180;
                              const midAngle = (entry.startAngle + entry.endAngle) / 2;
                              const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5;
                              const x = entry.cx + radius * Math.cos(-midAngle * RADIAN);
                              const y = entry.cy + radius * Math.sin(-midAngle * RADIAN);
                              
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fill="#333"
                                  fontSize="8"
                                  fontWeight="500"
                                >
                                  <tspan x={x} dy="-5" fontSize="8">{entry.visitorType}</tspan>
                                  <tspan x={x} dy="9" fontSize="8" fill="#660B05">{percent.toFixed(1)}%</tspan>
                                </text>
                              );
                            }}
                            labelLine={false}
                          >
                            {(stats.visitsByVisitorType || []).map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={index === 0 ? "#660B05" : CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              fontSize: "12px",
                              padding: "8px 12px",
                            }}
                            formatter={(value: any, name: any) => {
                              const visitorTypes = stats.visitsByVisitorType || [];
                              const total = visitorTypes.reduce((sum: number, v: any) => sum + v.count, 0);
                              const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                              return [`${name}: ${percent}%`, "Visitor Type"];
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-gray-400">No visitor type data yet.</p>
                    )}
                  </div>
                </section>

                {/* Latest Visitors List - Donezo style */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  {/* Latest Visitors */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-semibold text-gray-900">Latest Visitors</h2>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#660B05] hover:bg-[#660B05]/10 rounded-lg transition-all duration-200 hover:shadow-sm">
                        <Plus className="w-4 h-4" />
                        New
                      </button>
                    </div>

                    {latestEntries.length === 0 ? (
                      <p className="text-sm text-gray-400">No visitors logged yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {latestEntries.slice(0, 5).map((e, index) => {
                          const colors = ["#2196F3", "#4CAF50", "#FFC107", "#FF9800", "#9C27B0"];
                          return (
                            <div
                              key={e._id}
                              className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#660B05]/5 transition-all duration-200 cursor-pointer"
                            >
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                                style={{ backgroundColor: colors[index % colors.length] }}
                              >
                                {e.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 truncate">{e.fullName}</div>
                                <div className="text-xs text-gray-500 truncate">{e.destination}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-medium text-gray-900">
                                  {e.timeIn
                                    ? new Date(e.timeIn).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "-"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {e.timeIn
                                    ? new Date(e.timeIn).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "-"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Most Visited Destinations */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Top Destinations</h2>
                    {stats.visitsPerDestination.length === 0 ? (
                      <p className="text-sm text-gray-400">No visitor data yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {stats.visitsPerDestination.slice(0, 8).map((d, index) => (
                          <div key={d.destination} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#660B05]/5 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0 
                                  ? "bg-[#660B05] text-white" 
                                  : index === 1 
                                  ? "bg-gray-400 text-white" 
                                  : index === 2 
                                  ? "bg-amber-600 text-white" 
                                  : "bg-gray-200 text-gray-700"
                              }`}>
                                {index + 1}
                              </div>
                              <span className="text-sm font-medium text-gray-700 truncate">{d.destination}</span>
                            </div>
                            <span className="text-sm font-semibold text-[#660B05]">{d.count} visits</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

              </>
            )}

            {!loading && !error && tab === "visitors" && (
              <>
                {/* Visitors Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">Visitors</h1>
                      <p className="text-sm text-gray-500">
                        Manage and view all visitor records and logbook entries.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search visitors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05] min-w-[250px]"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#660B05]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {/* Export Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] text-gray-700 transition-all duration-200"
                        >
                          <Download className="w-4 h-4" />
                          Export
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {exportDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setExportDropdownOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  exportVisitorsPdf("today");
                                  setExportDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#660B05]/10 hover:text-[#660B05] transition-all duration-200"
                              >
                                Export Today
                              </button>
                              <button
                                onClick={() => {
                                  exportVisitorsPdf("week");
                                  setExportDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#660B05]/10 hover:text-[#660B05] transition-all duration-200"
                              >
                                Export This Week
                              </button>
                              <button
                                onClick={() => {
                                  exportVisitorsPdf("month");
                                  setExportDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#660B05]/10 hover:text-[#660B05] transition-all duration-200"
                              >
                                Export This Month
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#660B05] text-white hover:bg-[#8C1007] transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        Add Visitor
                      </button>
                    </div>
                  </div>
                </div>

                {/* Visitors Table */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900">Visitor Records</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => loadVisitors(Math.max(1, visitorsPage - 1))}
                        disabled={visitorsPage <= 1}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Prev
                      </button>
                      <span className="text-sm text-gray-600 px-3">
                        Page {visitorsPage} / {visitorsTotalPages}
                      </span>
                      <button
                        onClick={() => loadVisitors(Math.min(visitorsTotalPages, visitorsPage + 1))}
                        disabled={visitorsPage >= visitorsTotalPages}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  {searchQuery && (
                    <div className="mb-4 p-3 bg-[#660B05]/10 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Found <span className="font-semibold text-[#660B05]">{filteredVisitors.length}</span> visitor{filteredVisitors.length !== 1 ? "s" : ""} matching "{searchQuery}"
                      </p>
                    </div>
                  )}
                  {filteredVisitors.length === 0 ? (
                    <p className="text-sm text-gray-400 py-8 text-center">
                      {searchQuery ? "No visitors found matching your search." : "No visitors logged yet."}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Full Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Visitor Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Destination
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Purpose
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Time In
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Time Out
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVisitors.map((v) => (
                            <tr key={v._id} className="border-b border-gray-100 hover:bg-[#660B05]/10 transition">
                              <td className="px-4 py-3 font-semibold text-gray-900">{v.fullName}</td>
                              <td className="px-4 py-3 text-gray-700">
                                <span className="px-2 py-1 rounded-md bg-gray-100 text-xs font-medium">
                                  {v.visitorType}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-700">{v.destination}</td>
                              <td className="px-4 py-3 text-gray-700 max-w-[260px]">
                                <div className="truncate" title={v.purpose}>
                                  {v.purpose}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {new Date(v.timeIn).toLocaleString()}
                              </td>
                              <td className="px-4 py-3">
                                {v.timeOut ? (
                                  <span className="text-gray-600">{new Date(v.timeOut).toLocaleString()}</span>
                                ) : (
                                  <span className="px-2 py-1 rounded-md bg-[#660B05]/10 text-[#660B05] text-xs font-medium">
                                    In Progress
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEdit(v)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] text-gray-700 text-sm font-medium transition-all duration-200"
                                    title="Edit"
                                  >
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => openDeleteConfirm(v)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-800 text-red-700 text-sm font-medium transition-all duration-200"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Edit modal */}
      {editOpen && editEntry && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !editSaving && setEditOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#660B05]" />
                <div>
                  <div className="text-sm font-bold text-gray-800">Edit Visitor</div>
                  <div className="text-[11px] text-gray-500">Update fields then save</div>
                </div>
              </div>
              <button
                onClick={() => !editSaving && setEditOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-[#660B05]/10 flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    value={editForm.fullName || ""}
                    onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Visitor Type</label>
                  <select
                    value={editForm.visitorType || ""}
                    onChange={(e) => setEditForm((p) => ({ ...p, visitorType: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  >
                    <option value="">Select</option>
                    {visitorTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Destination</label>
                  <select
                    value={editForm.destination || ""}
                    onChange={(e) => setEditForm((p) => ({ ...p, destination: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  >
                    <option value="">Select</option>
                    {destinations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time Out</label>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(editForm.timeOut as any)}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        timeOut: e.target.value ? new Date(e.target.value).toISOString() : "",
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  />
                  <div className="text-[11px] text-gray-500 mt-1">Leave blank for In Progress</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Purpose</label>
                <textarea
                  value={editForm.purpose || ""}
                  onChange={(e) => setEditForm((p) => ({ ...p, purpose: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time In</label>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(editForm.timeIn as any)}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        timeIn: e.target.value ? new Date(e.target.value).toISOString() : p.timeIn,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editForm.date ? new Date(editForm.date).toISOString().slice(0, 10) : ""}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        date: e.target.value ? new Date(e.target.value).toISOString() : p.date,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
              <button
                onClick={() => setEditOpen(false)}
                disabled={editSaving}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={editSaving}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#660B05] text-white hover:bg-[#8C1007] disabled:opacity-50"
              >
                {editSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Visitor modal */}
      {addOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !addSaving && setAddOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#660B05]" />
                <div>
                  <div className="text-sm font-bold text-gray-800">Add New Visitor</div>
                  <div className="text-[11px] text-gray-500">Fill in all required fields</div>
                </div>
              </div>
              <button
                onClick={() => !addSaving && setAddOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-[#660B05]/10 flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {addError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {addError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={addForm.fullName || ""}
                    onChange={(e) => setAddForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Visitor Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.visitorType || ""}
                    onChange={(e) => setAddForm((p) => ({ ...p, visitorType: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  >
                    <option value="">Select visitor type</option>
                    {visitorTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addForm.destination || ""}
                    onChange={(e) => setAddForm((p) => ({ ...p, destination: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  >
                    <option value="">Select destination</option>
                    {destinations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={addForm.date ? new Date(addForm.date).toISOString().slice(0, 10) : ""}
                    onChange={(e) =>
                      setAddForm((p) => ({
                        ...p,
                        date: e.target.value ? new Date(e.target.value).toISOString().split("T")[0] : p.date,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={addForm.purpose || ""}
                  onChange={(e) => setAddForm((p) => ({ ...p, purpose: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  placeholder="Enter purpose of visit"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time In</label>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(addForm.timeIn as any)}
                    onChange={(e) =>
                      setAddForm((p) => ({
                        ...p,
                        timeIn: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString(),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time Out (Optional)</label>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(addForm.timeOut as any)}
                    onChange={(e) =>
                      setAddForm((p) => ({
                        ...p,
                        timeOut: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]"
                  />
                  <div className="text-[11px] text-gray-500 mt-1">Leave blank for active session</div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
              <button
                onClick={() => setAddOpen(false)}
                disabled={addSaving}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveAdd}
                disabled={addSaving}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#660B05] text-white hover:bg-[#8C1007] disabled:opacity-50"
              >
                {addSaving ? "Adding…" : "Add Visitor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#660B05]" />
                <div>
                  <div className="text-sm font-bold text-gray-800">Settings</div>
                  <div className="text-[11px] text-gray-500">Configure your admin preferences</div>
                </div>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-[#660B05]/10 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Email Notifications</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Receive email notifications for new visitors</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#660B05]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#660B05]"></div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Auto-refresh Interval</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]">
                  <option>Every 5 minutes</option>
                  <option>Every 10 minutes</option>
                  <option>Every 30 minutes</option>
                  <option>Never</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Default Export Format</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/20 focus:border-[#660B05]">
                  <option>PDF</option>
                  <option>CSV</option>
                  <option>Excel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-3 border-2 border-[#660B05] rounded-lg bg-[#660B05]/10">
                    <div className="text-xs font-medium text-[#660B05]">Maroon</div>
                  </button>
                  <button className="p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="text-xs font-medium text-gray-600">Light</div>
                  </button>
                  <button className="p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="text-xs font-medium text-gray-600">Dark</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Settings saved successfully!");
                  setSettingsOpen(false);
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#660B05] text-white hover:bg-[#8C1007] transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setHelpOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#660B05]" />
                <div>
                  <div className="text-sm font-bold text-gray-800">Help & Support</div>
                  <div className="text-[11px] text-gray-500">Get help with using the admin dashboard</div>
                </div>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-[#660B05]/10 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Getting Started</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Welcome to the ISKA Visitor Monitor admin dashboard. Use this panel to manage visitor records, view analytics, and export reports.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Dashboard</h3>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>View visitor statistics and trends</li>
                  <li>Monitor daily, weekly, and monthly visitor counts</li>
                  <li>Analyze visitor patterns with interactive charts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Visitors</h3>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Add new visitor entries manually</li>
                  <li>Edit existing visitor records</li>
                  <li>Delete visitor entries</li>
                  <li>Export reports in PDF format</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Export Reports</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Export visitor data by selecting a time range:
                </p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li><strong>Today:</strong> All visitors who logged in today</li>
                  <li><strong>This Week:</strong> Visitors from Monday until today</li>
                  <li><strong>This Month:</strong> All visitors for the current month</li>
                </ul>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Need More Help?</h3>
                <div className="space-y-2">
                  <a
                    href="mailto:support@iska.edu"
                    className="block text-xs text-[#660B05] hover:underline"
                  >
                    📧 Email: support@iska.edu
                  </a>
                  <p className="text-xs text-gray-600">
                    📞 Phone: (02) 123-4567
                  </p>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end bg-gray-50">
              <button
                onClick={() => setHelpOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#660B05] text-white hover:bg-[#8C1007] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && visitorToDelete && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setDeleteConfirmOpen(false);
              setVisitorToDelete(null);
            }}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Delete Visitor</div>
                  <div className="text-[11px] text-gray-500">This action cannot be undone</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setVisitorToDelete(null);
                }}
                className="w-9 h-9 rounded-lg hover:bg-[#660B05]/10 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to delete this visitor record?
              </p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm font-semibold text-gray-900">{visitorToDelete.fullName}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {visitorToDelete.visitorType} • {visitorToDelete.destination}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {visitorToDelete.timeIn
                    ? new Date(visitorToDelete.timeIn).toLocaleString()
                    : "No time in"}
                </div>
              </div>
              <p className="text-xs text-red-600 font-medium">
                ⚠️ This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-gray-50">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setVisitorToDelete(null);
                }}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white hover:bg-[#660B05]/10 hover:border-[#660B05]/30 hover:text-[#660B05] disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteEntry}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Deleting…" : "Delete Visitor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[3000] animate-in slide-in-from-top-5">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </div>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-[#660B05]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

