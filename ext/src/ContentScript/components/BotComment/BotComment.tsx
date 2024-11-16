

import React, {  useCallback, useEffect, useMemo } from 'react';
import { getReplyCommentElement } from '../../utils/get-reply-comment-element.util';
import { getAuthorUrl } from '../../utils/get-authour-url.util';
import { usePolling } from '../../hooks/use-pooling.hook';
import { IFirebaseBody } from '../../api/use-get-firebase-statistic.hook';
import { WhyItsBotButton } from '../WhyItsButton/WhyItsBotButton';
import { ReplyButtonContainer } from '../ReplyButtonContainer/ReplyButtonContainer';
import { CommentPopup } from '../CommentPopup/CommentPopup';
import { useHover } from '../../hooks/use-hover.hook';
import { Avatar } from '../Avatar/Avatar';

interface IProps {
  statistic?: IFirebaseBody;
  parentEl: HTMLElement;
  authorId: string;
  onReplyClick: (parent: HTMLElement) => void;
}
export const BotComment: React.FC<IProps> = ({ parentEl, statistic, authorId, onReplyClick }: IProps) => {
  const authorUrl = useMemo(() => getAuthorUrl(parentEl), [parentEl]);

  const textContentEl = usePolling(() => parentEl.querySelector('#content-text') as HTMLElement, [parentEl])

  useEffect(() => {
    if (textContentEl) {
      textContentEl.style.backgroundColor = 'rgba(255, 0, 0, 0.16)'
    }
  }, [textContentEl])
  

  const handleReplyClick = useCallback(() => {
    onReplyClick(parentEl);
  }, [onReplyClick, parentEl])

  const replyCommentEl = useMemo(() => getReplyCommentElement(parentEl), [parentEl])
  useEffect(() => {
    replyCommentEl?.addEventListener('click', handleReplyClick);
    return () => replyCommentEl?.removeEventListener('click', handleReplyClick);
  }, [handleReplyClick, replyCommentEl]);


  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  return  <><ReplyButtonContainer ref={hoverRef} parentEl={parentEl}>
      <WhyItsBotButton parentEl={parentEl} />
      {isHovered && <CommentPopup
        authorId={authorId || ''}
        authorUrl={authorUrl || ''}
        isOpen={isHovered}
        parentEl={parentEl}
        statistic={statistic} />}
    </ReplyButtonContainer>
    <Avatar authorId={authorId} parentEl={parentEl} />
    </>;
}
