FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN cp -R src/data dist/data

EXPOSE 3000

CMD ["node", "dist/index.js"]
