/*
 ---------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al jugador
 ---------------------------------------------------------------------------
*/

const con = require('../API/db');
const API = require('../API/funcionesAPI');


async function Registrarse(socket, email, contrasenya, nombre) {
    try {
        // Si se ha registrado correctamente
        let insert = nombre + "," + contrasenya + "," + email + "," + 0;
        if (await API.insertarUsuario(insert)) {
            socket.send("Registro correcto");
        }
        else {
            // TODO: Habría que ver como mirar el motivo de por qué ha ido mal el registro
            socket.send("Registro incorrecto");
        }
        
      } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
      }
}
exports.Registrarse = Registrarse;


async function IniciarSesion(email, contrasenya) {
    try {
        // Llamar a la función de la api correspondiente para comprobar inicio de sesión
        // Obtenemos el valor devuelto por la función (el num de gemas de ese usuario)
        let gemas = await API.comprobarInicioSesion(email, contrasenya);
        // Si ha iniciado sesión correctamente
        if ( gemas >= 0) {
            // Comprobams si está en una partida existente
            let id_partida = await API.jugadorEnPartida(email);
            // Está en una partida
            if (id_partida >= 0) {
                // TODO: Ver como devuelven los datos de la partida y mandárselos al cliente
                await API.obtenerDatosPartida(id_partida);
                // Mandar los datos de la partida para mostrarlos
            }
            else {
                socket.send(`El usuario tiene ${gemas} gemas`);
            }
        }
        else {
            socket.send(`Inicio de sesion incorrecto`);
        }

    } catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.IniciarSesion = IniciarSesion;
