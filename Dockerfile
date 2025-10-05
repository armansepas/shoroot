FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server/ ./server/
COPY src/ ./src/
COPY index.html ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY Entities/ ./Entities/

RUN npm run build

EXPOSE 3333

CMD ["npm", "run", "server"]