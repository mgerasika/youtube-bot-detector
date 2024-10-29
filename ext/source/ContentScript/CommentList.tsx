import React from 'react';
import ReactDOM from 'react-dom';
import { getAuthorUrl } from './utils/get-authour-url.util';
import { Comment } from './Comment';
import { useGetFullScanByVideo } from './api/use-get-full-scan-by-video.hook';
import { useGetStatisticByChannelAndVideo } from './api/use-get-statistic-by-channel-and-video.hook';

interface IProps {
    videoId: string;
    channelUrl: string;
    channelId: string;
    comments: HTMLElement[];
    onReplyClick: (parent: HTMLElement) => void;
}
export const CommentsList: React.FC<IProps> = ({comments, onReplyClick, videoId, channelId}: IProps) => {
    useGetFullScanByVideo(videoId, channelId);

    const {data: byChannelAndVideo} = useGetStatisticByChannelAndVideo(channelId, videoId);

    return (
        <>
            {comments.map((parentEl,index) => {
                const authourUrl = getAuthorUrl(parentEl);
                const statByChannel = byChannelAndVideo?.find(f => f.channel_url === authourUrl);
                parentEl.style.position = "relative";
                
                return <React.Fragment key={`${authourUrl}-${index}`}>
                    {ReactDOM.createPortal(
                        statByChannel ? <Comment byChannelAndVideo={statByChannel} parentEl={parentEl} onReplyClick={onReplyClick} /> : null,
                        parentEl
                    )}
                </React.Fragment>
            })}
        </>
    );
}
