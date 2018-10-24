FROM node:9.10.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --quiet

COPY . .
