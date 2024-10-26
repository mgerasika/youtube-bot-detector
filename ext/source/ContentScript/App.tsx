import React, { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getChannelId } from './utils/get-channel-id.util';
import { getChannelUrl } from './utils/get-channel-url.util';
import { getVideoId } from './utils/get-video-id.util';
import ErrorBoundary from './ErrorBoundary';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CommentsList } from './CommentList';
import { useGetComments } from './hooks/use-get-comments.hook';

const App: React.FC = () => {
    const videoId = useMemo(getVideoId, []);
    const channelUrl = useMemo( getChannelUrl, []);
    const channelId = useMemo( getChannelId, []);
    const {comments, rescan} = useGetComments();

    const handleReployClick = useCallback((parentEl) => {
        rescan(parentEl)
    },[rescan])

    return (
        <CommentsList onReplyClick={handleReployClick} comments={comments} channelId={channelId || ''} videoId={videoId || ''} channelUrl={channelUrl || ''}/>
    );
}

const queryClient = new QueryClient();
export function renderReactApp() {
    const appDiv = document.body;
    const divForReact = document.createElement('div');
    appDiv?.appendChild(divForReact)
    // Render the main App component inside the root div
    ReactDOM.render(
        <React.StrictMode>
            <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </ErrorBoundary>
        
        </React.StrictMode >,
        divForReact
    );
}