import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
            channel: {
                id: (id?: string) => IUrlItem;
            };
            comment: {
                lastDate: IUrlItem;
                id: (id?: string) => IUrlItem;
            };
            video: {
                lastDate: IUrlItem;
                id: (id?: string) => IUrlItem;
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
                id: (id?: string) => EMPTY_URL_ITEM,
            },
            video: {
                lastDate: EMPTY_URL_ITEM,
                id: (id?: string) => EMPTY_URL_ITEM,
            },
    },
});
