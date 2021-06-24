FROM jupyter/pyspark-notebook
COPY *.ipynb /home/jovyan/work/notebooks/
COPY real_domains.csv /home/jovyan/work/data/
COPY postgresql-42.2.22.jar /usr/local/spark-3.1.2-bin-hadoop3.2/jars
#ADD https://jdbc.postgresql.org/download/postgresql-42.2.22.jar /usr/local/spark-3.1.2-bin-hadoop3.2/jars
# TODO: Preferebly, download the driver directly. ADD? wget? Problem => Not "green" when running ls
EXPOSE 8888

# TODO Fix: java.sql.SQLException: No suitable driver in last chunk

# TODO Mount? => data? notebooks? both?
# TODO /data good practice?
