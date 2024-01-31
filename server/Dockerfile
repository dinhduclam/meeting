FROM node:18-slim AS build
WORKDIR /app/server
COPY package.json ./
RUN npm install

FROM node:18-slim
WORKDIR /app/server
COPY .dockerignore ./
COPY --from=build /app/server/node_modules ./node_modules