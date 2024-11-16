import { useCallback, useEffect, useRef } from 'react';

export const useDelay = (callback: () => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear the timeout if the component unmounts or the delay changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(() => {
    // Clear any existing timeout before setting a new one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  },[callback, delay]);

};

