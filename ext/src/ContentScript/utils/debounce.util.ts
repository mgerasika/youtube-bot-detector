export const debounce = (func: () => void, delay: number): () => void => {
    let timeoutId: NodeJS.Timeout | null;
  
    return function (this: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const context = this;
  
      if (timeoutId) {
        clearTimeout(timeoutId); // Clear the previous timeout
      }
  
      timeoutId = setTimeout(() => {
        func.apply(context);
      }, delay);
    };
  };
  