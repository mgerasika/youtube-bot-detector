import React from 'react';
import ReactDOM from 'react-dom';
import { getAuthorUrl } from '../../utils/get-authour-url.util';
import { CommentContainer } from '../CommentContainer';

interface IProps {
    videoId: string;
    comments: HTMLElement[];
    onReplyClick: (parent: HTMLElement) => void;
}
export const CommentsList: React.FC<IProps> = ({comments, onReplyClick}: IProps) => {
    return (
        <>
            {comments.map((parentEl,index) => {
                const authourUrl = getAuthorUrl(parentEl);
                parentEl.style.position = "relative";
                
                return <React.Fragment key={`${authourUrl}-${index}`}>
                    {ReactDOM.createPortal(
                         <CommentContainer parentEl={parentEl} onReplyClick={onReplyClick} /> ,
                        parentEl
                    )}
                </React.Fragment>
            })}
        </>
    );
}
