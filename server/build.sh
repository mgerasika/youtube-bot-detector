#for local testing/or local docker container
image=youtube-bot-filter
container=youtube-bot-filter
port=8077

if [ "$(docker ps -aq -f name=$container)" ]; then
  docker stop $container
  docker rm $container
fi

if [ "$(docker images -q $image)" ]; then
  docker image rm $image
fi

cd ..
docker build -t $image -f server/Dockerfile . --build-arg PORT=$port
docker run --security-opt=no-new-privileges:false --network=host --restart=always --env PORT=8010 -v /home:/home -d -p $port:8010 --env-file=server/.env --name $container $image