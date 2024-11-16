import { scan, } from './scan/services';
import { getServerInfoAsync } from './server-info/server-info.service';
import { youtube, } from './youtube/services';

export const allServices = {
    scan,
    youtube,
    serverInfo: {getServerInfoAsync}
};
