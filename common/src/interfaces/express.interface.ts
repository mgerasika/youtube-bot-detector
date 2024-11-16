import  { Response,Request } from 'express';

export type IExpressRequest = Request & {};
export type IExpressResponse<TSuccess, TError> = Response & {
    json: (data: TSuccess | TError) => void;
    send: (data: TSuccess | TError) => void;
} & Response;