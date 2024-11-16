#for local testing/or local docker container
image=youtube-bot-filter-downloader
container=youtube-bot-filter-downloader
port=8010
ports=8011

if [ "$(docker ps -aq -f name=$container)" ]; then
  docker stop $container
  docker rm $container
fi

if [ "$(docker images -q $image)" ]; then
  docker image rm $image
fi

cd ..
docker build -t $image -f download-server/Dockerfile . --build-arg PORT=$port
docker run --security-opt=no-new-privileges:false --network=host --restart=always --env PORT=$port --env PORTS=$ports -v /home:/home -d -p $port:$port --env-file=download-server/.env --name $container $image