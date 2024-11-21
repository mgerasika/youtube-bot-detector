export interface IConnectionParams {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
}

export function parseConnectionString(connectionString: string): IConnectionParams {
    const regex = /^(?<protocol>[a-z]+):\/\/(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:]+):(?<port>\d+)\/(?<database>.+)$/;

    const match = connectionString.match(regex);
    if (!match || !match.groups) {
        throw new Error("Invalid connection string format.");
    }

    return {
        user: match.groups.user,
        password: match.groups.password,
        host: match.groups.host,
        port: parseInt(match.groups.port, 10),
        database: match.groups.database,
    };
}