class AudioManager {
  private audios: Map<string, HTMLAudioElement> = new Map();
  private unlocked = false;

  unlock() {
    this.unlocked = true;
  }

  load(key: string, src: string, volume = 1) {
    if (this.audios.has(key)) return;

    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;

    this.audios.set(key, audio);
  }

  play(key: string) {
    if (!this.unlocked) return;

    const audio = this.audios.get(key);
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
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
  }
}

export const audioManager = new AudioManager();
