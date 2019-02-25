FROM node:10
WORKDIR /usr/src/dockron
COPY . .
RUN npm ci && \
    npm link
ENTRYPOINT [ "dockron" ]
