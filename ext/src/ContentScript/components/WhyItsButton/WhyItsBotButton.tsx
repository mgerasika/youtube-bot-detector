

import React from 'react';
import styles from './WhyItsBotButton.module.css';

interface IProps {
  parentEl: HTMLElement;
}
export const WhyItsBotButton: React.FC<IProps> = ({ parentEl: _}: IProps) => {
  
  const imageUrl = chrome.runtime.getURL("assets/icons/bot-icon.svg")

  return <>
    <div className={styles.root} >
      <img src={imageUrl} className={styles.image} />
      <div className={styles.text}> Why it&apos;s bot</div>
    </div>
    
  </>
}
