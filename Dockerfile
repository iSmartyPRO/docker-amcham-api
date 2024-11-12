FROM node:20.11.0-alpine

RUN apk add --no-cache \
    sudo \
    curl \
    npm \
    build-base \
    g++;

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY ./src/package.json /home/node/app

RUN apk --no-cache add ca-certificates wget  && \
    npm install \
    ;

CMD [ "./node_modules/.bin/nodemon", "index" ]
