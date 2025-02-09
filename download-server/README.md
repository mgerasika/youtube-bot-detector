For deploy new image:
sh build.sh
sudo docker tag youtube-bot-downloader-1 mgerasika/youtube-bot-downloader:v15
sudo docker login
sudo docker push mgerasika/youtube-bot-downloader:v15

# on another pc
docker pull mgerasika/youtube-bot-downloader:v15
docker run --network=host --restart=always --env PORT=8091 -v /home:/home -d \
  -p $port:8091 \
  --env RABBIT_MQ=amqp://test:Zxc123=-@192.168.0.16:5672 \
  --env API_SERVER_URL=http://178.210.131.101:8077 \
  --env REDIS_URL=redis://192.168.0.16:6379 \
  --name youtube-bot-downloader-1 \
  mgerasika/youtube-bot-downloader:v15

# for windows 
docker pull mgerasika/youtube-bot-downloader:v15; docker run --network=host --restart=always -e PORT=8091 -v C:\home:/home -p 8091:8091 -e RABBIT_MQ=amqp://test:Zxc123=-@192.168.0.16:5672 -e API_SERVER_URL=http://178.210.131.101:8077 -e REDIS_URL=redis://192.168.0.16:6379 --name youtube-bot-downloader-1 mgerasika/youtube-bot-downloader:v15

docker pull mgerasika/youtube-bot-downloader:v15; docker run --network=host --restart=always -e PORT=8092 -v C:\home:/home -p 8092:8092 -e RABBIT_MQ=amqp://test:Zxc123=-@192.168.0.16:5672 -e API_SERVER_URL=http://178.210.131.101:8077 -e REDIS_URL=redis://192.168.0.16:6379 --name youtube-bot-downloader-2 mgerasika/youtube-bot-downloader:v15



