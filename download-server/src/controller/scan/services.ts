import { scanVideosAsync } from './scan-videos/scan-videos.service';
import { scanCommentsAsync } from './scan-comments/scan-comments.service';
import { scanChannelInfoAsync } from './scan-channel-info/scan-channel-info.service';

export const scan = {
       scanVideosAsync,
       scanCommentsAsync,
       scanChannelInfoAsync,
};
