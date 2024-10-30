import React from 'react';
import ReactDOM from 'react-dom';
import { useGetFullScanByVideo } from '../../api/use-get-full-scan-by-video.hook';
import { useGetStatisticByVideo } from '../../api/use-get-statistic-by-channel-and-video.hook';
import { getAuthorUrl } from '../../utils/get-authour-url.util';
import {Comment} from '../comment/Comment';

interface IProps {
    videoId: string;
    channelUrl: string;
    channelId: string;
    comments: HTMLElement[];
    onReplyClick: (parent: HTMLElement) => void;
}
export const CommentsList: React.FC<IProps> = ({comments, onReplyClick, videoId, channelId}: IProps) => {
    useGetFullScanByVideo(videoId, channelId);

    const {data: statByVideo} = useGetStatisticByVideo(videoId);

    return (
        <>
            {comments.map((parentEl,index) => {
                const authourUrl = getAuthorUrl(parentEl);
                const statisticItem = statByVideo?.find(f => f.channel_url === authourUrl);
                parentEl.style.position = "relative";
                
                return <React.Fragment key={`${authourUrl}-${index}`}>
                    {ReactDOM.createPortal(
                        statisticItem ? <Comment statistic={statisticItem} parentEl={parentEl} onReplyClick={onReplyClick} /> : null,
                        parentEl
                    )}
                </React.Fragment>
            })}
        </>
    );
}
