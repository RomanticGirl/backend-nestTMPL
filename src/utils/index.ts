export const timestampInSeconds = () => Math.floor(Date.now() / 1000);

export const dateToTimestamp = (date: string | number | Date) => Math.floor(+(new Date(date)) / 1000);
