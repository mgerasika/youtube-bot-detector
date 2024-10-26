import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IStatisticInfo } from '../api.generated';
import { getReplyCommentElement } from './utils/get-reply-comment-element.util';

interface IProps {
  byVideo?: IStatisticInfo
  byChannel?: IStatisticInfo
  parentEl: HTMLElement;
  onReplyClick: (parent: HTMLElement) => void;
}
export const Comment: React.FC<IProps> = ({ byVideo, byChannel, parentEl, onReplyClick }: IProps) => {

  const [flagsState, setFlagsState] = useState<IFlagsState>();

  const handleParentClick = useCallback(() =>{
    setFlagsState(getFlagsState(parentEl))
  },[])

  const handleReplyClick = useCallback(() =>{
    onReplyClick && onReplyClick(parentEl);
  },[parentEl])

  const replyCommentEl = useMemo(() => getReplyCommentElement(parentEl), [parentEl])
  useEffect(() => {
    replyCommentEl?.addEventListener('click',handleReplyClick);
    return () => replyCommentEl?.removeEventListener('click', handleReplyClick);
  },[]);

  useEffect(() => {
    parentEl.addEventListener('click',handleParentClick);
    return () => parentEl.removeEventListener('click', handleParentClick);
  },[]);


  useEffect(() =>{
    setFlagsState(getFlagsState(parentEl))
  },[parentEl]);
  return <div className="botDiv">
    <div className='iconDiv'>
    {byChannel?.comment_count || '-'}/{byVideo?.comment_count || '-'}

      <pre>{false && JSON.stringify({...flagsState}, null, 2)}</pre>
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