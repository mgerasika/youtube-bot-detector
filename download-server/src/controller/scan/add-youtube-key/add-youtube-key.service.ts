import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { toQuery } from '@common/utils/to-query.util';
import { api } from '@server/api.generated';
import { processYoutubeErrorAsync } from '@server/youtube';
import { AxiosError } from 'axios';
import { google } from 'googleapis';
import { ILogger } from '@common/utils/create-logger.utils';
import { IAddYoutubeKeyBody } from '@common/model';
import { IScanReturn } from '@common/interfaces/scan.interface';

export const addYoutubeKeyAsync = async (body: IAddYoutubeKeyBody, logger: ILogger): IAsyncPromiseResult<IScanReturn> => {
    try {
        const youtubeInstance = google.youtube({
            version: 'v3',
            auth: body.key,
        });

        const [, responseError] = await toQuery(() =>
            youtubeInstance.channels.list({
                part: ['id'],
                id: ['UCqOowQp96vnKJ_e4eoDvUsA'], // @mgerasika channel id
            }),
        );

        if (responseError) {
            return [{message: logger.log('user provide invalid key, skip')}]
        }
    } catch (ex) {
        
        return [{message:logger.log('validate youtube key error, skip ' + ex)}];
    }

    const [, postError] = await toQuery(() => api.keyPost({ email: body.email, youtube_key: body.key }));
    if (postError) {
        return [, postError];
    }
   
    return [{message: logger.log('success add/update key')}];
};
