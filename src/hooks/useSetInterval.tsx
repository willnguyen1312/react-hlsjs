import { useEffect, useRef } from 'react';

const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args: any) => {
      const savedCallBackInstance = savedCallback.current;
      if (savedCallBackInstance) {
        savedCallBackInstance(...args);
      }
    };

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return () => clearInterval(id);
    }

    return undefined;
  }, [delay]);
};

export default useInterval;
