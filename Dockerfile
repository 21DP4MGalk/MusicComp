FROM node:debian

WORKDIR /app

COPY . .

RUN apt update && apt upgrade && apt install nginx git -y

EXPOSE 3000
