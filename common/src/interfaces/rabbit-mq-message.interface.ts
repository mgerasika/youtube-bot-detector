export interface IRabbitMqBody {
    methodArgumentsJson: any;
    methodName: string;
}

export interface IRabbitMqMessage {
	msg:IRabbitMqBody
}