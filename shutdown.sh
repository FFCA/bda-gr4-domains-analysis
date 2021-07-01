basename="$(dirname "$0")/"
rmiArg="rmi"
rmDataArg="rmdata"

cd $basename/src/services
docker-compose -p "bda-gr4-domain-analysis" down

for arg in "$@"; do
  if [ $arg = $rmiArg ]; then
    for img in "bda-gr4-domain-analysis_statistics_service" "bda-gr4-domain-analysis_dashboard" "bda-gr4-domain-analysis_database" "bda-gr4-domain-analysis_dig_ms" "bda-gr4-domain-analysis_spark"; do
      docker rmi $img
    done
  elif [ $arg = $rmDataArg ]; then
    rm -r postgres-db/postgres-data
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
echo "Hint: If you also want to remove the mounted DB storage or the built images, you can append the following argument(s) when running this script:"
echo " - '"$rmDataArg"' => removes the mounted Postgres storage"
echo " - '"$rmiArg"' => removes all images (if not used by another container)"
echo "e.g.: bash shutdown.sh $rmiArg $rmDataArg"
echo "(Of course, if once removed, there will be a warning prompted for the already deleted container/image/directory"
