import { getVideosAsync } from './get-videos/get-videos.service';
import { getCommentsAsync } from './get-comments/get-comments.service';
import { getChannelInfoAsync } from './get-channel-info/get-channel-info.service';
import { getChannelIdAsync } from './get-channel-id/get-channel-id.service';

export const scan = {
      getVideosAsync,
      getCommentsAsync,
      getChannelInfoAsync,
      getChannelIdAsync,
};
