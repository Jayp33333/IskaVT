import { useRef, useState } from "react";
import { FolderOpen, RotateCcw } from "lucide-react";
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

  return (
    <div className="border-b-[2px] border-ink/10 px-3 py-2.5 [@media(max-height:500px)]:px-2.5 [@media(max-height:500px)]:py-2">
      <div className="flex min-w-0 items-start gap-2.5 [@media(max-height:500px)]:gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-[2px] border-ink bg-gold shadow-brutal-sm [@media(max-height:500px)]:h-7 [@media(max-height:500px)]:w-7 [@media(max-height:500px)]:rounded-lg">
          <FolderOpen
            className="h-3.5 w-3.5 text-maroon [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3"
            strokeWidth={3}
          />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-wide text-ink [@media(max-height:500px)]:text-[9px]">
            My Music
          </p>
          <p
            className="mt-0.5 truncate text-[8px] font-bold text-ink/50 [@media(max-height:500px)]:text-[7px]"
            title={label}
          >
            {label}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5 [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:gap-1">
            <button
              type="button"
              onClick={handleChooseFile}
              disabled={busy}
              className="rounded-lg border-[2px] border-ink bg-maroon px-2.5 py-1.5 text-[8px] font-black uppercase text-white shadow-brutal-sm transition-all active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[7px]"
            >
              {busy ? "Loading…" : "Choose file"}
            </button>

            {customAmbientTrackName && (
              <button
                type="button"
                onClick={handleUseDefault}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-lg border-[2px] border-ink bg-cream px-2.5 py-1.5 text-[8px] font-black uppercase text-ink transition-colors hover:bg-gold/40 disabled:cursor-not-allowed disabled:opacity-50 [@media(max-height:500px)]:px-2 [@media(max-height:500px)]:py-1 [@media(max-height:500px)]:text-[7px]"
              >
                <RotateCcw className="h-3 w-3" strokeWidth={3} />
                Default
              </button>
            )}
          </div>

          {error && (
            <p className="mt-1.5 text-[8px] font-bold text-maroon [@media(max-height:500px)]:text-[7px]">
              {error}
            </p>
          )}
        </div>
      </div>

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
