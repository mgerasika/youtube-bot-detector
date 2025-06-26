import { channelIdsToFirebaseAsync } from '../channel-ids-to-firebase/channel-ids-to-firebase.service';
import { testAsync, } from '../test/test.service';
import { uploadStatisticAsync, } from './upload-statistic/upload-statistic.service';

export const statistic = {
       testAsync,
       uploadStatisticAsync,
       channelIdsToFirebaseAsync,
};
