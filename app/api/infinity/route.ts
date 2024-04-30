import Replicate from "replicate";
import { ReplicateStream, StreamingTextResponse } from "ai";

const REACT_REPLICATE_API_TOKEN = process.env.REACT_REPLICATE_API_TOKEN;

const replicate = new Replicate({
  auth: REACT_REPLICATE_API_TOKEN,
});

interface Model {
  id: string;
  name: string;
  shortened: string;
  emoji: string;
  description: string;
}
const MODELS: Model[] = [
  {
    id: "meta/llama-2-70b-chat",
    name: "Llama 2 70B",
    shortened: "70B",
    emoji: "🦙",
    description: "The most accurate, powerful Llama.",
  },
  {
    id: "meta/llama-2-13b-chat",
    name: "Llama 2 13B",
    shortened: "13B",
    emoji: "🦙",
    description: "Faster and cheaper at the expense of accuracy.",
  },

  {
    id: "meta/llama-2-7b-chat",
    name: "Llama 2 7B",
    shortened: "7B",
    emoji: "🦙",
    description: "The smallest, fastest chat model.",
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const words = body.words;
    // console.log("words", words);
    let response;
    response = await runLlama(MODELS[3], words);
    const stream = await ReplicateStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function runLlama(model: Model, words: string[]) {
  console.log("words", words);
  const prompt = `Recive words and you have to find a new word that combines them. When you have thought of the correct word, respond with a single sticker and an object that represents the combination of the words. non conclusion,not sentences. For example:\nInput: [word]+[word]\nAnswer: [sticker][word]\nwords: ${words
    .map((word) => `[${word}]`)
    .join("+")}`;

  const input = {
    top_k: 50,
    top_p: 0.9,
    prompt: prompt,

    max_tokens: 512,
    min_tokens: 0,
    temperature: 0.6,
    prompt_template:
      "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    presence_penalty: 1.15,
    frequency_penalty: 0.2,
  };
  return await replicate.predictions.create({
    model: "meta/meta-llama-3-70b-instruct",
    stream: true,
    input,
  });
}
