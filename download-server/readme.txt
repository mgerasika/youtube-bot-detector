# nodejs-server

works on 16.17.0 (16.14.0 have problems https://www.google.com/search?q=checkFunctionsSDKVersion+was+unable+to+fetch+information+from+NPM+Error%3A+spawnSync+npm+ETIMEDOUT&oq=checkFunctionsSDKVersion+was+unable+to+fetch+information+from+NPM+Error%3A+spawnSync+npm+ETIMEDOUT&aqs=chrome..69i57j69i59.1180j0j7&sourceid=chrome&ie=UTF-8)

For deploy new image:
sh build.sh
sudo docker tag youtube-bot-filter-downloader mgerasika/youtube-bot-filter-downloader:v1
sudo docker login
sudo docker push mgerasika/youtube-bot-filter-downloader:v1

docker pull mgerasika/youtube-bot-filter-downloader:v1
docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d -p $port:8008
 --env RABBIT_MQ=http://178.210.131.101:8007/
 --env API_SERVER_URL=http://178.210.131.101:8007/
 --name youtube-bot-filter-downloader mgerasika/youtube-bot-filter-downloader:v1

.env file
RABBIT_MQ=amqp://test:test@178.210.131.101:5672
API_SERVER_URL=http://178.210.131.101:8007/

# mgerasika@gmail.com
# YOUTUBE_KEY=AIzaSyCXuMpc8Ci70dELX9m4tCDHbveG1XjIUbg

# alta.romeo@gmail.com
# YOUTUBE_KEY=AIzaSyABSxMZ3X2-85t9I-DFfiPLyNa-TRaE46s

# mgerasika2@gmail.com
# YOUTUBE_KEY=AIzaSyClZRlrQY2JcU2VEMNVy7fa1GZB9raDk2g

#oddbox.cypress@gmail.com
# YOUTUBE_KEY=AIzaSyB2_b83SZDhN4WKMX5V-drV3DoQ8F5xzN0

#mherasika@gmail.com
# YOUTUBE_KEY=AIzaSyBQEx9McZ82-bshI2jTw2IuU47VJH0gszs

# horodechnajulia@gmail.com
AIzaSyBQn6hna3tyPc6SvG2WQ_KAw6LvGpDFMms

#mgerasika3@gmail.com
'AIzaSyCszefmn92_1or2Wat7DNupqLuC6ZaJJXo');

gerasikaivanna@gmail.com
AIzaSyBZ-d-VRkWQc6uUi0u3mXwS13y9KMswIOU
