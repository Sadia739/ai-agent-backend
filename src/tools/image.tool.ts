export const generateImage = async (
  prompt: string,
  size: string = "1024x1024",
  n: number = 1
) => {
  try {
    const [width = "1024", height = "1024"] = size.split("x");

    const images: { url: string }[] = [];

    for (let i = 0; i < n; i++) {
      // Pollinations only accepts a 32-bit integer
      const seed = Math.floor(Math.random() * 2_147_483_647);

      const url =
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
        `?width=${width}` +
        `&height=${height}` +
        `&seed=${seed}` +
        `&model=flux`;

      images.push({
        url,
      });
    }

    return {
      success: true,
      images,
    };
  } catch (error) {
    console.error("IMAGE ERROR:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate image.",
    };
  }
};