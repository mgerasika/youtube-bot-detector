import { channelIdsToFirebaseAsync } from './channel-ids-to-firebase/channel-ids-to-firebase.service';
import { getServerInfoAsync } from './server-info/server-info.service';
import { statistic, } from './statistic/services';
import { testAsync } from './test/test.service';

export const allServices = {
    statistic,
    test: testAsync,
    serverInfo: {getServerInfoAsync},
    channelIdsToFirebaseAsync

};
