/*
 ----------------------------------------------------------------------------
 * Fichero: funcionesPartidaTorneo.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes a la partida
 ----------------------------------------------------------------------------
*/

const con = require('./conexiones');
const APIpartida = require('../API/partidaAPI');
const APItorneo = require('../API/torneoAPI');
const bot = require('./bot');


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

    catch (error) {
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

    catch (error) {
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

    catch (error) {
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

    catch (error) {
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

            // Dado un ID_partida que devuelva los jugadores de la partida, si es un bot que devuelva 'bot' como el jugador
            // jugador1,jugador2,jugador3,jugador4
            let jugadores = await APIpartida.obtenerJugadoresPartida(ID_partida);
            console.log(jugadores);
            jugadores = jugadores + ",a2:1,a3:1,a4:1";
            console.log(jugadores);
            let jugadoresPartida = jugadores.split(",");
            let jugadores_struct = new Array(4);
            let aux;
            for (let i = 0; i < 4; i++) {
                aux = jugadoresPartida[i].split(":");
                jugadores_struct[i] = new Usuario(aux[0], aux[1]);
            }

            mostrarJugadores(jugadores_struct);

            // Ordenar aleatoriamente los jugadores de la partida
            // for (let i = jugadores_struct.length - 1; i > 0; i--) {
            //     const j = Math.floor(Math.random() * (i + 1)); // Seleccionamos un índice aleatorio
            //     [jugadores_struct[i], jugadores_struct[j]] = [jugadores_struct[j], jugadores_struct[i]]; // Intercambiamos las cadenas
            // }

            // TODO: Guardar en la base el orden de los jugadores funcion -> establecerOrdenPartida(ID_partida,jugadores_array[0], jugadores_array[1], jugadores_array[2], jugadores_array[3]);

            for (let i = 0; i < jugadores_struct.length; i++) {
                console.log('pp');
                // Si el jugador no es un bot
                if (jugadores_struct[i].esBot === "0") {
                    console.log('ppopo');
                    let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
                    if (conexionUsuario === null) {
                        console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
                        return;
                    }
                    conexionUsuario.send(`EMPEZAR_OK,${ID_partida},${jugadores_struct[0].id},${jugadores_struct[1].id},${jugadores_struct[2].id},${jugadores_struct[3].id}`);
                }
            }

            // Damos el turno al primer jugador
            if (jugadores_struct[0].esBot === 1) {
                bot.jugar(jugadores_struct[0].id, ID_partida);
            } else {
                con.mostrarUsuarios();
                let conexionUsuario = con.buscarUsuario(jugadores_struct[0].id);
                if (conexionUsuario === null) {
                    console.log('NO SE ENCUENTRA ESE USUARIO');
                    return;
                }
                conexionUsuario.send(`TURNO,${jugadores_struct[0].id},${ID_partida}`);
            }
        }
        else {
            socket.send(`EMPEZAR_NO_OK,${ID_partida}`);
        }
    }

    catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.EmpezarPartida = EmpezarPartida;

// Almacenar el usuario y si es un bot
function Usuario(id, esBot) {
    this.id = id;
    this.esBot = esBot;
}

function mostrarJugadores(jugadores_struct) {
    console.log("Jugadores de la partida:");
    for (let i = 0; i < jugadores_struct.length; i++) {
        console.log(`Jugador ${i + 1}: ${jugadores_struct[i].id} (${jugadores_struct[i].esBot})`);
    }
}

