import React, {  } from 'react';
import { IStatistic } from '../api.generated';

interface IProps {
  byChannelAndVideo: IStatistic
  frequency_by_channel:number | undefined;
  frequency_by_all: number | undefined;
}
export const CommentPopup: React.FC<IProps> = (props: IProps) => {
  return <div className="botDivPopup" >
    <pre>
    {JSON.stringify(props,null,2)}
   </pre>
  </div>;

}
