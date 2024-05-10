"use client";

// MatrixSlides.jsx
import { words } from "@/app/words";
import { Shuffle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import html2canvas from "html2canvas";

async function fetchData(word) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const json = await res.json();

  // const sourceUrls = json[0].sourceUrls
  const antonyms = json[0].meanings[0].antonyms;
  const synonyms = json[0].meanings[0].synonyms;
  const definitions = json[0].meanings[0].definitions;
  console.log("antonyms: ", antonyms);
  console.log("synonyms: ", synonyms);
  definitions.forEach((definitionWrapper) => {
    console.log("definition: ", definitionWrapper.definition);
  });
}
fetchData("wicked");

export function getRandomWord() {
  const word = words[Math.floor(Math.random() * words.length)];
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getRandomWords() {
  return [getRandomWord(), getRandomWord()];
}

export function WordCard({ word }) {
  return (
    <HoverCard>
      <HoverCardTrigger>{word}</HoverCardTrigger>
      <HoverCardContent>
        Good
        {/* {json} */}
      </HoverCardContent>
    </HoverCard>
  );
}

export function Matrix(props) {
  const { wordCol, wordRow, index, setIndex, wordMatrix, setWordMatrix } =
    props;

  function shuffleRow() {
    const newWords = [getRandomWord(), wordMatrix[index][1]];
    setWordMatrix((prev) => [...prev, newWords]);
    setIndex(wordMatrix.length);
  }

  function shuffleCol() {
    const newWords = [wordMatrix[index][0], getRandomWord()];
    setWordMatrix((prev) => [...prev, newWords]);
    setIndex(wordMatrix.length);
  }

  return (
    <table className="table-auto border-collapse border border-gray-400">
      <thead>
        <tr>
          <th className="border border-gray-400 px-4 py-2">
            <Button variant="ghost" onClick={shuffleCol}>
              <Shuffle size={14} /> Col
            </Button>
            \
            <Button variant="ghost" onClick={shuffleRow}>
              <Shuffle size={14} /> Row
            </Button>
          </th>
          <th className="border border-gray-400 px-4 py-2">
            <WordCard word={wordRow} />
          </th>
          <th className="border border-gray-400 px-4 py-2">
            NOT <WordCard word={wordRow} />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th className="border border-gray-400 px-4 py-2">
            <WordCard word={wordCol} />
          </th>
          <td className="border border-gray-400 px-4 py-2">
            <WordCard word={wordCol} /> x <WordCard word={wordRow} />
          </td>
          <td className="border border-gray-400 px-4 py-2">
            <WordCard word={wordCol} /> x NOT <WordCard word={wordRow} />
          </td>
        </tr>
        <tr>
          <th className="border border-gray-400 px-4 py-2">
            NOT <WordCard word={wordCol} />
          </th>
          <td className="border border-gray-400 px-4 py-2">
            NOT <WordCard word={wordCol} /> x <WordCard word={wordRow} />
          </td>
          <td className="border border-gray-400 px-4 py-2">
            NOT <WordCard word={wordCol} /> x NOT <WordCard word={wordRow} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function MatrixSlides() {
  const [wordMatrix, setWordMatrix] = useState([["", ""]]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setWordMatrix((prevWords) => [getRandomWords()]);
  }, []);

  function prev() {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  }

  function next() {
    const isLastOne = index + 1 === wordMatrix.length;
    if (isLastOne) {
      setWordMatrix((prevWords) => [...prevWords, getRandomWords()]);
    }
    setIndex((prevIndex) => prevIndex + 1);
  }

  function downloadImage() {
    // Get the element you want to capture
    const element = document.getElementById("matrix");

    // Use html2canvas to capture the element and convert it into an image
    html2canvas(element).then((canvas) => {
      // Create a temporary URL for the canvas image
      const url = canvas.toDataURL("image/png");

      // Create a new anchor element
      const a = document.createElement("a");
      a.href = url;
      a.download = "content.png";

      // Simulate a click on the anchor element to trigger the download
      a.click();
    });
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h2 className="text-xl font-bold">
        Idea Matrix: {index + 1}/{wordMatrix.length}
      </h2>

      <div id="matrix">
        <Matrix
          wordRow={wordMatrix[index][0]}
          wordCol={wordMatrix[index][1]}
          index={index}
          setIndex={setIndex}
          wordMatrix={wordMatrix}
          setWordMatrix={setWordMatrix}
        />
      </div>

      <div className="flex flex-row justify-between mt-6 w-[60%]">
        <Button variant="outline" onClick={prev}>
          Prev
        </Button>
        <Button variant="outline" onClick={downloadImage}>
          Save
        </Button>
        <Button variant="outline" onClick={next}>
          Next
        </Button>
      </div>
    </div>
  );
}
