import React, { useEffect, useRef } from 'react';
import { IStatisticByVideo } from '../../../api.generated';
import { usePolling } from '../../hooks/use-pooling.hook';

interface IProps {
  statistic: IStatisticByVideo;
  isOpen: boolean;
  parentEl: HTMLElement;
}

export const CommentPopup: React.FC<IProps> = ({ statistic, isOpen, parentEl }) => {
  const maxCommentsCount = Math.max(statistic.comments_on_current_channel, statistic.comments_on_all_channels);
  const duration = Math.max(statistic.comments_days_diff_currrent, statistic.comments_days_diff_all);
  const popupRef = useRef<HTMLDivElement>();
  const perDayByRange = Math.max(
    statistic.comments_per_day_by_range_current,
    statistic.comments_per_day_by_range_all
  );

  const avatarEl = usePolling(() => parentEl.querySelector('yt-img-shadow img') as HTMLElement, [parentEl])
  useEffect(() => {
    if (avatarEl && popupRef.current) {
      popupRef.current.style.top = (avatarEl.offsetHeight + 1) + 'px';
    }
  }, [popupRef.current, avatarEl])

  return  (
    <div className="ybf-popup" ref={popupRef as any} style={{display: isOpen ? 'block' :'none'}}>
      Цей користувач залишив <strong>{maxCommentsCount} </strong>коментарів за <strong>{duration}</strong> днів. 
      В середньому, він залишає <strong>{perDayByRange}</strong> коментарів на день, що є дуже високим показником 
      і може вказувати на те, що ці коментарі можуть вводити інших користувачів в оману. 
      Радимо не звертати увагу на такі коментарі, оскільки їх часто залишають люди, 
      які отримують винагороду за коментарі (так звані "боти").
      <pre style={{display:'none'}}>{JSON.stringify(statistic, null, 2)}</pre>
    </div>
  ) ;
};
