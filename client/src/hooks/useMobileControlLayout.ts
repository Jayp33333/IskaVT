import { useEffect, useRef } from "react";
import useWorld from "./useWorld";
import {
  applyMobileControlLayout,
  clampControlPosition,
  type MobileControlLayout,
  type MobileControlPosition,
} from "../utils/experienceMobileControls";

const JOYSTICK_SELECTOR = ".viverse-joystick";
const JUMP_SELECTOR = ".viverse-button.viverse-jump";

export function useMobileControlLayout(enabled: boolean) {
  const layout = useWorld((s) => s.mobileControlLayout);
  const customizeMode = useWorld((s) => s.mobileControlsCustomize);
  const setMobileControlLayout = useWorld((s) => s.setMobileControlLayout);
  const dragRef = useRef<{
    target: "joystick" | "jump";
    element: HTMLElement;
    pointerId: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    applyMobileControlLayout(layout);

    const observer = new MutationObserver(() => {
      applyMobileControlLayout(layout);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    const interval = window.setInterval(() => {
      applyMobileControlLayout(layout);
    }, 1000);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, [enabled, layout]);

  useEffect(() => {
    if (!enabled || !customizeMode) {
      document.body.classList.remove("mobile-controls-customize");
      return;
    }

    document.body.classList.add("mobile-controls-customize");

    const updateFromPointer = (
      target: "joystick" | "jump",
      element: HTMLElement,
      clientX: number,
      clientY: number,
    ) => {
      const rect = element.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const next: MobileControlPosition = {
        left: ((clientX - rect.width / 2) / vw) * 100,
        bottom: ((vh - clientY - rect.height / 2) / vh) * 100,
      };
      const clamped = clampControlPosition(
        next,
        rect.width,
        rect.height,
      );

      const current = useWorld.getState().mobileControlLayout;
      const updated: MobileControlLayout = {
        ...current,
        [target]: clamped,
      };
      setMobileControlLayout(updated);
      applyMobileControlLayout(updated);
    };

    const onPointerDown = (event: PointerEvent) => {
      const joystick = event.target instanceof Element
        ? event.target.closest<HTMLElement>(JOYSTICK_SELECTOR)
        : null;
      const jump = event.target instanceof Element
        ? event.target.closest<HTMLElement>(JUMP_SELECTOR)
        : null;
      const element = joystick ?? jump;
      if (!element) return;

      event.preventDefault();
      event.stopPropagation();
      element.setPointerCapture(event.pointerId);
      dragRef.current = {
        target: joystick ? "joystick" : "jump",
        element,
        pointerId: event.pointerId,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      updateFromPointer(drag.target, drag.element, event.clientX, event.clientY);
    };

    const endDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag.element.releasePointerCapture(event.pointerId);
      dragRef.current = null;
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointermove", onPointerMove, true);
    window.addEventListener("pointerup", endDrag, true);
    window.addEventListener("pointercancel", endDrag, true);

    return () => {
      document.body.classList.remove("mobile-controls-customize");
      dragRef.current = null;
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", endDrag, true);
      window.removeEventListener("pointercancel", endDrag, true);
    };
  }, [enabled, customizeMode, setMobileControlLayout]);
}
