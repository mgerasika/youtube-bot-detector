import { useState, useEffect, useRef, RefObject } from 'react';
import { usePolling } from './use-pooling.hook';

export function useHover<T extends HTMLElement>(): [RefObject<T>, boolean] {
  const [isHovered, setIsHovered] = useState(false);
  const internalRef = useRef<T>(null);
  const node = usePolling( () => internalRef.current, [internalRef.current] );

  useEffect(() => {
    if (!node) return;

    console.log('listned')
    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [node]);

  return [internalRef, isHovered];
}

