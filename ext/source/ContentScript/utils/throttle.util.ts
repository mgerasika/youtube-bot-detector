// Throttle function
export const throttle = (func: () => void, limit: number): () => void => {
    let lastFunc: NodeJS.Timeout | null;
    let lastRan: number | null = null;
  
    return function (this: any) {
      const context = this;
      const now = Date.now();
  
      if (lastRan === null || now - lastRan >= limit) {
        func.apply(context);
        lastRan = now;
      } else {
        if (lastFunc) clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          func.apply(context);
          lastRan = now;
        }, limit);
      }
    };
  };