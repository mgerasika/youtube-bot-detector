import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { getCommentElements } from './utils/get-comment-elements.util';
import axios from 'axios';
import { ENV } from '../env';
import { getChannelId } from './utils/get-channel-id.util';
import { getChannelUrl } from './utils/get-channel-url.util';
import { getVideoId } from './utils/get-video-id.util';
import { IStatisticInfo } from '../api.generated';
import { getAuthorUrl } from './utils/get-authour-url.util';
import { Comment } from './Comment';
import ErrorBoundary from './ErrorBoundary';

const App: React.FC = () => {
    console.log('hello from app 7')

    const comments = useMemo(() => getCommentElements(), []);
    const [byVideo, setByVideo] = useState<IStatisticInfo[]>([]);
    useEffect(() => {

        if (comments.length) {

            const videoId = getVideoId();
            console.log('videoId', videoId)

            const channelUrl = getChannelUrl();
            console.log('channelUrl', channelUrl)

            const channelId = getChannelId();
            console.log('channelId', channelId)

            axios.get(`${ENV.next_server_url}api/scan/by-video?video_id=${videoId}`).then(scan => {
                console.log('scan by video = ', scan.data)

            })

            axios.get(`${ENV.next_server_url}api/statistic/by-video?video_id=${videoId}`).then(statistic => {
                console.log('statistic by video = ', statistic.data)
                setByVideo(statistic.data);

            })

            axios.get(`${ENV.next_server_url}api/statistic/by-channel?channel_id=${channelId}`).then(statistic => {
                console.log('statistic by channel = ', statistic.data)

            })


        }
    }, [comments])

    return (
        <>
            {comments.map((parentEl, index) => {
                const authourUrl = getAuthorUrl(parentEl);
                const statByVideo = byVideo.find(f => f.author_url === authourUrl);
                parentEl.style.position = "relative";
                return <React.Fragment key={parentEl.id || index}>
                    {ReactDOM.createPortal(
                        <Comment statistic={statByVideo} parentEl={parentEl} />,
                        parentEl
                    )}
                </React.Fragment>
            })}
        </>
    );
}


export function renderReactApp() {
    const appDiv = document.body;
    const divForReact = document.createElement('div');
    appDiv?.appendChild(divForReact)
    // Render the main App component inside the root div
    ReactDOM.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>,
        divForReact
    );
}