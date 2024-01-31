FROM node:18-slim as build
WORKDIR /app/web
COPY package.json ./
RUN npm install

FROM node:18-slim
WORKDIR /app/web
COPY .dockerignore ./
COPY --from=build /app/web/node_modules ./node_modules