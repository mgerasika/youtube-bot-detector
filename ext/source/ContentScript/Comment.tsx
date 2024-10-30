import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IStatistic } from '../api.generated';
import { getReplyCommentElement } from './utils/get-reply-comment-element.util';
import { getAuthorUrl } from './utils/get-authour-url.util';
import { CommentPopup } from './CommentPopup';

interface IProps {
  byChannelAndVideo: IStatistic
  parentEl: HTMLElement;
  onReplyClick: (parent: HTMLElement) => void;
}
export const Comment: React.FC<IProps> = ({ byChannelAndVideo, parentEl, onReplyClick }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setFlagsState] = useState<IFlagsState>();
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

  

  const frequency_by_all = useMemo(() => {
    if (byChannelAndVideo.unique_days_all) {
      return (+(byChannelAndVideo?.comments_on_all_channels || 0) / (+byChannelAndVideo.unique_days_all || 1) )
    }
    return undefined;
  }, [byChannelAndVideo])

  const frequency_by_channel = useMemo(() => {
    if (byChannelAndVideo.unique_days_on_channel) {
      return (+(byChannelAndVideo?.comments_on_current_channel || 0) / (+byChannelAndVideo.unique_days_on_channel || 1))
    }
    return undefined;
  }, [byChannelAndVideo])



  const isBot = useMemo((): boolean => {
    if (frequency_by_channel && frequency_by_channel > 4) {
      return true;
    }
    if (frequency_by_all && frequency_by_all > 4) {
      return true;
    }
    return false;

  }, [frequency_by_channel, frequency_by_all])

  useEffect(() => {
    if (isBot) {
      parentEl.classList.add('bot')
      const div = parentEl.querySelector('yt-attributed-string');
      if (div) {
        div.classList.add('bot')
      }
    }
  }, [isBot, parentEl]);


  useEffect(() => {
    setFlagsState(getFlagsState(parentEl))
  }, [parentEl]);


  return <div className="botDiv" id={authourUrl} onClick={() => setIsOpen(!isOpen)}>
    <div className='iconDiv'>
      {byChannelAndVideo?.comments_on_all_channels}/{byChannelAndVideo?.comments_on_current_channel}/{frequency_by_all?.toFixed(1)}/{frequency_by_channel?.toFixed(1)}
    </div>
    {isOpen && <CommentPopup
      frequency_by_channel={frequency_by_channel}
      frequency_by_all={frequency_by_all}
      byChannelAndVideo={byChannelAndVideo} />}
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
