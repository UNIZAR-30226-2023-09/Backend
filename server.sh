################################################################################
# Asignatura: Proyecto Software (2022/2023)                                    #
# Fichero: server.sh                                                           #
# Autor: David Rivera Seves (NIP: 815124) Gracias david :)                     #
# Ejecución: bash server.sh [status/start/stop/restart]                        #
################################################################################

cd /Users/cmoro/Documents/GitHub/
if [ "$1" = "status" ]; then
  if pgrep -f "main.js" > /dev/null; then
    echo "El archivo 'main.js' está en ejecución"
  else
    echo "El archivo 'main.js' no se está ejecutando"
  fi
elif [ "$1" = "start" ]; then
  if pgrep -f "main.js" > /dev/null; then
    echo "El archivo 'main.js' ya se está ejecutando"
  else
    echo "Iniciando 'main.js'"
    node Backend/src/server/main.js &
  fi
elif [ "$1" = "stop" ]; then
  if pgrep -f "main.js" > /dev/null; then
    echo "Apagando 'main.js'"
    pkill -f "main.js" &
  else
    echo "El archivo 'main.js' no se está ejecutando"
  fi
elif [ "$1" = "restart" ]; then
  #echo "Descargando última versión..."
  #bash /usr/local/bin/github.sh
  cd Backend/src/baseDeDatos
  echo "DROP TABLES..."
  bash ejecutarSQL.sh 2 # Borrar db
  sleep 1
  echo "CREATE TABLES..."
  bash ejecutarSQL.sh 1 # Crear db
else
  echo "El parámetro debe ser 'status', 'start', 'stop' o 'restart'"
fi