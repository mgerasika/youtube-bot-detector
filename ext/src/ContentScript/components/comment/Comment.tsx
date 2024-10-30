

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getReplyCommentElement } from '../../utils/get-reply-comment-element.util';
import { getAuthorUrl } from '../../utils/get-authour-url.util';
import { CommentPopup } from '../comment-popup/CommentPopup';
import { IStatisticByVideo } from '../../../api.generated';
import { usePolling } from '../../hooks/use-pooling.hook';

interface IProps {
  statistic: IStatisticByVideo
  parentEl: HTMLElement;
  onReplyClick: (parent: HTMLElement) => void;
}
export const Comment: React.FC<IProps> = ({ statistic, parentEl, onReplyClick }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setFlagsState] = useState<IFlagsState>();
  const authourUrl = useMemo(() => getAuthorUrl(parentEl), []);
  const imageRef = useRef<HTMLImageElement>();
  

  const avatarEl = usePolling(() => parentEl.querySelector('yt-img-shadow img') as HTMLElement, [parentEl])
  useEffect(() => {
    if (avatarEl && imageRef.current) {
      imageRef.current.style.width = avatarEl.offsetWidth + 'px';
      imageRef.current.style.height = avatarEl.offsetHeight + 'px';
    }
  }, [imageRef.current,  avatarEl])

  const handleParentClick = useCallback(() => {
    setFlagsState(getFlagsState(parentEl))
  }, [])

  const handleReplyClick = useCallback(() => {
    onReplyClick && onReplyClick(parentEl);
  }, [parentEl])

  const replyCommentEl = useMemo(() => getReplyCommentElement(parentEl), [parentEl])
  useEffect(() => {
    replyCommentEl?.addEventListener('click', handleReplyClick);
    return () => replyCommentEl?.removeEventListener('click', handleReplyClick);
  }, []);

  useEffect(() => {
    parentEl.addEventListener('click', handleParentClick);
    return () => parentEl.removeEventListener('click', handleParentClick);
  }, []);


  useEffect(() => {
    if (statistic.isBot) {
      parentEl.classList.add('bot')
      const div = parentEl.querySelector('yt-attributed-string');
      if (div) {
        div.classList.add('bot')
      }
    }
  }, [statistic.isBot, parentEl]);

  useEffect(() => {
    setFlagsState(getFlagsState(parentEl))
  }, [parentEl]);


  const imageUrl = chrome.runtime.getURL("assets/bot.png")
  return statistic.isBot ? <div className="ybf-comment" id={authourUrl} onClick={() => setIsOpen(!isOpen)}>
    <img ref={imageRef as any} src={imageUrl} className='ybf-icon' />
    <CommentPopup
      isOpen={isOpen}
      parentEl={parentEl}
      statistic={statistic} />
  </div> : null;
}

interface IFlagsState {
  liked: boolean;
  disliked: boolean;
  authorLiked: boolean;
}
function getFlagsState(el: HTMLElement): IFlagsState {
  let res: IFlagsState = {
    authorLiked: false,
    disliked: false,
    liked: false
  };
  const toolbar = el.querySelector("div[id=toolbar]");
  const [likeBtn, dislikeBtn, authorLikedBtn] = toolbar?.getElementsByTagName("button") || [];
  if (likeBtn?.getAttribute("aria-pressed") === "true") {
    res.liked = true;
  }
  if (dislikeBtn?.getAttribute("aria-pressed") === "true") {
    res.disliked = true;
  }
  if (authorLikedBtn?.getAttribute("aria-label") === "Heart") {
    res.authorLiked = true;
  }

  return res;
};
