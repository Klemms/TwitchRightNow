export enum Time {
    MINUTE_1 = 60_000,
    MINUTE_10 = 600_000,
    HOURS_1 = 3_600_000,
    DAY_1 = 86_400_000,
}

export const TimeUtils = {
    formatToHHmm: (time: number) => {
        const timeS = parseInt(String(time / 1000), 10);
        const hours = parseInt(String(timeS / 3600), 10);
        const minutes = parseInt(String((timeS - hours * 3600) / 60), 10);

        if (hours > 0) {
            return `${hours}h${String(minutes).padStart(2, '0')}`;
        }

        return `${minutes}m`;
    },
};
