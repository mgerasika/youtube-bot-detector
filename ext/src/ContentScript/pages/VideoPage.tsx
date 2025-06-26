import React, { useCallback } from 'react';
import { useGetComments } from '../hooks/use-get-comments.hook';
import { CommentsList } from '../components/CommentList/CommentList';
import { useInjectScript } from '../hooks/use-inject-script.hook';
import { ChannelInfoContainer } from '../components/ChannelInfoContainer/ChannelInfoContainer';

interface IProps {
    videoId:string;
}
export const VideoPage: React.FC<IProps> = ({videoId}) => {
    useInjectScript();
    
    const {comments, rescan} = useGetComments();

    const handleReployClick = useCallback((parentEl) => {
        rescan(parentEl)
    },[rescan])

    return (
        <>
            <ChannelInfoContainer />
            <CommentsList onReplyClick={handleReployClick} comments={comments} videoId={videoId}/>
            
        </>
    );
}

