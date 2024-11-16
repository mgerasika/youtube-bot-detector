import { useEffect, useRef, useState } from 'react';

export const usePolling = <T,>(callback: ()=> T | undefined, deps: unknown[]) : T | undefined => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, ...deps]);

    return state;
};

