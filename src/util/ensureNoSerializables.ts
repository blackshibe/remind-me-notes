export const ensureNoSerializables = (data: any) => JSON.parse(JSON.stringify(data));
