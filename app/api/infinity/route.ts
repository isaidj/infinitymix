import Replicate from "replicate";
import { ReplicateStream, StreamingTextResponse } from "ai";

const REACT_REPLICATE_API_TOKEN = process.env.REACT_REPLICATE_API_TOKEN;
// curl -s -X POST \
//   -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
//   -H "Content-Type: application/json" \
//   -d $'{
//     "version": "02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
//     "input": {
//       "debug": false,
//       "top_k": 50,
//       "top_p": 1,
//       "prompt": "User\I\'m going to give you two words and you\'re going to give me one back, but let it be a relationship and make sense with the meaning of the two words. Give me an example if you understood.\Take into account chemistry and physics too.\fictional, historical and real characters.\Just respond with a word or two that are nouns only.",
//       "temperature": 0.5,
//       "system_prompt": "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\\If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don\'t know the answer to a question, please don\'t share false information.",
//       "max_new_tokens": 500,
//       "min_new_tokens": -1
//     }
//   }' \
//   https://api.replicate.com/v1/predictions

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

const MAX_TOKENS = 800;
const temp = 0.75;
export async function POST(req: Request) {
  //   const params = await req.json();
  let response;
  response = await runLlama(MODELS[3]);

  // Convert the response into a friendly text-stream
  const stream = await ReplicateStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
async function runLlama(model: Model) {
  console.log("running llama");
  console.log("model", model);

  return await replicate.predictions.create({
    model: "meta/meta-llama-3-70b-instruct", // "meta/llama-2-7b-chat
    stream: true,
    input: {
      prompt: `Imagine that I provide you with two words and you must find a third word that combines both, considering principles of physics and chemistry. Once you have thought of the right word, respond using a single sticker and an object that represents the combination of the two words. For example:
      template input: [word] + [word]
      template answer: [sticker] [word result]`,
      prompt_template: "[word] + [word] = [word result]",
      max_new_tokens: MAX_TOKENS,
      temperature: 0.75,
      repetition_penalty: 1,
      top_p: 0.9,
    },
  });
}
