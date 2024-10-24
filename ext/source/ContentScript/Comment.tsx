import React, { useCallback, useEffect, useState } from 'react';
import { IStatisticInfo } from '../api.generated';

interface IProps {
  statistic?: IStatisticInfo
  parentEl: HTMLElement;
}
export const Comment: React.FC<IProps> = ({ statistic, parentEl }: IProps) => {

  const [flagsState, setFlagsState] = useState<IFlagsState>();

  const handleParentClick = useCallback(() =>{
    setFlagsState(getFlagsState(parentEl))
  },[])
  useEffect(() => {
    parentEl.addEventListener('click',handleParentClick);
    return () => parentEl.removeEventListener('click', handleParentClick);
  },[]);


  useEffect(() =>{
    setFlagsState(getFlagsState(parentEl))
  },[parentEl]);
  return <div className="botDiv">
    <div className='iconDiv'>{statistic?.comment_count || '-'}

      <pre>{JSON.stringify({...flagsState}, null, 2)}</pre>
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