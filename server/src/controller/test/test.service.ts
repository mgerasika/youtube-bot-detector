/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAsyncPromiseResult } from '@common/interfaces/async-promise-result.interface';
import { ILogger } from '@common/utils/create-logger.utils';
import { sqlQueryAsync } from '@server/sql/sql-async.util';
import { sql_escape } from '@server/sql/sql.util';
import { huggingFaceAsync } from './hugging-face.service';
import { oneByOneAsync } from '@common/utils/one-by-one-async.util';
import { channel } from 'diagnostics_channel';
import { allServices } from '../all-services';
import { IFullScanChannelInfoBody } from '@common/model/download-server.model';
import { rabbitMqService } from '@common/services/rabbit-mq';
import { RABBIT_MQ_DOWNLOAD_ENV } from '@server/env';


const youtubeChannels = [
    
    // { username: "@CNN", channelId: "UCupvZG-5ko_eiXAupbDfxWw" },
    // { username: "@NBCNews", channelId: "UCeY0bbntWzzVIaj2z3QigXg" },
    // { username: "@CBSNews", channelId: "UC8p1vwvWtl6T73JiExfWs1g" },
    // { username: "@FoxNews", channelId: "UCXIJgqnII2ZOINSWNOGFThA" },
    
    { username: "@tsn", channelId: "UCXoJ8kY9zpLBEz-8saaT3ew" },
    { username: "@УкраїнськаПравда", channelId: "UChparf_xrUZ_CJGQY5g4aEg" },
    { username: "@unian", channelId: "UCKCVeAihEfJr-pGH7B73Wyg" },
    { username: "@ButusovPlus", channelId: "UCg7T647ROSeONOCHeNMBduQ" },
    
    { username: "@mgerasika", channelId: "UCqOowQp96vnKJ_e4eoDvUsA" },
    { username: "@army_tv_ua", channelId: "UCWRZ7gEgbry5FI2-46EX3jA" },
    { username: "@IstoriyaBezMifiv", channelId: "UCXx3yVx9paWJ-BLZVqQ8CRQ" },
    { username: "@bootuseua", channelId: "UCk_mTOq1CM29S3fvIaV0Gdw" },
    { username: "@portnikov", channelId: "UCV0ZrOPCKzqx36rRiPHkwFg" },
    { username: "@liga_net", channelId: "UCozzcggrnIZPLgDSVA4qKCQ" },
    { username: "@FaktyICTVchannel", channelId: "UCG26bSkEjJc7SqGsxoHNnbA" },
    { username: "@UKRAINETODAY24", channelId: "UCjAg2-3PgoksLAkYE88S_6g" },
    { username: "@RadaTVchannel", channelId: "UC5V8mErVFOpcQXEb3y9IMZw" },
    { username: "@weukrainetv", channelId: "UCEduOt4TK8TtOaznB45TrhA" },
    { username: "@1plus1", channelId: "UCVEaAWKfv7fE1c-ZuBs7TKQ" },
    { username: "@НароднаДумка", channelId: "UCsWMSE0bHdHLCqsMXUfQeSA" },
    { username: "@lugablog", channelId: "UCWParBCQ4W46CDNAxA5IXFg" },
    { username: "@DmytriyGordon", channelId: "UCZIFo5MmrUJS5JbLOxgnHuQ" },
    { username: "@NevzorovTV", channelId: "UC8kI2B-UUv7A5u3AOUnHNMQ" },
    { username: "@Censor_Net", channelId: "UC2J8-ykgWRStTGy6uUvhr_A" },
    { username: "@pryamiy", channelId: "UCH9H_b9oJtSHBovh94yB5HA" },
    { username: "@Taras.Berezovets", channelId: "UC7FEBULCrgaFxH05t6mYeHA" },
    { username: "@STERNENKO", channelId: "UC5HBd4l_kpba5b0O1pK-Bfg" },
    { username: "@MackNack", channelId: "UCgpSieplNxXxLXYAzJLLpng" },
    { username: "@OlegZhdanov", channelId: "UC111NXlcDs0VGfyre6EiPmA" },
    { username: "@Taras_Lawyer", channelId: "UCxS4p_IE2fQG5kJu9coxn4w" },
    { username: "@ZnajUA", channelId: "UCCj_la08uOQ1teL2dD-xcRw" },
    { username: "@dneprexpress", channelId: "UC1h4sv6jq8vrKvtyNSqbpYQ" },
    { username: "@EspresoTv", channelId: "UCMEiyV8N2J93GdPNltPYM6w" },
    { username: "@hromadske_ua", channelId: "UC2oGvjIJwxn1KeZR3JtE-uQ" },
    { username: "@PresidentGovUa", channelId: "UCncq73xfx9sVA3Ht2uVRrCw" },
    { username: "@RadioSvobodaUkraine", channelId: "UC-wWyFdk_txbZV8FKEk0V8A" },
    { username: "@arestovych", channelId: "UCjWy2g76QZf7QLEwx4cB46g" },
    { username: "@YuriyRomanenko_Ukraine", channelId: "UCY2z9noVRgOx0AZwqMCLuBA" },
    { username: "@FeyginLive", channelId: "UCQVtD_N4OeD-9PshBq7NwyQ" },
    { username: "@yuryshvets", channelId: "UCb2oej0JtxlnywlqoSiHHVQ" },
    { username: "@Max_Katz", channelId: "UCUGfDbfRIx51kJGGHIFo8Rw" },
    { username: "@varlamov", channelId: "UC101o-vQ2iOj9vr00JUlyKw" }
  ];
  
export const testAsync = async (logger: ILogger): IAsyncPromiseResult<unknown> => {
    logger.log('testAsync start');

    await oneByOneAsync(youtubeChannels, async (channel) => {
        logger.log('start getFullScanByChannelAsync ', channel.username)
        await rabbitMqService.sendDataAsync<IFullScanChannelInfoBody>(
            RABBIT_MQ_DOWNLOAD_ENV,
            'fullScanChannelInfoAsync',
            {
                channelId: channel.channelId,
                ignoreCommentsLastDate:false,
                ignoreVideoLastDate: false,
            } ,
            logger
        );
    })

    logger.log('testAsync end');
    return [{}];
};

export const getComments = async (logger: ILogger): IAsyncPromiseResult<unknown> => {
    logger.log('getComments start');

    const id = 'UCfppUojvDPTw1u2FjoEMMug'
    const [comment, commentError] = await sqlQueryAsync<any>(async (client) => {
        const {rows} = await client.query<any>(`SELECT STRING_AGG(text, '\n') AS combined_text
        FROM (
            SELECT text
            FROM public.comment
            WHERE author_id = ${sql_escape(id)}
            ORDER BY RANDOM()
            LIMIT 10
        ) AS random_comments;`);
         if(!rows?.length) {
            return [,  'not found'] 
         }
        return rows[0].combined_text;
    }, logger)
    if(commentError) {
        return [,commentError]
    }
    logger.log('comment', comment)
    return comment;
};


