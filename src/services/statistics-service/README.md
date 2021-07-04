# Statistics Service

## What does this service do?

This service connects this project's [Postgres database](../../services/postgres-db/README.md) to your client(s) using
asynchronous/event-driven architecture ([Socket.io](https://socket.io/)).

## How do I use this service as a developer?

### Prerequisites

You will need [Node.js](https://nodejs.org/en/) and [npm](https://docs.npmjs.com/cli/v7/commands/npm) to be installed in
order to start this project locally (outside of Docker).

Also, make sure you have the [Postgres DB](../../services/postgres-db/README.md) running at port `5432` on `localhost`:
Hint: For this purpose, you can also map the port of the database in the project's
docker-compose (`bda-gr-4-domains-analysis/src/services`).

In order to load all dependencies, run (in this directory):

```sh
npm install
```

### Commands for developing

The following commands are useful for developers:

- For starting the app in dev mode, run `npm run start:dev`
- For manual building, run: `npm run build`
- For starting the built application, run: `npm run start:prod`

### Emitted events

In order to minimize the complexity of this application, the emitted events are named as the database functions that
have been called in order to get the respective emitted values. For this purpose, the
shared [domain analysis types package](../../shared-node-modules/domain-analysis-types/README.md) is used.

In order to prevent clients from receiving too many notifications, events are only emitted after not receiving any new
notification from the database for 2 seconds. Also, in order to avoid sending too many data to this backend, it only
calls a DB function once after these 2 seconds in order to get the data. Read more about
it [here](../postgres-db/README.md).

### Subscribe to events as a client

From your client, after establishing a connection, you can subscribe to events using [Socket.io](https://socket.io/).
Example using [Angular](https://angular.io/) with
the [socket.io-client package](https://www.npmjs.com/package/socket.io-client):

```ts
const socket = io('my-api-endpoint');
socket.on(
    DomainAnalysisFunctionName.DOMAIN_COUNT,
    (data: { domain_count: number }[]) => {
        console.log(
            `The number of domains has changed to: ${data[0].domain_count}. Let's display the value in a flashy way!`
        );
    }
);
```

On connection, all events will be emitted to the new connected client. In case of changes to be emitted, i.e. an event
emitted by the database, the statistics service emits to all of its connected clients.

## Docker Image

The dockerized version of this project builds upon:

- `node:16-alpine` (both for building and for running the application)

See [Dockerfile](./Dockerfile).

_**Hint:** For building a Docker Image, the context has to be adjusted to [the monorepo's `src` directory](../..) since
service requires the [domain analysis types package](../../shared-node-modules/domain-analysis-types/README.md). Yet, if
you build this image using [docker-compose](../docker-compose.yml) (strongly recommended), the required context is set
automatically._

## License

The project's [package.json](./package.json) does contain a license: As the whole project, this service is licensed as
Attribution-NonCommercial 4.0 International (CC-BY-NC-4.0). If you are not familiar with this license, read more about
it [here](https://creativecommons.org/licenses/by-nc/4.0/).
