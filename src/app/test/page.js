// import { WordCard } from '@/components/MatrixSlides'
"use client"
import { useRef, useEffect, useState } from "react";

import "./page.css"

export function WordCard({ word }) {
  const pRef = useRef(null);

  useEffect(() => {
    console.log(pRef.current);
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

        if (contentElement && pRef.current.childNodes.length === 0) {
          console.log(contentElement)
          pRef.current.appendChild(contentElement);
        } else {
          pRef.current.appendChild(<div>No Result</div>);
          // throw new Error("Element with the specified className not found.");
        }

      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }, [word]);

  const [isCardShow, setIsCardShow] = useState(false)
  return (
    <>
      <h1
        onMouseEnter={ev => { setIsCardShow(true) }}
      >
        {word}
      </h1>
      <p
        ref={pRef}
        onMouseLeave={ev => { setIsCardShow(false) }}
        className={`rounded-md w-[400px] h-[300px] overflow-auto border p-4 font-normal ${isCardShow ? "" : "hidden"}`}
      ></p>
    </>
  );
}


export default function Test() {

  return (
    <>
      <WordCard word={"man"} />
    </>
  )
}