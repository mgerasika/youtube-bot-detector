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
import { ENV } from "./env";

const API_SERVER_URL = ENV.api_server_url;

// DON'T REMOVE THIS COMMENTS!!! Code between comments auto-generated
// INSERT START
export interface IApiKeyDto {
	'email': string;
	'youtube_key': string;
	'expired'?: Date;
}
export interface IApiKeyPostBody {
	'email': string;
	'youtube_key': string;
	'expired'?: Date;
}
export interface IChannelDto {
	'id': string;
	'published_at': Date;
	'video_count': number;
	'view_count': number;
	'subscriber_count': number;
	'title': string;
	'author_url': string;
}
export interface IChannelPostBody {
	'channels': IChannelDto[];
}
export interface ICommentDto {
	'id': string;
	'published_at': Date;
	'published_at_time'?: Date;
	'author_id': string;
	'video_id': string;
	'text': string;
}
export interface ICommentPostBody {
	'comments': ICommentDto[];
}
export interface IStatisticInfo {
	'video_count': number;
	'comment_count': number;
	'channel_count': number;
	'rabbitm_mq_messages_count': number;
	'rabbitm_mq_consumer_count': number;
	'youtube_accounts_count': number;
}
export interface IStatistic {
	'comments_on_all_channels': number;
	'comments_on_current_channel': number;
	'channel_id': string;
	'channel_url': string;
	'id': string;
	'channel_published_at': Date;
	'min_comment_publish_date': Date;
	'max_comment_publish_date': Date;
}
export interface IGroupStatistic {
	'author_id': string;
	'author_url': string;
	'author_published_at': string;
	'items': IGroupStatisticItem[];
}
export interface IGroupStatisticItem {
	'published_at': Date;
	'total_comment_count': number;
	'channel_url': string;
	'channel_id': string;
	'comment_count': number;
	'first_video_published_at': Date;
	'last_video_published_at': Date;
}
export interface IVideoDto {
	'id': string;
	'published_at': Date;
	'channel_id': string;
	'title': string;
}
export interface IVideoPostBody {
	'videos': IVideoDto[];
}
export type TKeyActiveGetError = ''
	 |'undefined';
export type TKeyPostError = ''
	 |'undefined';
export type TKeyAddYoutubeKeyPostError = ''
	 |'undefined';
export type TChannelGetError = ''
	 |'undefined';
export type TChannelPostError = ''
	 |'undefined';
export type TChannelIdGetError = ''
	 |'undefined';
export type TCommentLastDateGetError = ''
	 |'undefined';
export type TCommentAuthorIdsGetError = ''
	 |'undefined';
export type TCommentGetError = ''
	 |'undefined';
export type TCommentPostError = ''
	 |'undefined';
export type TCommentIdGetError = ''
	 |'undefined';
export type TScanFullByVideoGetError = ''
	 |'undefined';
export type TScanFullByChannelGetError = ''
	 |'undefined';
export type TStatisticInfoGetError = ''
	 |'undefined';
export type TStatisticByChannelGetError = ''
	 |'undefined';
export type TStatisticByChannelAndVideoGetError = ''
	 |'undefined';
export type TStatisticByGroupGetError = ''
	 |'undefined';
export type TTestGetError = ''
	 |'undefined';
export type TVideoLastDateGetError = ''
	 |'undefined';
export type TVideoGetError = ''
	 |'undefined';
export type TVideoPostError = ''
	 |'undefined';
export type TVideoIdGetError = ''
	 |'undefined';
export type TPartialErrorCodes =

	 | TKeyActiveGetError
	 | TKeyPostError
	 | TKeyAddYoutubeKeyPostError
	 | TChannelGetError
	 | TChannelPostError
	 | TChannelIdGetError
	 | TCommentLastDateGetError
	 | TCommentAuthorIdsGetError
	 | TCommentGetError
	 | TCommentPostError
	 | TCommentIdGetError
	 | TScanFullByVideoGetError
	 | TScanFullByChannelGetError
	 | TStatisticInfoGetError
	 | TStatisticByChannelGetError
	 | TStatisticByChannelAndVideoGetError
	 | TStatisticByGroupGetError
	 | TTestGetError
	 | TVideoLastDateGetError
	 | TVideoGetError
	 | TVideoPostError
	 | TVideoIdGetError	 | '';

export const createApiRequest = (rs: IRequestService) => ({
	// get active api-key.controller.ts
	keyActiveGet : (query: {old_key?:string} | undefined): CustomPromise<CustomAxiosResponse<IApiKeyDto,TKeyActiveGetError>,IBEError<TKeyActiveGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/api-key/active`, query) ),

	// post api-key api-key.controller.ts
	keyPost : (body: IApiKeyPostBody): CustomPromise<CustomAxiosResponse<void,TKeyPostError>,IBEError<TKeyPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/api-key`) , body),

	// post add-youtube-key api-key.controller.ts
	keyAddYoutubeKeyPost : (): CustomPromise<CustomAxiosResponse<void,TKeyAddYoutubeKeyPostError>,IBEError<TKeyAddYoutubeKeyPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/api-key/add-youtube-key`) ),

	// get channel channel.controller.ts
	channelGet : (query: {channel_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<IChannelDto>,TChannelGetError>,IBEError<TChannelGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/channel`, query) ),

	// post channel channel.controller.ts
	channelPost : (body: IChannelPostBody): CustomPromise<CustomAxiosResponse<void,TChannelPostError>,IBEError<TChannelPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/channel`) , body),

	// get {id} channel.controller.ts
	channelIdGet : (id:string): CustomPromise<CustomAxiosResponse<IChannelDto,TChannelIdGetError>,IBEError<TChannelIdGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/channel/${id}`) ),

	// get last-date comment.controller.ts
	commentLastDateGet : (query: {video_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Date,TCommentLastDateGetError>,IBEError<TCommentLastDateGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/comment/last-date`, query) ),

	// get author-ids comment.controller.ts
	commentAuthorIdsGet : (): CustomPromise<CustomAxiosResponse<Date,TCommentAuthorIdsGetError>,IBEError<TCommentAuthorIdsGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/comment/author-ids`) ),

	// get comment comment.controller.ts
	commentGet : (query: {comment_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<ICommentDto>,TCommentGetError>,IBEError<TCommentGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/comment`, query) ),

	// post comment comment.controller.ts
	commentPost : (body: ICommentPostBody): CustomPromise<CustomAxiosResponse<void,TCommentPostError>,IBEError<TCommentPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/comment`) , body),

	// get {id} comment.controller.ts
	commentIdGet : (id:string): CustomPromise<CustomAxiosResponse<ICommentDto,TCommentIdGetError>,IBEError<TCommentIdGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/comment/${id}`) ),

	// get full-by-video scan.controller.ts
	scanFullByVideoGet : (query: {video_id?:string,channel_id?:string} | undefined): CustomPromise<CustomAxiosResponse<string,TScanFullByVideoGetError>,IBEError<TScanFullByVideoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/scan/full-by-video`, query) ),

	// get full-by-channel scan.controller.ts
	scanFullByChannelGet : (query: {channel_id?:string} | undefined): CustomPromise<CustomAxiosResponse<string,TScanFullByChannelGetError>,IBEError<TScanFullByChannelGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/scan/full-by-channel`, query) ),

	// get info statistic.controller.ts
	statisticInfoGet : (): CustomPromise<CustomAxiosResponse<IStatisticInfo,TStatisticInfoGetError>,IBEError<TStatisticInfoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/info`) ),

	// get by-channel statistic.controller.ts
	statisticByChannelGet : (query: {channel_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<IStatistic>,TStatisticByChannelGetError>,IBEError<TStatisticByChannelGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/by-channel`, query) ),

	// get by-channel-and-video statistic.controller.ts
	statisticByChannelAndVideoGet : (query: {channel_id?:string,video_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<IStatistic>,TStatisticByChannelAndVideoGetError>,IBEError<TStatisticByChannelAndVideoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/by-channel-and-video`, query) ),

	// get by-group statistic.controller.ts
	statisticByGroupGet : (query: {video_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<IGroupStatistic>,TStatisticByGroupGetError>,IBEError<TStatisticByGroupGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/by-group`, query) ),

	// get test test.controller.ts
	testGet : (): CustomPromise<CustomAxiosResponse<string,TTestGetError>,IBEError<TTestGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/test`) ),

	// get last-date video.controller.ts
	videoLastDateGet : (query: {channel_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Date,TVideoLastDateGetError>,IBEError<TVideoLastDateGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/video/last-date`, query) ),

	// get video video.controller.ts
	videoGet : (query: {video_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<IVideoDto>,TVideoGetError>,IBEError<TVideoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/video`, query) ),

	// post video video.controller.ts
	videoPost : (body: IVideoPostBody): CustomPromise<CustomAxiosResponse<void,TVideoPostError>,IBEError<TVideoPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/video`) , body),

	// get {id} video.controller.ts
	videoIdGet : (id:string): CustomPromise<CustomAxiosResponse<IVideoDto,TVideoIdGetError>,IBEError<TVideoIdGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/video/${id}`) ),

});

const URL = {
	keyActiveGet:  (): string => `/api/api-key/active`,
	keyPost:  (): string => `/api/api-key`,
	keyAddYoutubeKeyPost:  (): string => `/api/api-key/add-youtube-key`,
	channelGet:  (): string => `/api/channel`,
	channelPost:  (): string => `/api/channel`,
	channelIdGet:  (id:string): string => `/api/channel/${id}`,
	commentLastDateGet:  (): string => `/api/comment/last-date`,
	commentAuthorIdsGet:  (): string => `/api/comment/author-ids`,
	commentGet:  (): string => `/api/comment`,
	commentPost:  (): string => `/api/comment`,
	commentIdGet:  (id:string): string => `/api/comment/${id}`,
	scanFullByVideoGet:  (): string => `/api/scan/full-by-video`,
	scanFullByChannelGet:  (): string => `/api/scan/full-by-channel`,
	statisticInfoGet:  (): string => `/api/statistic/info`,
	statisticByChannelGet:  (): string => `/api/statistic/by-channel`,
	statisticByChannelAndVideoGet:  (): string => `/api/statistic/by-channel-and-video`,
	statisticByGroupGet:  (): string => `/api/statistic/by-group`,
	testGet:  (): string => `/api/test`,
	videoLastDateGet:  (): string => `/api/video/last-date`,
	videoGet:  (): string => `/api/video`,
	videoPost:  (): string => `/api/video`,
	videoIdGet:  (id:string): string => `/api/video/${id}`,
};
// INSERT END
// DON'T REMOVE THIS COMMENTS!!!

export const API_URL = URL;
export const api = {
  ...createApiRequest(requestService),
};





























































