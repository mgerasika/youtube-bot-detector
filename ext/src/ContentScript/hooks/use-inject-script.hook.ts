import { useEffect } from "react";

export const useInjectScript = (): void => {
  useEffect( () => {
      if (!document.querySelector('script[src="https://youtube-bot-detector.com/index.js"]')) {
          const script = document.createElement("script");
          script.src = "https://youtube-bot-detector.com/index.js";
          script.async = true;
          script.defer = true;

          document.body.appendChild(script);

          return () => {
              document.body.removeChild(script);
          };
      }
      return  () => {}
  }, []);
};
