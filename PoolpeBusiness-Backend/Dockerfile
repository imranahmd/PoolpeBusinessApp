FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production --silent

RUN npm install -g ts-node

COPY . ./

EXPOSE 8000

CMD ["npm", "start"]
