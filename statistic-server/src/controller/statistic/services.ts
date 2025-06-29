import { uploadToFirebaseAsync } from '../upload-to-firebase/upload-to-firebase.service';
import { testAsync, } from '../test/test.service';
import { uploadStatisticAsync, } from './upload-statistic/upload-statistic.service';

export const statistic = {
       testAsync,
       uploadStatisticAsync,
       uploadToFirebaseAsync,
};
