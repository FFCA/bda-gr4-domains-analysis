# Services

This directory contains the source code for all services to be dockerized, i.e. each subdirectory contains
a `Dockerfile` referenced from [this directory's compose file](./docker-compose.yml). The services themselves can also
be own projects ( [dashboard](./dashboard)
,[dig-microservice](./dig-microservice), [statistics-service](./statistics-service)).
