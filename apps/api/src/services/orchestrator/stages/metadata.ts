export async function metadataStage(ctx: any) {
  const { job, script } = ctx;
  return {
    title: job.request.prompt.slice(0, 60),
    summary: `An exploration of ${job.request.prompt}`,
    duration: job.request.targetDuration * 60,
    transcript: (script?.segments || []).map((s: any, i: number) => ({
      speaker: s.speaker,
      text: s.text,
      startTime: i * 10,
      endTime: (i + 1) * 10,
    })),
  };
}
