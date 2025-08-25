FROM node:22.15.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g @nestjs/cli

RUN npm run prisma:generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]