import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export type IQueryReturn<T> = [T, undefined] | [undefined, string | Error | AxiosError] | [T];

export async function useQuery<T>(callback: () => Promise<T>): Promise<IQueryReturn<T>> {
    const [state,setState] = useState<T>();

    try {
        const data = (await callback()) as T;
        setState(data)
        return [data];
    } catch (ex) {
        const error = (ex as Error) || 'empty error';
        return [undefined, error];
    }
}


