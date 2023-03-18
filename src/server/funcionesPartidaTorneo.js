/*
 ----------------------------------------------------------------------------
 * Fichero: funcionesPartidaTorneo.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes a la partida
 ----------------------------------------------------------------------------
*/

const con = require('../API/db');
const APIpartida = require('../API/partidaAPI');
const APItorneo = require('../API/torneoAPI');


// El jugador dado crea una partida
async function CrearPartida(socket, ID_jugador) {
    try {
        // Creamos la partida y guardamos su ID
        let id_partida = await APIpartida.crearPartida(ID_jugador);
        if (id_partida == -1) {
            socket.send(`CREADAP_NOOK,${ID_jugador}`);
        }
        else {
            socket.send(`CREADAP_OK,${id_partida}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.CrearPartida = CrearPartida;

// Unir al jugador dado a la partida solicitada
async function UnirsePartida(socket, ID_jugador, ID_partida) {
    try {
        // Unimos al jugador a la partida 
        if (await APIpartida.unirsePartida(ID_jugador, ID_partida)) {
            socket.send(`UNIRP_OK,${ID_partida},${ID_jugador}`);
        }
        else { // TODO: ¿Motivo?
            socket.send(`UNIRP_NO_OK,${ID_partida},${ID_jugador}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.UnirsePartida = UnirsePartida;

// El jugador dado crea un nuevo torneo
async function CrearTorneo(socket, ID_jugador) {
    try {
        // Creamos el torneo y guardamos su ID
        let id_torneo = await APItorneo.crearTorneo(ID_jugador);
        if (id_torneo == -1) {
            socket.send(`CREADOT_NOOK,${ID_jugador}`);
        }
        else {
            socket.send(`CREADOT_OK,${id_torneo}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.CrearTorneo = CrearTorneo;

// Unir al jugador dado al torneo solicitado
async function UnirseTorneo(socket, ID_jugador, ID_Torneo) {
    try {
        // Unimos al jugador al torneo 
        if (await APItorneo.unirseTorneo(ID_jugador, ID_Torneo)) {
            socket.send(`UNIRSET_OK,${ID_Torneo},${ID_jugador}`);
        }
        else { // TODO: ¿Motivo?
            socket.send(`UNIRSET_NO_OK,${ID_Torneo},${ID_jugador}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.UnirseTorneo = UnirseTorneo;

async function EmpezarPartida(socket, ID_partida, ID_jugador) {
    try {
        // Empezamos la partida 
        if (await APIpartida.empezarPartida(ID_partida, ID_jugador)) {
            // TODO: Mandar al jugador que le toca empezar que es su turno 
            // Establecer orden de jugadores (funcion API para obtener jugadores de la partida)
            // Guardar en la base el orden de jugadores(funcion API que le pases el idPartida y el orden d los 4 jugadores)
            // Estos IDs se obtienen de funcion API
            let idJugador1 = "1";
            let idJugador2 = "2";
            let idJugador3 = "3";
            let idJugador4 = "4";

            const ordenJugadores = [idJugador1, idJugador2, idJugador3, idJugador4]; // Colocamos las cadenas en un array
            for (let i = ordenJugadores.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // Seleccionamos un índice aleatorio
                [ordenJugadores[i], ordenJugadores[j]] = [ordenJugadores[j], ordenJugadores[i]]; // Intercambiamos las cadenas
            }            

            socket.send(`EMPEZAR_OK,${ID_partida},${ordenJugadores[0]},${ordenJugadores[1]},${ordenJugadores[2]},${ordenJugadores[3]}`);
        }
        else { // TODO: ¿Motivo?
            socket.send(`EMPEZAR_NO_OK,${ID_partida}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false; 
    }
}
exports.EmpezarPartida = EmpezarPartida;
