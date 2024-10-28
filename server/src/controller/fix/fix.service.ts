import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { nameOf } from '@common/utils/name-of';
import { rabbitMQ_sendDataAsync } from '@common/utils/rabbit-mq';
import { ENV, RABBIT_MQ_ENV } from '@server/env';
import { allServices } from '../all-services';
import {
    IAddYoutubeKeyBody,
    IFixBoxy,
    IScan,
    IScanChannelInfoBody,
    IScanCommentsBody,
    IScanVideoInfoBody,
} from '@common/interfaces/scan.interface';
import { ILogger } from '@common/utils/create-logger.utils';
import { groupArray } from '@common/utils/group-array.util';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';


export const fixAsync = async (logger: ILogger): IAsyncPromiseResult<string> => {
    const [ids, error] = await allServices.comment.getAutorsIds(logger);
    if (error) {
        return [, error];
    }

    if (ids?.length) {
        const groups = groupArray(ids, 50);
        await oneByOneAsync(groups, async (group) => {
            await rabbitMQ_sendDataAsync<IFixBoxy>(
                RABBIT_MQ_ENV,
                'fixAsync',
                {
                    date: new Date(),
                    authorIds: group,
                } as any,
                logger,
            );
        });
    }

    return ['fix added to queue ' + ids?.length];
};
