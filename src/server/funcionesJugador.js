/*
 ---------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al jugador
 ---------------------------------------------------------------------------
*/

function Registrarse(email, contrasenya, nombre) {
    // Llamar a la función de la api correspondiente para el registro
    // TODO: Ver si se llama así o como
    // Si se ha registrado correctamente
    if (registrarJugador(email,contrasenya,nombre)) {
        socket.send("Registro correcto");
    }
    else {
        // TODO: Habría que ver como mirar el motivo de por qué ha ido mal el registro
        socket.send("Registro incorrecto");
    }
}
exports.Registrarse = Registrarse;

function IniciarSesion(email, contrasenya) {
    // Llamar a la función de la api correspondiente para comprobar inicio de sesión
    // Obtenemos el valor devuelto por la función (el num de gemas de ese usuario)
    let gemas = comprobarInicioSesion(email, contrasenya);
    // Si ha iniciado sesión correctamente
    if ( gemas >= 0) {
        // Comprobams si está en una partida existente
        let id_partida = jugadorEnPartida(email);
        // Está en una partida
        if (id_partida >= 0) {
            // TODO: Ver como devuelven los datos de la partida y mandárselos al cliente
            obtenerDatosPartida(id_partida);
            // Mandar los datos de la partida para mostrarlos
        }
        else {
            socket.send(`El usuario tiene ${gemas} gemas`);
        }
    }
    else {
        socket.send(`Inicio de sesion incorrecto`);
    }
}
exports.IniciarSesion = IniciarSesion;
