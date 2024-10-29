SELECT 
        COUNT(*) AS comment_count, 
        comment.author_id, 
        channel.*
    FROM 
        comment
    INNER JOIN 
        video ON video.id = comment.video_id
    LEFT OUTER JOIN 
        channel ON channel.id = comment.author_id
    WHERE 
        video.channel_id = 'UCXoJ8kY9zpLBEz-8saaT3ew'  
    GROUP BY 
        comment.author_id, 
        channel.id
ORDER BY 
    comment_count DESC;
