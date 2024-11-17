#for local testing/or local docker container
image=youtube-bot-downloader
container=youtube-bot-downloader
port=8099

if [ "$(docker ps -aq -f name=$container)" ]; then
  docker stop $container
  docker rm $container
fi

if [ "$(docker images -q $image)" ]; then
  docker image rm $image
fi

cd ..
docker build -t $image -f download-server/Dockerfile . --build-arg PORT=$port
docker run --security-opt=no-new-privileges:false --network=host --restart=always --env PORT=$port -v /home:/home -d -p $port:$port --env-file=download-server/.env --name $container $image