/*
 ---------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al jugador
 ---------------------------------------------------------------------------
*/

const con = require('../API/db');
const API = require('../API/jugadorAPI');
const APIpartida = require('../API/partidaAPI');
const conexion = require('./conexiones');
const bot = require('./bot')

// Registra al jugador dado si es posible
async function Registrarse(socket, email, contrasenya, nombre) {
    try {
        // Si se ha registrado correctamente
        let insert = nombre + "," + contrasenya + "," + email + "," + 0;
        if (await API.insertarUsuario(insert)) {
            socket.send("REGISTRO_OK");
        }
        else {
            // TODO: Habría que ver como mirar el motivo de por qué ha ido mal el registro
            socket.send("REGISTRO_NO_OK");
        }

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.Registrarse = Registrarse;

// Inicia sesión del jugador dado si es posible
async function IniciarSesion(socket, email, contrasenya) {
    try {
        // Llamar a la función de la api correspondiente para comprobar inicio de sesión
        // Obtenemos el valor devuelto por la función (el num de gemas de ese usuario)
        let gemas = await API.comprobarInicioSesion(email, contrasenya);
        // Si ha iniciado sesión correctamente
        if (gemas >= 0) {
            conexion.agregarUsuario(socket, email);
            // Comprobams si está en una partida existente
            let id_partida = await APIpartida.jugadorEnPartida(email);
            // Está en una partida
            if (id_partida >= 0) {
                // TODO: Ver como devuelven los datos de la partida y mandárselos al cliente
                //let datosPartida = await API.obtenerDatosPartida(id_partida);
                // Mandar los datos de la partida para mostrarlos
                //socket.send();

                // TODO: temporal, hay que modificarlo

            }
            socket.send(`INICIO_OK,${email},${gemas}`);
        }
        else {
            socket.send(`INICIO_NO_OK`);
        }

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.IniciarSesion = IniciarSesion;

async function FinTurno(ID_jugador, ID_partida) {
    // TODO: Comprobar si es fin de ronda para lo de los eventos, para actualizar saldos bancos                 actualizar economía
    // Si es un jugador mando: TURNO,ID_jugador,ID_partida

    // Llamar a la función de la api para obtener el siguiente jugador
    let siguienteJugador = await API.obtenerSiguienteJugador(ID_jugador, ID_partida);
    let resultado = siguienteJugador.split(",");
    let resultado2 = resultado.split(":");
    let jugador = resultado2[0];
    let esBot = resultado2[1];
    let finRonda = resultado[1];
    // Si le toca a un bot
    if (esBot == "1") {
        bot.Jugar(jugador, ID_partida);
    }
    else {   // Es un jugador
        // Buscar jugadores en el pool 
        let conexionUsuario = con.buscarUsuario(siguienteJugador);
        conexionUsuario.send(`TURNO,${siguienteJugador},${ID_partida}`);
    }
    // TODO: Enviar a los demas jugadores la info de que ha cambiado en mi estado(dinero, posicion, propiedades, etc)

    // Comprobar si es fin de ronda y realizar lo oportuno con esta
    if (finRonda == 1) {
        // TODO: Hacer lo necesario con los eventos, actualizar saldos de los bancos, economía
    }
}
exports.FinTurno = FinTurno;
