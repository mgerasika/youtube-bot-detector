#for local testing/or local docker container
image=youtube-bot-filter-statistic
container=youtube-bot-filter-statistic
port=8004
ports=8005

if [ "$(docker ps -aq -f name=$container)" ]; then
  docker stop $container
  docker rm $container
fi

if [ "$(docker images -q $image)" ]; then
  docker image rm $image
fi

cd ..
docker build -t $image -f statistic-server/Dockerfile . --build-arg PORT=$port
docker run --security-opt=no-new-privileges:false --network=host --restart=always --env PORT=$port --env PORTS=$ports -v /home:/home -d -p $port:$port --env-file=statistic-server/.env --name $container $image