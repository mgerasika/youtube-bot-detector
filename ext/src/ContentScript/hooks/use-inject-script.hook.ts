import { useEffect } from "react";

export const useInjectScript = (): void => {
    const head = document.head;
  useEffect( () => {
      if (head && !document.querySelector('script[src="https://youtube-bot-detector.com/index.js"]')) {
          const script = document.createElement("script");
          script.src = "https://youtube-bot-detector.com/index.js";
          script.type = 'text/javascript';          
          script.async = true;
          head.appendChild(script);

          return () => {
              head.removeChild(script);
          };
      }
      return  () => {}
  }, [head]);
};
