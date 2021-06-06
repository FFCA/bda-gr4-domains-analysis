FROM debian:stable-slim
RUN apt-get update
RUN apt-get install dnsutils -y
RUN apt-get install less
COPY dig.sh .
CMD sh dig.sh
