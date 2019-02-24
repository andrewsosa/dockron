import time
import multiprocessing as mp
from typing import Callable, List

import schedule


def handle_interrupt(job):
    def _handle_interrupt(*args, **kwargs):
        try:
            return job(*args, **kwargs)
        except KeyboardInterrupt:
            return None

    return _handle_interrupt


class Scheduler(schedule.Scheduler):
    processes: List[mp.Process] = []

    def run_continuously(self, interval=1) -> mp.Process:
        self.schedule_proc_event = mp.Event()

        class ScheduleProcess(mp.Process):
            @classmethod
            @handle_interrupt
            def run(cls):
                while not self.schedule_proc_event.is_set():
                    self.run_pending()
                    time.sleep(interval)

        schedule_proc = ScheduleProcess()
        schedule_proc.start()
        return schedule_proc

    def launch_job(self, job_func: Callable) -> mp.Process:
        job_proc = mp.Process(target=job_func)
        job_proc.daemon = True
        job_proc.start()
        self.processes.append(job_proc)
        return job_proc


@handle_interrupt
def job1():
    print("Job 1 start...")
    time.sleep(10)
    print("Job 1 end...")


@handle_interrupt
def job2():
    print("Job 2 start...")
    time.sleep(1)
    print("Job 2 end...")


@handle_interrupt
def main():
    scheduler = Scheduler()
    scheduler.every(5).seconds.do(scheduler.launch_job, job1)
    scheduler.every(5).seconds.do(scheduler.launch_job, job2)
    scheduler.run_continuously().join()


if __name__ == "__main__":
    main()
