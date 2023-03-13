/*
 -----------------------------------------------------------------------
 * Fichero: main.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero main de servidor Backend
 -----------------------------------------------------------------------
*/

/* TODO: HACER IMPORTS
 *       CONFIGURAR EL SEND
*/
const funcionesPartidaTorneo = require('./funcionesPartidaTorneo');
const funcionesJugador = require('./funcionesJugador');
const funcionesTablero = require('./funcionesTablero');

const PUERTO = 8080 // Puerto a elegir

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: PUERTO });    

// Nueva conexion de cliente
server.on("connection", (socket) => {
    console.log("Cliente conectado");
    
    // Nuevo mensaje recibido
    socket.on("message", (message) => {
        console.log(`Mensaje recibido: ${message}`);

        let mensaje = "";
        // Obtenemos el mensaje solicitado comprobando si contiene una coma
        // para dividirlo o no.
        if (message.includes(",")) {
            mensaje = message.toString().split(",");
        }
        else {
            mensaje = [message];
        }
        
        // TODO: HACER TODOS LOS MENSAJES RECIBIDOS EN OTROS FICHEROS

        // Si se quiere registrar
        if (mensaje[0] == "registrarse") {
            // socket, email, contrasenya, nombre
            funcionesJugador.Registrarse(socket, mensaje[1],mensaje[2],mensaje[3]);
        }

        // Si se quiere iniciar sesión
        if (mensaje[0] == "iniciarSesion") {
            // socket, email, contrasenya
            funcionesJugador.IniciarSesion(socket, mensaje[1],mensaje[2]);
        }

        // Si el mensaje es que se ha creado una partida
        if (mensaje[0] == "crearPartida") {
            // socket, ID_jugador
            funcionesPartidaTorneo.CrearPartida(socket, mensaje[1]);
        }

        // Si el mensaje es que se ha unido a una partida
        if (mensaje == "unirsePartida") {
            // socket, ID_jugador, ID_partida
            funcionesPartidaTorneo.UnirsePartida(socket, mensaje[1],mensaje[2]);
        }

        // Si el mensaje es que se han lanzado los dados
        if (mensaje[0] === "lanzarDados") {
            // socket, ID_jugador, ID_partida
            funcionesTablero.LanzarDados(socket, mensaje[1],mensaje[2]);
        }

        // En caso de que el jugador haya apostado
        if (mensaje[0] == "APOSTAR") {
            // socket, ID_jugador, ID_partida, cantidad
            funcionesTablero.Apostar(socket, mensaje[1],mensaje[2]);
        }

        // En caso de caer en la casilla del banco, realizar la acción oportuna
        //METER/SACAR,ID_jugador,ID_partida,cantidad
        if (mensaje[0] == "METER") {
            funcionesTablero.MeterBanco(socket, mensaje[1], mensaje[2], mensaje[3]);
        }

        if (mensaje[0] == "SACAR") {
            funcionesTablero.SacarBanco(socket, mensaje[1], mensaje[2], mensaje[3]);
        }

        // Si el mensaje es que se quiere comprar una propiedad
        if (mensaje[0] == "SI_COMPRAR_PROPIEDAD") {
            // Socket, ID_jugador,propiedad,ID_partida
            funcionesTablero.ComprarPropiedad(socket, mensaje[1], mensaje[2], mensaje[3]);
        }      

        // Si el mensaje es que no se quiere comprar una propiedad -> no hacer nada y pasar turno
        if (mensaje[0] == "NO_COMPRAR_PROPIEDAD") {
            // No hacer nada
            // TODO:
        }      

        // Si el mensaje es que se quiere vender una propiedad
        if (mensaje[0] == "venderPropiedad") {
            // Socket, jugador, propiedad
            funcionesTablero.VenderPropiedad(socket, mensaje[1], mensaje[2]);
        }   

        // Cuando se quiere edificar
        if (mensaje[0] == "QUIERO_EDIFICAR") {
            // socket,ID_jugador,ID_partida
            funcionesTablero.PropiedadesDispEdificar(socket, mensaje[1], mensaje[2])
        }

        // Nos dicen la propiedad a edificar
        if (mensaje[0] == "EDIFICAR") {
            // socket,ID_jugador,ID_partida,propiedad-precio
            funcionesTablero.EdificarPropiedad(socket, mensaje[1], mensaje[2], mensaje[3])
        }

        // Si el mensaje es que se quiere usar una carta
        if (mensaje[0] == "usarCarta") {
            // TODO:
        }   

        // Si el mensaje es que se quiere acabar el turno
        if (mensaje[0] === "finTurno") {
            // TODO: MIRAR ESTA 
            // Función de la API que diga si el siguiente jugador es un bot o no
            //      Si no es un bot devuelve el correo del jugador que le toca
            //      Si es un bot, que devuelva bot@bot.com
            // Comprobar si es fin de ronda para lo de los eventos, para actualizar saldos bancos
            //                      actualizar economía
            // Si es un jugador mando: TURNO,ID_jugador,ID_partida
            funcionesTablero.finTurno(socket, mensaje[1],mensaje[2]);
        }
        
        // Si el mensaje es que se quiere crear un torneo
        if (mensaje[0] == "crearTorneo") {
            // socket, ID_jugador
            funcionesPartidaTorneo.CrearTorneo(socket, mensaje[1]);
        }   
        
        // Si el mensaje es que se quiere unir a un torneo
        if (mensaje[0] == "unirseTorneo") {
            // socket, ID_jugador, ID_Torneo
            funcionesPartidaTorneo.UnirseTorneo(socket, mensaje[1],mensaje[2]);
        }   
        
        // Se solicita hacer un intercambio
        if (mensaje[0] == "intercambio") {
            // TODO:
        }   
        
        // Se inicia una subasta
        if (mensaje[0] == "iniciarSubasta") {
            // TODO:
        }   

        // Se quiere comprar una skin
        if (mensaje[0] == "comprarSkin") {
            // TODO:
        }   

        // Se quiere ver las skins disponibles de un jugador
        if (mensaje[0] == "verSkins") {
            // TODO:
        }   

    });

    socket.on("close", () => {
        console.log("Cliente desconectado");
    });
});
