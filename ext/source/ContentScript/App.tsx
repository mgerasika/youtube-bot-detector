import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from './ErrorBoundary';
import { QueryClient, QueryClientProvider } from 'react-query';
import { VideoPage } from './VideoPage';
import { BrowserRouter as Router} from 'react-router-dom';
import { useVideoInfo } from './hooks/use-video-info.hook';


const App: React.FC = () => {
    const info = useVideoInfo()

    if (info?.videoId && info?.channelId && info?.channelUrl) {
        return (
            <VideoPage videoId={info.videoId} channelId={info.channelId} />
        );
    }
    return <></>
}

const queryClient = new QueryClient();
export function renderReactApp() {
    const appDiv = document.body;
    const divForReact = document.createElement('div');
    appDiv?.appendChild(divForReact)
    // Render the main App component inside the root div
    ReactDOM.render(
        <React.StrictMode>
            
            <ErrorBoundary>  <Router>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
                </Router>
            </ErrorBoundary>

        </React.StrictMode >,
        divForReact
    );
}