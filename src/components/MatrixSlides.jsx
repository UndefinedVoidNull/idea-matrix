"use client";

// MatrixSlides.jsx
import html2canvas from "html2canvas";

import { words } from "@/app/words";

import { Shuffle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { useEffect, useRef, useState } from "react";

export function getRandomWord() {
  const word = words[Math.floor(Math.random() * words.length)];
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getRandomWords() {
  return [getRandomWord(), getRandomWord()];
}

export function WordCard({ word }) {
  const pRef = useRef(null);

  useEffect(() => {
    // console.log(pRef.current);
    fetch(
      `https://www.collinsdictionary.com/us/dictionary/english-thesaurus/${word}`
    )
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const contentElement = doc.querySelector(
          ".content.synonyms.dictionary.thesbase"
        );

        if (contentElement) {
          pRef.current.innerHTML = "";
          pRef.current.appendChild(contentElement);
          pRef.current.scrollTop = 0;
        } else {
          // If synonyms not found, fetch the definition
          fetch(
            `https://www.collinsdictionary.com/us/dictionary/english/${word}`
          )
            .then((response) => response.text())
            .then((html) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, "text/html");
              const contentElement = doc.querySelector(".dictlink");

              if (contentElement) {
                pRef.current.innerHTML = "";
                pRef.current.appendChild(contentElement);
                pRef.current.scrollTop = 0;
              } else {
                pRef.current.innerHTML = "No Result";
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              pRef.current.innerHTML = "No Result";
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        pRef.current.innerHTML = "No Result";
      });
  }, [word]);

  const [isCardShow, setIsCardShow] = useState(false);
  return (
    <>
      <span
        onMouseEnter={(ev) => {
          setIsCardShow(true);
          pRef.current.scrollTop = 0;
        }}
        onMouseLeave={(ev) => {
          setIsCardShow(false);
          pRef.current.scrollTop = 0;
        }}
      >
        {word}
      </span>
      <div
        ref={pRef}
        onMouseEnter={(ev) => {
          setIsCardShow(true);
          pRef.current.scrollTop = 0;
        }}
        onMouseLeave={(ev) => {
          setIsCardShow(false);
          pRef.current.scrollTop = 0;
        }}
        className={`z-10 text-start absolute bg-white rounded-md max-w-[500px] max-h-[300px] overflow-auto border p-4 font-normal ${
          isCardShow ? "" : "hidden"
        }`}
      ></div>
    </>
  );
}

export function EditDialog(props) {
  const { wordCol, wordRow, index, setIndex, wordMatrix, setWordMatrix } =
    props;

  const rowRef = useRef(null);
  const colRef = useRef(null);

  function save() {
    const rowWord = rowRef.current.value;
    const colWord = colRef.current.value;
    setWordMatrix((prev) => [...prev, [rowWord, colWord]]);
    setIndex((prev) => wordMatrix.length);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Words</DialogTitle>
          {/* <DialogDescription>
            Make changes to WordRow, WordCol
          </DialogDescription> */}
        </DialogHeader>
        <div className="flex flex-row items-center gap-3">
          <Label className="text-right">
            Row
          </Label>
          <Input ref={rowRef} defaultValue={wordRow} />
        </div>
        <div className="flex flex-row items-center gap-3">
          <Label className="text-right">
            Col
          </Label>
          <Input ref={colRef} defaultValue={wordCol} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={save}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
            {wordCol} x {wordRow}
          </td>
          <td className="border border-gray-400 px-4 py-2">
            {wordCol} x NOT {wordRow}
          </td>
        </tr>
        <tr>
          <th className="border border-gray-400 px-4 py-2">
            NOT <WordCard word={wordCol} />
          </th>
          <td className="border border-gray-400 px-4 py-2">
            NOT {wordCol} x {wordRow}
          </td>
          <td className="border border-gray-400 px-4 py-2">
            NOT {wordCol} x NOT {wordRow}
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

  if (wordMatrix[0][0] === "") {
    // Data is not available yet, render a loading state or placeholder
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Loader2 className="mr-2 h-[30%] w-[30%] animate-spin" />
      </div>
    );
  }

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
      a.download = "idea-matrix.vercel.app.png";

      // Simulate a click on the anchor element to trigger the download
      a.click();
    });
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h2 className="text-xl font-bold">
        Idea Matrix: {index + 1}/{wordMatrix.length}
      </h2>

      <div>
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

        <EditDialog
          wordRow={wordMatrix[index][0]}
          wordCol={wordMatrix[index][1]}
          index={index}
          setIndex={setIndex}
          wordMatrix={wordMatrix}
          setWordMatrix={setWordMatrix}
        />

        <Button variant="outline" onClick={downloadImage}>
          Save
        </Button>
        <Button variant="outline" onClick={next}>
          {index + 1 === wordMatrix.length ? "New" : "Next"}
        </Button>
      </div>
    </div>
  );
}
