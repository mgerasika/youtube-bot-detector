import { ILogger } from "@common/utils/create-logger.utils";
import { IAsyncPromiseResult } from "./async-promise-result.interface";
import { IScanReturn } from "./rabbitm-mq-return";
import { IStatisticServerTestBody, IUploadStatisticBody } from "@common/model/statistic-server.model";

export interface IStatisticServerRabbitMq {
    testAsync: (body: IStatisticServerTestBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
    uploadStatisticAsync: (body: IUploadStatisticBody, logger: ILogger) => IAsyncPromiseResult<IScanReturn>;
};