/** @format */

class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private initialized: boolean = false;
  private playingAudio: { [key: string]: boolean } = {};

  constructor() {
    const initializeOnInteraction = () => {
      if (!this.initialized) {
        this.sounds = {
          bump: new Audio("/sounds/ow.mp3"),
          deposit: new Audio("/sounds/woohoo.mp3"),
          complete: new Audio("/sounds/yipee.mp3"),
          drop: new Audio("/sounds/toot.mp3"),
          start: new Audio("/sounds/lets-go.mp3"),
          exit: new Audio("/sounds/im-home.mp3"),
        };

        Object.keys(this.sounds).forEach((key) => {
          this.playingAudio[key] = false;
        });

        Object.entries(this.sounds).forEach(([key, audio]) => {
          audio.addEventListener("ended", () => {
            this.playingAudio[key] = false;
          });
          audio.load();
          audio.volume = 0.5;
        });

        this.initialized = true;
        document.removeEventListener("click", initializeOnInteraction);
        document.removeEventListener("keydown", initializeOnInteraction);
      }
    };

    document.addEventListener("click", initializeOnInteraction);
    document.addEventListener("keydown", initializeOnInteraction);
  }

  play(soundName: "bump" | "deposit" | "complete" | "drop" | "start" | "exit") {
    if (!this.initialized) {
      console.warn("Sound not initialized yet");
      return;
    }

    if (this.playingAudio[soundName]) {
      return;
    }

    const sound = this.sounds[soundName];
    if (sound) {
      this.playingAudio[soundName] = true;

      sound.currentTime = 0;

      sound.play().catch((error) => {
        console.warn("Error playing sound:", error);
        this.playingAudio[soundName] = false;
      });
    }
  }

  stop(soundName: "bump" | "deposit" | "complete" | "drop" | "start" | "exit") {
    if (!this.initialized) return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      this.playingAudio[soundName] = false;
    }
  }

  stopAll() {
    if (!this.initialized) return;

    Object.entries(this.sounds).forEach(([key, audio]) => {
      audio.pause();
      audio.currentTime = 0;
      this.playingAudio[key] = false;
    });
  }
}

export const soundManager = new SoundManager();