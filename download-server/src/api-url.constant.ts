import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
       
        scan: {
            fullScanChannelInfo: IUrlItem;
            scanVideos: IUrlItem;
            scanComments: IUrlItem;
            scanChannelInfo: IUrlItem;
            scanVideoInfo: IUrlItem;
            scanAuthors: IUrlItem;
            addYoutubeKey: IUrlItem;
        };

        youtube: {
            getVideos: IUrlItem;
            getComments: IUrlItem;
            getChannelId: IUrlItem;
            getChannelInfo: IUrlItem;
            getVideoInfo: IUrlItem;
            getShortChannelInfo: IUrlItem;
        };
        
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        scan: {
            fullScanChannelInfo: EMPTY_URL_ITEM,
            scanVideos: EMPTY_URL_ITEM,
            scanComments: EMPTY_URL_ITEM,
            scanChannelInfo: EMPTY_URL_ITEM,
            scanVideoInfo: EMPTY_URL_ITEM,
            scanAuthors: EMPTY_URL_ITEM,
            addYoutubeKey: EMPTY_URL_ITEM
        },
        youtube: {
            getVideos: EMPTY_URL_ITEM,
            getComments: EMPTY_URL_ITEM,
            getChannelId: EMPTY_URL_ITEM,
            getChannelInfo: EMPTY_URL_ITEM,
            getVideoInfo: EMPTY_URL_ITEM,
            getShortChannelInfo: EMPTY_URL_ITEM
        },
    },
});
