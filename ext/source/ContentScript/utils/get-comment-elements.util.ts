export function getCommentElements(): HTMLElement[] {
    const rootElements = document.body.getElementsByTagName(
      "ytd-comment-thread-renderer"
    ) ;
    return Array.from(rootElements) as HTMLElement[];
  }