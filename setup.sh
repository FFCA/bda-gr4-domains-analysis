csvFile=real_domains.csvs
basename="$(dirname "$0")/"

if [ -e $basename$csvFile ]
then
    echo $basename$csvFile "exists!"
else
    echo "Failed to find" $basename$csvFile"!"
    echo "Make sure to download the data and store it as:" $basename$csvFile
    echo "Please note, that the relative path to the directory this script has been run from was termined."
    echo "In case of questions, check the assignment specification in Moodle."
fi
