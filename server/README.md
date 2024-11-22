# postgress backup - restore example
## backup database
sudo PGPASSWORD=test pg_dump -U test -h 192.168.0.106 -p 5433 -F c -b -v -f /mnt/hdd1/backup/youtube-bot-filter-backup-$(date +\%Y-\%m-\%d).dump youtube-bot-filter


docker run --rm -v /mnt/hdd1/backup:/backup -e PGPASSWORD=test postgres:17 pg_dump \
  -U test -h 192.168.0.106 -p 5433 -F c -b -v -f /backup/youtube-bot-filter-backup-$(date +%Y-%m-%d).dump youtube-bot-filter


## restore database
pg_restore -U test -h 192.168.0.16 -p 5433 -d youtube-bot-filter -v /mnt/hdd1/backup/youtube-bot-filter-backup-2024-11-21.dump 

pg_restore -U test -h 192.168.0.16 -p 5434 -d youtube-bot-filter -v /mnt/hdd1/backup/youtube-bot-filter-backup-2024-11-21.dump 

over docker

docker run --rm -v /mnt/hdd1/backup:/backup -e PGPASSWORD=test postgres:17 pg_restore \
  -U test -h 192.168.0.16 -p 5433 -d youtube-bot-filter -v /backup/youtube-bot-filter-backup-2024-11-21.dump


docker run --rm -v /mnt/hdd1/backup:/backup -e PGPASSWORD=test postgres:17 pg_restore \
  -U test -h 192.168.0.16 -p 5434 -d youtube-bot-filter -v /backup/youtube-bot-filter-backup-2024-11-21.dump



# how tag image and upload to docker.io

sudo docker tag youtube-bot-server mgerasika/youtube-bot-server:v12
sudo docker login
sudo docker push mgerasika/youtube-bot-server:v12

## for linux
docker run --network=host \
  --restart=always \
  --env PORT=8077 \
  --env DB_USER=test \
  --env DB_PASSWORD=test \
  --env DB_OWNER_USER=postgres \
  --env DB_OWNER_PASSWORD=homeassistant \
  --env DB_HOST=192.168.0.106 \
  --env RABBIT_MQ=amqp://test:Zxc123=-@178.210.131.101:5672 \
  --env REDIS_URL=redis://178.210.131.101:6379 \
  -v /home:/home \
  -d \
  -p $port:8077 \
  --name youtube-bot-server \
mgerasika/youtube-bot-server:v11

## for windows
docker run --restart=always --env PORT=8077 --env DB_USER=test --env DB_PASSWORD=test --env DB_OWNER_USER=postgres --env DB_OWNER_PASSWORD=homeassistant --env DB_HOST=192.168.0.106 --env RABBIT_MQ=amqp://test:Zxc123=-@178.210.131.101:5672 --env REDIS_URL=redis://178.210.131.101:6379 -v /c/home:/home -d -p 8077:8077 --name youtube-bot-server mgerasika/youtube-bot-server:v11


# docker - postgress pgadmin rabbitmq redis

/media/mgerasika/ssd13/postgres_data
/media/mgerasika/ssd13/postgres_data_master
/media/mgerasika/baracuda/postgres_data

## permissions
sudo mkdir -p /mnt/hdd1/backup
sudo chown -R mgerasika:mgerasika /mnt/hdd1/backup

## several postgress instances for 192.168.0.16

docker run -p 5433:5432 \
  --name postgres_1 \
  -e POSTGRES_PASSWORD=homeassistant \
  -v /mnt/hdd1/postgres_data:/var/lib/postgresql/data \
  --restart always \
  -d postgres

docker run -p 5434:5432 \
  --name postgres_2 \
  -e POSTGRES_PASSWORD=homeassistant \
  -v /mnt/hdd2/postgres_data:/var/lib/postgresql/data \
  --restart always \
  -d postgres  

## several postgress instances for 192.168.0.106

docker run -p 5434:5432 \
  --name postgres_1 \
  -e POSTGRES_PASSWORD=homeassistant \
  -v /media/mgerasika/Documents/postgres_data:/var/lib/postgresql/data \
  --restart always \
  -d postgres

docker run -p 5435:5432 \
  --name postgres_2 \
  -e POSTGRES_PASSWORD=homeassistant \
  -v /mnt/ssd1/postgres_data:/var/lib/postgresql/data \
  --restart always \
  -d postgres

## pgadmin4
docker run --restart always --name pgadmin4 -p 5050:80 \
    -e 'PGADMIN_DEFAULT_EMAIL=mgerasika@gmail.com' \
    -e 'PGADMIN_DEFAULT_PASSWORD=Zxc123=-' \
    -d dpage/pgadmin4

## rabbitmq
sudo chown -R 999:999 /mnt/hdd1/rabbit_mq_data
docker run  --restart always  -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=test \
  -e RABBITMQ_DEFAULT_PASS=Zxc123=- \
  -v /mnt/hdd1/rabbit_mq_data:/var/lib/rabbitmq \
  rabbitmq:management

## redis
sudo chown -R 999:999 /mnt/hdd1/redis_data
docker run --restart always -d --name redis-stack \
  -p 6379:6379 -p 8001:8001 \
  -v /mnt/hdd1/redis_data:/data \
  redis/redis-stack:latest


# mount disc example
lsblk -f
// remember id of your drive for example b8dc6576-7fca-4a40-a17a-e16e9a469244
sudo mkdir -p /mnt/baracuda
sudo mkdir -p /mnt/ssd1
sudo nano /etc/fstab
add next line
UUID=b8dc6576-7fca-4a40-a17a-e16e9a469244 /media/mgerasika/baracuda ext4 defaults 0 2
b0d3d1f9-0e46-4ee6-acfe-8cbb4bd7bcdc /mnt/hdd2 ext4 defaults 0 2
39f36beb-140b-464c-8f94-93c21de5d66f /mnt/wd_12gb ext4 defaults 0 2
systemctl daemon-reload

# postgres replication example

## reset broken data
sudo /usr/lib/postgresql/17/bin/pg_resetwal -f /media/mgerasika/ssd13/postgres_data_master/
sudo /usr/lib/postgresql/17/bin/pg_resetwal -f  /media/mgerasika/baracuda/postgres_data/

CREATE ROLE replication_user WITH LOGIN REPLICATION PASSWORD 'homeassistant';
ALTER ROLE replication_user WITH SUPERUSER;

docker-compose up -d master
docker exec -it postgres-master psql -U postgres -c "CREATE ROLE replication_user REPLICATION LOGIN ENCRYPTED PASSWORD 'homeassistant';"

sudo rsync -av --progress /media/mgerasika/ssd13/postgres_data/ /media/mgerasika/ssd13/postgres_data_master/
sudo rsync -av --progress /media/mgerasika/ssd13/postgres_data/ /media/mgerasika/baracuda/postgres_data/
sudo rsync -av --progress /media/mgerasika/ssd13/postgres_data_master/ /media/mgerasika/baracuda/postgres_data/

docker-compose up -d
docker exec -it postgres-slave pg_basebackup -h postgres-master -p 5432 -D /var/lib/postgresql/data -U replication_user -Fp -Xs -P

docker-compose down
docker-compose up --build


docker exec -it postgres-master psql -U postgres
docker exec -it postgres-slave psql -U postgres

CREATE ROLE replication_user WITH REPLICATION LOGIN PASSWORD 'homeassistant';

docker exec -it postgres-slave bash
PGPASSWORD="homeassistant" psql -h postgres-master -U replication_user -c "SELECT 1;"

