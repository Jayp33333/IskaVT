import { Square, Volume2 } from "lucide-react";
import { useEffect, useId } from "react";
import { useFaqSpeech } from "../../features/contact/hooks/useFaqSpeech";

type SpeakTextButtonProps = {
  text: string;
  className?: string;
};

export function SpeakTextButton({ text, className = "" }: SpeakTextButtonProps) {
  const speechId = useId();
  const { speak, stop, speakingId, isSupported } = useFaqSpeech();
  const isSpeaking = speakingId === speechId;

  useEffect(() => () => stop(), [stop]);

  if (!isSupported || !text.trim()) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => (isSpeaking ? stop() : speak(speechId, text))}
      aria-pressed={isSpeaking}
      aria-label={isSpeaking ? "Stop reading" : "Listen to this section"}
      className={`inline-flex items-center justify-center rounded-xl border border-ink bg-gold p-2.5 text-ink transition-colors hover:bg-gold/90 sm:rounded-2xl sm:p-3 ${className}`}
    >
      {isSpeaking ? (
        <Square className="h-4 w-4 fill-current sm:h-5 sm:w-5" aria-hidden />
      ) : (
        <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
      )}
    </button>
  );
}
