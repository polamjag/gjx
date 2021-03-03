export const calculateBPMFromBeatInterval = (intervalMs: number): number => {
  return 60 / (intervalMs / 1000);
};

export const calculateBPM = (timestamps: number[]): number => {
  let totalDiffs = 0;
  for (let i = 1; i < timestamps.length; i++) {
    totalDiffs += timestamps[i] - timestamps[i - 1];
  }
  const averageTapDiff = totalDiffs / (timestamps.length - 1);
  return calculateBPMFromBeatInterval(averageTapDiff);
};

export const calculateBeatIntervalMsFromBPM = (bpm: number): number => {
  return (60 / bpm) * 1000;
};
