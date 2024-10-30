import { apiKey } from './api-key/api-key.service';
import { channel } from './channel/channel.service';
import { comment } from './comment/comment.service';
import { testAsync } from './test/test.service';
import { scan } from './scan/scan.service';
import { video } from './video/video.service';
import { statistic } from './statistic';

export const allServices = {
    channel,
    video,
    comment,
    apiKey,
    statistic,
    scan,
    fixAsync: testAsync
};
