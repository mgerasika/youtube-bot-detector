// services/cronService.js
import { ILogger } from '@common/utils/create-logger.utils';
import cron from 'node-cron';

export const startCronJob = async (jobName: string, period: string, callback:  () => void, logger: ILogger) => {
    logger.log(`Start cron job = [${jobName}]`)
    cron.schedule(period, async () => {
        
        // Your cron job logic here
        // For example, you could call another function or API
        logger.log(`----------Cron job start executing = [${jobName}]--`);
        try {
            await callback();
        }
        catch(ex) {
            logger.log('Cron job error ', ex)
        }
        logger.log(`------------Cron job finish [${jobName}]--`);
    });
};
