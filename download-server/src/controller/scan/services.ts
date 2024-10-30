import { scanVideosAsync } from './scan-videos/scan-videos.service';
import { scanCommentsAsync } from './scan-comments/scan-comments.service';
import { scanChannelInfoAsync } from './scan-channel-info/scan-channel-info.service';
import { IScan, IScanReturn } from '@common/interfaces/scan.interface';
import { addYoutubeKeyAsync } from './add-youtube-key/add-youtube-key.service';
import { fullScanChannelInfoAsync } from './full-scan-channel-info/full-scan-channel-info.service';
import { scanVideoInfoAsync } from './scan-video-info/scan-video-info.service';
import { testAsync } from './test/test.service';
import { fullScanVideoInfoAsync } from './full-scan-video-info/full-scan-video-info.service';
import { IFullScanChannelInfoBody, IFullScanVideoInfoBody, IScanVideoInfoBody, IScanChannelInfoBody, IScanVideosBody, IScanCommentsBody, IAddYoutubeKeyBody, ITestBody } from '@common/model';
import { ILogger } from '@common/utils/create-logger.utils';

export const scan: IScan = {
       fullScanChannelInfoAsync:(body: IFullScanChannelInfoBody, logger: ILogger) => {
              return fullScanChannelInfoAsync(body, logger);
       },
       fullScanVideoInfoAsync:(body: IFullScanVideoInfoBody, logger: ILogger) => {
              return fullScanVideoInfoAsync(body, logger)
       },
       
       scanVideoInfoAsync : (body: IScanVideoInfoBody, logger: ILogger) => {
              return scanVideoInfoAsync(body, logger)
       },
       scanChannelInfoAsync:(body: IScanChannelInfoBody, logger: ILogger) =>{
              return scanChannelInfoAsync(body, logger)
       },
       scanVideosAsync: (body: IScanVideosBody, logger: ILogger) => {
              return scanVideosAsync(body, logger)
       },
       scanCommentsAsync : (body: IScanCommentsBody, logger: ILogger) => {
              return scanCommentsAsync(body, logger)
       },
       addYoutubeKeyAsync: (body: IAddYoutubeKeyBody, logger: ILogger) =>{
              return addYoutubeKeyAsync(body, logger)
       },
       testAsync: (body: ITestBody, logger: ILogger) => {
              return testAsync(body, logger)
       },

       
};
