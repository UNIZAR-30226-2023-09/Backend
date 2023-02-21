/*
 ----------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes a la partida
 ----------------------------------------------------------------------------
*/

function CrearPartida(ID_jugador, numJugadores) {
    // Creamos la partida y guardamos su ID
    let id_partida = crearPartida(numJugadores);
    socket.send("Partida creada con ID: ${id_partida}");
}

function UnirsePartida(ID_partida, ID_jugador) {
    // Unimos al jugador a la partida 
    if (unirPartida(ID_jugador, ID_partida)) {
        socket.send("Jugador unido correctamente a la partida");
    }
    else { // TODO: ¿Motivo?
        socket.send("Jugador no unido correctamente");
    }
}
