# Domain Analysis - Group 04 - Big Data Analytics, HTW Berlin

This is a monorepo containing both the source files (LaTeX) of a conceptual documentation and of the domain analysis
itself.

[comment]: <> (TODO: describe why...)

## Setup this project

### The easiest way: All-in-one shell script

In order to make this tool as easily usable as possible, there is a shell script for both managing the required data (
parsed domain data (`real_domains.csv`) and starting all services (`docker-compose`). This file can be
found [here](./setup.sh).

_**Note:** the `sh` command can only be run in a Linux-based terminal. However, if you are using Windows, you can use
your Git Bash._

#### Called without param

```shell
sh setup.sh
```

In this case, it is obligatory to have stored the required data in the root directory already (e.g. by having run the
command presented below some time before).

#### Called with file path

```shell
sh setup.sh path/to/your/downloaded/file/data.csv
```

In this case, after checking whether the file exists and whether it is a `.csv` file, it will be copied to the required
location (root directory of this repository as `real_domains.csv`). If a file already exists, it will be overwritten.
Once you have imported the data, this command is no longer necessary, i.e. the file path can be excluded from the
command (see above).

#### Called from any location

In the examples above, the commands were intended to be run from the root directory. However, you can also call it from
anywhere else:

```shell
sh path/to/your/repo/setup.sh 
sh path/to/your/repo/setup.sh path/to/your/downloaded/file/data.csv
```

### Manual verification and execution of commands

After verifying whether the required data exists, the shell script does nothing else than (in `./services`):

```shell
docker compose -p "bda-gr4-domain-analysis" up -d
```

Of course, in order to set up the services, and a network through which they are interacting, you can run the command above (in `./services`), too. The `-d` flag is used
in order to run in detached mode, but not necessarily required. The flag `-p <name>` is not required either but
recommended as it is a descriptive project name.

However, as it requires manual verification of whether the domain data to be analyzed exists (`real_domains.csv` in the
root directory of this project, i.e. on the same level as this README-file), we do not recommend this approach.

### Shutdown

In order to shut down the services and remove their containers/network, navigate to `./services` and run:

```shell
docker compose -p "bda-gr4-domain-analysis" down
```

Please note that you have to state the same name as `-p <name>` as when started (see above). For more `docker compose` commands, have a look at the [Docker Documentation (docker compose)](https://docs.docker.com/engine/reference/commandline/compose/).

## Repository Structure

### Conceptual documentation

The LaTeX files for the conceptual documentation can be found [here (./conceptual-doc)](./conceptual-doc):

### Domain Analysis (Source Code for Services)

The source code for the domain analysis can be found [here (./services)](./services):

### Workflows

...

[comment]: <> (TODO: Add workflows)
