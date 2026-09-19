export async function scriptStage(ctx: any) {
  const { job } = ctx;
  return {
    segments: [
      { speaker: 'Host', text: `Welcome to today's episode on ${job.request.prompt}.` },
      { speaker: 'Guest', text: `Thanks for having me. This is a fascinating topic.` },
      { speaker: 'Host', text: `Let's dive into the details.` },
    ],
  };
}
