/*
 ----------------------------------------------------------------------------
 * Fichero: skin.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes a las skins
 ----------------------------------------------------------------------------
*/

const con = require('./conexiones');
const API = require('../API/skins');
const bot = require('./bot');

// El jugador dado compra la skin dada
async function ComprarSkin(socket, ID_jugador, skin) {
    try {
        // Compramos la skin
        if (await API.comprarSkin(ID_jugador, skin)) {
            // TODO: obtener las nuevas gemas del jugador y mandarlas 
            //let gemas = API.obtenerGemas(ID_jugador);
            // socket.send(`COMPRADA_OK,${ID_jugador},${gemas}`);
        }
        else {
            // socket.send(`COMPRADA_NOOK,${ID_jugador},${skin}`);
        }
    }

    catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.ComprarSkin = ComprarSkin;

// El jugador dado solicita ver la tienda
async function VerSkins(socket, ID_jugador) {
    // Devuelve el listado de skins con id.Precio que estan en el sistema
    let listadoSkins = await obtenerListadoSkins();
    // socket.send(`LISTA_SKIN,${ID_jugador},{listadoSkins}`);
}
exports.VerSkins = VerSkins;
