import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { toQuery } from '@common/utils/to-query.util';
import { api } from '@server/api.generated';
import { IAddYoutubeKeyBody } from '@common/interfaces/scan.interface';
import { processYoutubeErrorAsync } from '@server/youtube';
import { AxiosError } from 'axios';
import { google } from 'googleapis';

export const addYoutubeKeyAsync = async (body: IAddYoutubeKeyBody): IAsyncPromiseResult< string> => {
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
            return ['user provide invalid key, skip']
        }
    } catch (ex) {
        return ['validate youtube key error, skip ' + ex];
    }

    const [, postError] = await toQuery(() => api.keyPost({ email: body.email, youtube_key: body.key }));
    if (postError) {
        return [, postError];
    }
    return ['success add/update key'];
};
