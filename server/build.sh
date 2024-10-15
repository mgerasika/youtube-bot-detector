#for local testing/or local docker container
image=youtube-bot-filter-server
container=youtube-bot-filter-server
port=8008

docker stop $container
docker rm $container
docker image rm $image
docker build -t $image -f Dockerfile . --build-arg PORT=$port
docker run --network=host --restart=always --env PORT=8008 -v /home:/home -d -p $port:8008 --env-file=.env --name $container $image