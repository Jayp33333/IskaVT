import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCopy, MapPin, X } from "lucide-react";
import { IoClose } from "react-icons/io5";
import {
  formatCampusNodeSnippet,
  validateCampusNodeName,
} from "../../../data/campusGraph";
import useWorld from "../../../hooks/useWorld";
import { Vector3 } from "three";

const NODE_Y_OFFSET = 0.3;

type Draft = {
  x: number;
  y: number;
  z: number;
};

function formatCoord(value: number) {
  return value.toFixed(2);
}

export function CampusNodeAddTool() {
  const showCampusNodeAddTool = useWorld((s) => s.showCampusNodeAddTool);
  const characterPosition = useWorld((s) => s.characterPosition);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [snippet, setSnippet] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === "undefined") return;
    window.localStorage.removeItem("dev-campus-nodes");
  }, []);

  if (!import.meta.env.DEV || !showCampusNodeAddTool) return null;

  const handleOpen = () => {
    if (!characterPosition) return;
    setDraft({
      x: characterPosition.x,
      y: characterPosition.y + NODE_Y_OFFSET,
      z: characterPosition.z,
    });
    setNodeName("");
    setError(null);
    setSnippet(null);
    setCopied(false);
    setOpen(true);
  };

  const handleCopySnippet = async () => {
    if (!draft) return;

    const validation = validateCampusNodeName(nodeName);
    if (!validation.ok) {
      setError(validation.reason);
      return;
    }

    const position = new Vector3(draft.x, draft.y, draft.z);
    const nextSnippet = formatCampusNodeSnippet(
      validation.normalizedId,
      position,
    );

    try {
      await navigator.clipboard.writeText(nextSnippet);
      setSnippet(nextSnippet);
      setCopied(true);
      setError(null);
    } catch {
      setSnippet(nextSnippet);
      setCopied(false);
      setError("Could not copy automatically. Copy the snippet below.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setDraft(null);
    setNodeName("");
    setError(null);
    setSnippet(null);
    setCopied(false);
  };

  return (
    <>
      {!open && (
        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={!characterPosition}
          className="fixed bottom-4 left-4 z-[1300] flex items-center gap-2 rounded-xl border-[3px] border-ink bg-gold px-3 py-2 text-[10px] font-black uppercase tracking-wide text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5 sm:text-xs"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ClipboardCopy className="h-4 w-4" strokeWidth={3} />
          Copy Node
        </motion.button>
      )}

      <AnimatePresence>
        {open && draft && (
          <motion.aside
            className="fixed bottom-4 left-4 z-[1310] w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border-[4px] border-ink bg-cream text-ink"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
          >
            <div className="flex items-start justify-between gap-3 border-b-[4px] border-ink bg-maroon px-4 py-3 text-white">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <h2 className="text-sm font-black uppercase tracking-tight sm:text-base">
                    Copy Campus Node
                  </h2>
                </div>
                <p className="mt-1 text-[11px] font-bold text-white/85">
                  Dev only — Y +{NODE_Y_OFFSET} applied · paste into `campusGraph.ts`
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close copy node panel"
                className="rounded-lg border-2 border-ink bg-white p-1.5 text-ink"
              >
                <IoClose size={16} />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="rounded-xl border-[3px] border-ink bg-white p-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-ink/60">
                  Coordinates
                </p>
                <p className="mt-2 font-mono text-sm font-bold text-ink">
                  ({formatCoord(draft.x)}, {formatCoord(draft.y)},{" "}
                  {formatCoord(draft.z)})
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-wide text-ink/70">
                  Node name
                </span>
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => {
                    setNodeName(e.target.value);
                    setError(null);
                    setCopied(false);
                  }}
                  placeholder='e.g. gym-approach-2'
                  className="w-full rounded-xl border-[3px] border-ink bg-white px-3 py-2.5 text-sm font-bold text-ink outline-none placeholder:font-medium placeholder:text-ink/35 focus:bg-yellow-50"
                  autoFocus
                />
              </label>

              {error && (
                <p className="rounded-xl border-2 border-ink bg-red-100 px-3 py-2 text-xs font-bold text-red-700">
                  {error}
                </p>
              )}

              {snippet && (
                <div className="rounded-xl border-[3px] border-ink bg-muted p-3">
                  <p className="text-[10px] font-black uppercase tracking-wide text-ink/60">
                    Snippet {copied ? "(copied)" : ""}
                  </p>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs font-bold text-ink">
                    {snippet}
                  </pre>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-[3px] border-ink bg-maroon px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white hover:bg-maroon/90"
                >
                  <ClipboardCopy className="h-4 w-4" strokeWidth={3} />
                  Copy snippet
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded-xl border-[3px] border-ink bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wide text-ink hover:bg-cream"
                >
                  <X className="h-4 w-4" strokeWidth={3} />
                  Close
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
