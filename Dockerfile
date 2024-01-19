# FROM pudding/docker-app:node-20-inkscape-20230922-2210


FROM node:20-buster

RUN apt-get update
RUN apt-get install -y inkscape

RUN apt-get install -y \
    imagemagick