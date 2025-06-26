import { createUrls, EMPTY_URL_ITEM, IUrlItem, } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
        serverInfo: IUrlItem;
        test: IUrlItem;
        statistic: {
            uploadStatistic: IUrlItem;
        };
        channelIdsToFirebase: IUrlItem;
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        serverInfo: EMPTY_URL_ITEM,
        test: EMPTY_URL_ITEM,
        statistic: {
            uploadStatistic: EMPTY_URL_ITEM,
        },
       channelIdsToFirebase: EMPTY_URL_ITEM
    },
});
