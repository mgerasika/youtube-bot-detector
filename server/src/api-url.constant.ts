import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
            channel: {
                id: (id?: string) => IUrlItem;
            };
            comment: {
                lastDate: IUrlItem;
                authorIds: IUrlItem;
                id: (id?: string) => IUrlItem;
            };
            video: {
                lastDate: IUrlItem;
                id: (id?: string) => IUrlItem;
            };
            apiKey: {
                active: IUrlItem,
                addYoutubeKey: IUrlItem,
            };

            statistic: {
                info: IUrlItem,
                byVideo: IUrlItem,
                byChannel: IUrlItem,
                byChannelAndVideo: IUrlItem,
            };
            test: IUrlItem;
            scan: {
                fullByVideo: IUrlItem,
                fullByChannel: IUrlItem,
            };
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
            channel: {
                id: (id?: string) => EMPTY_URL_ITEM,
            },
            comment: {
                lastDate: EMPTY_URL_ITEM,
                authorIds: EMPTY_URL_ITEM,
                id: (id?: string) => EMPTY_URL_ITEM,
            },
            video: {
                lastDate: EMPTY_URL_ITEM,
                id: (id?: string) => EMPTY_URL_ITEM,
            },
            apiKey: {
                active: EMPTY_URL_ITEM,  
                addYoutubeKey: EMPTY_URL_ITEM,
            },
            statistic: {
                info: EMPTY_URL_ITEM,
                byVideo: EMPTY_URL_ITEM,
                byChannel: EMPTY_URL_ITEM,
                byChannelAndVideo: EMPTY_URL_ITEM,
            },
            test: EMPTY_URL_ITEM,
            scan: {
              
                fullByVideo: EMPTY_URL_ITEM,
                fullByChannel: EMPTY_URL_ITEM,
            },
    },
});
