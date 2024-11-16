import React, { ReactNode, forwardRef } from 'react';
import { usePolling } from '../../hooks/use-pooling.hook';
import ReactDOM from 'react-dom';
import styles from './ReplyButtonContainer.module.css';

interface IProps {
  children: ReactNode;
  parentEl: HTMLElement;
}

export const ReplyButtonContainer = forwardRef<HTMLDivElement, IProps>(
  ({ children, parentEl }: IProps, ref) => {
    const replyEl = usePolling(
      () => parentEl.querySelector('#reply-button-end')?.parentElement as HTMLElement,
      [parentEl]
    );

    return replyEl ? (
      <>
        {ReactDOM.createPortal(
          <div className={styles.root} ref={ref}>
            {children}
          </div>,
          replyEl
        )}
      </>
    ) : null;
  }
);

// Set displayName for better debugging
ReplyButtonContainer.displayName = 'ReplyButtonContainer';
