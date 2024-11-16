"use client"
import React, { useEffect, useState } from 'react';

export const YouTubeEmbed = ({ videoId }: {videoId: string}) => {
    const [iframeWidth, setIframeWidth] = useState(660); // Default width for larger screens

    useEffect(() => {
      // Check for window availability to ensure it runs only in the browser
      if (typeof window !== 'undefined') {
        setIframeWidth(window.innerWidth <= 660 ? 260 : 660);
      }
    }, []); // Empty dependency array ensures this runs once on mount
  return (
    <div style={{ width: '100%', maxWidth: `${iframeWidth}px`, margin: '0 auto' }}>
   
      <iframe
         width="100%"
        height="415"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

