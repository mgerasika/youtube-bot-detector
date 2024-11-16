import { ILogger } from "./create-logger.utils";

export async function resolveWithDealyAsync<T>(data:T, delay: number, logger: ILogger): Promise<T> {
    logger.log('resolve with delay ', data)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve( data);
        },delay)
    })
}