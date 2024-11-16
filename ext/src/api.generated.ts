/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
export interface IServerInfoDto {
	'id': string;
	'name': string;
	'ip': string;
	'memory_info': IMemoryInfo;
}
export interface IMemoryInfo {
	'RSS': number;
	'heapTotal': number;
	'heapUsed': number;
	'external': number;
}
export interface IAddServerInfoBody {
	'id': string;
	'name': string;
	'ip': string;
	'memory_info': IMemoryInfo;
}
export interface IApiKeyDto {
	'email': string;
	'youtube_key': string;
	'expired'?: Date;
	'status': string;
}
export interface IApiKeyPostBody {
	'email': string;
	'youtube_key': string;
	'expired'?: Date;
	'status': string;
}
export interface IExistBody {
	'ids': string[];
}
export interface IChannelDto {
	'id': string;
	'published_at': Date;
	'video_count': number;
	'view_count': number;
	'subscriber_count': number;
	'title': string;
	'author_url': string;
	'is_scannable'?: boolean;
	'is_deleted'?: boolean;
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
	'parent_comment_id'?: string;
}
export interface ICommentPostBody {
	'comments': ICommentDto[];
}
export interface IServerInfo {
	'serverName': string;
	'memory': IMemoryInfo;
	'ipV4': string;
}
export interface IStatisticInfo {
	'video': IVideoInfo;
	'comment': ICommentInfo;
	'statistic': IStatisticInternalInfo;
	'channel': IChannelInfo;
	'missed_statistic_channels': number;
	'youtube_key': IYoutubeKeyInfo;
	'statistic_rabbit_mq': IRabbitMqConnectionInfo;
	'download_rabbit_mq': IRabbitMqConnectionInfo;
	'servers': IServerInfoDto[];
}
export interface IVideoInfo {
	'all_keys': number;
}
export interface ICommentInfo {
	'all_keys': number;
}
export interface IStatisticInternalInfo {
	'all_keys': number;
}
export interface IChannelInfo {
	'all_keys': number;
}
export interface IYoutubeKeyInfo {
	'active_keys': number;
	'active_not_expired_keys': number;
	'suspended_keys': number;
	'all_keys': number;
}
export interface IRabbitMqConnectionInfo {
	'messageCount': number;
	'consumerCount': number;
}
export interface IStatisticByChannel {
	'items': IStatisticByChannelInvividualWithCalc[];
	'forOne': {
		'db': IStatisticByChannelForOne;
		'calc': ICalc;
	};
}
export interface IStatisticByChannelInvividualWithCalc {
	'db': IStatisticByChannelInvdividual;
	'calc': ICalc;
}
export interface IStatisticByChannelInvdividual {
	'comment_count': number;
	'channel_id': number;
	'channel_url': string;
	'published_at': Date;
	'min_published_at': Date;
	'max_published_at': Date;
	'days_tick': number;
	'published_at_diff': number;
}
export interface ICalc {
	'frequency': number;
	'frequency_tick': number;
}
export interface IStatisticByChannelForOne {
	'published_at': Date;
	'channel_url': string;
	'channel_id': string;
	'comment_count': number;
	'min_published_at': Date;
	'max_published_at': Date;
	'days_tick': number;
	'published_at_diff': number;
	'frequency': number;
	'frequency_tick': number;
}
export interface IStatisticByVideo {
	'published_at': Date;
	'channel_url': string;
	'channel_id': string;
	'comment_count': number;
	'min_published_at': Date;
	'max_published_at': Date;
	'days_tick': number;
	'published_at_diff': number;
	'frequency': number;
	'frequency_tick': number;
}
export interface IStatisticDto {
	'channel_id': string;
	'channel_url': string;
	'comment_count': number;
	'published_at'?: Date;
	'min_published_at'?: Date;
	'max_published_at'?: Date;
	'days_tick': number;
	'published_at_diff': number;
	'uploaded_at_time'?: Date;
	'frequency': number;
	'frequency_tick': number;
	'hash'?: string;
}
export interface IStatisticPostBody {
	'statistics': IStatisticDto[];
}
export interface IVideoDto {
	'id': string;
	'published_at': Date;
	'published_at_time'?: Date;
	'channel_id': string;
	'title': string;
}
export interface IVideoPostBody {
	'videos': IVideoDto[];
}
export type TAllServerInfoGetError = ''
	 |'undefined';
export type TAllServerInfoPostError = ''
	 |'undefined';
export type TKeyActiveGetError = ''
	 |'undefined';
export type TKeyInfoGetError = ''
	 |'undefined';
export type TKeyPostError = ''
	 |'undefined';
export type TKeyAddYoutubeKeyPostError = ''
	 |'undefined';
export type TChannelExistPostError = ''
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
export type TServerInfoGetError = ''
	 |'undefined';
export type TStatisticInfoGetError = ''
	 |'undefined';
export type TStatisticByChannelGetError = ''
	 |'undefined';
export type TStatisticByChannelForOneGetError = ''
	 |'undefined';
export type TStatisticByVideoGetError = ''
	 |'undefined';
export type TStatisticGetError = ''
	 |'undefined';
export type TStatisticPostError = ''
	 |'undefined';
export type TStatisticIdGetError = ''
	 |'undefined';
export type TTaskChannelToStatisticGetError = ''
	 |'undefined';
export type TTaskStatisticToFirebaseGetError = ''
	 |'undefined';
export type TTaskRescanChannelsGetError = ''
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

	 | TAllServerInfoGetError
	 | TAllServerInfoPostError
	 | TKeyActiveGetError
	 | TKeyInfoGetError
	 | TKeyPostError
	 | TKeyAddYoutubeKeyPostError
	 | TChannelExistPostError
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
	 | TServerInfoGetError
	 | TStatisticInfoGetError
	 | TStatisticByChannelGetError
	 | TStatisticByChannelForOneGetError
	 | TStatisticByVideoGetError
	 | TStatisticGetError
	 | TStatisticPostError
	 | TStatisticIdGetError
	 | TTaskChannelToStatisticGetError
	 | TTaskStatisticToFirebaseGetError
	 | TTaskRescanChannelsGetError
	 | TTestGetError
	 | TVideoLastDateGetError
	 | TVideoGetError
	 | TVideoPostError
	 | TVideoIdGetError	 | '';

export const createApiRequest = (rs: IRequestService) => ({
	// get all-server-info all-server-info.controller.ts
	allServerInfoGet : (): CustomPromise<CustomAxiosResponse<IServerInfoDto,TAllServerInfoGetError>,IBEError<TAllServerInfoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/all-server-info`) ),

	// post all-server-info all-server-info.controller.ts
	allServerInfoPost : (body: IAddServerInfoBody): CustomPromise<CustomAxiosResponse<void,TAllServerInfoPostError>,IBEError<TAllServerInfoPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/all-server-info`) , body),

	// get active api-key.controller.ts
	keyActiveGet : (query: {old_key?:string,old_status?:string} | undefined): CustomPromise<CustomAxiosResponse<IApiKeyDto,TKeyActiveGetError>,IBEError<TKeyActiveGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/api-key/active`, query) ),

	// get info api-key.controller.ts
	keyInfoGet : (): CustomPromise<CustomAxiosResponse<IApiKeyDto,TKeyInfoGetError>,IBEError<TKeyInfoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/api-key/info`) ),

	// post api-key api-key.controller.ts
	keyPost : (body: IApiKeyPostBody): CustomPromise<CustomAxiosResponse<void,TKeyPostError>,IBEError<TKeyPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/api-key`) , body),

	// post add-youtube-key api-key.controller.ts
	keyAddYoutubeKeyPost : (): CustomPromise<CustomAxiosResponse<void,TKeyAddYoutubeKeyPostError>,IBEError<TKeyAddYoutubeKeyPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/api-key/add-youtube-key`) ),

	// post exist channel.controller.ts
	channelExistPost : (body: IExistBody): CustomPromise<CustomAxiosResponse<string[],TChannelExistPostError>,IBEError<TChannelExistPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/channel/exist`) , body),

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
	commentGet : (query: {comment_id?:string,author_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<ICommentDto>,TCommentGetError>,IBEError<TCommentGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/comment`, query) ),

	// post comment comment.controller.ts
	commentPost : (body: ICommentPostBody): CustomPromise<CustomAxiosResponse<void,TCommentPostError>,IBEError<TCommentPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/comment`) , body),

	// get {id} comment.controller.ts
	commentIdGet : (id:string): CustomPromise<CustomAxiosResponse<ICommentDto,TCommentIdGetError>,IBEError<TCommentIdGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/comment/${id}`) ),

	// get full-by-video scan.controller.ts
	scanFullByVideoGet : (query: {video_id?:string} | undefined): CustomPromise<CustomAxiosResponse<string,TScanFullByVideoGetError>,IBEError<TScanFullByVideoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/scan/full-by-video`, query) ),

	// get full-by-channel scan.controller.ts
	scanFullByChannelGet : (query: {channel_id?:string} | undefined): CustomPromise<CustomAxiosResponse<string,TScanFullByChannelGetError>,IBEError<TScanFullByChannelGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/scan/full-by-channel`, query) ),

	// get server-info server-info.controller.ts
	serverInfoGet : (): CustomPromise<CustomAxiosResponse<IServerInfo,TServerInfoGetError>,IBEError<TServerInfoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/server-info`) ),

	// get info statistic.controller.ts
	statisticInfoGet : (): CustomPromise<CustomAxiosResponse<IStatisticInfo,TStatisticInfoGetError>,IBEError<TStatisticInfoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/info`) ),

	// get by-channel statistic.controller.ts
	statisticByChannelGet : (query: {channel_id?:string} | undefined): CustomPromise<CustomAxiosResponse<IStatisticByChannel,TStatisticByChannelGetError>,IBEError<TStatisticByChannelGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/by-channel`, query) ),

	// get by-channel-for-one statistic.controller.ts
	statisticByChannelForOneGet : (query: {channel_id?:string} | undefined): CustomPromise<CustomAxiosResponse<IStatisticByChannelForOne,TStatisticByChannelForOneGetError>,IBEError<TStatisticByChannelForOneGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/by-channel-for-one`, query) ),

	// get by-video statistic.controller.ts
	statisticByVideoGet : (query: {video_id?:string} | undefined): CustomPromise<CustomAxiosResponse<Array<IStatisticByVideo>,TStatisticByVideoGetError>,IBEError<TStatisticByVideoGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/by-video`, query) ),

	// get statistic statistic.controller.ts
	statisticGet : (): CustomPromise<CustomAxiosResponse<Array<IStatisticDto>,TStatisticGetError>,IBEError<TStatisticGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic`) ),

	// post statistic statistic.controller.ts
	statisticPost : (body: IStatisticPostBody): CustomPromise<CustomAxiosResponse<void,TStatisticPostError>,IBEError<TStatisticPostError>> =>
		rs.post(formatUrl(API_SERVER_URL + `/api/statistic`) , body),

	// get {id} statistic.controller.ts
	statisticIdGet : (id:string): CustomPromise<CustomAxiosResponse<IStatisticDto,TStatisticIdGetError>,IBEError<TStatisticIdGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/statistic/${id}`) ),

	// get channel-to-statistic task.controller.ts
	taskChannelToStatisticGet : (): CustomPromise<CustomAxiosResponse<string,TTaskChannelToStatisticGetError>,IBEError<TTaskChannelToStatisticGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/task/channel-to-statistic`) ),

	// get statistic-to-firebase task.controller.ts
	taskStatisticToFirebaseGet : (): CustomPromise<CustomAxiosResponse<string,TTaskStatisticToFirebaseGetError>,IBEError<TTaskStatisticToFirebaseGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/task/statistic-to-firebase`) ),

	// get rescan-channels task.controller.ts
	taskRescanChannelsGet : (): CustomPromise<CustomAxiosResponse<string,TTaskRescanChannelsGetError>,IBEError<TTaskRescanChannelsGetError>> =>
		rs.get(formatUrl(API_SERVER_URL + `/api/task/rescan-channels`) ),

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
	allServerInfoGet:  (): string => `/api/all-server-info`,
	allServerInfoPost:  (): string => `/api/all-server-info`,
	keyActiveGet:  (): string => `/api/api-key/active`,
	keyInfoGet:  (): string => `/api/api-key/info`,
	keyPost:  (): string => `/api/api-key`,
	keyAddYoutubeKeyPost:  (): string => `/api/api-key/add-youtube-key`,
	channelExistPost:  (): string => `/api/channel/exist`,
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
	serverInfoGet:  (): string => `/api/server-info`,
	statisticInfoGet:  (): string => `/api/statistic/info`,
	statisticByChannelGet:  (): string => `/api/statistic/by-channel`,
	statisticByChannelForOneGet:  (): string => `/api/statistic/by-channel-for-one`,
	statisticByVideoGet:  (): string => `/api/statistic/by-video`,
	statisticGet:  (): string => `/api/statistic`,
	statisticPost:  (): string => `/api/statistic`,
	statisticIdGet:  (id:string): string => `/api/statistic/${id}`,
	taskChannelToStatisticGet:  (): string => `/api/task/channel-to-statistic`,
	taskStatisticToFirebaseGet:  (): string => `/api/task/statistic-to-firebase`,
	taskRescanChannelsGet:  (): string => `/api/task/rescan-channels`,
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































































































