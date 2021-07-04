basename="$(dirname "$0")/"

csvetension=.csv
csvFile="real_domains"$csvetension
datadir=$basename"data/"

# Error case: file stated as param exists but is not a csv => exit with information
if ! [ -z $1 ] && [ -e $1 ] && [ "${1: -4}" != $csvetension ]; then
  echo "[Data csv] Given file format is not supported! Please make sure your file ends with" $csvetension
  exit 1
# Case: File stated as param is valid csv => copy file to the repository's root dir making sure it is named correctly
elif ! [ -z $1 ] && [ -e $1 ]; then
  echo "[Data csv] Copying file" $1 "to" $datadir$csvFile "(updates existing file)"
  mkdir -p $datadir
  cp $1 $datadir$csvFile
# Case: No or no existing file stated as param but csv could be found at the required location
elif [ -e $datadir$csvFile ]; then
  echo "[Data csv] Existing" $datadir$csvFile "will be used!"
# No data at the repository's root and no existing file stated as param  => exit with information
else
  echo "[Data csv] Failed to find" $datadir$csvFile"!"
  echo "[Data csv] Note: If you started this script with a file path as argument, this path does not seem to exist."
  echo "[Data csv] This script makes sure the application is only called if the required data exists. You have two options:"
  echo "[Data csv]   1. Download the data and call this script with the path to the downloaded data, e.g. (called from root): bash setup.sh <absolute path to your csv>"
  echo "[Data csv]   2. Download the data and store it manually as:" $datadir$csvFile "(relative path to the directory this script has been run from)"
  echo "[Data csv] In case of questions, check the assignment specification in Moodle."
  echo "[Data csv] Also, your file name is not relevant as long as it's a csv. E.g. you can copy my_domains_small.csv using this script and it will be renamed to real_domains.csv at the directory it is copied to."
  exit 1
fi

pysparkdir=$basename"src/services/pyspark/"
postgresFile="postgresql-42.2.22.jar"

# check for postgres jar
if [ -e $pysparkdir$postgresFile ]; then
  echo "[Postgres jar] Existing" $pysparkdir$postgresFile "will be used!"
else
  echo "[Postgres jar] Failed to find required" $pysparkdir$postgresFile"!"
  echo "[Postgres jar] This script makes sure the application is only called if the required Postgres driver exists."
  echo "[Postgres jar] Please make sure to download the driver from https://jdbc.postgresql.org/download/postgresql-42.2.22.jar"
  echo "[Postgres jar] Afterwards, just move it to $pysparkdir$postgresFile"
  echo "[Postgres jar] Hint: to do so, you can use the terminal from right where you are:"
  echo "[Postgres jar] mv <path to the downloaded jar>" $pysparkdir$postgresFile
  exit 1
fi

cityDb="GeoLite2-City.mmdb"

# check for city mmdb
if [ -e $pysparkdir$cityDb ]; then
  echo "[GeoLite2 City] Existing" $pysparkdir$cityDb "will be used!"
else
  echo "[GeoLite2 City] Failed to find required" $pysparkdir$cityDb"!"
  echo "[GeoLite2 City] This script makes sure the application is only called if the required City DB exists."
  echo "[GeoLite2 City] Please make sure to download it from https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=YOUR_LICENSE_KEY&suffix=tar.gz"
  echo "[GeoLite2 City] (Please insert you license key)"
  echo "[GeoLite2 City] Afterwards, just move it to $pysparkdir$cityDb"
  echo "[GeoLite2 City] Hint: to do so, you can use the terminal from right where you are:"
  echo "[GeoLite2 City] mv <path to the downloaded mmdb>" $pysparkdir$cityDb
  exit 1
fi

asnDb="GeoLite2-ASN.mmdb"

# check for asn mmdb
if [ -e $pysparkdir$cityDb ]; then
  echo "[GeoLite2 ASN] Existing" $pysparkdir$asnDb "will be used!"
else
  echo "[GeoLite2 ASN] Failed to find required" $pysparkdir$asnDb"!"
  echo "[GeoLite2 ASN] This script makes sure the application is only called if the required ASN DB exists."
  echo "[GeoLite2 ASN] Please make sure to download it from https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN&license_key=YOUR_LICENSE_KEY&suffix=tar.gz"
  echo "[GeoLite2 ASN] (Please insert you license key)"
  echo "[GeoLite2 ASN] Afterwards, just move it to $pysparkdir$asnDb"
  echo "[GeoLite2 ASN] Hint: to do so, you can use the terminal from right where you are:"
  echo "[GeoLite2 ASN] mv <path to the downloaded mmdb>" $pysparkdir$asnDb
  exit 1
fi

# Only called if not exited before => setup docker-compose in detached mode
cd $basename/src/services
docker-compose -p "bda-gr4-domain-analysis" up -d
echo
echo "----------------"
echo
echo "The services should be running by now. Here's what you can do now:"
echo " - open http://localhost:8321 in order to access the dashboard"
echo " - open http://localhost:8888/lab?token=token4711 in order to access the Notebooks (with 'token4711' being your personal access token)"
echo
echo "Seeing an NPM error (EAI_AGAIN)? It's a network issue that we cannot control, unfortunately (yet, we're very sorry for the inconvenience). Just re-run this script and building should succeed (or at least take a step)."
