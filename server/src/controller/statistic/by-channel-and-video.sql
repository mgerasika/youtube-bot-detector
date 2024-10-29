SELECT 
    (cc.comment_count::float / NULLIF(dd.days_difference, 0)) AS comment_frequency,
    (cc.comment_count::float / NULLIF(cc.time_since_channel_published, 0)) AS comment_frequency_since_channel,
    dd.days_difference,
    cc.*
FROM 
    (
        SELECT 
            COUNT(*) AS comment_count, 
            comment.author_id, 
            EXTRACT(EPOCH FROM (NOW() - channel.published_at)) / 86400 AS time_since_channel_published,
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
    ) AS cc
CROSS JOIN 
    (
        SELECT 
            (MAX(published_at) - MIN(published_at)) AS days_difference
        FROM 
            video
        WHERE 
            channel_id = 'UCXoJ8kY9zpLBEz-8saaT3ew'
    ) AS dd
WHERE 
    cc.author_id IN (SELECT author_id FROM comment WHERE video_id = 'EZo7xM2I8rY')
ORDER BY 
    comment_frequency_since_channel DESC;
