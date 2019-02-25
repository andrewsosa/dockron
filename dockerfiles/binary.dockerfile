FROM node:10 as builder
WORKDIR /usr/src/dockron
COPY . .
RUN npm ci && \
    npx pkg . --out-path dist/ --targets node10-alpine-x64


FROM amd64/alpine
COPY --from=builder /usr/src/dockron/dist/dockron-linux /usr/bin/dockron
ENTRYPOINT [ "/usr/bin/dockron" ]

