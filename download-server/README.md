For deploy new image:
sh build.sh
sudo docker tag youtube-bot-filter-downloader mgerasika/youtube-bot-filter-downloader:v3
sudo docker login
sudo docker push mgerasika/youtube-bot-filter-downloader:v3

# on another pc
docker pull mgerasika/youtube-bot-filter-downloader:v3
docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d \
  -p $port:8008 \
  --env RABBIT_MQ=amqp://test:test@178.210.131.101:5672 \
  --env API_SERVER_URL=http://178.210.131.101:8007/ \
  --name youtube-bot-filter-downloader \
  mgerasika/youtube-bot-filter-downloader:v1



