import React, { useCallback, useEffect } from 'react';
import { usePolling } from '../../hooks/use-pooling.hook';
import ReactDOM from 'react-dom';
import styles from './ChannelInfoContainer.module.css';
import { useGetFirebaseChannelsList } from '../../api/use-get-firebase-channels-list.hook';
import { getChannelId } from '../../utils/get-channel-id.util';
import { useAddToScanList } from '../../api/use-add-to-scan-list.hook';

export const ChannelInfoContainer = () => {
  const {data: channelList, isFetched} = useGetFirebaseChannelsList();
  const channelId = getChannelId();
  const {mutateAsync:addToScanListMutation} = useAddToScanList(channelId || '');
  
  const [status, setStatus] = React.useState<string>('');
    const channelNameCntEl = usePolling(
      () => document.querySelector('#upload-info') as HTMLElement,
      []
    );

    useEffect(() => {
      if (isFetched && channelList && channelId) {
        const hasChannel = channelList.channel_ids.includes(channelId);
        setStatus(hasChannel ? 'Already scannable' : 'Click to add scan queue');
      }
    }, [isFetched, channelList, channelId]);

    const handleIsScannedClick = useCallback(() => {
      addToScanListMutation().then(() => {
        setStatus('Added to queue, but not scanned yet');
      });
    }, []);

    return channelNameCntEl && isFetched ? (
      <>
        {ReactDOM.createPortal(
          <div className={styles.root} onClick={handleIsScannedClick}>
            {status}
          </div>,
          channelNameCntEl
        )}
      </>
    ) : null;
  };

// Set displayName for better debugging
ChannelInfoContainer.displayName = 'ReplyButtonContainer';
