FROM jupyter/pyspark-notebook

COPY ./notebooks/ /home/jovyan/work/notebooks/
# TODO: Remove this copy command once all notebooks have been moved to /notebooks/
COPY *.ipynb /home/jovyan/work/notebooks/

COPY postgresql-42.2.22.jar /usr/local/spark-3.1.2-bin-hadoop3.2/jars
#ADD https://jdbc.postgresql.org/download/postgresql-42.2.22.jar /usr/local/spark-3.1.2-bin-hadoop3.2/jars
# TODO: Preferebly, download the driver directly. ADD? wget? Problem => Not "green" when running ls
EXPOSE 8888
