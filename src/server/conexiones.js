/*
 ---------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones que permiten gestionar la conexion con websockets
 ---------------------------------------------------------------------------
*/

const APIpartida = require('../API/partidaAPI');
const TIMEOUT = 60000; // 1 minuto

// Creamos un array vacío para almacenar las conexiones de los usuarios
const connections = [];

// Creamos un objeto vacío para asociar el nombre de usuario con su posición en el array de conexiones
const usuarios = {};

function agregarUsuario(socket, nombreUsuario) {
    console.log('Nuevo usuario:', nombreUsuario);

    // Si el usuario ya existe, actualizamos su socket y ponemos timeout a null
    if (usuarios[nombreUsuario] !== undefined) {
        connections[usuarios[nombreUsuario]].socket = socket;
        desactivarTimer(nombreUsuario);
        connections[usuarios[nombreUsuario]].timeoutId = null;
        console.log('Usuario actualizado:', nombreUsuario);
        return;
    }

    // Creamos un objeto para almacenar la información del usuario
    const usuario = { name: nombreUsuario, socket, timeoutId: null };

    // Agregamos la conexión del usuario al array de conexiones
    connections.push(usuario);

    // Asociamos el nombre de usuario con la posición en el array de conexiones
    usuarios[nombreUsuario] = connections.indexOf(usuario);

}

function eliminarUsuario(nombreUsuario) {
    console.log('Usuario desconectado:', nombreUsuario);

    // Obtenemos la conexión del usuario a partir del nombre de usuario
    const usuario = usuarios[nombreUsuario];
    if (!usuario) return; // Si no encontramos al usuario, salimos de la función

    // Eliminamos la conexión del usuario del array de conexiones
    const index = connections.indexOf(usuario.socket);
    if (index !== -1) connections.splice(index, 1);

    // Eliminamos al usuario del diccionario de usuarios
    delete usuarios[nombreUsuario];
}


// Devuelve la conexion asociada al usuario
function buscarUsuario(IDusuario) {
    const index = usuarios[IDusuario];
    if (index !== undefined) {
        console.log('Se ha encontrado al usuario:', IDusuario);
        return connections[index].socket;
    }
    return null;
}

// Devuelve el ID de usuario asociado a la conexión
function buscarConexion(socket) {
    const index = connections.findIndex(conn => conn.socket === socket);
    if (index !== -1) {
        return connections[index].usuario;
    }
    return null;
}


// ***** Apartado que gestiona las desconexiones *****

// Gestiona la descionexion de un usuario: En caso de estar en partida dispone
// de un minuto para volver a conectarse, sino se le sustituye por un bot.
async function desconexionUsuario(socket) {
    let IDusuario = buscarConexion(socket);
    if (IDusuario === null) {
        // No existe el usuario
        console.log('No se ha encontrado al usuario');
        return null
    } else {
        try {
            // Comprobar si el usuario esta jugando una partida
            let enPartida = await APIpartida.jugadorEnPartida(IDusuario);
            if (enPartida !== -1) {
                const index = usuarios[IDusuario];
                conecctions[index].timeoutId = setTimeout(() => {
                    sustituirJugadorPorBot(IDusuario, enPartida);
                }, TIMEOUT); // 10 minutos en milisegundos
            }
        } catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
        }
    }
}

// Dado un usuario desactiva su timer de desconexion
function desactivarTimer(IDusuario) {
    console.log('Desactivando el timer de:', IDusuario);
    const index = usuarios[IDusuario];
    if (index !== undefined) {
        clearTimeout(connections[index].timeoutId);
    }
}

// Funcion que sustituye a un jugador por un bot
async function sustituirJugadorPorBot(IDusuario, IDPartida) {
    console.log('Sustituyendo a ', IDusuario, ' por un bot en la partida ', IDPartida);
    try {
        APIpartida.sustituirJugadorPorBot(IDusuario, IDPartida);
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
    }
}

// Creamos un objeto para almacenar todas las funciones que queremos exportar
const funciones = {
    agregarUsuario,
    eliminarUsuario,
    buscarUsuario,
    buscarConexion,
    desconexionUsuario
};

// Exportamos el objeto que contiene las funciones
module.exports = funciones;