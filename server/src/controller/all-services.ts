import { apiKey } from './api-key/api-key.service';
import { channel } from './channel/channel.service';
import { comment } from './comment/comment.service';
import { statistic } from './statistic/statistic.service';
import { video } from './video/video.service';

export const allServices = {
    channel,
    video,
    comment,
    apiKey,
    statistic
};
