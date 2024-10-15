import { AxiosError } from "axios";

type TError = string | Error | AxiosError | undefined;
export type IAsyncPromiseResult<T = any> = Promise<([T , string]) | ([T]) | [undefined, TError]>