import React from 'react';
import ReactDOM from 'react-dom';
import { getAuthorUrl } from './utils/get-authour-url.util';
import { Comment } from './Comment';
import { useGetScanByVideo } from './api/use-get-scan-by-video.hook';
import { useGetStatisticByVideo } from './api/use-get-statistic-by-video.hook';
import { useGetStatisticByChannel } from './api/use-get-statistic-by-channel.hook';

interface IProps {
    videoId: string;
    channelUrl: string;
    channelId: string;
    comments: HTMLElement[];
    onReplyClick: (parent: HTMLElement) => void;
}
export const CommentsList: React.FC<IProps> = ({comments, onReplyClick, videoId, channelId}: IProps) => {
    useGetScanByVideo(videoId);

    const {data: byVideo} = useGetStatisticByVideo(videoId)
    const {data: byChannel} = useGetStatisticByChannel(channelId);

    return (
        <>
            {comments.map((parentEl, index) => {
                const authourUrl = getAuthorUrl(parentEl);
                const statByVideo = byVideo?.find(f => f.author_url === authourUrl);
                const statByChannel = byChannel?.find(f => f.author_url === authourUrl);
                parentEl.style.position = "relative";
                return <React.Fragment key={index}>
                    {ReactDOM.createPortal(
                        <Comment byVideo={statByVideo} byChannel={statByChannel} parentEl={parentEl} onReplyClick={onReplyClick} />,
                        parentEl
                    )}
                </React.Fragment>
            })}
        </>
    );
}
