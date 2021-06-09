extension=.csv
csvFile=real_domains$extension
basename="$(dirname "$0")/"

# Error case: file stated as param exists but is not a csv => exit with information
if [ -e $1 ] && [ "${1: -4}" != $extension ]; then
  echo "Given file format is not supported! Please make sure your file ends with" $extension
  exit 1
# Case: File stated as param is valid csv => copy file to the repository's root dir making sure it is named correctly
elif [ -e $1 ]; then
  echo "Copying file" $1 "to" $basename$csvFile "(updates existing file)"
  cp $1 $basename$csvFile
# Case: No or no existing file stated as param but csv could be found at the required location
elif [ -e $basename$csvFile ]; then
  echo "Existing" $basename$csvFile "will be used!"
# No data at the repository's root and no existing file stated as param  => exit with information
else
  echo "Failed to find" $basename$csvFile"!"
  echo "Note: If you started this script with a file path as argument, this path does not seem to exist."
  echo "This script makes sure the application is only called if the required data exists. You have two options:"
  echo "  1. Download the data and call this shell script with the path to the downloaded data, e.g. (called from root): sh setup.sh <path to your csv>"
  echo "  2. Download the data and store it manually as:" $basename$csvFile "(relative path to the directory this script has been run from)"
  echo "In case of questions, check the assignment specification in Moodle."
  exit 1
fi

# Only called if not exited before => setup docker-compose in detached mode
cd $basename/services
docker-compose up -d
