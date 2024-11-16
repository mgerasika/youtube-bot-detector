import React, { useCallback } from 'react';
import { useGetComments } from '../hooks/use-get-comments.hook';
import { CommentsList } from '../components/CommentList/CommentList';
import { useFullScanByVideo } from '../api/use-full-scan-by-video.hook';

interface IProps {
    videoId:string;
}
export const VideoPage: React.FC<IProps> = ({videoId}) => {
    useFullScanByVideo(videoId);
    const {comments, rescan} = useGetComments();

    const handleReployClick = useCallback((parentEl) => {
        rescan(parentEl)
    },[rescan])

    return (
        <CommentsList onReplyClick={handleReployClick} comments={comments} videoId={videoId}/>
    );
}

