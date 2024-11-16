import { getServerInfoAsync } from './server-info/server-info.service';
import { statistic, } from './statistic/services';

export const allServices = {
    statistic,
    serverInfo: {getServerInfoAsync}
};
