export function getReplyCommentElement(parentEl: HTMLElement): HTMLElement | undefined {
    return parentEl.parentElement?.querySelector('ytd-comment-replies-renderer') as HTMLElement
  }
