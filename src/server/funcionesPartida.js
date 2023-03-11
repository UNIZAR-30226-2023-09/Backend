/*
 ----------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes a la partida
 ----------------------------------------------------------------------------
*/

const con = require('../API/db');
const API = require('../API/funcionesAPI');


async function CrearPartida(ID_jugador, numJugadores) {
    try {
        // Creamos la partida y guardamos su ID
        let id_partida = await API.crearPartida(numJugadores);
        socket.send(`Partida creada con ID: ${id_partida}`);
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.CrearPartida = CrearPartida;

async function UnirsePartida(ID_partida, ID_jugador) {
    try {
        // Unimos al jugador a la partida 
        if (await API.unirPartida(ID_jugador, ID_partida)) {
            socket.send("Jugador unido correctamente a la partida");
        }
        else { // TODO: ¿Motivo?
            socket.send("Jugador no unido correctamente");
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.UnirsePartida = UnirsePartida;
