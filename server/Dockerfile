FROM node:14-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g ts-node

COPY . .

EXPOSE 4201

CMD [ "npm", "run", "start"]