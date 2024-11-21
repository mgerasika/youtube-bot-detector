import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { toQuery, } from '@common/utils/to-query.util';
import { api, } from '@server/api.generated';
import { google, } from 'googleapis';
import { ILogger, } from '@common/utils/create-logger.utils';
import { IScanReturn, } from '@common/interfaces/rabbitm-mq-return';
import { IAddYoutubeKeyBody, } from '@common/model/download-server.model';

export const addYoutubeKeyAsync = async (body: IAddYoutubeKeyBody, logger: ILogger): IAsyncPromiseResult<IScanReturn> => {
    logger.log('addYoutubeKeyAsync start', body);
    try {
        const youtubeInstance = google.youtube({
            version: 'v3',
            auth: body.key,
        });

        const [, responseError] = await toQuery(() =>
            youtubeInstance.channels.list({
                part: ['id'],
                id: ['UCqOowQp96vnKJ_e4eoDvUsA'], // @mgerasika channel id
            })
        );

        if (responseError) {
            return [{message: logger.log('user provide invalid key, skip')}]
        }
    } catch (ex) {
        
        return [{message:logger.log('validate youtube key error, skip ' + ex)}];
    }

    const [, postError] = await toQuery(() => api.keyPost({ email: body.email, youtube_key: body.key, status: 'active', expired:null as unknown as undefined }));
    if (postError) {
        return [, postError];
    }
   
    logger.log('addYoutubeKeyAsync end');
    return [{message: logger.log('success add/update key')}];
};
