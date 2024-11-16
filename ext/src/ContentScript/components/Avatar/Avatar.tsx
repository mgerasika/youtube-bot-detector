

import React, { LegacyRef, useEffect, useRef } from 'react';
import { usePolling } from '../../hooks/use-pooling.hook';
import styles from './Avatar.module.css';

interface IProps {
  parentEl: HTMLElement;
  authorId: string;
}
export const Avatar: React.FC<IProps> = ({ parentEl }: IProps) => {
  const imageRef = useRef<HTMLImageElement>();

  const avatarEl = usePolling(() => parentEl.querySelector('yt-img-shadow img') as HTMLElement, [parentEl])

  useEffect(() => {
    if (avatarEl && imageRef.current) {
      imageRef.current.style.width = avatarEl.offsetWidth + 'px';
      imageRef.current.style.height = avatarEl.offsetHeight + 'px';
    }
  }, [avatarEl])

{/* <pre style={{ display: 'none' }}>{JSON.stringify({ authorId, authorUrl, ...statistic }, null, 2)}</pre> */}
  const imageUrl = chrome.runtime.getURL("assets/icons/bot-icon-big-animate.svg")
  return  <img ref={imageRef as LegacyRef<HTMLImageElement>} src={imageUrl} className={styles.icon} /> ;

}
