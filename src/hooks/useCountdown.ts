import { useCallback, useEffect, useState } from "react";

const DEFAULT_COOLDOWN_SECONDS = 30;

export function useCountdown(initialSeconds = DEFAULT_COOLDOWN_SECONDS) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timeout = setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const start = useCallback(
    (seconds = initialSeconds) => {
      setSecondsLeft(Math.max(0, Math.floor(seconds)));
    },
    [initialSeconds],
  );

  const reset = useCallback(() => setSecondsLeft(0), []);

  return {
    secondsLeft,
    isRunning: secondsLeft > 0,
    start,
    reset,
  };
}
