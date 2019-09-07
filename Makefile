# Makefile for Docker build + test + release

NAME	:= andrewsosa/dockron
FILE	:= dockerfiles/node.dockerfile
TAG		:= $$(./scripts/version.js)
IMG		:= ${NAME}:${TAG}
LATEST  := ${NAME}:latest
CWD		:= $(shell pwd)

all: clean build test push

build:
	docker build -t ${IMG} - < ${FILE}
	docker tag ${IMG} ${LATEST}

test:
	docker run --rm -t \
		-v /var/run/docker.sock:/var/run/docker.sock \
		-v ${CWD}/example/sample.toml:/etc/dockron/dockron.toml \
		${LATEST} -v

push:
	docker push ${NAME}

clean:
	-rm -rf dist/
