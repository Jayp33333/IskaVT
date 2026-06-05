import { useEffect } from "react";
import useWorld from "./useWorld";

function shouldIgnoreKeyboardTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

export function useAltCursorReveal() {
  const setCursorRevealedByAlt = useWorld((s) => s.setCursorRevealedByAlt);

  useEffect(() => {
    const revealCursor = () => {
      if (document.pointerLockElement) {
        document.exitPointerLock?.();
      }
      setCursorRevealedByAlt(true);
    };

    const hideCursorReveal = () => {
      setCursorRevealedByAlt(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreKeyboardTarget(e.target)) return;
      if (e.key !== "Alt") return;
      e.preventDefault();
      revealCursor();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== "Alt") return;
      hideCursorReveal();
    };

    const onBlur = () => hideCursorReveal();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        hideCursorReveal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      setCursorRevealedByAlt(false);
    };
  }, [setCursorRevealedByAlt]);
}
