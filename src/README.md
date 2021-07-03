# Source Code

This directory contains all source code of this everything-as-Code-based project. It is divided in two sections:

- [The services to be dockerized](./services)
- [The shared NPM package(s)](./shared-node-modules)

If you are working on this project, it's highly recommended to have a look at the base images of each service and to pull its base image(s) in order to reduce the Docker build time.

To do so, run:

```shell
docker pull <image>:<tag>
```
