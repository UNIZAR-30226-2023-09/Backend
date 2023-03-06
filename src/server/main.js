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
// const funcionesPartida = require('./funcionesPartida');
// const funcionesJugador = require('./funcionesJugador');
// const funcionesJuega = require('./funcionesJuega');

const PUERTO = 8080 // Puerto a elegir

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: PUERTO });    

// Nueva conexion de cliente
server.on("connection", (socket) => {
    console.log("Cliente conectado");
    
    // Nuevo mensaje recibido
    socket.on("message", (message) => {
        console.log(`Mensaje recibido: ${message}`);

        // // Obtenemos el mensaje solicitado
        // let mensaje = message.split(',');
        // // TODO: Switch de diferentes mensajes recibidos
        // // Si se quiere registrar
        if (message == "hola") {
            socket.send("buenas");
        }

        // // Si se quiere registrar
        // if (mensaje[0] == "iniciarSesion") {
        //     funcionesJugador.IniciarSesion(mensaje[1],mensaje[2]);
        // }

        // // Si el mensaje es que se ha creado una partida
        // if (mensaje[0] == "crearPartida") {
        //     funcionesPartida.CrearPartida(mensaje[1],mensaje[2]);
        // }

        // // Si el mensaje es que se ha unido a una partida
        // if (mensaje == "unirsePartida") {
        //     funcionesPartida.UnirsePartida(mensaje[1],mensaje[2]);
        // }

        // // Si el mensaje es que se han lanzado los dados
        // if (mensaje[0] === "lanzarDados") {
        //     funcionesJuega.LanzarDados(mensaje[1],mensaje[2]);
        // }

        // // Si el mensaje es que se quiere acabar el turno
        // if (mensaje[0] === "finTurno") {
        //     funcionesJuega.finTurno(mensaje[1],mensaje[2]);
        // }

    });

    socket.on("close", () => {
        console.log("Cliente desconectado");
    });
});
