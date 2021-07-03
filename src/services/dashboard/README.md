# Domain Analysis Dashboard

## What does This dashboard do?

Dashboard for visualizing data received from the [Statistics Service](../statistics-service/README.md).

### Layout and application logic

Improving the user experience (UX), this dashboard uses event-driven logic, i.e. it subscribes to the events emitted
from the Statistics Service and displays data asynchronously without the necessity of having to refresh the page in
order to perform HTTP requests (Read more about it [here](../statistics-service/README.md)).

If connected, a green check-icon is visible in the bottom right corner (or after opening the hamburger menu on small
screens) indicating being listening to events emitted from the Statistics Service. If not, a dialog is opened informing
the user about this problem.

The dashboard's layout is card- and tab-based in order to prominently display the data to be presented and dividing it
into logically coherent sections. Information will either be displayed as a KPI or as a chart component.

### Integrated Dig terminal

The dashboard does also feature an integrated (mocked) terminal for performing requests to
the [Dig Microservice](../dig-microservice/README.md). Even though using the Dig service has been discarded for this
project's [data analysis part](../pyspark/README.md), it is still fully functional and ready-to-use from this client and
can be accessed through the terminal icon in the bottom right corner (or after opening the hamburger menu on small
screens).

### Further features

- **I18N:** The dashboard is available in English and in German: The language can be configured after tapping the world
  icon in the bottom right corner (or after opening the hamburger menu on small screens)
- **Responsiveness and Cross-Browser-Support:** The dashboard is fully responsive, i.e. it will adjust its content's
  size to the device it is opened from. Also, it runs on all modern web browsers (excluding Internet Explorer...if to be
  considered modern any way)
- **Resizeable charts:** All displayed charts can be resized according to the user's needs (depending on the user's
  screen size). There are three selectable size options: _S_, _M_ and _XL_ for resizing charts (default is _S_ in order
  to avoid the necessity of scrolling in order to see all information).

## Developer Information

### Prerequisites

You will need the [Angular CLI](https://angular.io/cli) (incl. [Node.js](https://nodejs.org/en/)
and [npm](https://docs.npmjs.com/cli/v7/commands/npm)) to be installed in order to start this project locally (outside
of Docker).

In order to load all dependencies, run (in this directory):

```sh
npm install
```

### Angular (CLI)

> # Dashboard
>
> This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.3.
>
> ## Development server
>
> Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
>
> ## Code scaffolding
>
> Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
>
> ## Build
>
> Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
>
> ## Running unit tests
>
> Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
>
> ## Running end-to-end tests
>
> Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.
>
> ## Further help
>
> To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Docker Image

The dockerized version of this project builds upon:

- `node:16-alpine` (for building the application)
- `nginx:alpine` (for running the application)

See [Dockerfile](./Dockerfile).

_**Hint:** For building a Docker Image, the context has to be adjusted to [the monorepo's `src` directory](../..) since service
requires the [domain analysis types package](../../shared-node-modules/domain-analysis-types/README.md). Yet, if you
build this image using [docker-compose](../docker-compose.yml) (strongly recommended), the required context is set
automatically._

## License

The project's [package.json](./package.json) does contain a license: As the whole project, this service is licensed as
Attribution-NonCommercial 4.0 International (CC-BY-NC-4.0). If you are not familiar with this license, read more about
it [here](https://creativecommons.org/licenses/by-nc/4.0/).
