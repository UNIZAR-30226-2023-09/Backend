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
const funcionesPartida = require('./funcionesPartida');
const funcionesJugador = require('./funcionesJugador');
const funcionesJuega = require('./funcionesJuega');

const PUERTO = 8080 // Puerto a elegir
const HOST = "127.0.0.1"

const WebSocket = require("ws");
const server = new WebSocket.Server({ host: HOST, port: PUERTO });

// Nueva conexion de cliente
server.on("connection", (socket) => {
    console.log("Cliente conectado");
    
    // Nuevo mensaje recibido
    socket.on("message", (message) => {
        console.log("Mensaje recibido: ${message}");
        /*if (message === "lanzarDados") {
            let tiradaDados1 = Math.floor(Math.random() % 6) + 1;
            let tiradaDados2 = Math.floor(Math.random() % 6) + 1;
            let sumaDados = tiradaDados1 + tiradaDados2;
	        // enviar a la base de datos posicion jugador
            socket.send("Has sacado un ${sumaDados}");
        }*/

        // Obtenemos el mensaje solicitado
        let mensaje = message.split(',');
        // TODO: Switch de diferentes mensajes recibidos
        // Si se quiere registrar
        if (mensaje[0] == "registrarse") {
            funcionesJugador.Registrarse(mensaje[1],mensaje[2],mensaje[3]);
        }

        // Si se quiere registrar
        if (mensaje[0] == "iniciarSesion") {
            funcionesJugador.IniciarSesion(mensaje[1],mensaje[2]);
        }

        // Si el mensaje es que se ha creado una partida
        if (mensaje[0] == "crearPartida") {
            funcionesPartida.CrearPartida(mensaje[1],mensaje[2]);
        }

        // Si el mensaje es que se ha unido a una partida
        if (mensaje == "unirsePartida") {
            funcionesPartida.UnirsePartida(mensaje[1],mensaje[2]);
        }

        // Si el mensaje es que se han lanzado los dados
        if (mensaje[0] === "lanzarDados") {
            funcionesJuega.LanzarDados(mensaje[1],mensaje[2]);
        }

    });

    socket.on("close", () => {
        console.log("Cliente desconectado");
    });
});
