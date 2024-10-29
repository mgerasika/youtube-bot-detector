import React, {  } from 'react';
import { IStatistic } from '../api.generated';

interface IProps {
  byChannelAndVideo: IStatistic
  commentMinMaxDiff: number | undefined;
  channelAgeFromToday: number | undefined;
  rate:number | undefined;
  rate_from_start: number | undefined;
}
export const CommentPopup: React.FC<IProps> = (props: IProps) => {
  return <div className="botDivPopup" >
    <pre>
    {JSON.stringify(props,null,2)}
   </pre>
  </div>;

}
