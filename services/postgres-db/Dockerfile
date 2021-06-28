FROM postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB domainanalysis
COPY init.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD ["postgres", "-c", "log_statement=all"]
