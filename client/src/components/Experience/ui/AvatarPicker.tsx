import { useEffect, useState } from "react";
import { useViverseAvatarList } from "@react-three/viverse";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, UserRound, X } from "lucide-react";
import useWorld from "../../../hooks/useWorld";
import { SAMPLE_AVATAR_LIST } from "../../../sampleData";
import { useGlobalLoading } from "../../../hooks/useGlobalLoading";
import { preloadModel } from "../../../utils/modelCache";

type AvatarOption = {
  id: string | number;
  headIconUrl: string;
  vrmUrl?: string;
  displayName?: string;
};

function getAvatarDisplayName(avatar: AvatarOption): string {
  if (avatar.displayName) return avatar.displayName;

  const haystack = `${avatar.headIconUrl ?? ""} ${avatar.vrmUrl ?? ""}`.toLowerCase();
  if (haystack.includes("isko")) return "ISKO";
  if (haystack.includes("iska")) return "ISKA";
  if (avatar.id === 189084 || avatar.id === 1) return "ISKA";
  if (avatar.id === 2) return "ISKO";

  return "Avatar";
}

export const AvatarPicker = () => {
  const avatarList = (useViverseAvatarList() || SAMPLE_AVATAR_LIST) as AvatarOption[];

  const currentAvatar = useWorld((state: any) => state.avatar) as AvatarOption;
  const setAvatar = useWorld((state: any) => state.setAvatar);
  const cameraMode = useWorld((state: any) => state.cameraMode) as "first" | "third";
  const setCameraMode = useWorld((state: any) => state.setCameraMode);
  const showLogHistory = useWorld((state: any) => state.showLogHistory);

  const { withLoading } = useGlobalLoading();

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (!openMenu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openMenu]);

  const handleSelectAvatar = (avatar: AvatarOption) => {
    if (currentAvatar?.id === avatar.id) {
      setOpenMenu(false);
      return;
    }

    setOpenMenu(false);

    void withLoading(async () => {
      if (cameraMode === "third" && avatar.vrmUrl) {
        await preloadModel(avatar.vrmUrl);
      }
      setAvatar(avatar);
    }, "Switching avatar…");
  };

  return (
    <div className="relative">
      {/* Current Avatar Button */}
      <button
        className={`group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border-[3px] border-ink bg-gold text-maroon shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-1 active:shadow-none [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:shadow-brutal-sm ${
          showLogHistory ? "pointer-events-none blur-sm opacity-50" : ""
        }`}
        onClick={() => setOpenMenu(!openMenu)}
        title="Choose avatar"
        aria-label="Choose avatar"
        aria-expanded={openMenu}
        type="button"
      >
        {currentAvatar?.headIconUrl ? (
          <img
            src={currentAvatar.headIconUrl}
            alt="Current avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5" strokeWidth={3} />
        )}
        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-slate-900/35 to-transparent" />
      </button>

      {/* Avatar List Panel */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            className="absolute left-0 top-12 z-[1500] w-[min(92vw,19rem)] overflow-hidden rounded-[1.5rem] border-[4px] border-ink bg-cream text-ink shadow-brutal-md [@media(max-width:360px)]:w-[min(88vw,17rem)] [@media(max-height:500px)]:top-10 [@media(max-height:500px)]:w-[min(80vw,20rem)] [@media(max-height:500px)]:rounded-2xl [@media(max-height:500px)]:border-[3px] [@media(max-height:500px)]:shadow-brutal-md [@media(orientation:landscape)_and_(max-height:500px)]:w-[min(50vw,18rem)]"
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
          >
            <div className="flex items-center justify-between gap-3 border-b-[4px] border-ink bg-maroon px-4 py-3 [@media(max-height:500px)]:border-b-[3px] [@media(max-height:500px)]:px-3 [@media(max-height:500px)]:py-2 [@media(orientation:landscape)_and_(max-height:500px)]:gap-2 [@media(orientation:landscape)_and_(max-height:500px)]:px-2.5 [@media(orientation:landscape)_and_(max-height:500px)]:py-1.5">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider text-yellow-200 [@media(max-height:500px)]:hidden">
                  Player Style
                </p>
                <h2 className="truncate text-base font-black italic leading-tight text-white [@media(max-height:500px)]:text-sm [@media(orientation:landscape)_and_(max-height:500px)]:text-xs">
                  Choose Avatar
                </h2>
              </div>
              <button
                onClick={() => setOpenMenu(false)}
                className="shrink-0 rounded-xl border-[3px] border-ink bg-white p-1 text-ink transition-transform hover:bg-muted active:scale-90 [@media(max-height:500px)]:rounded-lg [@media(max-height:500px)]:border-[2px] [@media(orientation:landscape)_and_(max-height:500px)]:p-0.5"
                aria-label="Close avatar picker"
                type="button"
              >
                <X className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5 [@media(orientation:landscape)_and_(max-height:500px)]:h-3 [@media(orientation:landscape)_and_(max-height:500px)]:w-3" strokeWidth={4} />
              </button>
            </div>

            <div className="max-h-[min(62dvh,22rem)] overflow-y-auto p-3 custom-scrollbar [@media(max-height:500px)]:max-h-[calc(100dvh-4.5rem)] [@media(max-height:500px)]:p-2 [@media(orientation:landscape)_and_(max-height:500px)]:max-h-[calc(100dvh-3.5rem)] [@media(orientation:landscape)_and_(max-height:500px)]:p-1.5">
              <div className="mb-3 rounded-2xl border-[3px] border-ink bg-white p-1.5 shadow-brutal-sm [@media(max-height:500px)]:mb-2 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:p-1 [@media(orientation:landscape)_and_(max-height:500px)]:mb-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:border-[2px] [@media(orientation:landscape)_and_(max-height:500px)]:shadow-brutal-sm">
                <p className="mb-1.5 px-1 text-[9px] font-black uppercase tracking-wide text-ink/50 [@media(max-height:500px)]:hidden">
                  Camera View
                </p>
                <div className="grid grid-cols-2 gap-1.5 [@media(max-height:500px)]:gap-1 [@media(orientation:landscape)_and_(max-height:500px)]:gap-0.5">
                  {(["first", "third"] as const).map((mode) => {
                    const isActive = cameraMode === mode;

                    return (
                      <button
                        key={mode}
                        onClick={() => setCameraMode(mode)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border-[2px] border-ink px-2 py-2 text-[10px] font-black uppercase transition-all active:translate-y-0.5 [@media(max-height:500px)]:gap-1 [@media(max-height:500px)]:px-1.5 [@media(max-height:500px)]:py-1.5 [@media(max-height:500px)]:text-[8px] [@media(orientation:landscape)_and_(max-height:500px)]:gap-0.5 [@media(orientation:landscape)_and_(max-height:500px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:500px)]:px-1 [@media(orientation:landscape)_and_(max-height:500px)]:py-1 [@media(orientation:landscape)_and_(max-height:500px)]:text-[7px] ${
                          isActive
                            ? "bg-maroon text-white shadow-brutal-sm"
                            : "bg-gold/25 text-ink hover:bg-gold/90"
                        }`}
                        type="button"
                        aria-pressed={isActive}
                      >
                        {mode === "first" ? (
                          <Camera className="h-3.5 w-3.5 [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3 [@media(orientation:landscape)_and_(max-height:500px)]:h-2.5 [@media(orientation:landscape)_and_(max-height:500px)]:w-2.5" strokeWidth={3.5} />
                        ) : (
                          <UserRound className="h-3.5 w-3.5 [@media(max-height:500px)]:h-3 [@media(max-height:500px)]:w-3 [@media(orientation:landscape)_and_(max-height:500px)]:h-2.5 [@media(orientation:landscape)_and_(max-height:500px)]:w-2.5" strokeWidth={3.5} />
                        )}
                        {mode === "first" ? "First" : "Third"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 [@media(max-height:500px)]:grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] [@media(max-height:500px)]:gap-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:grid-cols-[repeat(auto-fit,minmax(3.75rem,1fr))] [@media(orientation:landscape)_and_(max-height:500px)]:gap-1">
                {avatarList.map((avatar) => {
                  const isSelected = currentAvatar?.id === avatar.id;
                  const displayName = getAvatarDisplayName(avatar);

                  return (
                    <button
                      key={avatar.id}
                      onClick={() => handleSelectAvatar(avatar)}
                      className={`group/avatar relative flex flex-col items-center gap-2 rounded-2xl border-[3px] p-2 text-center transition-all active:translate-y-1 [@media(max-height:500px)]:gap-1 [@media(max-height:500px)]:rounded-xl [@media(max-height:500px)]:p-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:gap-0.5 [@media(orientation:landscape)_and_(max-height:500px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:500px)]:border-[2px] [@media(orientation:landscape)_and_(max-height:500px)]:p-1 ${
                        isSelected
                          ? "border-ink bg-gold shadow-brutal-sm"
                          : "border-ink bg-white shadow-brutal-sm hover:bg-cream"
                      }`}
                      type="button"
                      aria-pressed={isSelected}
                    >
                      <span className="relative h-16 w-16 overflow-hidden rounded-2xl border-[3px] border-ink bg-muted [@media(max-height:500px)]:h-11 [@media(max-height:500px)]:w-11 [@media(max-height:500px)]:rounded-xl [@media(orientation:landscape)_and_(max-height:500px)]:h-9 [@media(orientation:landscape)_and_(max-height:500px)]:w-9 [@media(orientation:landscape)_and_(max-height:500px)]:rounded-lg [@media(orientation:landscape)_and_(max-height:500px)]:border-[2px]">
                        <img
                          src={avatar.headIconUrl}
                          alt={displayName}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover/avatar:scale-105"
                        />
                        {isSelected && (
                          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full border-[2px] border-ink bg-emerald-300 [@media(max-height:500px)]:h-4 [@media(max-height:500px)]:w-4 [@media(orientation:landscape)_and_(max-height:500px)]:right-0.5 [@media(orientation:landscape)_and_(max-height:500px)]:top-0.5 [@media(orientation:landscape)_and_(max-height:500px)]:h-3.5 [@media(orientation:landscape)_and_(max-height:500px)]:w-3.5">
                            <Check className="h-3 w-3 text-ink [@media(max-height:500px)]:h-2.5 [@media(max-height:500px)]:w-2.5 [@media(orientation:landscape)_and_(max-height:500px)]:h-2 [@media(orientation:landscape)_and_(max-height:500px)]:w-2" strokeWidth={4} />
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wide [@media(max-height:500px)]:text-[8px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[7px] ${
                          isSelected ? "text-maroon" : "text-ink/80"
                        }`}
                      >
                        {displayName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
