import { scanVideosAsync } from './scan-videos/scan-videos.service';
import { scanCommentsAsync } from './scan-comments/scan-comments.service';
import { scanChannelInfoAsync } from './scan-channel-info/scan-channel-info.service';
import { scanAuthorsAsync } from './scan-auhors/scan-authors.service';
import {IScan}from '@common/interfaces/scan.interface';

export const scan: IScan = {
       scanVideosAsync,
       scanCommentsAsync,
       scanChannelInfoAsync,
       scanAuthorsAsync
};
