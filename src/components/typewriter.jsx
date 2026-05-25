import React, { useState, useEffect } from 'react';

const words = ["Discover", "Learn", "Build"];

const TypewriterText = ({ theme }) => {
  const [currentText, setCurrentText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState("typing"); // "typing", "blinking", "erasing"
  const [blinkCount, setBlinkCount] = useState(0);
  const [dotVisible, setDotVisible] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];

    if (phase === "typing") {
      // Type letter by letter
      if (currentText.length < word.length) {
        const timeout = setTimeout(() => {
          setCurrentText(word.slice(0, currentText.length + 1));
        }, 150); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        // Word is finished, move to blinking phase
        const timeout = setTimeout(() => {
          setPhase("blinking");
          setBlinkCount(0);
          setDotVisible(true);
        }, 200);
        return () => clearTimeout(timeout);
      }
    }

    if (phase === "blinking") {
      // Blink the dot 3 times (On->Off->On->Off->On->Off = 6 state changes)
      if (blinkCount < 6) {
        const timeout = setTimeout(() => {
          setDotVisible((prev) => !prev);
          setBlinkCount((prev) => prev + 1);
        }, 300); // Speed of the blink
        return () => clearTimeout(timeout);
      } else {
        // Done blinking, prepare to erase
        const timeout = setTimeout(() => {
          setPhase("erasing");
          setDotVisible(false);
        }, 300);
        return () => clearTimeout(timeout);
      }
    }

    if (phase === "erasing") {
      // Erase letter by letter
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(word.slice(0, currentText.length - 1));
        }, 100); // Erasing speed
        return () => clearTimeout(timeout);
      } else {
        // Word is fully erased, move to the next word
        setWordIndex((prev) => (prev + 1) % words.length);
        setPhase("typing");
      }
    }
  }, [currentText, phase, wordIndex, blinkCount]);

  return (
    // Fixed height ensures the container doesn't jump up and down when empty
    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center select-none cursor-default flex justify-center items-center h-20 md:h-28">
      <span className={`text-transparent bg-clip-text bg-gradient-to-b ${theme === 'dark' ? 'from-white to-neutral-400' : 'from-black to-black/70'}`}>
        {currentText}
      </span>
      <span
        className={` ml-1 transition-opacity duration-75 ${
          dotVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        .
      </span>
    </h1>
  );
};

export default TypewriterText;