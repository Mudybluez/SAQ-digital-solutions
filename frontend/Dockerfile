FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src/ ./src/
COPY public/ ./public/
EXPOSE 3003
CMD ["node", "src/index.js"]
