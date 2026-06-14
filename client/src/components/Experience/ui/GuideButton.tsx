import { BookOpen } from "lucide-react";
import useWorld from "../../../hooks/useWorld";

type GuideButtonProps = {
  disabled?: boolean;
};

export function GuideButton({ disabled = false }: GuideButtonProps) {
  const tourCoachOpen = useWorld((s) => s.tourCoachOpen);
  const guideBookOpen = useWorld((s) => s.guideBookOpen);
  const openGuideBook = useWorld((s) => s.openGuideBook);

  const isDisabled = disabled || tourCoachOpen || guideBookOpen;

  return (
    <button
      type="button"
      data-tour="guide"
      onClick={() => openGuideBook()}
      disabled={isDisabled}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border-[3px] border-ink bg-gold text-maroon shadow-brutal-sm transition-all hover:bg-gold/90 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 [@media(max-height:500px)]:rounded-xl"
      title="Campus guide"
      aria-label="Open campus guide"
      aria-pressed={tourCoachOpen || guideBookOpen}
      aria-expanded={guideBookOpen}
    >
      <BookOpen
        className="h-4 w-4 [@media(max-height:500px)]:h-3.5 [@media(max-height:500px)]:w-3.5"
        strokeWidth={3}
      />
    </button>
  );
}
