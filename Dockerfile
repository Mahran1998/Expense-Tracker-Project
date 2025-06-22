FROM node:18-alpine

WORKDIR /app

# copy only manifests to leverage Docker layer cache
COPY package.json package-lock.json ./
RUN npm install --production

# copy source
COPY src/ ./src

EXPOSE 3000
CMD ["node", "src/server.js"]

