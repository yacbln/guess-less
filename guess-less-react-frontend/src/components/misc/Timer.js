import React, { useState, useEffect } from 'react';
import './Timer.css';

const CountdownTimer = ({ initialCount =10, resetFlag=false,setPenalized}) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [resetFlag, initialCount]);

  useEffect(() => {
    if (count <= 0) {
      setPenalized(true);
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
    </div>
    
    
  );
};

export default CountdownTimer;