// Web Audio API & Speech Synthesis for Railway Emergency Broadcasts

class AudioManager {
  private ctx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private isSirenPlaying = false;
  private sirenInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // High-intensity Emergency Buzzer / Railway Alarm
  playBuzzerSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(920, this.ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.9);
    } catch {
      // Audio context may be restricted by autoplay policy
    }
  }

  // Continuous Emergency Siren for extreme SOS
  startContinuousSiren() {
    if (this.isSirenPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      this.isSirenPlaying = true;
      let toggle = false;

      const playPulse = () => {
        if (!this.isSirenPlaying || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(toggle ? 960 : 640, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.48);
        toggle = !toggle;
      };

      playPulse();
      this.sirenInterval = window.setInterval(playPulse, 500);
    } catch {
      // fallback
    }
  }

  stopContinuousSiren() {
    this.isSirenPlaying = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }

  // Railway Intercom chime before speech announcement
  playIntercomChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.16);
        gain.gain.setValueAtTime(0.18, now + index * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.16 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + index * 0.16);
        osc.stop(now + index * 0.16 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // Text-to-Speech public address broadcast
  speakAnnouncement(text: string, voiceRate = 1.0) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceRate;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // ignore
    }
  }
}

export const audioService = new AudioManager();
