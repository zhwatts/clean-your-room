/** @format */

import { useEffect, useState } from "react";
import "./CountdownModal.css";

interface CountdownModalProps {
  onComplete: () => void;
}

function CountdownModal({ onComplete }: CountdownModalProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const countDown = () => {
      if (count > 1) {
        setTimeout(() => setCount(count - 1), 1000);
      } else if (count === 1) {
        setTimeout(() => {
          setCount(0);
          onComplete();
        }, 1000);
      }
    };

    countDown();
  }, [count, onComplete]);

  return (
    <div className="countdown-modal">
      <div className="countdown-content">
        <h2>Game Starting in</h2>
        <div className="countdown-number">{count}</div>
      </div>
    </div>
  );
}

export default CountdownModal;
