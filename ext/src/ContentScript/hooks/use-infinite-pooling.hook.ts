import { useCallback, useEffect, useRef, useState } from 'react';

export const useInfinitePolling = <T,>(callback: ()=> T | undefined, deps: unknown[]) : T | undefined => {
    const timeoutRef = useRef<undefined | NodeJS.Timeout>();
    const [state,setState] = useState<T>();

    const handler = useCallback(callback, [callback]);

    useEffect(() => {
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        const poll = () => {
            const result = handler();
            timeoutRef.current = setTimeout(poll, 500);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handler, ...deps]);

    return state;
};

