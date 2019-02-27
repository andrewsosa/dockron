FROM node:10-alpine
RUN npm i -g dockron
ENTRYPOINT [ "/usr/local/bin/dockron" ]
