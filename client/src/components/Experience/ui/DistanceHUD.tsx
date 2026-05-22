import { FaLocationCrosshairs } from "react-icons/fa6";
import useWorld from "../../../hooks/useWorld";

export const DistanceHUD = () => {
  const { pinPosition, isPinConfirmed, distance, selectedDestination } =
    useWorld((s: any) => s);
  const displayDistance = Number.isFinite(distance)
    ? Math.max(0, Math.round(distance))
    : 0;

  if (!pinPosition || !isPinConfirmed) return null;

  return (
    <div className="w-[min(82vw,210px)] rounded-xl border-[2px] border-slate-900 bg-[#FFFDF9] p-2 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] [@media(max-width:360px)]:w-[min(76vw,180px)] [@media(max-width:360px)]:p-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:w-[min(58vw,180px)] [@media(orientation:landscape)_and_(max-height:500px)]:p-1.5">
      <div className="flex items-center gap-1.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-slate-900 bg-yellow-300 [@media(max-width:360px)]:h-6 [@media(max-width:360px)]:w-6 [@media(orientation:landscape)_and_(max-height:500px)]:h-6 [@media(orientation:landscape)_and_(max-height:500px)]:w-6">
          <FaLocationCrosshairs className="text-xs text-[#D43F3F] [@media(max-width:360px)]:text-[10px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[10px]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-black uppercase tracking-wide text-slate-500 [@media(max-width:360px)]:text-[7px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[7px]">
            Destination
          </p>
          <p className="truncate text-xs font-black leading-tight text-slate-900 [@media(max-width:360px)]:text-[10px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[10px]">
            {selectedDestination || "Pinned location"}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-1.5 rounded-lg border-[2px] border-slate-900 bg-emerald-300 px-2 py-1.5 [@media(max-width:360px)]:mt-1.5 [@media(max-width:360px)]:px-1.5 [@media(max-width:360px)]:py-1 [@media(orientation:landscape)_and_(max-height:500px)]:mt-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:px-1.5 [@media(orientation:landscape)_and_(max-height:500px)]:py-1">
        <span className="text-[8px] font-black uppercase tracking-wide text-emerald-950 [@media(max-width:360px)]:text-[7px] [@media(orientation:landscape)_and_(max-height:500px)]:text-[7px]">
          Distance
        </span>
        <span className="text-sm font-black leading-none text-slate-900 [@media(max-width:360px)]:text-xs [@media(orientation:landscape)_and_(max-height:500px)]:text-xs">
          {displayDistance}m
        </span>
      </div>
    </div>
  );
};
