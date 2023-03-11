/*
 ----------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al juego
 ----------------------------------------------------------------------------
*/

const con = require('../API/db');
const API = require('../API/funcionesAPI');

async function LanzarDados(socket, ID_jugador, ID_partida) {
    try {
        // Calculamos el valor de los dados
        let dado1 = Math.floor(Math.random() % 6) + 1;
        let dado2 = Math.floor(Math.random() % 6) + 1;
        let sumaDados = dado1 + dado2;
        // Movemos al jugador -> obtenemos su nueva casilla
        let posicionNueva = await API.moverJugador(ID_jugador, sumaDados);
        // En función de la nueva casilla -> miramos que hacer
        /* Posibles casos al caer en una casilla:
        *    - Casilla de salida    -> Sumar 300$ al dinero al dinero del jugador (posicionNueva == casillaSalida)
        *    - Pasa casilla salida  -> Sumar 200$ al dinero del jugador (posicionNueva - sumaDados <= 0)
        *    - Casilla de la cárcel -> ir a la caŕcel
        *    - Casilla de propiedad -> si es de otro jugador -> pagar
        *                           -> si no es de nadie -> mostrar posibilidad de comprarla
        *                           -> si es del propio jugador -> no hacer nada
        *    - Casilla de bote      -> sumarle el dinero del juego
        *    - Casilla treasure     -> sumarle al jugador el dinero o restarselo y sumarselo al banco
        *    - Casilla Superpoder   -> obtener carta
        *    - Casilla del banco    -> dar opcion de poder meter dinero para generar intereses cada ronda
        *                           -> dar la opción de retirar el dinero en caso de que hubiera
        *    - Casilla de casino    -> Dar la opcion de si quiere jugar 
        *                           -> si quiere jugar num random para ganar/perder en funcion del dinero que meta
        */

        // Comprobar si ha pasado por la casilla de salida en este turno
        if ((posicionNueva - sumaDados) <= 0) {
            // Si ha pasado, le sumamos 200$ al jugador
            await API.modificarDinero(ID_jugador, 200);
        }

        // Comprobar la casilla y realizar la acción oportuna
        await API.comprobarCasilla(posicionNueva, ID_jugador);

        // Enviar la nueva posición del jugador y el valor de los dados
        socket.send(`El dado 1 es: ${dado1}`);
        socket.send(`El dado 2 es: ${dado2}`);
        socket.send(`La nueva posicion es: ${posicionNueva}`);
    }
    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }

}
exports.LanzarDados = LanzarDados;


async function comprobarCasilla(posicion, ID_jugador) {
    let tablero = ["Salida","Monterrey","Guadalajara","Treasure","Tax","AeropuertoNarita",
        "Tokio","Kioto","Superpoder","Osaka","Carcel","Roma","Milan","Casino","Napoles",
        "Estacion","Londres","Superpoder","Manchester","Edimburgo","Bote","Madrid",
        "Barcelona","Treasure","Zaragoza","AeropuertoOrly","Paris","Banco","Marsella",
        "Lyon","IrCarcel","Toronto","Vancouver","Treasure","Ottawa","AeropuertoDeLosAngeles",
        "NuevaYork","LosAngeles","LuxuryTax","Chicago"];
    
    // Comprobar si la nueva casilla es la de salida -> sumar 300$
    if (posicion == 1) {
        await API.modificarDinero(ID_jugador, 300);
    }

    // Comprobar si es la casilla del tax
    if (posicion == 5) {
        // 50€ + 20€ * número de propiedades
        let numPropiedades = await API.obtenerNumPropiedades(ID_jugador);
        let cantidad = 50 + 20 * numPropiedades;
        await API.sumarDineroBote(cantidad);
    }

    // Comprobar si es la casilla del luxuryTax
    if (posicion == 5) {
        // 100€ + 50€ * número de propiedades
        let numPropiedades = await API.obtenerNumPropiedades(ID_jugador);
        let cantidad = 100 + 50 * numPropiedades;
        await API.sumarDineroBote(cantidad);
    }

    // Comprobar si es casilla de casino
    if (posicion == 14) {
        
    }

    // Comprobar si la nueva casilla es la del bote
    if (posicion == 21) {
        await API.obtenerDineroBote(ID_jugador);
    }

    // Comprobar si es casilla de banco
    if (posicion == 28) {

    }

    // Comprobar si la nueva casilla es la de ir a la cárcel
    if (posicion == 31) {
        await API.enviarCarcel(ID_jugador);
    }

    // Comprobar si es casilla de treasure
    if (posicion == 4 || posicion == 24 || posicion == 34) {
        // Obtener dinero aleatorio entre -250 y 250
        // Generar un número aleatorio entre -250 y 250
        let cantidad = Math.floor(Math.random() * 501) - 250;
        await API.modificarDinero(ID_jugador, cantidad)
    }

    // Comprobar si es casilla de superpoder
    if (posicion == 9 || posicion == 18) {
        // Obtener carta

    }

    // Si la nueva casilla es la de la cárcel (11) -> no hacer nada
    if (posicion == 1) {
        // No se hace nada, se pasa turno y ya
    }

    // Si no es ninguna de las anteriores -> es casilla de propiedad
    let IDjugador_propiedad = await API.obtenerJugadorPropiedad(tablero[posicion - 1]);

    // Comprobamos si la propiedad no pertenece a ningún jugador
    if (IDjugador_propiedad == -1) {
        // TODO: Dar opción de comprarla
    }
    // Comprobamos si la propiedad es de otro jugador -> tiene que pagarle
    else if (IDjugador_propiedad != ID_jugador) {
        // Pagar al jugador que posee la propiedad
        // pagarAlquiler(jugadorPaga, jugadorRecibe, propiedad)
        await API.pagarAlquiler(ID_jugador, IDjugador_propiedad, tablero[posicion - 1]);
    }
    // Si pertenece al propio jugador no se hace nada -> no hace falta comprobarlo
}


/* function finTurno() {

} */
