export const CenterDot = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-1/2 top-1/2 z-[320] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)] sm:h-2 sm:w-2" />
    </div>
  );
};
