import { scanVideosAsync } from './scan-videos/scan-videos.service';
import { scanCommentsAsync } from './scan-comments/scan-comments.service';
import { scanChannelInfoAsync } from './scan-channel-info/scan-channel-info.service';
import { IScan } from '@common/interfaces/scan.interface';
import { addYoutubeKeyAsync } from './add-youtube-key/add-youtube-key.service';
import { fullScanChannelInfoAsync } from './full-scan-channel-info/full-scan-channel-info.service';

export const scan: IScan = {
       scanVideosAsync,
       scanCommentsAsync,
       scanChannelInfoAsync,
       addYoutubeKeyAsync,
       fullScanChannelInfoAsync,
       scanAuthorsAsync: async () => {
              return ['',];
       },
};
