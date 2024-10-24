FROM node:18.19.1-alpine

ARG PORT

# Common library install
COPY common /common
WORKDIR /common
RUN yarn

# Application install
COPY download-server/ /download-server
WORKDIR /download-server
RUN yarn
RUN yarn build

EXPOSE ${PORT}

CMD [ "yarn",  "start" ]
