

import React, { useMemo } from 'react';
import { useStatistic } from '../hooks/use-statistic.hook';
import { getAuthorUrl } from '../utils/get-authour-url.util';
import { BotComment } from './BotComment/BotComment';
import { DebugInfo } from './DebugInfo/DebugInfo';

interface IProps {
  parentEl: HTMLElement;
  onReplyClick: (parent: HTMLElement) => void;
}
export const CommentContainer: React.FC<IProps> = ({ parentEl, onReplyClick }: IProps) => {
  const authorUrl = useMemo(() => getAuthorUrl(parentEl), [parentEl]);

  const { authorId, statistic } = useStatistic({ channelUrl: authorUrl });

  const isBot = useMemo(() => {
    if (statistic) {
      if ((statistic.frequency >= 2 || statistic.frequency_tick >= 5) && statistic.comment_count >= 50 && statistic.days_tick >= 10) {
        return true;
      }
    }
    return false;
  }, [statistic])

  if (!authorId) {
    return null;
  }
  return <>{statistic && isBot && <BotComment statistic={statistic} authorId={authorId} onReplyClick={onReplyClick} parentEl={parentEl} />}
    <DebugInfo statistic={statistic} authorId={authorId} onReplyClick={onReplyClick} parentEl={parentEl} />
  </>

}
