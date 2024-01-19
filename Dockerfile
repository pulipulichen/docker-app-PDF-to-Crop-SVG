# FROM pudding/docker-app:node-20-inkscape-20230922-2210


FROM pudding/docker-app:node-jsdom-20230707

RUN apt-get update
RUN apt-get install -y inkscape

RUN apt-get install -y \
    imagemagick

RUN apt-get install -y \
    texlive-extra-utils

# RUN npm link jsdom