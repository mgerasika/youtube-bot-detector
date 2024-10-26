import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from '../utils/debounce.util';


interface UseScrollOptions {
  onScroll?: () => void; 
}

export const useScroll = ({  onScroll }: UseScrollOptions) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const handleScroll = useCallback(() => {
    setScrollPosition(window.scrollY);
  },[]);

  const debounceCallback = useMemo(() => {
    return debounce(() => {
        handleScroll();
        if (onScroll) {
          onScroll(); // Call the callback when throttle ends
        }
      }, 400);
  },[onScroll, handleScroll])

  useEffect(() => {
    window.addEventListener('scroll', debounceCallback);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', debounceCallback);
    };
  }, [debounceCallback]);

  return scrollPosition;
};

