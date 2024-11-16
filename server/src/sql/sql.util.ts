export const sql_where = (field: string, value: string | undefined) => (value ? `where ${field} = ${sql_escape(value)}` : `where ${field} is not null`);
export const sql_and = (field: string, str: string | undefined) => (str ? `and ${field} = ${sql_escape(str)}` : ``);
export const sql_escape = (value: string | undefined) => (value ? `'${value.replace("'",'"')}'` : undefined);
