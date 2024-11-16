import { apiKey, } from './api-key/api-key.service';
import { channel, } from './channel/channel.service';
import { comment, } from './comment/comment.service';
import { testAsync, } from './test/test.service';
import { scan, } from './scan/scan.service';
import { video, } from './video/video.service';
import { statistic, } from './statistic';
import { task } from './task/task.service';
import { getServerInfoAsync } from './server-info/server-info.service';
import { allServerInfo } from './all-server-info/all-server-info.service';

export const allServices = {
    channel,
    video,
    comment,
    apiKey,
    statistic,
    scan,
    testAsync,
    task,
    allServerInfo,
    serverInfo: {getServerInfoAsync}
};
