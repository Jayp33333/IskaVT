type AudioCategory = "sfx" | "ambient";

type LoadOptions = {
  category?: AudioCategory;
  volume?: number;
  loop?: boolean;
};

type AmbientSourceOptions = {
  volume?: number;
  loop?: boolean;
  isObjectUrl?: boolean;
};

class AudioManager {
  private audios = new Map<string, HTMLAudioElement>();
  private categories = new Map<string, AudioCategory>();
  private baseVolumes = new Map<string, number>();
  private unlocked = false;
  private masterVolume = 1;
  private ambientVolume = 0.8;
  private ambientShouldPlay = false;
  private ambientObjectUrl: string | null = null;

  unlock() {
    this.unlocked = true;
    this.syncAmbient();
  }

  configure(options: {
    masterEnabled?: boolean;
    ambientVolume?: number;
  }) {
    if (options.masterEnabled !== undefined) {
      this.masterVolume = options.masterEnabled ? 1 : 0;
    }
    if (options.ambientVolume !== undefined) {
      this.ambientVolume = Math.max(0, Math.min(1, options.ambientVolume / 100));
    }

    this.audios.forEach((_audio, key) => this.applyVolume(key));
    this.syncAmbient();
  }

  load(key: string, src: string, options: LoadOptions = {}) {
    if (this.audios.has(key)) return;

    const category = options.category ?? "sfx";
    const baseVolume = options.volume ?? 1;

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = options.loop ?? category === "ambient";

    this.audios.set(key, audio);
    this.categories.set(key, category);
    this.baseVolumes.set(key, baseVolume);
    this.applyVolume(key);

    if (category === "ambient") {
      this.bindAmbientEvents(audio);
      this.syncAmbient();
    }
  }

  setAmbientSource(src: string, options: AmbientSourceOptions = {}) {
    const existing = this.audios.get("ambient");
    if (existing) {
      existing.pause();
      this.audios.delete("ambient");
      this.categories.delete("ambient");
      this.baseVolumes.delete("ambient");
    }

    if (this.ambientObjectUrl) {
      URL.revokeObjectURL(this.ambientObjectUrl);
      this.ambientObjectUrl = null;
    }

    if (options.isObjectUrl) {
      this.ambientObjectUrl = src;
    }

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = options.loop ?? true;

    const baseVolume = options.volume ?? 0.45;
    this.audios.set("ambient", audio);
    this.categories.set("ambient", "ambient");
    this.baseVolumes.set("ambient", baseVolume);
    this.applyVolume("ambient");
    this.bindAmbientEvents(audio);
    this.syncAmbient();
  }

  play(key: string) {
    if (!this.unlocked) return;

    const audio = this.audios.get(key);
    if (!audio) return;

    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }

  setAmbientActive(active: boolean) {
    this.ambientShouldPlay = active;
    this.syncAmbient();
  }

  stop(key: string) {
    const audio = this.audios.get(key);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }

  stopAll() {
    this.audios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.ambientShouldPlay = false;
  }

  private bindAmbientEvents(audio: HTMLAudioElement) {
    const handleReady = () => this.syncAmbient();
    audio.addEventListener("canplaythrough", handleReady, { once: true });
    audio.addEventListener("loadeddata", handleReady);
    audio.addEventListener("error", () => {
      console.warn("Failed to load ambient audio track");
    });
  }

  private applyVolume(key: string) {
    const audio = this.audios.get(key);
    if (!audio) return;

    const baseVolume = this.baseVolumes.get(key) ?? 1;
    const category = this.categories.get(key) ?? "sfx";
    const ambientMultiplier = category === "ambient" ? this.ambientVolume : 1;
    audio.volume = this.masterVolume * ambientMultiplier * baseVolume;
  }

  private syncAmbient() {
    const audio = this.audios.get("ambient");
    if (!audio) return;

    const shouldPlay =
      this.unlocked && this.ambientVolume > 0 && this.ambientShouldPlay;

    if (!shouldPlay) {
      audio.pause();
      return;
    }

    if (audio.paused) {
      void audio.play().catch(() => {});
    }
  }
}

export const audioManager = new AudioManager();
