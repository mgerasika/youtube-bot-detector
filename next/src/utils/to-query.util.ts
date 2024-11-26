import { AxiosError } from 'axios';

export type IQueryReturn<T> = [T, undefined] | [undefined, string | Error | AxiosError | unknown] | [T];

export async function toQuery<T>(callback: () => Promise<T>): Promise<IQueryReturn<T>> {
    try {
        const data = (await callback()) as T;
        return [data];
    } catch (ex) {
        return [undefined,'Error in toQuery' + ex];
    }
}

