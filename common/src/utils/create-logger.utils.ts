
export interface ILogger {
    log: (msg: any, ...rest: any[]) => string;
}
export const createLogger = () : ILogger => {
    const _logs: string[] = [];
let _time = new Date();
    
    return {
        log: (msg: any, ...rest: any[]) => {
            const now = new Date();
            const diff = Math.floor((now.getTime() - _time.getTime() )/1000)
            console.log(msg, ...rest, diff + 'ms');
            _logs.push(msg + (rest.length ? ' - ' + rest.join() : '') + ' ' + diff + 'ms');

            const res = msg + (rest.length ? ' - ' + rest.join(', ') : '');
            return res;
        },
      
    };
};
