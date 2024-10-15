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
} from 'swagger-to-typescript2';
import { ENV } from './constants/env';

const API_SERVER_URL = ENV.API_SERVER_URL;

// DON'T REMOVE THIS COMMENTS!!! Code between comments auto-generated
// INSERT START
export interface IChannelDto {
    id: string;
    published_at: Date;
    video_count: number;
    viewCount: number;
    subscriber_count: number;
    title: string;
    custom_url: string;
}
export interface IChannelPostBody {
    id: string;
    published_at: Date;
    video_count: number;
    viewCount: number;
    subscriber_count: number;
    title: string;
    custom_url: string;
}
export interface ICommentDto {
    id: string;
    published_at: Date;
    author_id: string;
    video_id: string;
    text: string;
}
export interface IcommentPostBody {
    comments: ICommentDto[];
}
export interface IVideoDto {
    id: string;
    published_at: Date;
    channel_id: string;
    title: string;
}
export interface IVideoPostBody {
    videos: IVideoDto[];
}
export type TChannelGetError = '' | 'undefined';
export type TChannelPostError = '' | 'undefined';
export type TChannelIdGetError = '' | 'undefined';
export type TChannelIdPutError = '' | 'undefined';
export type TChannelIdDeleteError = '' | 'undefined';
export type TCommentLastDateGetError = '' | 'undefined';
export type TCommentGetError = '' | 'undefined';
export type TCommentPostError = '' | 'undefined';
export type TCommentIdGetError = '' | 'undefined';
export type TCommentIdPutError = '' | 'undefined';
export type TCommentIdDeleteError = '' | 'undefined';
export type TVideoLastDateGetError = '' | 'undefined';
export type TVideoGetError = '' | 'undefined';
export type TVideoPostError = '' | 'undefined';
export type TVideoIdGetError = '' | 'undefined';
export type TVideoIdPutError = '' | 'undefined';
export type TVideoIdDeleteError = '' | 'undefined';
export type TPartialErrorCodes =
    | TChannelGetError
    | TChannelPostError
    | TChannelIdGetError
    | TChannelIdPutError
    | TChannelIdDeleteError
    | TCommentLastDateGetError
    | TCommentGetError
    | TCommentPostError
    | TCommentIdGetError
    | TCommentIdPutError
    | TCommentIdDeleteError
    | TVideoLastDateGetError
    | TVideoGetError
    | TVideoPostError
    | TVideoIdGetError
    | TVideoIdPutError
    | TVideoIdDeleteError
    | '';

export const createApiRequest = (rs: IRequestService) => ({
    channelGet: (
        query: { channel_id?: string } | undefined,
    ): CustomPromise<CustomAxiosResponse<Array<IChannelDto>, TChannelGetError>, IBEError<TChannelGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/channel/`, query)),

    channelPost: (
        body: IChannelPostBody,
    ): CustomPromise<CustomAxiosResponse<Array<IChannelDto>, TChannelPostError>, IBEError<TChannelPostError>> =>
        rs.post(formatUrl(API_SERVER_URL + `api/channel/`), body),

    channelIdGet: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<IChannelDto, TChannelIdGetError>, IBEError<TChannelIdGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/channel/${id}`)),

    channelIdPut: (
        id: string,
        body: IChannelDto,
    ): CustomPromise<CustomAxiosResponse<IChannelDto, TChannelIdPutError>, IBEError<TChannelIdPutError>> =>
        rs.put(formatUrl(API_SERVER_URL + `api/channel/${id}`), body),

    channelIdDelete: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<Array<IChannelDto>, TChannelIdDeleteError>, IBEError<TChannelIdDeleteError>> =>
        rs.delete(formatUrl(API_SERVER_URL + `api/channel/${id}`)),

    commentLastDateGet: (
        query: { video_id?: string } | undefined,
    ): CustomPromise<CustomAxiosResponse<Date, TCommentLastDateGetError>, IBEError<TCommentLastDateGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/comment/last-date/`, query)),

    commentGet: (
        query: { comment_id?: string } | undefined,
    ): CustomPromise<CustomAxiosResponse<Array<ICommentDto>, TCommentGetError>, IBEError<TCommentGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/comment/`, query)),

    commentPost: (
        body: IcommentPostBody,
    ): CustomPromise<CustomAxiosResponse<Array<ICommentDto>, TCommentPostError>, IBEError<TCommentPostError>> =>
        rs.post(formatUrl(API_SERVER_URL + `api/comment/`), body),

    commentIdGet: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<ICommentDto, TCommentIdGetError>, IBEError<TCommentIdGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/comment/${id}`)),

    commentIdPut: (
        id: string,
        body: ICommentDto,
    ): CustomPromise<CustomAxiosResponse<ICommentDto, TCommentIdPutError>, IBEError<TCommentIdPutError>> =>
        rs.put(formatUrl(API_SERVER_URL + `api/comment/${id}`), body),

    commentIdDelete: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<Array<ICommentDto>, TCommentIdDeleteError>, IBEError<TCommentIdDeleteError>> =>
        rs.delete(formatUrl(API_SERVER_URL + `api/comment/${id}`)),

    videoLastDateGet: (
        query: { channel_id?: string } | undefined,
    ): CustomPromise<CustomAxiosResponse<Date, TVideoLastDateGetError>, IBEError<TVideoLastDateGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/video/last-date/`, query)),

    videoGet: (
        query: { video_id?: string } | undefined,
    ): CustomPromise<CustomAxiosResponse<Array<IVideoDto>, TVideoGetError>, IBEError<TVideoGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/video/`, query)),

    videoPost: (
        body: IVideoPostBody,
    ): CustomPromise<CustomAxiosResponse<Array<IVideoDto>, TVideoPostError>, IBEError<TVideoPostError>> =>
        rs.post(formatUrl(API_SERVER_URL + `api/video/`), body),

    videoIdGet: (id: string): CustomPromise<CustomAxiosResponse<IVideoDto, TVideoIdGetError>, IBEError<TVideoIdGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/video/${id}`)),

    videoIdPut: (
        id: string,
        body: IVideoDto,
    ): CustomPromise<CustomAxiosResponse<IVideoDto, TVideoIdPutError>, IBEError<TVideoIdPutError>> =>
        rs.put(formatUrl(API_SERVER_URL + `api/video/${id}`), body),

    videoIdDelete: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<Array<IVideoDto>, TVideoIdDeleteError>, IBEError<TVideoIdDeleteError>> =>
        rs.delete(formatUrl(API_SERVER_URL + `api/video/${id}`)),
});

const URL = {
    channelGet: (): string => `api/channel/`,
    channelPost: (): string => `api/channel/`,
    channelIdGet: (id: string): string => `api/channel/${id}`,
    channelIdPut: (id: string): string => `api/channel/${id}`,
    channelIdDelete: (id: string): string => `api/channel/${id}`,
    commentLastDateGet: (): string => `api/comment/last-date/`,
    commentGet: (): string => `api/comment/`,
    commentPost: (): string => `api/comment/`,
    commentIdGet: (id: string): string => `api/comment/${id}`,
    commentIdPut: (id: string): string => `api/comment/${id}`,
    commentIdDelete: (id: string): string => `api/comment/${id}`,
    videoLastDateGet: (): string => `api/video/last-date/`,
    videoGet: (): string => `api/video/`,
    videoPost: (): string => `api/video/`,
    videoIdGet: (id: string): string => `api/video/${id}`,
    videoIdPut: (id: string): string => `api/video/${id}`,
    videoIdDelete: (id: string): string => `api/video/${id}`,
};
// INSERT END
// DON'T REMOVE THIS COMMENTS!!!

export const API_URL = URL;
export const api = {
    ...createApiRequest(requestService),
};
