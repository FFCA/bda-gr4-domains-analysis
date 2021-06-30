# Attention: This Dockerfile must be called with context ".."

FROM node:16-alpine AS appbuild
RUN npm i -g rimraf -g typescript
WORKDIR /usr/src/app/domain-analysis-types
COPY domain-analysis-types/src ./src
COPY domain-analysis-types/package.json .
COPY domain-analysis-types/tsconfig.json .
COPY domain-analysis-types/tsconfig-cjs.json .
RUN npm i
RUN npm run prepare
RUN npm pack
WORKDIR /usr/src/app/statistics-service
COPY statistics-service/src ./src
COPY statistics-service/package.json .
COPY statistics-service/tsconfig.json .
RUN npm i
RUN npm run build

FROM node:16-alpine
WORKDIR /usr/src/app/domain-analysis-types
COPY --from=appbuild /usr/src/app/domain-analysis-types/domain-analysis-types-*.tgz .
WORKDIR /usr/src/app/statistics-service
COPY --from=appbuild /usr/src/app/statistics-service/package*.json .
RUN npm ci --only=production
COPY --from=appbuild /usr/src/app/statistics-service/build ./build
EXPOSE 8089
CMD node build/index.js
