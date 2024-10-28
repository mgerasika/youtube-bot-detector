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
import { ENV } from './env';

const API_SERVER_URL = ENV.api_server_url;

// DON'T REMOVE THIS COMMENTS!!! Code between comments auto-generated
// INSERT START
export interface IApiKeyDto {
    email: string;
    youtube_key: string;
    expired: Date;
}
export interface IApiKeyPostBody {
    email: string;
    youtube_key: string;
    expired?: Date;
}
export interface IChannelDto {
    id: string;
    published_at: Date;
    video_count: number;
    view_count: number;
    subscriber_count: number;
    title: string;
    author_url: string;
}
export interface IChannelPostBody {
    channels: IChannelDto[];
}
export interface ICommentDto {
    id: string;
    published_at: Date;
    author_id: string;
    video_id: string;
    text: string;
}
export interface ICommentPostBody {
    comments: ICommentDto[];
}
export interface IStatisticInfo {
    comment_count: number;
    author_id: string;
    author_url: string;
}
export interface IStatistic {
    comment_count: number;
    author_id: string;
    author_url: string;
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
export type TKeyActiveGetError = '' | 'undefined';
export type TKeyPostError = '' | 'undefined';
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
export type TStatisticInfoGetError = '' | 'undefined';
export type TStatisticByVideoGetError = '' | 'undefined';
export type TStatisticByChannelGetError = '' | 'undefined';
export type TVideoLastDateGetError = '' | 'undefined';
export type TVideoGetError = '' | 'undefined';
export type TVideoPostError = '' | 'undefined';
export type TVideoIdGetError = '' | 'undefined';
export type TVideoIdPutError = '' | 'undefined';
export type TVideoIdDeleteError = '' | 'undefined';
export type TPartialErrorCodes =
    | TKeyActiveGetError
    | TKeyPostError
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
    | TStatisticInfoGetError
    | TStatisticByVideoGetError
    | TStatisticByChannelGetError
    | TVideoLastDateGetError
    | TVideoGetError
    | TVideoPostError
    | TVideoIdGetError
    | TVideoIdPutError
    | TVideoIdDeleteError
    | '';

export const createApiRequest = (rs: IRequestService) => ({
    keyActiveGet: (
        query: { old_key?: string } | undefined,
    ): CustomPromise<CustomAxiosResponse<IApiKeyDto, TKeyActiveGetError>, IBEError<TKeyActiveGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/api-key/active/`, query)),

    keyPost: (body: IApiKeyPostBody): CustomPromise<CustomAxiosResponse<void, TKeyPostError>, IBEError<TKeyPostError>> =>
        rs.post(formatUrl(API_SERVER_URL + `api/api-key/`), body),

    channelGet: (
        query: { channel_id?: string } | undefined,
    ): CustomPromise<CustomAxiosResponse<Array<IChannelDto>, TChannelGetError>, IBEError<TChannelGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/channel/`, query)),

    channelPost: (
        body: IChannelPostBody,
    ): CustomPromise<CustomAxiosResponse<void, TChannelPostError>, IBEError<TChannelPostError>> =>
        rs.post(formatUrl(API_SERVER_URL + `api/channel/`), body),

    channelIdGet: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<IChannelDto, TChannelIdGetError>, IBEError<TChannelIdGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/channel/${id}`)),

    channelIdPut: (
        id: string,
        body: IChannelDto,
    ): CustomPromise<CustomAxiosResponse<void, TChannelIdPutError>, IBEError<TChannelIdPutError>> =>
        rs.put(formatUrl(API_SERVER_URL + `api/channel/${id}`), body),

    channelIdDelete: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<void, TChannelIdDeleteError>, IBEError<TChannelIdDeleteError>> =>
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
        body: ICommentPostBody,
    ): CustomPromise<CustomAxiosResponse<void, TCommentPostError>, IBEError<TCommentPostError>> =>
        rs.post(formatUrl(API_SERVER_URL + `api/comment/`), body),

    commentIdGet: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<ICommentDto, TCommentIdGetError>, IBEError<TCommentIdGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/comment/${id}`)),

    commentIdPut: (
        id: string,
        body: ICommentDto,
    ): CustomPromise<CustomAxiosResponse<void, TCommentIdPutError>, IBEError<TCommentIdPutError>> =>
        rs.put(formatUrl(API_SERVER_URL + `api/comment/${id}`), body),

    commentIdDelete: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<void, TCommentIdDeleteError>, IBEError<TCommentIdDeleteError>> =>
        rs.delete(formatUrl(API_SERVER_URL + `api/comment/${id}`)),

    statisticInfoGet: (): CustomPromise<
        CustomAxiosResponse<IStatisticInfo, TStatisticInfoGetError>,
        IBEError<TStatisticInfoGetError>
    > => rs.get(formatUrl(API_SERVER_URL + `api/statistic/info/`)),

    statisticByVideoGet: (
        query: { video_id?: string } | undefined,
    ): CustomPromise<
        CustomAxiosResponse<Array<IStatistic>, TStatisticByVideoGetError>,
        IBEError<TStatisticByVideoGetError>
    > => rs.get(formatUrl(API_SERVER_URL + `api/statistic/by-video/`, query)),

    statisticByChannelGet: (
        query: { channel_id?: string } | undefined,
    ): CustomPromise<
        CustomAxiosResponse<Array<IStatistic>, TStatisticByChannelGetError>,
        IBEError<TStatisticByChannelGetError>
    > => rs.get(formatUrl(API_SERVER_URL + `api/statistic/by-channel/`, query)),

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
    ): CustomPromise<CustomAxiosResponse<void, TVideoPostError>, IBEError<TVideoPostError>> =>
        rs.post(formatUrl(API_SERVER_URL + `api/video/`), body),

    videoIdGet: (id: string): CustomPromise<CustomAxiosResponse<IVideoDto, TVideoIdGetError>, IBEError<TVideoIdGetError>> =>
        rs.get(formatUrl(API_SERVER_URL + `api/video/${id}`)),

    videoIdPut: (
        id: string,
        body: IVideoDto,
    ): CustomPromise<CustomAxiosResponse<void, TVideoIdPutError>, IBEError<TVideoIdPutError>> =>
        rs.put(formatUrl(API_SERVER_URL + `api/video/${id}`), body),

    videoIdDelete: (
        id: string,
    ): CustomPromise<CustomAxiosResponse<void, TVideoIdDeleteError>, IBEError<TVideoIdDeleteError>> =>
        rs.delete(formatUrl(API_SERVER_URL + `api/video/${id}`)),
});

const URL = {
    keyActiveGet: (): string => `api/api-key/active/`,
    keyPost: (): string => `api/api-key/`,
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
    statisticInfoGet: (): string => `api/statistic/info/`,
    statisticByVideoGet: (): string => `api/statistic/by-video/`,
    statisticByChannelGet: (): string => `api/statistic/by-channel/`,
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
