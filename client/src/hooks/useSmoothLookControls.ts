import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { RotatePitchAction, RotateYawAction } from "@react-three/viverse";

type TouchLookOptions = {
  enabled: boolean;
  rotationSpeed: number;
};

/**
 * Converts touch-drag distance into camera rotation without relying on
 * PointerEvent.movementX/Y, which is unreliable or always zero on some mobile
 * browsers (notably iOS Safari).
 */
export function useSmoothLookControls({
  enabled,
  rotationSpeed,
}: TouchLookOptions) {
  const canvas = useThree((state) => state.gl.domElement);
  const pointerRef = useRef<{
    id: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled) {
      pointerRef.current = null;
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;

      pointerRef.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const onPointerMove = (event: PointerEvent) => {
      const pointer = pointerRef.current;
      if (!pointer || pointer.id !== event.pointerId) return;

      const rect = canvas.getBoundingClientRect();
      const scale = Math.max(1, rect.height);
      const deltaX = event.clientX - pointer.x;
      const deltaY = event.clientY - pointer.y;

      RotateYawAction.emit(-(deltaX / scale) * rotationSpeed);
      RotatePitchAction.emit(-(deltaY / scale) * rotationSpeed);

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      event.preventDefault();
    };

    const endPointer = (event: PointerEvent) => {
      if (pointerRef.current?.id !== event.pointerId) return;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      pointerRef.current = null;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove, { passive: false });
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", endPointer);

    return () => {
      pointerRef.current = null;
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endPointer);
      canvas.removeEventListener("pointercancel", endPointer);
    };
  }, [canvas, enabled, rotationSpeed]);
}
