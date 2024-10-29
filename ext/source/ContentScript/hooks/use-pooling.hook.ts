import { useEffect, useRef, useState } from 'react';

export const usePolling = <T,>(callback: ()=> T | undefined, deps: any[]) : T | undefined => {
    const timeoutRef = useRef<undefined | NodeJS.Timeout>();
    const [state,setState] = useState<T>();
    useEffect(() => {
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        const poll = () => {
            const result = callback();
            if (result === undefined) {
                timeoutRef.current = setTimeout(poll, 500);
            }
            else {
                setState(result);
            }
        };

        poll();

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [callback, ...deps]);

    return state;
};

