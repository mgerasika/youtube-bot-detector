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
