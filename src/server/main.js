/*
 -----------------------------------------------------------------------
 * Fichero: main.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero main de servidor Backend
 -----------------------------------------------------------------------
*/

const PUERTO = 8080 // Puerto a elegir

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: PUERTO });    

// Nueva conexion de cliente
server.on('connection', (socket) => {
    console.log('Cliente conectado');
    
    // Nuevo mensaje recibido
    socket.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);

        // Switch de diferentes mensajes recibidos
        if (message === 'Tirar_dados') {
            let tiradaDados = Math.floor(Math.random() % 6) + 1;
	        // enviar a la base de datos posicion jugador
            socket.send(`Has sacado un ${tiradaDados}`);
        }
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});
