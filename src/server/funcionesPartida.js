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


async function CrearPartida(socket, ID_jugador) {
    try {
        // Creamos la partida y guardamos su ID
        let id_partida = await API.crearPartida(ID_jugador);
        socket.send(`CREADAP_OK,${id_partida}`);
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.CrearPartida = CrearPartida;

async function UnirsePartida(socket, ID_jugador, ID_partida) {
    try {
        // Unimos al jugador a la partida 
        if (await API.unirPartida(ID_jugador, ID_partida)) {
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

async function ComprarPropiedad(socket, ID_jugador, propiedad) {
    try {
        let dinero = await API.comprarPropiedad(ID_jugador, propiedad);
        if (dinero == -1) { // No se ha podido comprar
            socket.send(`COMPRAR_NO_OK,${ID_jugador},${propiedad}`)
        }
        else { // Se ha comprado la propiedad, devolvemos el dinero resultante del jugador
            socket.send(`COMPRAR_OK, ${propiedad},${dinero}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.ComprarPropiedad = ComprarPropiedad;

async function VenderPropiedad(socket, ID_jugador, propiedad) {
    try {
        let dinero = await API.venderPropiedad(ID_jugador, propiedad);
        if (dinero == -1) { // No se ha podido vender
            socket.send(`VENDER_NO_OK,${ID_jugador},${propiedad}`)
        }
        else { // Se ha vendido la propiedad, devolvemos el dinero resultante del jugador
            socket.send(`VENDER_OK,${propiedad},${dinero}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.VenderPropiedad = VenderPropiedad;

async function CrearTorneo(socket, ID_jugador) {
    try {
        // Creamos el torneo y guardamos su ID
        let id_torneo = await API.crearTorneo(ID_jugador);
        socket.send(`CREADOT_OK,${id_torneo}`);
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.CrearTorneo = CrearTorneo;

async function UnirseTorneo(socket, ID_jugador, ID_Torneo) {
    try {
        // Unimos al jugador al torneo 
        if (await API.unirseTorneo(ID_jugador, ID_Torneo)) {
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