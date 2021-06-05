FROM node:alpine AS build
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm install -g @angular/cli
RUN ng build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/dashboard /usr/share/nginx/html
