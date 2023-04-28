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
            let info = API.obtenerInformacionJugador(ID_jugador);
            let aux = info.split(",");
            let gemas = aux[1];
            socket.send(`SKIN_COMPRADA_OK,${ID_jugador},${gemas}`);
        }
        else {
            socket.send(`SKIN_COMPRADA_NOOK,${ID_jugador},${skin}`);
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
    console.log("VerSkins");
    let listadoSkins = await API.obtenerSkinsJugador(ID_jugador);
    escribirEnArchivo(`El jugador ${ID_jugador} ha solicitado ver la tienda.`);
    socket.send(`LISTA_SKIN,${listadoSkins}`);
}
exports.VerSkins = VerSkins;

// Escribe en el archivo logs.txt el mensaje que se le pasa.
function escribirEnArchivo(datos) {
    // Obtener la fecha y hora actual en la zona horaria de España
    const fechaActual = new Date();
    fechaActual.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

    // Añadir al archivo logs.txt el mensaje que se le pasa junto al día y la hora actual en España
    datos = fechaActual.toLocaleString() + datos + " " + "\n";

    // Escribir datos al final del archivo logs.txt
    fs.appendFile("logs.txt", datos, (error) => {
        if (error) {
            console.error(`Error al escribir en el archivo logs.txt: ${error}`);
        }
    });
}