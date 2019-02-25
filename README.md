# Dockron
> Simple task scheduling for Docker jobs

## :rocket: Features
* **Cron Syntax.** Powerful, explicit scheduling.
* **Logging**. Comprehensive logging built-in.
* **Simple**. Easy to install, configure, and deploy.


## Installation
You can install and run `dockron` using either [locally with npm]():

```sh
npm i -g dockron
```

Or by [running in Docker](#running-with-docker) (**recommended**):
```sh
docker pull andrewsosa/dockron
```


## Usage
```sh
Usage: dockron [options]

Options:
  -h --help             Show this.
  -v --validate         Validate config file only.
  -c --config=<config>  Choose config file [default: /etc/dockron/dockron.toml]
  -s --socket=<socket>  Choose Docker socket [default: /var/run/docker.sock]
  -d --debug            Print the argument object (for debugging).
  -l --level            Set logging level [default: 'info']
```

### Running with Docker
If running inside a Docker container, you will need to mount both a configuration file and the Docker socket.

```sh
docker run -v /var/run/docker.sock:/var/run/docker.sock \
           -v ./path/to/dockron.toml:/etc/dockron/dockron.toml \
           andrewsosa/dockron
```

Alternatively, you can build your own image to add the config:

```dockerfile
FROM andrewsosa/dockron
COPY ./path/to/dockron.toml /etc/dockron/dockron.toml
```

## Configuration
`dockron` expects a configuration at `/etc/dockron/dockron.toml`, but you can change that with `--config`.

```toml
["Sample Task Name"]
schedule = "* * * * *"
image = "alpine"
command = "sleep 10"

["Hourly Task"]
schedule = "0 * * * *"
image = "ubuntu"
command = "echo 'Hello, world\!'"
```


