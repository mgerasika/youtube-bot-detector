INSERT INTO statistic (
    channel_id,
    channel_url,
    published_at,
    comment_count,
    min_published_at,
    max_published_at,
    days_tick,
    published_at_diff,
    frequency,
    frequency_tick
)
SELECT 
    channel_id,
    channel_url,
    published_at,
    comment_count,
    min_published_at,
    max_published_at,
    days_tick,
    published_at_diff,
    ROUND(comment_count::numeric / GREATEST(published_at_diff, 1), 2)::float AS frequency,
    ROUND(comment_count::numeric / GREATEST(days_tick, 1), 2)::float AS frequency_tick
FROM (
    SELECT 
        *, 
        GREATEST((max_published_at::date - min_published_at::date)::int, 1) AS published_at_diff
    FROM (
        SELECT 
            t0.published_at AS published_at,
            t0.id AS channel_id,
            t0.author_url AS channel_url,
            
            -- Total comments by this author
            (
                SELECT COUNT(c1.id)  
                FROM comment AS c1
                INNER JOIN video AS v1 ON v1.id = c1.video_id         
                WHERE c1.author_id = t0.id AND v1.channel_id != c1.author_id
            )::int AS comment_count,
            
            -- Earliest comment published date
            (
                SELECT MIN(c1.published_at)  
                FROM comment AS c1
                INNER JOIN video AS v1 ON v1.id = c1.video_id
                WHERE c1.author_id = t0.id AND v1.channel_id != c1.author_id
            ) AS min_published_at,
            
            -- Latest comment published date
            (
                SELECT MAX(c1.published_at)  
                FROM comment AS c1
                INNER JOIN video AS v1 ON v1.id = c1.video_id
                WHERE c1.author_id = t0.id AND v1.channel_id != c1.author_id
            ) AS max_published_at,
        
            -- Count of distinct days on which comments were published
            (
                SELECT COUNT(DISTINCT c1.published_at)  
                FROM comment AS c1
                INNER JOIN video AS v1 ON v1.id = c1.video_id         
                WHERE c1.author_id = t0.id AND v1.channel_id != c1.author_id
            )::int AS days_tick
        FROM (
            SELECT c.*
            FROM channel c
            LEFT JOIN statistic s ON c.id = s.channel_id
            WHERE s.channel_id IS NULL
        ) AS t0
        GROUP BY t0.id, t0.published_at, t0.author_url
    ) AS t1
) AS t2
ORDER BY frequency DESC;
