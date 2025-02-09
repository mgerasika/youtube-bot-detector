#for local testing/or local docker container
image=youtube-bot-server
container=youtube-bot-server
port=8077
ports=8078

if [ "$(docker ps -aq -f name=$container)" ]; then
  docker stop $container
  docker rm $container
fi

if [ "$(docker images -q $image)" ]; then
  docker image rm $image
fi

cd ..
docker build -t $image -f server/Dockerfile . --build-arg PORT=$port
docker run --security-opt=no-new-privileges:false --restart=always --env PORT=$port --env  PORTS=$ports -v /home:/home -d -p $port:$port --env-file=server/.env --name $container $image