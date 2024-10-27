export function getAuthorUrl(el: HTMLElement): string | undefined {
    const linkElement = el.querySelector("a[id=author-text]");
    if(linkElement && linkElement.getAttribute) {
      const id = linkElement?.getAttribute("href")?.replace("/channel/", "");
      if(id) {
        let tmp = decodeURIComponent(id.replace('/@','@')).toLowerCase();
        return tmp.replaceAll('й', 'и').replaceAll('ї','і');
      }
    }
    return undefined;
  }

  //@тетянабоико-и3ф"
  //@тетянабоико-й3ф
  //@володимир-ь7и8б