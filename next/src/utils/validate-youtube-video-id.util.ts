export function validateYouTubeVideoId(videoId:string):boolean {
    const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
    
    if (!videoId || !youtubeIdPattern.test(videoId)) {
      return false;
    }
    return true;
}
  
  
  
  