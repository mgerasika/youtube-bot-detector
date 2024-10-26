export function getCommentElements(): HTMLElement[] {
    const rootElements = document.body.getElementsByTagName(
      "ytd-comment-view-model"
    ) ;
    return Array.from(rootElements) as HTMLElement[];
  }