#for local testing/or local docker container
image=youtube-bot-filter-downloader
container=youtube-bot-filter-downloader
port=8010

docker stop $container
docker rm $container
docker image rm $image
docker build -t $image -f Dockerfile . --build-arg PORT=$port
docker run --network=host --restart=always --env PORT=8010 -v /home:/home -d -p $port:8010 --env-file=.env --name $container $image