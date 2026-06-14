import type { LucideIcon } from "lucide-react";
import { Check, Move } from "lucide-react";
import {
  AVATAR_PICKER_PREVIEW,
  CAMERA_PREVIEW_OPTIONS,
  MAP_CONTROL_PREVIEW,
  MOVEMENT_KEYS_PREVIEW,
  SETTINGS_TAB_PREVIEW,
  TOOLBAR_PREVIEW_ITEMS,
  type GuidePreview,
} from "../../../data/guideArticlePreviews";

const iconWrapSm =
  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink bg-gold";
const iconWrapLg =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink bg-gold sm:h-12 sm:w-12";
const toolbarBtn =
  "flex h-7 w-7 items-center justify-center rounded-lg border border-ink bg-gold text-maroon transition-all duration-200";
const cardClass =
  "rounded-xl border border-ink bg-white p-2.5 sm:p-3";

function PreviewStage({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`guide-book-preview-stage w-full ${
        wide ? "max-w-[18rem] sm:max-w-[19rem]" : "max-w-[14rem] sm:max-w-[15rem]"
      }`}
    >
      {children}
    </div>
  );
}

function MockToggle({ on = true }: { on?: boolean }) {
  return (
    <span
      className={`flex h-6 w-11 shrink-0 items-center rounded-full border border-ink p-0.5 ${
        on ? "bg-maroon" : "bg-cream"
      }`}
      aria-hidden
    >
      <span
        className={`block h-3.5 w-3.5 rounded-full border border-ink bg-white transition-transform ${
          on ? "translate-x-[1.1rem]" : "translate-x-0"
        }`}
      />
    </span>
  );
}

function MockSlider({ value = 65 }: { value?: number }) {
  return (
    <div className="mt-3 space-y-2" aria-hidden>
      <div className="relative h-2.5 rounded-full border border-ink bg-cream">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-maroon"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-end">
        <span className="rounded-md border border-ink bg-cream px-2 py-0.5 text-[9px] font-black tabular-nums text-maroon">
          {value}%
        </span>
      </div>
    </div>
  );
}

function ToolbarPreview({ highlight }: { highlight: string }) {
  return (
    <PreviewStage wide>
      <div className="rounded-xl border border-ink bg-cream/95 p-1 backdrop-blur-sm">
        <div className="flex flex-nowrap items-center justify-center gap-0.5 sm:gap-1">
          {TOOLBAR_PREVIEW_ITEMS.map(({ id, icon: Icon }) => {
            const active = id === highlight;
            return (
              <span
                key={id}
                className={`${toolbarBtn} ${
                  active
                    ? "guide-book-toolbar-active bg-maroon text-white"
                    : "opacity-55"
                }`}
              >
                <Icon className="h-3 w-3" strokeWidth={2.5} />
              </span>
            );
          })}
        </div>
      </div>
    </PreviewStage>
  );
}

function SettingsTabsRow({
  activeTab,
}: {
  activeTab?: "display" | "controls" | "audio";
}) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg border border-ink bg-cream p-1">
      {SETTINGS_TAB_PREVIEW.map(({ id, label, icon: Icon }) => {
        const active = id === activeTab;
        return (
          <div
            key={id}
            className={`flex flex-col items-center gap-0.5 rounded-md px-1 py-1 transition-colors ${
              active ? "bg-maroon text-white" : "text-ink/40"
            }`}
          >
            <Icon className="h-3 w-3" strokeWidth={2.5} />
            <span className="text-[7px] font-black uppercase tracking-wide">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SettingsTabsPreview({
  activeTab,
}: {
  activeTab?: "display" | "controls" | "audio";
}) {
  return (
    <PreviewStage>
      <div className="rounded-xl border border-ink bg-cream p-2">
        <SettingsTabsRow activeTab={activeTab} />
      </div>
    </PreviewStage>
  );
}

function SettingsDetailPreview({ preview }: { preview: GuidePreview }) {
  const detail = preview.settingsDetail ?? "tabs-only";
  const Icon = preview.icon;

  if (detail === "tabs-only") return null;

  if (detail === "camera") {
    return (
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        {CAMERA_PREVIEW_OPTIONS.map(({ id, label, icon: CameraIcon }, index) => (
          <div
            key={id}
            className={`flex flex-col items-center gap-1 rounded-md border px-1 py-1.5 ${
              index === 1
                ? "border-ink bg-maroon text-white"
                : "border-ink/20 bg-cream text-ink/50"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                index === 1 ? "border-white/40 bg-white/10" : "border-ink bg-gold"
              }`}
            >
              <CameraIcon
                className={`h-2.5 w-2.5 ${index === 1 ? "text-white" : "text-maroon"}`}
                strokeWidth={2.5}
              />
            </span>
            <span className="text-[7px] font-black uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (detail === "slider") {
    return (
      <div className={`${cardClass} mt-1.5 p-2`}>
        <div className="flex items-center gap-2">
          <span className={iconWrapSm}>
            <Icon className="h-3 w-3 text-maroon" strokeWidth={2.5} />
          </span>
          <span className="min-w-0 flex-1" />
        </div>
        <MockSlider />
      </div>
    );
  }

  return (
    <div className={`${cardClass} mt-1.5 p-2`}>
      <div className="flex items-center gap-2">
        <span className={iconWrapSm}>
          <Icon className="h-3 w-3 text-maroon" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1" />
        {preview.showToggle && <MockToggle />}
      </div>
    </div>
  );
}

function SettingsPanelPreview({ preview }: { preview: GuidePreview }) {
  return (
    <PreviewStage wide>
      <div className="guide-book-settings-panel overflow-hidden rounded-xl border border-ink bg-cream p-1.5">
        <div className="mb-1.5 rounded-lg border border-ink bg-cream/95 p-1">
          <div className="flex flex-nowrap items-center justify-center gap-0.5">
            {TOOLBAR_PREVIEW_ITEMS.map(({ id, icon: ToolbarIcon }) => {
              const active = id === "settings";
              return (
                <span
                  key={id}
                  className={`${toolbarBtn} ${
                    active
                      ? "guide-book-toolbar-active bg-maroon text-white"
                      : "opacity-40"
                  }`}
                >
                  <ToolbarIcon className="h-3 w-3" strokeWidth={2.5} />
                </span>
              );
            })}
          </div>
        </div>
        <div className="rounded-lg border border-ink bg-white p-1.5">
          <SettingsTabsRow activeTab={preview.settingsTab} />
          <SettingsDetailPreview preview={preview} />
        </div>
      </div>
    </PreviewStage>
  );
}

function SettingsCardPreview({
  icon: Icon,
  showToggle,
  showSlider,
}: {
  icon: LucideIcon;
  showToggle?: boolean;
  showSlider?: boolean;
}) {
  return (
    <PreviewStage>
      <div className={`${cardClass} w-full`}>
        <div className="flex items-center gap-3">
          <span className={iconWrapSm}>
            <Icon className="h-3 w-3 text-maroon" strokeWidth={2.5} />
          </span>
          <span className="min-w-0 flex-1" />
          {showToggle && <MockToggle />}
        </div>
        {showSlider && <MockSlider />}
      </div>
    </PreviewStage>
  );
}

function AvatarPickerPreview() {
  return (
    <PreviewStage>
      <div className="overflow-hidden rounded-xl border border-ink bg-cream">
        <div className="border-b border-ink bg-maroon px-2 py-1.5">
          <p className="text-[8px] font-black uppercase tracking-wide text-yellow-200">
            Choose Avatar
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-2">
          {AVATAR_PICKER_PREVIEW.map(({ id, label, imageSrc, selected }) => (
            <div
              key={id}
              className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 ${
                selected
                  ? "border-ink bg-gold"
                  : "border-ink/30 bg-white"
              }`}
            >
              <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-ink bg-muted">
                <img
                  src={imageSrc}
                  alt={label}
                  className="h-full w-full object-cover"
                />
                {selected && (
                  <span className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-ink bg-emerald-300">
                    <Check className="h-2 w-2 text-ink" strokeWidth={4} />
                  </span>
                )}
              </span>
              <span
                className={`text-[8px] font-black uppercase tracking-wide ${
                  selected ? "text-maroon" : "text-ink/70"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PreviewStage>
  );
}

function CameraPickerPreview() {
  return (
    <PreviewStage>
      <div className={`${cardClass} w-full`}>
        <div className="grid grid-cols-2 gap-2">
          {CAMERA_PREVIEW_OPTIONS.map(({ id, label, icon: Icon }, index) => (
            <div
              key={id}
              className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 transition-colors ${
                index === 1
                  ? "border-ink bg-maroon text-white"
                  : "border-ink/20 bg-cream text-ink/50"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                  index === 1 ? "border-white/40 bg-white/10" : "border-ink bg-gold"
                }`}
              >
                <Icon
                  className={`h-3 w-3 ${index === 1 ? "text-white" : "text-maroon"}`}
                  strokeWidth={2.5}
                />
              </span>
              <span className="text-[8px] font-black uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </PreviewStage>
  );
}

function MapControlsPreview({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <PreviewStage>
      <div className="rounded-2xl border border-ink bg-cream p-3">
        <div className="mb-3 flex items-center justify-center gap-2">
          {MAP_CONTROL_PREVIEW.map(({ icon: ControlIcon }, index) => (
            <span
              key={index}
              className={`${toolbarBtn} ${
                ControlIcon === Icon
                  ? "guide-book-toolbar-active bg-maroon text-white"
                  : "opacity-50"
              }`}
            >
              <ControlIcon className="h-3 w-3" strokeWidth={2.5} />
            </span>
          ))}
        </div>
        <div className="guide-book-map-placeholder mx-auto flex h-[3.5rem] w-full items-center justify-center rounded-lg border border-dashed border-ink/20 bg-white/90">
          <span className={iconWrapSm}>
                <Icon className="h-3 w-3 text-maroon" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </PreviewStage>
  );
}

function MovementTouchPreview() {
  return (
    <PreviewStage>
      <div className="flex items-center justify-center gap-5">
        <div className="guide-book-joystick flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-ink bg-cream sm:h-[4.75rem] sm:w-[4.75rem]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-ink bg-maroon">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
          </div>
        </div>
        <span className={iconWrapSm}>
          <Move className="h-3 w-3 text-maroon" strokeWidth={2.5} />
        </span>
      </div>
    </PreviewStage>
  );
}

function MovementKeysPreview() {
  const [w, a, s, d] = MOVEMENT_KEYS_PREVIEW;

  return (
    <PreviewStage>
      <div className="grid grid-cols-3 gap-1.5">
        <span />
        <KeyCap label={w} active />
        <span />
        <KeyCap label={a} />
        <KeyCap label={s} active />
        <KeyCap label={d} />
      </div>
    </PreviewStage>
  );
}

function KeyCap({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-md border border-ink text-[10px] font-black ${
        active ? "bg-gold text-maroon" : "bg-white text-ink/45"
      }`}
    >
      {label}
    </span>
  );
}

function IconHeroPreview({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <PreviewStage>
      <div className="flex justify-center py-2">
        <span className={iconWrapLg}>
          <Icon className="h-8 w-8 text-maroon" strokeWidth={2.5} />
        </span>
      </div>
    </PreviewStage>
  );
}

function PreviewContent({ preview }: { preview: GuidePreview }) {
  switch (preview.kind) {
    case "toolbar":
      return (
        <ToolbarPreview highlight={preview.toolbarHighlight ?? "guide"} />
      );
    case "avatar-picker":
      return <AvatarPickerPreview />;
    case "settings-panel":
      return <SettingsPanelPreview preview={preview} />;
    case "settings-tabs":
      return <SettingsTabsPreview activeTab={preview.settingsTab} />;
    case "settings-card":
      return (
        <SettingsCardPreview
          icon={preview.icon}
          showToggle={preview.showToggle}
        />
      );
    case "slider":
      return <SettingsCardPreview icon={preview.icon} showSlider />;
    case "camera-picker":
      return <CameraPickerPreview />;
    case "map-controls":
      return <MapControlsPreview icon={preview.icon} />;
    case "movement-touch":
      return <MovementTouchPreview />;
    case "movement-keys":
      return <MovementKeysPreview />;
    case "icon":
    default:
      return <IconHeroPreview icon={preview.icon} />;
  }
}

type GuidePreviewFrameProps = {
  preview: GuidePreview;
  children?: React.ReactNode;
};

function isWidePreview(preview: GuidePreview) {
  return preview.kind === "toolbar" || preview.kind === "settings-panel";
}

export function GuidePreviewFrame({ preview, children }: GuidePreviewFrameProps) {
  const wide = isWidePreview(preview);

  return (
    <div
      className={`guide-book-frame relative mx-auto w-full ${
        wide
          ? "guide-book-frame-wide max-w-[19rem] sm:max-w-[20rem]"
          : "max-w-[15rem] sm:max-w-[16rem]"
      }`}
    >
      <div
        className={`guide-book-frame-inner flex flex-col p-2.5 sm:p-3 [@media(max-height:500px)]:p-2 ${
          children ? "min-h-0" : "min-h-[8rem] items-center justify-center sm:min-h-[9rem] [@media(max-height:500px)]:min-h-[7rem]"
        }`}
      >
        <div className="flex shrink-0 items-center justify-center py-0.5">
          <PreviewContent preview={preview} />
        </div>
        {children && (
          <div className="guide-book-frame-content mt-2 min-w-0 border-t border-ink/10 pt-2 sm:mt-2.5 sm:pt-2.5">
            {children}
          </div>
        )}
      </div>
      <span className="guide-book-preview-badge">Preview</span>
      <span className="guide-book-corner guide-book-corner-tl" aria-hidden />
      <span className="guide-book-corner guide-book-corner-tr" aria-hidden />
      <span className="guide-book-corner guide-book-corner-bl" aria-hidden />
      <span className="guide-book-corner guide-book-corner-br" aria-hidden />
    </div>
  );
}

export function GuideTopicIcon({
  icon: Icon,
  active = false,
}: {
  icon: LucideIcon;
  active?: boolean;
}) {
  return (
    <span
      className={`guide-book-topic-thumb flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink transition-all duration-200 [@media(max-height:500px)]:h-6 [@media(max-height:500px)]:w-6 ${
        active ? "bg-maroon text-white" : "bg-gold text-maroon"
      }`}
    >
      <Icon
        className="h-3 w-3 [@media(max-height:500px)]:h-2.5 [@media(max-height:500px)]:w-2.5"
        strokeWidth={2.5}
      />
    </span>
  );
}
