import React, { useState, useEffect } from 'react';
import './Message.css'; 

function TypewriterEffect({ sentence }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset the displayed text whenever the sentence changes
    setDisplayedText('');
    console.log("Received sentence: ", sentence);
    // Define a variable to keep track of the current index
    let currentIndex = 0;
    console.log("last character of sentence:", sentence[sentence.length-1]);
    // Create a function to update the text
    const typeLetter = () => {
      if (currentIndex < sentence.length) {
        console.log("current index: ", currentIndex, "current letter: ",sentence[currentIndex]);
        setDisplayedText((prev) => prev + sentence[currentIndex]);
        console.log("displayed text now =: ", displayedText);
        currentIndex++;
        setTimeout(typeLetter, 100); // Adjust typing speed here
      }
    };

    // Start typing
    typeLetter();

    // Cleanup function to stop typing when component unmounts or sentence changes
    return () => clearTimeout(typeLetter);
  }, [sentence]); // Dependency array to re-run effect when sentence changes

  return (
    <div className='text' >{displayedText}</div>
  );
}

export default TypewriterEffect;