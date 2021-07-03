# Domain Analysis Types (Node package)

## What does this package do?

`domain-analysis-types` is a package to be used in TypeScript-based domain analysis projects, i.e.
the [statistics service](../../services/statistics-service/README.md) and
the [client](../../services/dashboard/README.md). This package exports DB event names and DB functions used in this
project as well as how they are connected, i.e. which functions belong to which event.

## How do I use this package?

### Prerequisites

You will need [Node.js](https://nodejs.org/en/) and [npm](https://docs.npmjs.com/cli/v7/commands/npm) installed in order
to build this package locally (outside of Docker).

### Install this package

The services using this module are referencing to it through a relative file path to the built tgz file. Subsequently,
if you are working on any project using this module, make sure you build it before. To do so, run (in this directory):

```shell
npm install
npm pack
```

In order to simplify development, there is a custom script you can call in order to update this package's version in
both the statistics service, and the dashboard project. To do so, run (in this directory):

```shell
npm run update-bda-types-in-repo
```

### Exported functions/data

The `domain-analysis-types` package exports the following enums:

- `DomainAnalysisEvent` &rarr; Database event names
- `DomainAnalysisFunctionName` &rarr; Database function names

And the following functions:

- `getDbFunctions` &rarr; get all existing database functions
- `getDbFunctionsByEvent` &rarr; get all functions belonging to a given `DomainAnalysisEvent`
- `getAllEvents` &rarr; get a Map containing all `DomainAnalysisEvent` and the `DomainAnalysisFunctionName` belonging to
  it

## License

The project's [package.json](./package.json) does contain a license: As the whole project, this service is licensed as
Attribution-NonCommercial 4.0 International (CC-BY-NC-4.0). If you are not familiar with this license, read more about
it [here](https://creativecommons.org/licenses/by-nc/4.0/).
