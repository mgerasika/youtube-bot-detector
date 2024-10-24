export function getAuthorUrl(el: HTMLElement): string | undefined {
    const linkElement = el.querySelector("a[id=author-text]");
    if(linkElement && linkElement.getAttribute) {
      const id = linkElement?.getAttribute("href")?.replace("/channel/", "");
      return id ? id.replace('/@','@') : undefined;
    }
    return undefined;
  }