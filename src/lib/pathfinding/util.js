// Sleeps ms amount of milliseconds, this is async
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
