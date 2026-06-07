export enum Time {
    MINUTE_1 = 60_000,
    MINUTE_10 = 600_000,
    HOURS_1 = 3_600_000,
    DAY_1 = 86_400_000,
}

export const TimeUtils = {
    formatToHHmm: (date: Date) => {
        const hours = date.getHours() - 1;
        const minutes = String(date.getMinutes()).padStart(2, '0');

        if (hours > 0) {
            return `${hours}h${minutes}`;
        }

        return `${minutes}m`;
    },
};
