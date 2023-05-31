FROM node:20-alpine

WORKDIR /usr/app

COPY . .

RUN yarn

EXPOSE 3000
