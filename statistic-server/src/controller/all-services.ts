import { uploadToFirebaseAsync } from './upload-to-firebase/upload-to-firebase.service';
import { getServerInfoAsync } from './server-info/server-info.service';
import { statistic, } from './statistic/services';
import { testAsync } from './test/test.service';
import { channelIdsToFirebaseAsync } from './channel-ids-to-firebase/channel_ids-to-firebase.service';

export const allServices = {
    statistic,
    test: testAsync,
    serverInfo: {getServerInfoAsync},
    uploadToFirebaseAsync,
    channelIdsToFirebaseAsync

};
