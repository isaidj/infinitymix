"use client";

import { useCompletion } from "ai/react";
import { useEffect, useState } from "react";

export default function Completion() {
  const [words, setWords] = useState(["water", "fire"]);
  const {
    completion,
    input,
    setInput,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/infinity",
    body: {
      words: words,
    },
  });
  const addInput = (input) => {
    setWords([...words, input]);
  };

  useEffect(() => {
    let wordsConcat = words.join("+");
    // console.log("wordsConcat", wordsConcat);
    setInput(wordsConcat);
  }, [words]);

  useEffect(() => {
    console.log(completion);
  }, [completion]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <input
            type="text"
            value={input}
            disabled={true}
            onChange={handleInputChange}
            placeholder="Enter completion"
          />

          {words.map((word, index) => (
            <div className="flex relative" key={index}>
              <input
                key={index}
                type="text"
                value={word}
                onChange={(e) => {
                  console.log(words[index]);
                  //editar el valor en la posicion de index dentro del array
                  let newWords = [...words];
                  newWords[index] = e.target.value;
                  setWords(newWords);
                }}
                placeholder={`Enter word ${index + 1}`}
              />
              <div className="absolute right-2">
                <button
                  type="button"
                  onClick={() => {
                    let newWords = [...words];
                    newWords.splice(index, 1);
                    setWords(newWords);
                  }}
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            addInput("water");
          }}
        >
          Add word
        </button>

        <p>Completion result: {completion}</p>
        <button type="button" onClick={stop}>
          Stop
        </button>
        <button disabled={isLoading} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
