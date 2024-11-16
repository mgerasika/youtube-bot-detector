import { scanVideosAsync, } from './scan-videos/scan-videos.service';
import { scanCommentsAsync, } from './scan-comments/scan-comments.service';
import { scanChannelInfoAsync, } from './scan-channel-info/scan-channel-info.service';

import { addYoutubeKeyAsync, } from './add-youtube-key/add-youtube-key.service';
import { fullScanChannelInfoAsync, } from './full-scan-channel-info/full-scan-channel-info.service';
import { scanVideoInfoAsync, } from './scan-video-info/scan-video-info.service';
import { testAsync, } from './test/test.service';
import { fullScanVideoInfoAsync, } from './full-scan-video-info/full-scan-video-info.service';

import { ILogger, } from '@common/utils/create-logger.utils';

export const scan = {
       fullScanChannelInfoAsync,
       fullScanVideoInfoAsync,
       scanVideoInfoAsync, 
       scanChannelInfoAsync,
       scanVideosAsync,
       scanCommentsAsync,
       addYoutubeKeyAsync,
       testAsync,
};
