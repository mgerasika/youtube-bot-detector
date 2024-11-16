# nodejs-server

sudo PGPASSWORD=test pg_dump -U test -h 192.168.0.16 -p 5432 -F c -b -v -f /home/mgerasika/Documents/backup/ua-video-torrent-backup.dump ua-video-torrent
sudo PGPASSWORD=test pg_dump -U test -h 192.168.0.16 -p 5432 -F c -b -v -f /home/mgerasika/Documents/backup/youtube-bot-filter-backup-6.11.24.dump youtube-bot-filter

pg_restore -U test -h 192.168.0.16 -d ua-video-torrent2 -v /home/mgerasika/Documents/backup/ua-video-torrent-backup.dump


sudo docker tag youtube-bot-server mgerasika/youtube-bot-server:v10
sudo docker login
sudo docker push mgerasika/youtube-bot-server:v10

# on another pc
docker pull mgerasika/youtube-bot-server:v10
docker run --network=host --restart=always --env PORT=8077 -v /home:/home -d \
    -p $port:8077 \ 
    --env DB_USER=test \
    --env DB_PASSWORD=test \
    --env DB_OWNER_USER=postgres \
    --env DB_OWNER_PASSWORD=homeassistant \
    --env DB_HOST=192.168.0.16 \
    --env RABBIT_MQ=amqp://test:test@178.210.131.101:5672 \
    --env REDIS_URL=redis://192.168.0.16:6379 \
    --name youtube-bot-server \
  mgerasika/youtube-bot-server:v10

