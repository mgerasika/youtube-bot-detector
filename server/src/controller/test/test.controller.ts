import { API_URL } from "@server/api-url.constant";
import { app, IExpressRequest, IExpressResponse } from "@server/express-app";
import { allServices } from "../all-services";
import { testAsync } from "./test.service";
import { createLogger } from "@common/utils/create-logger.utils";



interface IFixRequest extends IExpressRequest {
}

interface IFixResponse extends IExpressResponse<string, void> {}
app.get(API_URL.api.test.toString(), async (req: IFixRequest, res: IFixResponse) => {
    const logger = createLogger();
    const [data, error] = await testAsync(logger);
    if (error) {
        return res.status(400).send( error);
    }
    return res.send(data);
});






