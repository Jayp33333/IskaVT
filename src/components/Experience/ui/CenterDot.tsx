import useWorld from "../../../hooks/useWorld";

export const CenterDot = () => {
  const cameraMode = useWorld((s: any) => s.cameraMode);

  if (cameraMode !== "first") return null;

  return (
    <div
      className="
        pointer-events-none
        fixed
        left-1/2
        top-1/2
        z-999
        h-2
        w-2
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-white
        shadow-[0_0_6px_rgba(255,255,255,0.8)]
      "
    />
  );
};
