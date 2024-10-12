/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disabled no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  IRequestService,
  CustomPromise,
  CustomAxiosResponse,
  IBEError,
  formatUrl,
  requestService,
} from "swagger-to-typescript2";

const API_SERVER_URL = "http://localhost:8005/";

// DON'T REMOVE THIS COMMENTS!!! Code between comments auto-generated
// INSERT START
export interface IActorResponse {
	'id': string;
	'name': string;
}
export interface IPostActorBody {
	'name': string;
}
export interface IPutActorBody {
	'name': string;
}
export type TActorIdDeleteError = ''
	 |'undefined';
export type TActorIdGetError = ''
	 |'undefined';
export type TActorIdPutError = ''
	 |'undefined';
export type TActorGetError = ''
	 |'undefined';
export type TActorPostError = ''
	 |'undefined';
export type TPartialErrorCodes =

	 | TActorIdDeleteError
	 | TActorIdGetError
	 | TActorIdPutError
	 | TActorGetError
	 | TActorPostError	 | '';

export const createApiRequest = (rs: IRequestService) => ({
	actorIdDelete : (id:string): CustomPromise<CustomAxiosResponse<Array<IActorResponse>,TActorIdDeleteError>,IBEError<TActorIdDeleteError>> =>
		rs.delete(formatUrl(API_SERVER_URL + `api/actor/${id}`) ),

	actorIdGet : (id:string): CustomPromise<CustomAxiosResponse<IActorResponse,TActorIdGetError>,IBEError<TActorIdGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `api/actor/${id}`) ),

	actorIdPut : (id:string, body: IPutActorBody): CustomPromise<CustomAxiosResponse<IActorResponse,TActorIdPutError>,IBEError<TActorIdPutError>> =>
		rs.put(formatUrl(API_SERVER_URL + `api/actor/${id}`) , body),

	actorGet : (query: {actor_name?:string,movie_id?:string,imdb_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<IActorResponse>,TActorGetError>,IBEError<TActorGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `api/actor/`, query) ),

	actorPost : (body: IPostActorBody): CustomPromise<CustomAxiosResponse<Array<IActorResponse>,TActorPostError>,IBEError<TActorPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `api/actor/`) , body),

});

const URL = {
	actorIdDelete:  (id:string): string => `api/actor/${id}`,
	actorIdGet:  (id:string): string => `api/actor/${id}`,
	actorIdPut:  (id:string): string => `api/actor/${id}`,
	actorGet:  (): string => `api/actor/`,
	actorPost:  (): string => `api/actor/`,
};
// INSERT END
// DON'T REMOVE THIS COMMENTS!!!

export const API_URL = URL;
export const api = {
  ...createApiRequest(requestService),
};


