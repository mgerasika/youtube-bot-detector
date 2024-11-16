import { AxiosError } from "axios";

type TError = string | undefined | Error | AxiosError;
export type IAsyncPromiseResult<T> = Promise<[T] | [void, TError] > 