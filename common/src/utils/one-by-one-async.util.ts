import { IAsyncPromiseResult } from "@common/interfaces/async-promise-result.interface";

type TCancelFn = (error:string) => void;
interface ISettings { timeout: number }
export async function oneByOneAsync<T>(items: T[], fn: (item: T, cancelFn: TCancelFn ) => Promise<unknown>, settings?: ISettings): Promise<IAsyncPromiseResult<void>> {
    let error: string | undefined = undefined;
    const cancelCallback:TCancelFn = (e) => { error = 'error ' + e;}

    const fns = items.map((item) => {
        return () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    fn(item, cancelCallback).then(data => {
                        if(error) {
                            reject(error);
                        }
                        return resolve(data)
                    }).catch(reject);
                }, settings?.timeout !== undefined ? settings.timeout : 0);
            });
        };
    });

    try {
        await fns.reduce((acc, fn: any) => {
            return acc.then(fn);
        }, Promise.resolve());
    } catch (ex) {
        return [, 'error in oneByOneAsync ' + ex]
    }
    return [,];
}
