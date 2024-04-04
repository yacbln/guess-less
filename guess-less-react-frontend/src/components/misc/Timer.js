import React, { useState, useEffect } from 'react';
import './Timer.css';

const CountdownTimer = ({ initialCount=20, resetFlag=false,handlePenalized,stopFlag=false}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [resetFlag, initialCount]);

  useEffect(() => {
    if (count <= 0) {
      handlePenalized();
      return;
    }
    //stop timer at the end of the game
    if (stopFlag){
      return;
    }
    const intervalId = setInterval(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearInterval(intervalId);

  }, [count,stopFlag]);

  return (
    <div>
    <div className="clock-display">
     {count}
    </div>
    </div>
    
    
  );
};

export default CountdownTimer;