import { createUrls, EMPTY_URL_ITEM, IUrlItem, } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
        serverInfo: IUrlItem;
        statistic: {
            test: IUrlItem;
            uploadStatistic: IUrlItem;
        };

      
        
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        serverInfo: EMPTY_URL_ITEM,
        statistic: {
            test: EMPTY_URL_ITEM,
            uploadStatistic: EMPTY_URL_ITEM,
        },
       
    },
});
