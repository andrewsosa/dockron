all: build

build:
	npm run build

image:
	docker build -t andrewsosa/dockron .

test-image:
	docker run -v /var/run/docker.sock:/var/run/docker.sock -v /Users/andrew/Workspace/dockron/example/sample.toml:/etc/dockron/dockron.toml andrewsosa/dockron

clean:
	rm -rf dist/
