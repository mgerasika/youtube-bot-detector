import React, { useCallback } from 'react';
import { CommentsList } from './CommentList';
import { useGetComments } from './hooks/use-get-comments.hook';

interface IProps {
    videoId:string;
    channelId:string;
    channelUrl:string;
}
export const VideoPage: React.FC<IProps> = ({videoId,channelId, channelUrl}) => {
   
    const {comments, rescan} = useGetComments();

    const handleReployClick = useCallback((parentEl) => {
        rescan(parentEl)
    },[rescan])

    return (
        <CommentsList onReplyClick={handleReployClick} comments={comments} channelId={channelId} videoId={videoId} channelUrl={channelUrl}/>
    );
}

