/*
 -----------------------------------------------------------------------
 * Fichero: main.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero main de servidor Backend
 -----------------------------------------------------------------------
*/

const funcionesPartidaTorneo = require('./funcionesPartidaTorneo');
const funcionesJugador = require('./funcionesJugador');
const funcionesTablero = require('./funcionesTablero');
const funcionesSkin = require('./funcionesSkin');

const conexion = require('./conexiones');


const PUERTO = 8080 // Puerto a elegir

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: PUERTO });

// Cuando se lance el servidor que notifique que esta activo
server.on('listening', () => {
    console.log(`Servidor activo y escuchando en el puerto ${PUERTO}`);
});

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
            funcionesJugador.Registrarse(socket, mensaje[1], mensaje[2], mensaje[3]);
        }

        // Si se quiere iniciar sesión
        if (mensaje[0] == "iniciarSesion") {
            // socket, email, contrasenya
            funcionesJugador.IniciarSesion(socket, mensaje[1], mensaje[2]);
        }

        // Si el mensaje es que se ha creado una partida
        if (mensaje[0] == "crearPartida") {
            // socket, ID_jugador
            funcionesPartidaTorneo.CrearPartida(socket, mensaje[1]);
        }

        // Si el mensaje es que se ha unido a una partida
        if (mensaje[0] == "unirsePartida") {
            // socket, ID_jugador, ID_partida
            funcionesPartidaTorneo.UnirsePartida(socket, mensaje[1], mensaje[2]);
        }


        if (mensaje[0] == "empezarPartida") {
            // socket, ID_Partida, ID_Lider
            funcionesPartidaTorneo.EmpezarPartida(socket, mensaje[1], mensaje[2]);
        }

        // Si el mensaje es que se han lanzado los dados
        if (mensaje[0] === "lanzarDados") {
            // socket, ID_jugador, ID_partida
            funcionesTablero.LanzarDados(socket, mensaje[1], mensaje[2]);
        }

        // Si el mensaje es que se han lanzado los dados
        if (mensaje[0] === "lanzarDados2") {
            // Mandar dinero actual a todos (lo mismo que iria al fin del turno)
            // TODO:
            // Y volvemos a mirar la función de lanzarDados
            funcionesTablero.LanzarDados(socket, mensaje[1], mensaje[2]);
        }

        // En caso de que el jugador haya apostado
        if (mensaje[0] == "APOSTAR") {
            // socket, ID_jugador, ID_partida, cantidad
            funcionesTablero.Apostar(socket, mensaje[1], mensaje[2]);
        }

        // En caso de caer en la casilla del banco, realizar la acción oportuna si se desea
        //METER/SACAR, ID_jugador, ID_partida, cantidad
        if (mensaje[0] == "METER") {
            funcionesTablero.MeterBanco(socket, mensaje[1], mensaje[2], mensaje[3]);
        }
        if (mensaje[0] == "SACAR") {
            funcionesTablero.SacarBanco(socket, mensaje[1], mensaje[2], mensaje[3]);
        }

        // Si el mensaje es que se quiere comprar una propiedad
        if (mensaje[0] == "SI_COMPRAR_PROPIEDAD") {
            // Socket, ID_jugador,propiedad,ID_partida
            // TODO: Que me pase el numero de la propiedad
            funcionesTablero.ComprarPropiedad(socket, mensaje[1], mensaje[2], mensaje[3]);
        }

        // Si el mensaje es que no se quiere comprar una propiedad -> no hacer nada y pasar turno
        if (mensaje[0] == "NO_COMPRAR_PROPIEDAD") {
            // No hacer nada
            // TODO:
        }

        // Si el mensaje es que se quiere vender una propiedad
        if (mensaje[0] == "venderPropiedad") {
            // Socket, jugador, propiedad, ID_Partida
            funcionesTablero.VenderPropiedad(socket, mensaje[1], mensaje[2], mensaje[3]);
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
            //      Si es un bot, que devuelva TurnoBot
            // Comprobar si es fin de ronda para lo de los eventos, para actualizar saldos bancos
            //                      actualizar economía
            // Si es un jugador mando: TURNO,ID_jugador,ID_partida
            // socket, ID_jugador, ID_partida
            funcionesJugador.FinTurno(mensaje[1], mensaje[2]);
        }

        // Si el mensaje es que se quiere crear un torneo
        if (mensaje[0] == "crearTorneo") {
            // socket, ID_jugador
            funcionesPartidaTorneo.CrearTorneo(socket, mensaje[1]);
        }

        // Si el mensaje es que se quiere unir a un torneo
        if (mensaje[0] == "unirseTorneo") {
            // socket, ID_jugador, ID_Torneo
            funcionesPartidaTorneo.UnirseTorneo(socket, mensaje[1], mensaje[2]);
        }

        /*------------------------------------------------------*/
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
            // socket, ID_jugador, skin
            funcionesSkin.ComprarSkin(socket, mensaje[1], mensaje[2]);
        }

        // Se quiere ver las skins disponibles para comprar
        // Es decir, cuando se pulsa para ir a tienda
        if (mensaje[0] == "verSkins") {
            // TODO:
            // socket, ID_jugador
            funcionesSkin.VerSkins(socket, mensaje[1]);
        }

    });

    socket.on("close", () => {
        console.log("Cliente desconectado");
        conexion.desconexionUsuario(socket);
    });

});
