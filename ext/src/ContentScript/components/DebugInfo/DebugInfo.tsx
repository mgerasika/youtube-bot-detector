

import React, {  useCallback, useEffect, useMemo } from 'react';
import { getReplyCommentElement } from '../../utils/get-reply-comment-element.util';
import { IFirebaseBody } from '../../api/use-get-firebase-statistic.hook';
import styles from './DebugInfo.module.css'

const IS_DEBUG = localStorage.getItem('IS_DEBUG')
interface IProps {
  statistic?: IFirebaseBody;
  parentEl: HTMLElement;
  authorId: string;
  onReplyClick: (parent: HTMLElement) => void;
}
export const DebugInfo: React.FC<IProps> = ({ parentEl, authorId, statistic,  onReplyClick }: IProps) => {
  const handleReplyClick = useCallback(() => {
    onReplyClick(parentEl);
  }, [onReplyClick, parentEl])

  const replyCommentEl = useMemo(() => getReplyCommentElement(parentEl), [parentEl])
  useEffect(() => {
    replyCommentEl?.addEventListener('click', handleReplyClick);
    return () => replyCommentEl?.removeEventListener('click', handleReplyClick);
  }, [handleReplyClick, replyCommentEl]);

  return IS_DEBUG ? <pre className={styles.root}>
     {JSON.stringify({authorId,...statistic},null,2)}
    </pre> : null;
}

