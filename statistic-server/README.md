1 gcloud init

https://cloud.google.com/sdk/docs/install-sdk#deb
2 curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
3 echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
4 sudo apt-get update && sudo apt-get install google-cloud-cli
5 gsutil cors set cors.json gs://ybot-detector.firebasestorage.app




For deploy new image:
sh build.sh
sudo docker tag youtube-bot-statistic mgerasika/youtube-bot-statistic:v11
sudo docker login
sudo docker push mgerasika/youtube-bot-statistic:v11

# on another pc
docker pull mgerasika/youtube-bot-statistic:v11
docker run --network=host --restart=always --env PORT=8099 -v /home:/home -d \
  -p $port:8044 \
  --env RABBIT_MQ=amqp://test:Zxc123=-@192.168.0.16:5672 \
  --env API_SERVER_URL=http://178.210.131.101:8077 \
  --env REDIS_URL=redis://192.168.0.16:6379 \
  --name youtube-bot-statistic \
  mgerasika/youtube-bot-statistic:v11


# on windows
  docker pull mgerasika/youtube-bot-statistic:v11; docker run --network=host --restart=always -e PORT=8031 -v C:\home:/home -p 8031:8031 -e RABBIT_MQ=amqp://test:Zxc123=-@192.168.0.16:5672 -e API_SERVER_URL=http://178.210.131.101:8077 -e REDIS_URL=redis://192.168.0.16:6379 --name youtube-bot-statistic-1 mgerasika/youtube-bot-statistic:v11

  docker pull mgerasika/youtube-bot-statistic:v11; docker run --network=host --restart=always -e PORT=8032 -v C:\home:/home -p 8032:8032 -e RABBIT_MQ=amqp://test:Zxc123=-@192.168.0.16:5672 -e API_SERVER_URL=http://178.210.131.101:8077 -e REDIS_URL=redis://192.168.0.16:6379 --name youtube-bot-statistic-2 mgerasika/youtube-bot-statistic:v11
