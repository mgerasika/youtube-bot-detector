FROM node:16.14-alpine

ARG PORT
COPY . .

WORKDIR /app
RUN yarn
RUN yarn build

EXPOSE ${PORT}

CMD [ "yarn",  "start" ]
