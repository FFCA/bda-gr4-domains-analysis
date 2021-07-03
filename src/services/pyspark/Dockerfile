FROM jupyter/pyspark-notebook
COPY postgresql-42.2.22.jar /usr/local/spark-3.1.2-bin-hadoop3.2/jars
COPY GeoLite2-ASN.mmdb /home/jovyan/work/GeoLite2-ASN.mmdb
COPY GeoLite2-City.mmdb /home/jovyan/work/GeoLite2-City.mmdb
ENV JUPYTER_TOKEN "token4711"
ENV JUPYTER_ENABLE_LAB 1
EXPOSE 8888
