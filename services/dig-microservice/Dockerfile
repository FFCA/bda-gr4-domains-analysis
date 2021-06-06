FROM node:16-alpine AS appbuild
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

FROM debian:stable-slim
WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install -y dnsutils
RUN apt-get install -y nodejs
RUN apt-get install -y npm
COPY package*.json ./
RUN npm ci --only=production
COPY --from=appbuild /usr/src/app/build ./build
EXPOSE 8088
CMD node build/index.js
