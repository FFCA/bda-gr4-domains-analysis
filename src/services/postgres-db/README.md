# Postgres Database

Directory containing all required information for building a Postgres-container customized for this project.

## Docker Image

The Docker image builds upon:

- `postgres`

See [Dockerfile](./Dockerfile).

It extends its base image by

- Copying an initialization script executed on starting the container (see below)
- Setting environment variables for:
  - The user's password: `postgres` (user's name is also `postgres`)
  - The database name: `domainanalysis`
- Running the container with:
  - `shared_buffers=3GB`
  - `log_statement=all`

## Initialization Script

The [initialization script](./init.sql) copied on creating the image creates the following logic in the database:

- Tables to be used for the domain analysis
- Functions to be used for getting the data to be displayed as charts/KPIs
- Functions for notifying channels other services subscribed to
- Triggers for calling the notification function if a watched table has changed

In order to avoid sending an unnecessary amount of data, the emitted payload of the triggers is always `NULL`, i.e.
subscribers are only informed about changes but not about what has changed.
