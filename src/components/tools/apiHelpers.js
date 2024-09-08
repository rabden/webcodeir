export const queryModel = async (model, data, API_KEY) => {
  const modelEndpoints = {
    StableDiffusion: "stabilityai/stable-diffusion-3-medium-diffusers",
    FLUX: "black-forest-labs/FLUX.1-schnell",
    Hent: "stablediffusionapi/explicit-freedom-nsfw-wai"
  };
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${modelEndpoints[model]}`,
    {
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return response;
};