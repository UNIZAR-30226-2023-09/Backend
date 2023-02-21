/*
 ----------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al juego
 ----------------------------------------------------------------------------
*/

function LanzarDados(ID_jugador, ID_partida) {
    // Calculamos el valor de los dados
    let dado1 = Math.floor(Math.random() % 6) + 1;
    let dado2 = Math.floor(Math.random() % 6) + 1;
    let sumaDados = dado1 + dado2;
    // Movemos al jugador -> obtenemos su nueva casilla
    let posicionNueva = moverJugador(ID_jugador, sumaDados);
    // En función de la nueva casilla -> miramos que hacer
    /* Posibles casos al caer en una casilla:
     *    - Casilla de la cárcel -> ir a la caŕcel
     *    - Casilla de propiedad -> si es de otro jugador -> pagar
     *                           -> si no es de nadie -> mostrar posibilidad de comprarla
     *                           -> si es del propio jugador -> no hacer nada
     *    - Casilla de salida    -> Sumar 300$ al dinero al dinero del jugador (posicionNueva == casillaSalida)
     *    - Ha pasado por casilla de salida -> Sumar 200$ al dinero del jugador (posicionNueva - sumaDados <= 0)
     *    - Casilla de bote      -> sumarle el dinero del juego
     */

    // Comprobar si la nueva posición corresponde a la casilla de la cárcel
    if (comprobarCasillaCarcel(posicionNueva)) {
        socket.send(`El dado 1 es: ${dado1}`);
        socket.send("El dado 2 es: ${dado2}");
        enviarCarcel(jugador);
        // TODO: Definir la casilla de la carcel
        // posicionNueva = $casillaCarcel;
    }
    // Enviar la nueva posición del jugador y el valor de los dados
    socket.send("El dado 1 es: ${dado1}");
    socket.send("El dado 2 es: ${dado2}");
    socket.send("La nueva posicion es: ${posicionNueva}");
}
exports.LanzarDados = LanzarDados;
