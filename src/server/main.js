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
            funcionesPartida.CrearPartida(socket, mensaje[1]);
        }

        // Si el mensaje es que se ha unido a una partida
        if (mensaje == "unirsePartida") {
            // socket, ID_jugador, ID_partida
            funcionesPartida.UnirsePartida(socket, mensaje[1],mensaje[2]);
        }

        // Si el mensaje es que se han lanzado los dados
        if (mensaje[0] === "lanzarDados") {
            // socket, ID_jugador, ID_partida
            funcionesJuega.LanzarDados(socket, mensaje[1],mensaje[2]);
        }

        // En caso de que el jugador haya apostado
        if (mensaje[0] == "APOSTAR") {
            // socket, ID_jugador, ID_partida, cantidad
            funcionesJuega.Apostar(socket, mensaje[1],mensaje[2]);
        }

        // Si el mensaje es que se quiere comprar una propiedad
        if (mensaje[0] == "comprarPropiedad") {
            // Socket, jugador, propiedad
            funcionesPartida.ComprarPropiedad(socket, mensaje[1],mensaje[2]);
        }      

        // Si el mensaje es que se quiere vender una propiedad
        if (mensaje[0] == "venderPropiedad") {
            // Socket, jugador, propiedad
            funcionesPartida.VenderPropiedad(socket, mensaje[1],mensaje[2]);
        }   

        // Si el mensaje es que se quiere usar una carta
        if (mensaje[0] == "usarCarta") {
            
        }   

        // Si el mensaje es que se quiere acabar el turno
        if (mensaje[0] === "finTurno") {
            funcionesJuega.finTurno(socket, mensaje[1],mensaje[2]);
        }
        
        // Si el mensaje es que se quiere crear un torneo
        if (mensaje[0] == "crearTorneo") {
            // socket, ID_jugador
            funcionesPartida.CrearTorneo(socket, mensaje[1]);
        }   
        
        // Si el mensaje es que se quiere unir a un torneo
        if (mensaje[0] == "unirseTorneo") {
            // socket, ID_jugador, ID_Torneo
            funcionesPartida.UnirseTorneo(socket, mensaje[1],mensaje[2]);
        }   
        
        // Se solicita hacer un intercambio
        if (mensaje[0] == "intercambio") {
            
        }   
        
        // Se inicia una subasta
        if (mensaje[0] == "iniciarSubasta") {
            
        }   

        // Se quiere comprar una skin
        if (mensaje[0] == "comprarSkin") {
            
        }   

        // Se quiere ver las skins disponibles de un jugador
        if (mensaje[0] == "verSkins") {
            
        }   

    });

    socket.on("close", () => {
        console.log("Cliente desconectado");
    });
});
