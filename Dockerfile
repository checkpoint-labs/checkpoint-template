FROM node:20-alpine

WORKDIR /usr/app

COPY . .

RUN ["yarn", "install", "--frozen-lockfile"]

CMD [ "yarn", "start" ]

EXPOSE 3000
