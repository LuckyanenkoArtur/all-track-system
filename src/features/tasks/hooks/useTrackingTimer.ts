import { useEffect, useState } from "react";
import { useTasks } from "./useTasks";

export function useTrackingTimer() {
  const { tracking } = useTasks();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!tracking) return;

    const intervalId = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [tracking]);

  return tracking;
}
