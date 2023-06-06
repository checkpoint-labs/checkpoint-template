FROM node:20-alpine

WORKDIR /usr/app

COPY . .

EXPOSE 3000

ENV DATABASE_URL=mysql://root:default_password@mysql:3306/checkpoint

RUN ["yarn", "install", "--frozen-lockfile"]

CMD [ "yarn", "dev" ]
