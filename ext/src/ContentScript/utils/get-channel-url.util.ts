
export function getChannelUrl() : string | undefined {
    const link = document.querySelector("#owner ytd-channel-name[id='channel-name'] a") as HTMLLinkElement
    if(link && link.href) {
        return link.href.split('/').pop();
    
    }
    return undefined
  }