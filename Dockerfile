FROM node:20-alpine

RUN npm install -g nodemon

WORKDIR /usr/app

COPY . .

RUN yarn

EXPOSE 3000
