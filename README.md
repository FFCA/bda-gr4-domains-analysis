# Domain Analysis - Group 04 - Big Data Analytics, HTW Berlin

This is a monorepo containing both the source files (LaTeX) of a conceptual documentation and of the domain analysis
itself.

[comment]: <> (TODO: describe why...)

## Setup this project

### What is required?

It is obligatory to store the parsed domain data (`real_domains.csv`) in the root directory of this project, i.e. on the
same level as this README-file. Afterwards, the services can be started.

### The easiest way: All-in-one shell script

In order to make this tool as easily usable as possible, there is a shell script for both managing the required data and starting all services (`docker-compose`). This file can be found [here](./setup.sh). 


_**Note:** the `sh` command can only be run in a Linux-based terminal. However, if you are using Windows, you can use your
Git Bash._

#### Called without param

```shell
sh setup.sh
```
In this case, it is obligatory to have stored the required data in the root directory already (e.g. by having run command presented below some time before).

#### Called with file path

```shell
sh setup.sh path/to/your/downloaded/file/data.csv
```

In this case, after checking whether the file exists and whether it is a `.csv` file, it will be copied to the required location (root directory of this repository). If a file already exists, it will be overwritten. Once you have imported the data, this command is no longer necessary, i.e. the file path can be excluded from the command (see above).

#### Called from any location

In the examples above, the commands were intended to be run from the root directory. However, you can also call it from anywhere else:

```shell
sh path/to/your/repo/setup.sh 
```

### Manual verification and execution of commands

After verifying whether the required data exists, the shell script does nothing else than (in `./services`):

```shell
docker-compose up -d
```

The `-d` flag is used in order to run in detached mode, but not necessarily required. Of course, in order to set up the services, you can run the command above (in `./services`), too. 

However, as it requires manual verification of whether the domain data to be analyzed exists, we do not recommend this way.

### Shutdown

In order to shut down the services, navigate to `./services` and run:

```
docker-compose down
```

## Repository Structure

### Conceptual documentation

The LaTeX files for the conceptual documentation can be found [here (./conceptual-doc)](./conceptual-doc):

### Domain Analysis (Source Code for Services)

The source code for the domain analysis can be found [here (./services)](./services):

### Workflows

...

[comment]: <> (TODO: Add workflows)
