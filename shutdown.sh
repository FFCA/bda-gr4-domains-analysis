basename="$(dirname "$0")/"
rmiArg="rmi"
rmDbArg="rmdb"
rmDataArg="rmdata"

cd $basename/src/services
docker-compose -p "bda-gr4-domain-analysis" down
cd ../..

for arg in "$@"; do
  if [ $arg = $rmiArg ]; then
    for img in "bda-gr4-domain-analysis_statistics_service" "bda-gr4-domain-analysis_dashboard" "bda-gr4-domain-analysis_database" "bda-gr4-domain-analysis_dig_ms" "bda-gr4-domain-analysis_spark"; do
      docker rmi $img
    done
  elif [ $arg = $rmDbArg ]; then
    rm -r $basename/src/services/postgres-db/postgres-data
  elif [ $arg = $rmDataArg ]; then
    rm -r $basename/data
  else
    echo "Unknown argument '"$arg"' => will be ignored"
  fi
done

# TODO describe in readme

echo
echo "----------------"
echo
echo "The containers should be stopped and removed."
echo
echo "Hint: If you also want to remove the domain csv data, the mounted DB storage or the built images, you can append the following argument(s) when running this script:"
echo " - '"$rmDataArg"' => removes stored csv data"
echo " - '"$rmDbArg"' => removes the mounted Postgres storage"
echo " - '"$rmiArg"' => removes all images (if not used by another container)"
echo "e.g.: bash shutdown.sh $rmiArg $rmDbArg"
echo "(Of course, if already removed before, there will be a warning prompted for the already deleted container/image/directory"
