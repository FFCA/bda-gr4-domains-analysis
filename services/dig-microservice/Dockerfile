FROM debian:stable-slim
RUN apt-get update
RUN apt-get install dnsutils -y
COPY dig.sh .
CMD sh dig.sh
