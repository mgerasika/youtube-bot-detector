export function getVideoId() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const videoId = params.get('v');
    return videoId;
}