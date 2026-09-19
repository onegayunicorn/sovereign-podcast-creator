export async function coverStage(_ctx: any) {
  return {
    imageUrl: `https://storage.example.com/covers/cover_${Date.now()}.png`,
  };
}
