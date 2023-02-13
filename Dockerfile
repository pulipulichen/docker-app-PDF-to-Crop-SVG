# FROM ubuntu:20.04
FROM nanozoo/inkscape:0.91--fe10148

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

WORKDIR /

CMD ["bash"]

COPY package.json /
RUN npm install
