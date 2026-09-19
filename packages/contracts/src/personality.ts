export interface PersonalityProfile {
  id: string;
  name: string;
  pitch: {
    meanHz: number;
    varianceHz: number;
  };
  tempo: {
    rate: number;
  };
  formant: {
    scale: number;
  };
  expression: {
    energy: number;
    warmth: number;
    stability: number;
  };
}
