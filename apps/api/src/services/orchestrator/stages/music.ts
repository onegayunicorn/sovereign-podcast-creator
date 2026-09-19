export async function musicStage(ctx: any) {
  return {
    musicRef: `music_${Date.now()}.mp3`,
    mood: ctx.job.request.mood,
  };
}
