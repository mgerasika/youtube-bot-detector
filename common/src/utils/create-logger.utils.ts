
export interface ILogger {
    log: (msg: any, ...rest: any[]) => string;
}
export const createLogger = () : ILogger => {
    const _logs: string[] = [];

    
    return {
        log: (msg: any, ...rest: any[]) => {
            console.log(msg, ...rest);
            _logs.push(msg + (rest.length ? ' - ' + rest.join() : ''));

            const res = msg + (rest.length ? ' - ' + rest.join(', ') : '');
            return res;
        },
      
    };
};
