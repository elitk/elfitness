"use client";
import React, { useState, useRef } from "react";

const WorkoutTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
  };

  const pause = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setSeconds(0);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center w-full max-w-xs mx-auto">
      <div className="text-4xl font-mono text-gray-900 dark:text-white mb-4">{mins}:{secs}</div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          onClick={start}
          disabled={running}
        >
          Start
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50"
          onClick={pause}
          disabled={!running}
        >
          Pause
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default WorkoutTimer; 