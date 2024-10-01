FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./

COPY .npmrc ./

RUN npm install

COPY . .

EXPOSE 7004

CMD ["npm", "run", "start:dev"]
