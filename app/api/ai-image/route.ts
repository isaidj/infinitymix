//river, clean, modern style,league of legends style, valorant style
import Replicate from "replicate";

const REACT_REPLICATE_API_TOKEN = process.env.REACT_REPLICATE_API_TOKEN;

const replicate = new Replicate({
  auth: REACT_REPLICATE_API_TOKEN,
});
//bytedance/sdxl-lightning-4step
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const word = body.word;
    console.log("word", word);

    let response;
    response = await runSdxl({ word });
    //response es el resultado de la ejecución del modelo que genera imagen
    console.log(response);
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

const runSdxl = async ({ word }: { word: string }) => {
  try {
    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a",
      {
        input: {
          prompt: `Generate an image representing the element ${word} in a visual style similar to that of Arcane animation 2.5D. The image should be sized 200px * 300px`,

          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 0,
          negative_prompt: "worst quality, low quality",
          num_inference_steps: 4,
        },
      }
    );
    console.log(output);
    return output;
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
