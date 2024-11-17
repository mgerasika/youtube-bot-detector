# nodejs-server

sudo PGPASSWORD=test pg_dump -U test -h 192.168.0.106 -p 5433 -F c -b -v -f /home/mgerasika/Documents/backup/youtube-bot-filter-backup-$(date +\%Y-\%m-\%d-\%H:\%M).dump youtube-bot-filter
pg_restore -U test -h 192.168.0.106 -p 5433 -d youtube-bot-filter -v /home/mgerasika/Documents/backup/youtube-bot-filter-backup-6.11.24.dump 



sudo mkdir -p /media/mgerasika/ssd11/postgres_data
sudo chown -R $USER:$USER /media/mgerasika/ssd11/postgres_data
sudo docker cp postgres:/var/lib/postgresql/data /media/mgerasika/ssd11/postgres_data



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
    --env DB_HOST=192.168.0.106 \
    --env RABBIT_MQ=amqp://test:test@178.210.131.101:5672 \   
    --env REDIS_URL=redis://178.210.131.101:6379 \
    --name youtube-bot-server \
  mgerasika/youtube-bot-server:v10



docker run -p 5433:5432 \
  --name postgres \
  -e POSTGRES_PASSWORD=homeassistant \
  -v /media/mgerasika/ssd13/postgres_data:/var/lib/postgresql/data \
  --restart always \
  -d postgres



docker run --name pgadmin4 -p 5050:80 \
    -e 'PGADMIN_DEFAULT_EMAIL=mgerasika@gmail.com' \
    -e 'PGADMIN_DEFAULT_PASSWORD=Zxc123=-' \
    -d dpage/pgadmin4

docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=test \
  -e RABBITMQ_DEFAULT_PASS=test \
  -v rabbitmq-data:/var/lib/rabbitmq \
  rabbitmq:management


docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest



