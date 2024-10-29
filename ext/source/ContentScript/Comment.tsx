import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IStatistic } from '../api.generated';
import { getReplyCommentElement } from './utils/get-reply-comment-element.util';
import { getAuthorUrl } from './utils/get-authour-url.util';

interface IProps {
  byChannelAndVideo?: IStatistic
  parentEl: HTMLElement;
  onReplyClick: (parent: HTMLElement) => void;
}
export const Comment: React.FC<IProps> = ({ byChannelAndVideo, parentEl, onReplyClick }: IProps) => {

  const [flagsState, setFlagsState] = useState<IFlagsState>();
  const authourUrl = useMemo(() => getAuthorUrl(parentEl), [])

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

  const rate = useMemo(() => {
      return Number(byChannelAndVideo?.comment_frequency || 0).toFixed(2)
  }, [byChannelAndVideo])

  const rate_from_start = useMemo(() => {
    return Number(byChannelAndVideo?.comment_frequency_since_channel || 0).toFixed(2)
}, [byChannelAndVideo])

const isBot = useMemo((): boolean  => {
  if (rate && +rate > 2) {
    return true;
  }
  if (rate_from_start && +rate_from_start > 2) {
    return true;
  }
  return false;
  
},[rate, rate_from_start])

  useEffect(() => {
    if (isBot) 
      {
      parentEl.classList.add('bot')
      const div = parentEl.querySelector('yt-attributed-string');
      if(div) {
        div.classList.add('bot')
      }
    }
  }, [isBot, parentEl]);


  useEffect(() => {
    setFlagsState(getFlagsState(parentEl))
  }, [parentEl]);


  return <div className="botDiv" id={authourUrl}>
    <div className='iconDiv'>
      {byChannelAndVideo?.comment_count || '-'}/{rate || '-'}/{rate_from_start || '-'}

      <pre>{false && JSON.stringify({ ...flagsState }, null, 2)}</pre>
    </div>
  </div>;

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