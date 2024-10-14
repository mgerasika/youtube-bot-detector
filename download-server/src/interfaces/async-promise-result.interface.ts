
export type IAsyncPromiseResult<T> = Promise<([T , string]) | ([T]) | [undefined, string]>