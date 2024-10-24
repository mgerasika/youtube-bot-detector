
export function getChannelUrl() : string | undefined {
    const container = document.querySelector("ytd-channel-name[id='channel-name']")
    if(container) {
      const link  = container.querySelector("a")
      if(link) {
        return link.href.split('/').pop();
      }
    
    }
    return undefined
    }