FROM node:18.19.1-alpine

ARG PORT
COPY . .

WORKDIR /app
RUN yarn
RUN yarn build

EXPOSE ${PORT}

CMD [ "yarn",  "start" ]
