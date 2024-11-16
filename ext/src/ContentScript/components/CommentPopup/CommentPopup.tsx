import React, { LegacyRef, useRef } from 'react';
import { IFirebaseBody } from '../../api/use-get-firebase-statistic.hook';
import styles from './CommentPopup.module.css';

interface IProps {
  statistic?: IFirebaseBody;
  isOpen: boolean;
  parentEl: HTMLElement;
  authorUrl: string;
  authorId: string;
}

export const CommentPopup: React.FC<IProps> = ({ statistic, isOpen }) => {
  const popupRef = useRef<HTMLDivElement>();

  return (
    <div className={styles.root} ref={popupRef as LegacyRef<HTMLDivElement>} style={{ display: isOpen ? 'block' : 'none' }}>
    <div className={styles.content}>
      <div>
        Цей користувач залишив <span className={styles.redText}><strong>{statistic?.comment_count} </strong>повідомлень</span> за <span className={styles.redText}><strong>{statistic?.published_at_diff}</strong> днів</span>.
        В середньому, він публікує <span className={styles.redText}><strong>{statistic?.frequency}</strong> повідомлень на день</span>.
      </div>
  
      <div>
        Також користувач активно публікує протягом <span className={styles.redText}><strong>{statistic?.days_tick} </strong>днів</span>.<br/>
        І кожного дня він залишає не менше <span className={styles.redText}><strong>{statistic?.frequency_tick}</strong> повідомлень</span>, що є значним показником
        і може свідчити про можливу автоматизовану активність.
      </div>
  
      <div>
        Рекомендуємо бути обережними з такими повідомленнями, оскільки вони часто можуть бути залишені користувачами,
        які отримують винагороду за свою активність (так звані &quot;боти&quot;).
      </div>
    </div>
  </div>
  
  );
};
