import { useRef, useState } from "react";
import { FolderOpen, RotateCcw, Upload } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import {
  applyCustomAmbientMusic,
  applyDefaultAmbientMusic,
} from "../../../hooks/useCustomAmbientMusic";

export function CustomAmbientMusicPicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const customAmbientTrackName = useWorld((s) => s.customAmbientTrackName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChooseFile = () => {
    setError(null);
    inputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      await applyCustomAmbientMusic(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not use that file.");
    } finally {
      setBusy(false);
    }
  };

  const handleUseDefault = async () => {
    setBusy(true);
    setError(null);
    try {
      await applyDefaultAmbientMusic();
    } catch {
      setError("Could not restore campus music.");
    } finally {
      setBusy(false);
    }
  };

  const label = customAmbientTrackName ?? "Campus default";
  const isCustom = !!customAmbientTrackName;

  return (
    <div
      data-settings-guide="custom-music"
      className="rounded-2xl border-2 border-ink bg-white p-4 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:p-3.5"
    >
      <div className="mb-4 flex items-center gap-3.5 [@media(max-height:500px)]:mb-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-gold [@media(max-height:500px)]:h-8 [@media(max-height:500px)]:w-8">
          <FolderOpen
            className="h-4 w-4 text-maroon [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
            strokeWidth={2.5}
          />
        </span>
        <span className="min-w-0 flex-1 text-sm font-bold text-ink [@media(max-height:500px)]:text-xs">
          Custom Music
        </span>
      </div>

      <p
        className="mb-3 truncate rounded-lg border-2 border-ink/20 bg-cream px-3 py-2.5 text-xs font-semibold text-ink [@media(max-height:500px)]:mb-2.5 [@media(max-height:500px)]:py-2 [@media(max-height:500px)]:text-[11px]"
        title={label}
      >
        {label}
      </p>

      <div className={`grid gap-2 ${isCustom ? "grid-cols-2" : "grid-cols-1"}`}>
        <button
          type="button"
          onClick={handleChooseFile}
          disabled={busy}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-ink bg-maroon px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white transition-colors hover:bg-maroon/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 [@media(max-height:500px)]:min-h-9 [@media(max-height:500px)]:text-[9px]"
        >
          <Upload className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
          {busy ? "Loading…" : "Choose File"}
        </button>

        {isCustom && (
          <button
            type="button"
            onClick={handleUseDefault}
            disabled={busy}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-ink bg-cream px-3 py-2 text-[10px] font-black uppercase tracking-wide text-ink transition-colors hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 [@media(max-height:500px)]:min-h-9 [@media(max-height:500px)]:text-[9px]"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
            Default
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border-2 border-maroon/30 bg-maroon/5 px-2.5 py-1.5 text-[10px] font-semibold text-maroon">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.webm"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
      />
    </div>
  );
}
