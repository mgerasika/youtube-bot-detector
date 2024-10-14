export interface IRabbitMqBody {
    exampleMessage?: string;
    exampleFlag?: boolean;
}

export interface IRabbitMqMessage {
	msg:IRabbitMqBody
}