SELECT 
    distinct(comment.author_id) as channel_id, 
    channel_comment.author_url AS channel_url,
    channel_comment.published_at as channel_published_at,

  (SELECT COUNT(*)  
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
--     LEFT JOIN 
--       channel AS ch1 ON ch1.id = c1.author_id
--     LEFT JOIN 
--       channel AS chm ON chm.id = v1.channel_id
    WHERE 
      c1.author_id = comment.author_id and v1.channel_id = video.channel_id
  ) as comments_on_current_channel,



  (SELECT MIN(c1.published_at_time) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
--     LEFT JOIN 
--       channel AS ch1 ON ch1.id = c1.author_id
--     LEFT JOIN 
--       channel AS chm ON chm.id = v1.channel_id
    WHERE 
      c1.author_id = comment.author_id 
) as min_comment_publish_date,
  

  (SELECT MAX(c1.published_at_time) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
--     LEFT JOIN 
--       channel AS ch1 ON ch1.id = c1.author_id
--     LEFT JOIN 
--       channel AS chm ON chm.id = v1.channel_id
    WHERE 
      c1.author_id = comment.author_id 
) as max_comment_publish_date,

  (SELECT COUNT(*) 
    FROM 
      comment as c1
    INNER JOIN 
      video as v1 ON v1.id = c1.video_id
--     LEFT JOIN 
--       channel AS ch1 ON ch1.id = c1.author_id
--     LEFT JOIN 
--       channel AS chm ON chm.id = v1.channel_id
    WHERE 
      c1.author_id = comment.author_id 
) as comments_on_all_channels
  
FROM 
    comment 
INNER JOIN 
    video ON video.id = comment.video_id 
LEFT JOIN 
    channel AS channel_comment ON channel_comment.id = comment.author_id 
WHERE 
    comment.video_id = 'yjCSqz7AtJM'