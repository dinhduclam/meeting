FROM node:18-slim as build
WORKDIR /app/web
COPY package.json ./
RUN ["npm", "install"]

FROM node:18-slim
WORKDIR /app/web