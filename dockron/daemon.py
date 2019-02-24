from typing import Callable
from .config import Config, JobSpec, load_config
from .scheduler import Scheduler, handle_interrupt

Job = Callable[[], None]
scheduler = Scheduler()


def run_docker_job(image: str, command: str):
    print(image, command)


def choose_schedule(shced: str) -> Callable:
    return {}


def enqueue(schedule: str, job: Callable):
    # scheduler.
    pass


def start_daemon(conf: Config):

    # For each task, create a job
    for name, spec in conf.items():
        schedule = spec["schedule"]
        enqueue(
            spec["schedule"], run_docker_job(spec["image"], spec["command"])
        )
