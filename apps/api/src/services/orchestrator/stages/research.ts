export async function researchStage(ctx: any) {
  const { job } = ctx;
  return {
    sources: [
      `Research topic: ${job.request.prompt}`,
      `Category: ${job.request.category}`,
    ],
    summary: `Synthesized research on "${job.request.prompt}"`,
  };
}
