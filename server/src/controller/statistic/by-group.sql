SELECT 
    COUNT(*) AS comment_count, 
    SUM(COUNT(*)) OVER() AS total_comment_count,
    video.channel_id AS channel_id,
    channel_main.author_url AS channel_url,
	channel_main.published_at as published_at,
    MIN(video.published_at) AS first_video_published_at,
    MAX(video.published_at) AS last_video_published_at
FROM 
    comment 
INNER JOIN 
    video ON video.id = comment.video_id
LEFT JOIN 
    channel AS channel_comment ON channel_comment.id = comment.author_id
LEFT JOIN 
    channel AS channel_main ON channel_main.id = video.channel_id
WHERE 
    comment.author_id = 'UC0oVkfBIDwgS7FPAmjmB1mw'
GROUP BY 
    video.channel_id, 
	channel_comment.published_at,
	channel_main.published_at,
    channel_main.author_url;