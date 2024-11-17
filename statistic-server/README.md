1 gcloud init

https://cloud.google.com/sdk/docs/install-sdk#deb
2 curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
3 echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
4 sudo apt-get update && sudo apt-get install google-cloud-cli
5 gsutil cors set cors.json gs://ybot-detector.firebasestorage.app




For deploy new image:
sh build.sh
sudo docker tag youtube-bot-statistic mgerasika/youtube-bot-statistic:v10
sudo docker login
sudo docker push mgerasika/youtube-bot-statistic:v10

# on another pc
docker pull mgerasika/youtube-bot-statistic:v10
docker run --network=host --restart=always --env PORT=8099 -v /home:/home -d \
  -p $port:8044 \
  --env RABBIT_MQ=amqp://test:test@178.210.131.101:5672 \
  --env API_SERVER_URL=http://178.210.131.101:8007 \
  --env REDIS_URL=redis://178.210.131.101:6379 \
  --name youtube-bot-statistic \
  mgerasika/youtube-bot-statistic:v10