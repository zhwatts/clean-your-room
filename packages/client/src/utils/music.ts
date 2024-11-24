/** @format */

class MusicManager {
  private musicA: HTMLAudioElement | null = null;
  private musicB: HTMLAudioElement | null = null;
  private currentChannel: "A" | "B" | null = null;
  private muted = false;

  constructor() {
    try {
      this.musicA = new Audio("/music/channel-a.mp3");
      this.musicB = new Audio("/music/channel-b.mp3");

      if (this.musicA && this.musicB) {
        this.musicA.loop = true;
        this.musicB.loop = true;
        this.musicA.volume = 0.3;
        this.musicB.volume = 0.3;
      }
    } catch (error) {
      console.warn("Music initialization failed:", error);
    }
  }

  playChannelA() {
    if (!this.musicA) return;
    if (this.musicB) this.musicB.pause();
    if (!this.muted) {
      this.musicA.currentTime = 0;
      this.musicA
        .play()
        .catch((err) => console.warn("Failed to play channel A:", err));
    }
    this.currentChannel = "A";
  }

  playChannelB() {
    if (!this.musicB) return;
    if (this.musicA) this.musicA.pause();
    if (!this.muted) {
      this.musicB.currentTime = 0;
      this.musicB
        .play()
        .catch((err) => console.warn("Failed to play channel B:", err));
    }
    this.currentChannel = "B";
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      if (this.musicA) this.musicA.pause();
      if (this.musicB) this.musicB.pause();
    } else if (this.currentChannel) {
      if (this.currentChannel === "A" && this.musicA) {
        this.musicA.currentTime = 0;
        this.musicA
          .play()
          .catch((err) => console.warn("Failed to resume channel A:", err));
      } else if (this.currentChannel === "B" && this.musicB) {
        this.musicB.currentTime = 0;
        this.musicB
          .play()
          .catch((err) => console.warn("Failed to resume channel B:", err));
      }
    }
  }

  stopAll() {
    if (this.musicA) {
      this.musicA.pause();
      this.musicA.currentTime = 0;
    }
    if (this.musicB) {
      this.musicB.pause();
      this.musicB.currentTime = 0;
    }
    this.currentChannel = null;
  }

  isPlaying(channel: "A" | "B") {
    return this.currentChannel === channel && !this.muted;
  }

  getMuted() {
    return this.muted;
  }
}

export const musicManager = new MusicManager();
