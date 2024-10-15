import { AxiosError } from "axios";

export type IAsyncPromiseResult<T = any> = Promise<([T , string]) | ([T]) | [undefined, string | Error | AxiosError]>