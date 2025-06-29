#!/bin/bash

run_container() {
  image=$1
  container=$2
  port=$3

  if [ "$(docker ps -aq -f name=$container)" ]; then
    docker stop $container
    docker rm $container
  fi

  if [ "$(docker images -q $image)" ]; then
    docker image rm $image
  fi

  cd ..
  docker build -t $image -f download-server/Dockerfile . --build-arg PORT=$port
  cd - > /dev/null

  docker run --security-opt=no-new-privileges:false \
    --restart=always \
    --env PORT=$port \
    -v /home:/home \
    -d \
    -p $port:$port \
    --env-file=download-server/.env \
    --name $container \
    $image
}

# Run 3 containers with different names and ports
run_container youtube-bot-downloader-1 youtube-bot-downloader-1 8091
run_container youtube-bot-downloader-2 youtube-bot-downloader-2 8092
run_container youtube-bot-downloader-3 youtube-bot-downloader-3 8093
