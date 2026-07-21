import { useEffect, useState } from "react";

export function useCountdown(initialTime: number) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const restart = () => {
    setTimeLeft(initialTime);
  };

  return {
    timeLeft,
    isExpired: timeLeft === 0,
    restart,
  };
}