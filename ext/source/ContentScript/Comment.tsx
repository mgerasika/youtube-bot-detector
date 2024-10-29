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

  const commentMinMaxDiff = useMemo((): number | undefined => {
    if (byChannelAndVideo?.min_comment_publish_date && byChannelAndVideo.max_comment_publish_date) {
      return calculateDateDifference(new Date(byChannelAndVideo?.min_comment_publish_date), new Date(byChannelAndVideo?.max_comment_publish_date))
    }
    return undefined;
  }, [byChannelAndVideo])

  const channelAgeFromToday = useMemo((): number | undefined => {
    if (byChannelAndVideo?.channel_published_at) {
      return calculateDateDifference(new Date(byChannelAndVideo?.channel_published_at), new Date())
    }
    return undefined;
  }, [byChannelAndVideo])
  const rate = useMemo(() => {
    if (commentMinMaxDiff) {
      return (+(byChannelAndVideo?.comments_on_current_channel || 0) / commentMinMaxDiff || 1)
    }
    return undefined;

  }, [byChannelAndVideo, commentMinMaxDiff])

  const rate_from_start = useMemo(() => {
    if (channelAgeFromToday) {
      return (+(byChannelAndVideo?.comments_on_current_channel || 0) / channelAgeFromToday || 1)
    }
    return undefined;
  }, [byChannelAndVideo, channelAgeFromToday])

  const isBot = useMemo((): boolean => {
    if (rate && +rate > 2) {
      return true;
    }
    if (rate_from_start && +rate_from_start > 2) {
      return true;
    }
    return false;

  }, [rate, rate_from_start])

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
      {byChannelAndVideo?.comments_on_all_channels}/{byChannelAndVideo?.comments_on_current_channel}/{rate?.toFixed(1)}/{rate_from_start?.toFixed(1)}
    </div>
    {isOpen && <CommentPopup byChannelAndVideo={byChannelAndVideo}
      channelAgeFromToday={channelAgeFromToday}
      rate={rate} rate_from_start={rate_from_start} commentMinMaxDiff={commentMinMaxDiff} />}
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

function calculateDateDifference(startDate: Date, endDate: Date): number {
  // Get the difference in milliseconds
  const differenceInMs = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  return Math.floor(differenceInDays); // Use Math.floor to get full days
}