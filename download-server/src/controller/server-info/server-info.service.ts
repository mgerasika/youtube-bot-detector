import { IAsyncPromiseResult, } from '@common/interfaces/async-promise-result.interface';
import { ILogger, } from '@common/utils/create-logger.utils';
import { getMemoryInfo } from '@common/utils/log-memory.utils';
import { getLocalIpv4 } from '@common/utils/get-ip-address.util';
import { IServerInfo } from '@common/model/server-info.interface';

export const getServerInfoAsync = async (logger: ILogger): IAsyncPromiseResult<IServerInfo> => {
    return [{
        serverName: 'download-server',
        memory: getMemoryInfo(),
        ipV4: getLocalIpv4()
    }]
}

