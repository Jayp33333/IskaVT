function StageBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 320 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="320" height="420" fill="#FFFDF5" />

      <g transform="translate(160 300)">
        <ellipse
          cx="0"
          cy="52"
          rx="118"
          ry="30"
          fill="#FFD700"
          opacity="0.55"
          stroke="#000"
          strokeWidth="2.5"
        />
        <ellipse cx="0" cy="50" rx="92" ry="22" fill="#800000" opacity="0.32" />
        <ellipse
          cx="0"
          cy="48"
          rx="68"
          ry="14"
          fill="#FFFDF5"
          opacity="0.45"
          stroke="#000"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

function SpeechBubble() {
  return (
    <div className="relative z-10 mx-auto w-fit max-w-[92%] pt-5">
      <img
        src="/images/pup-logo.png"
        alt="Polytechnic University of the Philippines"
        className="absolute left-1/2 top-0 z-20 h-10 w-10 -translate-x-1/2 object-contain xl:h-11 xl:w-11"
      />
      <div className="rounded-2xl border-[3px] border-ink bg-white px-5 pb-2.5 pt-6 text-center shadow-brutal-sm xl:px-5 xl:pb-3 xl:pt-7">
        <p className="text-[11px] font-black uppercase leading-none tracking-[0.12em] text-ink xl:text-xs">
          Meet{" "}
          <span className="text-maroon italic tracking-[0.06em]">Iska</span>
          <span className="mx-1 text-ink/40">&</span>
          <span className="text-maroon italic tracking-[0.06em]">Isko</span>
        </p>
      </div>
      <svg
        className="absolute -bottom-[11px] left-1/2 -translate-x-1/2"
        width="22"
        height="12"
        viewBox="0 0 22 12"
        aria-hidden
      >
        <path
          d="M11 12 L3 2 H19 Z"
          className="fill-white"
          stroke="#000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function HeroMascotPanel() {
  return (
    <div className="relative w-full max-w-[min(100%,26rem)] xl:max-w-[min(100%,28rem)]">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-cream shadow-brutal-lg xl:rounded-[2rem]">
        <StageBackdrop />

        <div className="relative flex flex-col">
          <div className="px-5 pt-6 xl:px-6 xl:pt-7">
            <SpeechBubble />
          </div>

          <div className="relative -mt-2 flex items-end justify-center px-4 pb-4 pt-0 xl:-mt-3 xl:px-5 xl:pb-5">
            <img
              src="/images/iska-and-isko.png"
              alt="Iska and Isko — PUP Lopez campus mascots"
              className="relative z-10 h-[min(52dvh,25rem)] w-auto max-w-full -translate-y-3 object-contain object-bottom [filter:drop-shadow(0_20px_28px_rgba(0,0,0,0.35))_drop-shadow(5px_5px_0_rgba(0,0,0,0.88))] xl:h-[min(56dvh,29rem)] xl:-translate-y-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
