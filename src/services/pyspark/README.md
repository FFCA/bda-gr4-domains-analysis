# PySpark

Directory containing all required information for building a PySpark image customized for this project.

## Docker Image

The Docker image builds upon:

- `jupyter/pyspark-notebook`

See [Dockerfile](./Dockerfile).

It extends its base image by

- Copying the required Postgres driver `jar` and database files (ignored by Git) to the image
- Setting the `Jupyter Token` (`token4711`) and an environment variable for enabling Jupyter Lab.

## Required data

The required data can be downloaded from here:

- [Postgres Driver 42.2.22](https://jdbc.postgresql.org/download/postgresql-42.2.22.jar)
- GeoLite2 Databases using these URLs (insert your own license key):
    - https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN&license_key=YOUR_LICENSE_KEY&suffix=tar.gz
    - https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=YOUR_LICENSE_KEY&suffix=tar.gz
