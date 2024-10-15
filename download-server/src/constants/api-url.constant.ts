import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
       
        scan: {
            scanVideos: IUrlItem;
            scanComments: IUrlItem;
            scanChannelInfo: IUrlItem;
        };

        youtube: {
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
            scanVideos: EMPTY_URL_ITEM,
            scanComments: EMPTY_URL_ITEM,
            scanChannelInfo: EMPTY_URL_ITEM
        },
        youtube: {
            getVideos: EMPTY_URL_ITEM,
            getComments: EMPTY_URL_ITEM,
            getChannelId: EMPTY_URL_ITEM,
            getChannelInfo: EMPTY_URL_ITEM
        },
    },
});
