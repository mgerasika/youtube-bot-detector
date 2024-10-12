import { createUrls, EMPTY_URL_ITEM, IUrlItem } from 'react-create-url';

interface IApiUrl {
    swagger: IUrlItem;
    api: {
        
        rabbitMQ: {
            sendMessage: IUrlItem;
        };
       
        example: {
            id: (id?: string) => IUrlItem;
        };
        
        tools: {
			sendToRabbitMq: IUrlItem;
        };

        
    };
}

export const API_URL = createUrls<IApiUrl>({
    swagger: EMPTY_URL_ITEM,
    api: {
        
        rabbitMQ: {
            sendMessage: EMPTY_URL_ITEM,
        },
        
       

        example: {
            id: (id?: string) => EMPTY_URL_ITEM,
        },
        tools: {
			sendToRabbitMq: EMPTY_URL_ITEM,
        },
       
    },
});
