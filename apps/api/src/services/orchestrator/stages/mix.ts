export async function mixStage(ctx: any) {
  return {
    audioUrl: `https://storage.example.com/shows/mix_${Date.now()}.mp3`,
  };
}
