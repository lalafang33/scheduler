import { useState } from "react";

 export default function useVisualMode (initialMode) {
  const [history, setHistory] = useState([initialMode]);

  const transition = (newView, replace = false) => {
    if (replace) {
      return setHistory((prev) => {
        const copy = [
          ...prev.slice(0, prev.length - 1),
          newView
        ];

        return copy;
      });
    }

    setHistory((prev) => {
      const copy = [...prev, newView];
      return copy;
    });
  };

  const back = () => {
    setHistory((prev) => {
      if (prev.length > 1) {
        const copy = prev.slice(0, prev.length - 1);
        return copy;
      }

      return prev;
    });
  };

  return {
    mode: history[history.length - 1],
    transition,
    back
  };
};

