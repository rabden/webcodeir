import { queryModel } from './apiHelpers';

export const generateImage = async (model, state, setState, API_KEY, MAX_SEED) => {
  setState(prevState => ({
    ...prevState,
    loading: { ...prevState.loading, [model]: true }
  }));

  let data;
  if (model === 'FLUX') {
    const { seed, randomize_seed, width, height, num_inference_steps } = state.fluxParams;
    data = {
      inputs: state.prompts[model],
      seed: randomize_seed ? Math.floor(Math.random() * MAX_SEED) : seed,
      width,
      height,
      num_inference_steps,
    };
  } else {
    data = {
      inputs: state.prompts[model],
      seed: Math.floor(Math.random() * MAX_SEED),
    };
  }
  
  setState(prevState => ({
    ...prevState,
    results: {
      ...prevState.results,
      [model]: [{ loading: true, seed: data.seed, prompt: state.prompts[model] }, ...prevState.results[model]]
    }
  }));

  try {
    const response = await queryModel(model, data, API_KEY);
    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    setState(prevState => ({ 
      ...prevState,
      results: {
        ...prevState.results,
        [model]: prevState.results[model].map((item, index) => 
          index === 0 ? { imageUrl, seed: data.seed, prompt: state.prompts[model], blob: imageBlob } : item
        )
      },
      fluxParams: {
        ...prevState.fluxParams,
        seed: data.seed // Update the seed with the one used for generation
      }
    }));
  } catch (error) {
    console.error('Error:', error);
    setState(prevState => ({ 
      ...prevState,
      results: {
        ...prevState.results,
        [model]: prevState.results[model].map((item, index) => 
          index === 0 ? { error: 'Error generating image. Please try again.', seed: data.seed, prompt: state.prompts[model] } : item
        )
      }
    }));
  }
  setState(prevState => ({
    ...prevState,
    loading: { ...prevState.loading, [model]: false }
  }));
};

export const copyToClipboard = (text, toast) => {
  navigator.clipboard.writeText(text);
  toast({
    title: "Copied!",
    description: "Copied to clipboard",
  });
};

export const downloadImage = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};