type AudioCategory = "sfx" | "ambient";

type LoadOptions = {
  category?: AudioCategory;
  volume?: number;
  loop?: boolean;
};

class AudioManager {
  private audios = new Map<string, HTMLAudioElement>();
  private categories = new Map<string, AudioCategory>();
  private baseVolumes = new Map<string, number>();
  private unlocked = false;
  private masterVolume = 0.8;
  private sfxEnabled = true;
  private ambientEnabled = true;
  private ambientShouldPlay = false;

  unlock() {
    this.unlocked = true;
    this.syncAmbient();
  }

  configure(options: {
    masterVolume?: number;
    sfxEnabled?: boolean;
    ambientEnabled?: boolean;
  }) {
    if (options.masterVolume !== undefined) {
      this.masterVolume = Math.max(0, Math.min(1, options.masterVolume / 100));
    }
    if (options.sfxEnabled !== undefined) {
      this.sfxEnabled = options.sfxEnabled;
    }
    if (options.ambientEnabled !== undefined) {
      this.ambientEnabled = options.ambientEnabled;
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
      const handleReady = () => this.syncAmbient();
      audio.addEventListener("canplaythrough", handleReady, { once: true });
      audio.addEventListener("loadeddata", handleReady);
      audio.addEventListener("error", () => {
        console.warn(`Failed to load ambient audio: ${src}`);
      });
      this.syncAmbient();
    }
  }

  play(key: string) {
    if (!this.unlocked) return;

    const category = this.categories.get(key) ?? "sfx";
    if (category === "sfx" && !this.sfxEnabled) return;

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

  private applyVolume(key: string) {
    const audio = this.audios.get(key);
    if (!audio) return;

    const baseVolume = this.baseVolumes.get(key) ?? 1;
    audio.volume = this.masterVolume * baseVolume;
  }

  private syncAmbient() {
    const audio = this.audios.get("ambient");
    if (!audio) return;

    const shouldPlay =
      this.unlocked && this.ambientEnabled && this.ambientShouldPlay;

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
