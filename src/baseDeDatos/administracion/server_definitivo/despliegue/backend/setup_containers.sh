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
#   - bash setup_containers.sh status:  Para consultar es estado del servidor node                        #
#   - bash setup_containers.sh clear:   Para eliminar los datos de la base de datos mysql                 #
#   - bash setup_containers.sh view:    Para ver la salida por pantalla de node                           #
#   - bash setup_containers.sh logs:    Para ver los logs de node                                         #
#                                                                                                         #
# Entrar en los contenedores:                                                                             #
#   - MYSQL: docker exec -it db_mysql_psoft bash                                                          #
#   - NODE: docker exec -it backend_node_psoft bash                                                       #
#                                                                                                         #
# Comprobar servicios:                                                                                    #
#   - MYSQL                                                                                               #
#      · cmd: docker exec -it db_mysql_psoft mysql -h db -u root -p      (pass: psbackend1234)            #
#   - NODE <-> MYSQL                                                                                      #
#      · cmd: docker exec -it backend_node_psoft node src/baseDeDatos/administracion/exec_remote_sql.js 'SHOW TABLES'
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
    echo; echo "Cierre sesión y vuelva a entrar"; echo
}


#
# Función para descargar repositorios y poner en marcha los contenedores
#
function start_containers {
    # Descargar repositorios
    sudo rm -rf $HOME/Backend
    git clone https://github.com/UNIZAR-30226-2023-09/Backend.git

    sleep 2

    # Puesta en marcha de contenedores para la DB MYSQL y para el Backend NODE
    docker-compose up -d

    sleep 2

    # Configurar en el contenedor Node
    docker exec -it backend_node_psoft npm install mysql ws
    docker exec -d backend_node_psoft sh -c 'node src/server/main.js > output.txt 2>&1'
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
# Función para ver si esta activo el servidor node (main.js)
#
function status_node {
    if pgrep -f "main.js" > /dev/null; then
        echo "El servidor node (main.js) está en ejecución"
    else
        echo "El servidor node (main.js) no está en ejecución"
    fi
}


#
# Función para eliminar la base de datos mysql
#
function clear_mysql {
    docker volume rm psoftserver_my-db
}


#
# Función para eliminar la base de datos mysql
#
function view_output {
    while true
    do
        clear
        docker exec -it backend_node_psoft cat output.txt
        sleep 0.5
        done
}


#
# Función para eliminar la base de datos mysql
#
function view_logs {
    docker exec -it backend_node_psoft cat logs.txt
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
    status_node
elif [ "$1" == "clear" ]; then
    clear_mysql
elif [ "$1" == "view" ]; then
    view_output
elif [ "$1" == "logs" ]; then
    view_logs
else
    # Argumento inválido
    echo "Argumento inválido. Usa 'install' o 'start' o 'stop' o 'restart' o 'status' o 'clear' o 'view' o logs."
    exit 1
fi

# IP: 34.175.149.140