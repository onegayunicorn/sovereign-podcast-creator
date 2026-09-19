export interface MixerChannel {
  volume: number;
  muted: boolean;
  solo: boolean;
}

export interface MixerState {
  channels: {
    host: MixerChannel;
    guest: MixerChannel;
    music: MixerChannel;
    sfx: MixerChannel;
    caller: MixerChannel;
    aiVoice: MixerChannel;
  };
  master: MixerChannel;
}
