from typing import Type, Dict
import toml

JobSpec = Type[Dict[str, str]]
Config = Type[Dict[str, JobSpec]]


def load_config(config_path: str = None) -> Dict[str, Dict]:
    config_path = config_path or None

    with open(config_path, "r") as conf_file:
        conf: Dict[str, Dict] = toml.load(conf_file)

    return conf
