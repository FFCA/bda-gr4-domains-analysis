extension=.csv
csvFile=real_domains$extension
basename="$(dirname "$0")/"
datadir=$basename"data/"

# Error case: file stated as param exists but is not a csv => exit with information
if ! [ -z $1 ] && [ -e $1 ] && [ "${1: -4}" != $extension ]; then
  echo "Given file format is not supported! Please make sure your file ends with" $extension
  exit 1
# Case: File stated as param is valid csv => copy file to the repository's root dir making sure it is named correctly
elif ! [ -z $1 ] && [ -e $1 ]; then
  echo "Copying file" $1 "to" $datadir$csvFile "(updates existing file)"
  mkdir -p $datadir
  cp $1 $datadir$csvFile
# Case: No or no existing file stated as param but csv could be found at the required location
elif [ -e $datadir$csvFile ]; then
  echo "Existing" $datadir$csvFile "will be used!"
# No data at the repository's root and no existing file stated as param  => exit with information
else
  echo "Failed to find" $datadir$csvFile"!"
  echo "Note: If you started this script with a file path as argument, this path does not seem to exist."
  echo "This script makes sure the application is only called if the required data exists. You have two options:"
  echo "  1. Download the data and call this shell script with the path to the downloaded data, e.g. (called from root): sh setup.sh <path to your csv>"
  echo "  2. Download the data and store it manually as:" $datadir$csvFile "(relative path to the directory this script has been run from)"
  echo "In case of questions, check the assignment specification in Moodle."
  exit 1
fi

# TODO adjust README concerning path

# Only called if not exited before => setup docker-compose in detached mode
cd $basename/src/services
docker-compose -p "bda-gr4-domain-analysis" up -d
echo
echo "----------------"
echo
echo "The services should be running by now. Here's what you can do now:"
echo " - open http://localhost:8321 in order to access the dashboard"
echo " - open http://localhost:8888/lab?token=token4711 in order to access the Notebooks (with 'token4711' being your personal access token)"
