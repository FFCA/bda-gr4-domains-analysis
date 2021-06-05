csvDir=src/
csvFile=real_domains.csv

if [ -e $csvDir$csvFile ]
then
    echo $csvFile "exists!"
else
    echo $csvFile "does not exist in directory" $csvDir
    echo "Please make sure to download it and store it as" $csvDir$csvFile"!"
    echo "In case of questions, check the assignment specification in Moodle."
fi
