/** @format */

class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private audioContext: AudioContext | null = null;
  private vacuumBuffer: AudioBuffer | null = null;
  private vacuumSource: AudioBufferSourceNode | null = null;
  private vacuumGainNode: GainNode | null = null;
  private initialized: boolean = false;
  private playingAudio: { [key: string]: boolean } = {};

  constructor() {
    const initializeOnInteraction = async () => {
      if (!this.initialized) {
        this.audioContext = new AudioContext();

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

        await this.loadVacuumSound();

        this.initialized = true;
        document.removeEventListener("click", initializeOnInteraction);
        document.removeEventListener("keydown", initializeOnInteraction);
      }
    };

    document.addEventListener("click", initializeOnInteraction);
    document.addEventListener("keydown", initializeOnInteraction);
  }

  private async loadVacuumSound() {
    if (!this.audioContext) return;

    const response = await fetch("/sounds/vacuum.mp3");
    const arrayBuffer = await response.arrayBuffer();
    this.vacuumBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }

  private playVacuumSound() {
    if (!this.audioContext || !this.vacuumBuffer) return;

    this.vacuumSource = this.audioContext.createBufferSource();
    this.vacuumGainNode = this.audioContext.createGain();

    this.vacuumSource.buffer = this.vacuumBuffer;
    this.vacuumSource.loop = true; // Loop the sound
    this.vacuumSource.connect(this.vacuumGainNode);
    this.vacuumGainNode.connect(this.audioContext.destination);

    this.vacuumGainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime); // Set volume to 10%

    this.vacuumSource.start(0);
  }

  play(
    soundName:
      | "bump"
      | "deposit"
      | "complete"
      | "drop"
      | "start"
      | "exit"
      | "vacuum"
  ) {
    if (!this.initialized) {
      console.warn("Sound not initialized yet");
      return;
    }

    if (this.playingAudio[soundName]) {
      return;
    }

    if (soundName === "vacuum" && this.vacuumBuffer && this.audioContext) {
      this.playVacuumSound();
      this.playingAudio[soundName] = true;
    } else {
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
  }

  stop(
    soundName:
      | "bump"
      | "deposit"
      | "complete"
      | "drop"
      | "start"
      | "exit"
      | "vacuum"
  ) {
    if (!this.initialized) return;

    if (soundName === "vacuum" && this.vacuumSource && this.vacuumGainNode) {
      this.vacuumSource.stop();
      this.vacuumSource.disconnect();
      this.vacuumGainNode.disconnect();
      this.vacuumSource = null;
      this.vacuumGainNode = null;
      this.playingAudio[soundName] = false;
    } else {
      const sound = this.sounds[soundName];
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
        this.playingAudio[soundName] = false;
      }
    }
  }

  stopAll() {
    if (!this.initialized) return;

    Object.entries(this.sounds).forEach(([key, audio]) => {
      audio.pause();
      audio.currentTime = 0;
      this.playingAudio[key] = false;
    });

    if (this.vacuumSource && this.vacuumGainNode) {
      this.vacuumSource.stop();
      this.vacuumSource.disconnect();
      this.vacuumGainNode.disconnect();
      this.vacuumSource = null;
      this.vacuumGainNode = null;
      this.playingAudio["vacuum"] = false;
    }
  }
}

export const soundManager = new SoundManager();
