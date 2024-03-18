import React, { useState, useEffect } from 'react';
import './Timer.css';

const CountdownTimer = ({ initialCount = 60 }) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count <= 0) {
      console.log('Timer finished');
      return;
    }

    const intervalId = setInterval(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearInterval(intervalId);

  }, [count]);

  return (
    <div>
    <div className="clock-display">
     {count}
    </div>
    <button onClick={() => setCount(initialCount)}> Reset Timer </button>
    </div>
    
    
  );
};

export default CountdownTimer;