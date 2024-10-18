INSERT INTO public.api_key(
	email, youtube_key)
	VALUES 
	('mgerasika@gmail.com', 'AIzaSyCXuMpc8Ci70dELX9m4tCDHbveG1XjIUbg'),
	('alta.romeo@gmail.com', 'AIzaSyABSxMZ3X2-85t9I-DFfiPLyNa-TRaE46s'),
	('mgerasika2@gmail.com', 'AIzaSyClZRlrQY2JcU2VEMNVy7fa1GZB9raDk2g'),
	('oddbox.cypress@gmail.com', 'AIzaSyB2_b83SZDhN4WKMX5V-drV3DoQ8F5xzN0'),
	('mherasika@gmail.com', 'AIzaSyBQEx9McZ82-bshI2jTw2IuU47VJH0gszs');

	-- SELECT COUNT(*) AS comment_count, comment.author_id, channel.custom_url
-- FROM comment
-- left outer join channel on channel.id = comment.author_id
-- WHERE comment.video_id = 'nN5awumyZMw'
-- GROUP BY comment.author_id, channel.id;


SELECT COUNT(*) AS comment_count, comment.author_id, channel.custom_url
FROM comment
inner join video on video.id = comment.video_id
left outer join channel on channel.id = comment.author_id
WHERE video.channel_id = 'UCXoJ8kY9zpLBEz-8saaT3ew'
GROUP BY comment.author_id, channel.id order by comment_count desc;

1 027 927

1 028 768
