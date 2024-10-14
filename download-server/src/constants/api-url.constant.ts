import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
       
        scan: {
            getVideos: IUrlItem;
            getComments: IUrlItem;
            getChannelId: IUrlItem;
            getChannelInfo: IUrlItem;
        };
        
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        scan: {
            getVideos: EMPTY_URL_ITEM,
            getComments: EMPTY_URL_ITEM,
            getChannelId: EMPTY_URL_ITEM,
            getChannelInfo: EMPTY_URL_ITEM
        },
    },
});
