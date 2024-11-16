
import { stringify } from 'flatted';

export interface ILogger {
    log: (msg: any, ...rest: any[]) => string;
}
let _idx = 0;

export const createLogger = () : ILogger => {
    let _time = new Date();
    _idx++;

    return {
        log: (msg: any, ...rest: any[]) => {
            const now = new Date();
            const diff = ((now.getTime() - _time.getTime() )/1000).toFixed(2)
   
            console.log(_idx, msg, ...rest, `${diff}s`);
            _time = now;
            return `${msg} ${rest}`
        },
      
    };
};
