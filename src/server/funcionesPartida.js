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
        socket.send(`CREADA_OK,${id_partida}`);
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
            socket.send("UNIR_OK");
        }
        else { // TODO: ¿Motivo?
            socket.send("UNIR_NO_OK");
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
            socket.send("COMPRAR_NO_ON")
        }
        else { // Se ha comprado la propiedad, devolvemos el dinero resultante del jugador
            socket.send(`COMPRAR_OK, ${dinero}`);
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
            socket.send("VENDER_NO_ON")
        }
        else { // Se ha vendido la propiedad, devolvemos el dinero resultante del jugador
            socket.send(`VENDER_OK, ${dinero}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.VenderPropiedad = VenderPropiedad;