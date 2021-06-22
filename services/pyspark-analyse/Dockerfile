FROM jupyter/pyspark-notebook
COPY *.ipynb /home/jovyan/work/notebooks/
COPY real_domains.csv /home/jovyan/work/data/
ADD https://jdbc.postgresql.org/download/postgresql-42.2.22.jar <where to put?>
EXPOSE 8888

# TODO Fix: java.sql.SQLException: No suitable driver in last chunk

# TODO Mount? => data? notebooks? both?
# TODO /data good practice?
