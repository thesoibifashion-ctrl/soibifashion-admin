import { useEffect, useState } from "react";

interface CountdownProps {
  seconds: number;
  onResend: () => void;
  isResending?: boolean;
}

const Countdown = ({ seconds, onResend, isResending }: CountdownProps) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining]);

  if (remaining > 0) {
    return (
      <span className="text-[#0D0D0D99]">
        Resend in {remaining}s
      </span>
    );
  }

  return (
    <span
      onClick={!isResending ? onResend : undefined}
      className={`text-[#186D0F] ml-1 cursor-pointer ${
        isResending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {isResending ? "Resending..." : "resend"}
    </span>
  );
};

export default Countdown;