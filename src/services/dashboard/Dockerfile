# Attention: This Dockerfile must be called with context "../.."

FROM node:16-alpine AS build
WORKDIR /usr/src/app/shared-node-modules/domain-analysis-types
COPY shared-node-modules/domain-analysis-types/src ./src
COPY shared-node-modules/domain-analysis-types/package.json .
COPY shared-node-modules/domain-analysis-types/tsconfig.json .
COPY shared-node-modules/domain-analysis-types/tsconfig-cjs.json .
RUN npm i
RUN npm run prepare
RUN npm pack
WORKDIR /usr/src/app/services/dashboard
COPY services/dashboard/ .
RUN rm package-lock.json
RUN npm i
RUN npm install -g @angular/cli
RUN ng build

FROM nginx:alpine
COPY services/dashboard/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/services/dashboard/dist/dashboard /usr/share/nginx/html
