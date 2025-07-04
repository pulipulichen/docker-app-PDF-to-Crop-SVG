FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update

RUN apt-get install -y \
    software-properties-common curl

WORKDIR /tmp
RUN curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt install nodejs -y

RUN add-apt-repository ppa:inkscape.dev/stable -y

RUN apt-get update

RUN apt-get install -y \
    inkscape

RUN apt-get install -y \
    texlive-extra-utils

WORKDIR /

CMD ["bash"]

RUN apt-get install -y \
    imagemagick

RUN apt-get install -y \
    poppler-utils

RUN apt-get install -y \
    pdftk

RUN apt-get install ghostscript -y

COPY ./docker-build/policy.xml /etc/ImageMagick-6/


RUN groupadd -g 1000 appgroup \
    && useradd -m -u 1000 -g appgroup -s /bin/bash appuser

# ==============

COPY package.json /
RUN npm install
