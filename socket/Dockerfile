FROM node:22.17.1-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 5070

CMD ["npm", "start"]