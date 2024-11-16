export function getVideoId(queryString:string) {
    const params = new URLSearchParams(queryString);
    const videoId = params.get('v');
    return videoId || undefined;
}