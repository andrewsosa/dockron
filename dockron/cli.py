"""Docker Cron Executor

Usage: dockron [--config=<path>] (daemon | config)

Options:
  -h --help     Show this screen.

"""
from docopt import docopt


def cli():
    args = docopt(__doc__)
    print(args)
