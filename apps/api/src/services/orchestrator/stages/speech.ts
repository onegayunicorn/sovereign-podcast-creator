export async function speechStage(ctx: any) {
  const { job } = ctx;
  return {
    audioRef: `tts_${job.request.personality.host}_${Date.now()}.wav`,
    duration: job.request.targetDuration * 60,
  };
}
