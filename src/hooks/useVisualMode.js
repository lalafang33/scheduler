import { useState } from "react";

 export default function useVisualMode (initialMode) {
  const [history, setHistory] = useState([initialMode]);

  // replaces previous mode in hisotry with new 
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
    if(history.length < 2){
      return 
    }
    // setting history to not include the last item of the array 
    setHistory((prev) => 
    [...prev.slice(0, history.length -1)])
  };
  // returning mode as the last item of history 
  return {
    mode: history[history.length - 1],
    transition,
    back
  };
};

