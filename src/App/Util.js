export function getStreamUptime(startTime) {
    let start = new Date(startTime);
    let now = new Date();
    let hours = (((now - start) / 1000) / 60) / 60;
    let minutes = (((now - start) / 1000) / 60) % 60;

    return parseInt(hours) + ":" + parseInt(minutes).toString().padStart(2, '0');
}
