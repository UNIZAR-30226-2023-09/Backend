#!/bin/bash

###########################################################################################################
# Fichero: setup_containers.sh                                                                            #
# Autor: David Rivera Seves (NIP: 815124)                                                                 #
# Descripción: Este script sirve para instalar y configurar Docker, Docker-Compose y Git,                 #
#              y para poner en marcha los contenedores de una aplicación de backend y                     #
#              frontend web que utilizan React, Node MySQL.                                               #
#                                                                                                         #
# Ejecución:                                                                                              #
#   - bash setup_containers.sh install: Para instalar Docker, Docker-Compose y Git.                       #
#   - bash setup_containers.sh start:   Para descargar repositorios y poner en marcha los contenedores.   #
#   - bash setup_containers.sh stop:    Para finalizar el funcionamiento de los contenedores.             #
#   - bash setup_containers.sh restart: Para reiniciar los contenedores.                                  #
#   - bash setup_containers.sh status:  Para consultar el estado del servidor react                       #
#                                                                                                         #
# Entrar en los contenedores:                                                                             #
#   - REACT: docker exec -it frontend_react_psoft bash                                                    #
#                                                                                                         #
# Comprobar servicios:                                                                                    #
#   - REACT                                                                                               #
#      · cmd: curl http://34.175.172.53:80                                                                #
#                                                                                                         #
###########################################################################################################


#
# Función para instalar y configurar Docker, Docker-Compose y Git
#
function install_docker {
    # Instalar y configurar Docker, Docker-Compose y Git ...
    sudo apt update
    sudo apt install -y docker.io docker-compose git-all
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
    systemctl stop apache2
    sudo systemctl disable apache2
    echo; echo "Cierre sesión y vuelva a entrar"; echo
}


#
# Función para descargar repositorios y poner en marcha los contenedores
#
function start_containers {
    # Descargar repositorios
    sudo rm -rf $HOME/Frontend-Web
    git clone https://github.com/UNIZAR-30226-2023-09/Frontend-Web.git

    sleep 2

    # Puesta en marcha de contenedores para la DB MYSQL y para el Backend NODE
    docker-compose up -d

    sleep 2

    # Configurar en el contenedor React
    docker exec -it frontend_react_psoft npm install
    docker exec -it frontend_react_psoft npm run build
    docker exec -it frontend_react_psoft npm install -g serve
    docker exec -d frontend_react_psoft serve -s build
}


#
# Función para finalizar los contentedores
#
function stop_containers {
    # Finalizar funcionamiento de contenedores
    docker-compose down
}


#
# Función para reiniciar los contentedores
#
function restart_containers {
    stop_containers
    sleep 2
    start_containers
}


#
# Función para ver si está activo el servidor React
#
function status_react {
  if pgrep -f "/usr/local/bin/serve -s build" > /dev/null; then
    echo "El servidor React está en ejecución"
  else
    echo "El servidor React no está en ejecución"
  fi
}


# Validar argumentos
if [ "$1" == "install" ]; then
  install_docker
elif [ "$1" == "start" ]; then
  start_containers
elif [ "$1" == "stop" ]; then
  stop_containers
elif [ "$1" == "restart" ]; then
  restart_containers
elif [ "$1" == "status" ]; then
  status_react
else
  # Argumento inválido
  echo "Argumento inválido. Usa 'install' o 'start' o 'stop' o 'restart' o 'status'."
  exit 1
fi

# Ver quien esta usando el puerto 80 (http)
# sudo lsof -i :80
# IP: 34.175.172.53