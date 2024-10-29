import { useCallback, useEffect, useRef, useState } from 'react';

export const useInfinitePolling = <T,>(callback: ()=> T | undefined, deps: any[]) : T | undefined => {
    const timeoutRef = useRef<undefined | NodeJS.Timeout>();
    const [state,setState] = useState<T>();

    const handler = useCallback(callback, deps);

    useEffect(() => {
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        const poll = () => {
            const result = handler();
            timeoutRef.current = setTimeout(poll, 50);
            if(result) {
                setState(prev => {
                    if(JSON.stringify(prev) !== JSON.stringify(result)) {
                        return result;
                    }
                    return prev;
                });
            }
        };

        poll();

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [handler, ...deps]);

    return state;
};

