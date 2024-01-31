FROM node:18-slim AS build
WORKDIR /app/server
COPY package.json ./
RUN ["npm", "install"]

FROM node:18-slim
WORKDIR /app/server