import { ILogger } from "./create-logger.utils";

export async function resolveWithDealyAsync<T>(data:T, delay: number, logger: ILogger): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve( data);
        },delay)
    })
}