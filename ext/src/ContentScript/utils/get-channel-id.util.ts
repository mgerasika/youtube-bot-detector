export function getChannelId() {
    const container = document.querySelector("div[id='social-links']")
    if(container) {
      const link  = container.querySelector("a")
      if(link) {
        const href = link.href.replace('/videos', '')
        return href.split('/').pop();
      }
    
    }
    return undefined
  }