/*
 ---------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero que gestiona las jugadas de un bot
 ---------------------------------------------------------------------------
*/

const API = require('../API/partidaAPI');
const jugador = require('./funcionesJugador');
const tablero = require('./funcionesTablero');
const ECONOMIA = 1;

/**
 * Realiza el movimiento de un bot.
 * Si el jugador está en la cárcel, se restará un turno.
 * Si el jugador está en la cárcel y saca dobles, saldrá de la cárcel.
 * @param {string} IDJugador - El ID del jugador que va a realizar el movimiento.
 * @param {int} IDpartida - El ID de la partida en la que está jugando el jugador.
 */
async function moverBot(IDJugador, IDpartida) {
    let dado1 = Math.ceil(Math.random() * 6);
    let dado2 = Math.ceil(Math.random() * 6);
    let sumaDados = dado1 + dado2;
    let estaCarcel = 0; //await API.verificarCarcel(IDJugador, IDpartida);

    // Si estás en la cárcel restamos un turno
    if (estaCarcel > 0) {
        API.restarTurnoCarcel(IDJugador, IDpartida, 1);
    }

    // Si estás en la cárcel y has sacado dobles -> sales
    if (dado1 === dado2 && estaCarcel > 0) {
        API.restarTurnoCarcel(IDJugador, IDpartida, estaCarcel);
        estaCarcel = 0;
    }
    // Movemos al jugador -> obtenemos su nueva posición
    let posicionNueva = await API.moverJugador(IDJugador, sumaDados, IDpartida);
    return { dado1, dado2, posicionNueva, estaCarcel, sumaDados };
}

// Funcion que automatiza la jugada de un bot
async function jugar(IDusuario, IDpartida) {

    try {
        let { dado1, dado2, posicionNueva, estaCarcel, sumaDados } = await moverBot(IDusuario, IDpartida);
        let dadosDobles = (dado1 === dado2);
        console.log("| Partida:", IDpartida, " | Turno de bot:", IDusuario, "| Posicion:", posicionNueva, "| Dados:", dado1, ",", dado2);
        // Comprobar si ha pasado por la casilla de salida en este turno
        if ((posicionNueva - sumaDados) <= 0) {
            // Si ha pasado, le sumamos 200$ al jugador
            if (await API.modificarDinero(IDpartida, IDusuario, 200)) {
                dinero = await API.obtenerDinero(IDusuario, IDpartida);
            }
        }

        if (!estaCarcel) {
            casillaActual(IDusuario, IDpartida, posicionNueva, dadosDobles);
        }

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.Jugar = jugar;

async function casillaActual(IDJugador, IDpartida, posicion, dadosDobles) {
    let tablero = ["Salida", "Monterrey", "Guadalajara", "Treasure", "Tax", "AeropuertoNarita",
        "Tokio", "Kioto", "Superpoder", "Osaka", "Carcel", "Roma", "Milan", "Casino", "Napoles",
        "Estacion", "Londres", "Superpoder", "Manchester", "Edimburgo", "Bote", "Madrid",
        "Barcelona", "Treasure", "Zaragoza", "AeropuertoOrly", "Paris", "Banco", "Marsella",
        "Lyon", "IrCarcel", "Toronto", "Vancouver", "Treasure", "Ottawa", "AeropuertoDeLosAngeles",
        "NuevaYork", "LosAngeles", "LuxuryTax", "Chicago"];

    // Comprobar si la nueva casilla es la de salida -> sumar 300$
    if (posicion == 1) {
        try {
            API.modificarDinero(IDpartida, IDJugador, 100);
        } catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es la casilla del tax
    else if (posicion == 5) {
        try {
            // 50€ + 20€ * número de propiedades
            let numPropiedades = await API.obtenerNumPropiedades(IDpartida, IDJugador);
            let cantidad = 50 + 20 * numPropiedades;
            await API.sumarDineroBote(cantidad, IDpartida);
            let nuevoDinero = API.modificarDinero(IDpartida, IDJugador, -cantidad);
            let sigueEnPartida = tablero.sigueEnPartida(IDJugador, IDpartida, nuevoDinero);
            if (!sigueEnPartida) {
                await API.jugadorAcabadoPartida(IDJugador, IDpartida);
                await enviarJugadorMuertoPartida(IDJugador, IDpartida);
            }
        }

        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es la casilla del luxuryTax
    else if (posicion == 38) {
        try {
            // 100€ + 50€ * número de propiedades
            let numPropiedades = await API.obtenerNumPropiedades(IDpartida, IDJugador);
            let cantidad = 100 + 50 * numPropiedades;
            let dineroBote = await API.sumarDineroBote(cantidad, IDpartida);
            let nuevoDinero = API.modificarDinero(IDpartida, IDJugador, -cantidad);
            let sigueEnPartida = tablero.sigueEnPartida(IDJugador, IDpartida, nuevoDinero);
            if (!sigueEnPartida) {
                await API.jugadorAcabadoPartida(IDJugador, IDpartida);
                await enviarJugadorMuertoPartida(IDJugador, IDpartida);
            }
        }
        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de casino
    else if (posicion == 14) {
        // No apostar nada
    }

    // Comprobar si la nueva casilla es la del bote
    else if (posicion == 21) {
        try {
            API.obtenerDineroBote(IDJugador, IDpartida);
        }
        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de banco
    else if (posicion == 28) {
        // No hacer nada
    }

    // Comprobar si la nueva casilla es la de ir a la cárcel
    else if (posicion == 31) {
        try {
            API.enviarCarcel(IDJugador, IDpartida);
        }
        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de treasure
    else if (posicion == 4 || posicion == 24 || posicion == 34) {
        try {
            // Obtener dinero aleatorio entre -250 y 250
            // Generar un número aleatorio entre -250 y 250
            let cantidad = Math.floor(Math.random() * 501) - 250;
            let nuevoDinero = await API.modificarDinero(IDpartida, IDJugador, cantidad);
            let sigueEnPartida = tablero.sigueEnPartida(IDJugador, IDpartida, nuevoDinero);
            if (!sigueEnPartida) {
                await API.jugadorAcabadoPartida(IDJugador, IDpartida);
                await enviarJugadorMuertoPartida(IDJugador, IDpartida);
            }
        }
        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de superpoder
    else if (posicion == 9 || posicion == 18) {
        // Obtener carta
        // TODO:
    }

    // Si la nueva casilla es la de la cárcel (11) -> no hacer nada
    else if (posicion == 11) {
        // No se hace nada, se pasa turno y ya
    }

    else {
        // Si no es ninguna de las anteriores -> es casilla de propiedad
        // Obtener a quien pertenece la propiedad
        let IDjugador_propiedad;
        try {
            IDjugador_propiedad = await API.obtenerJugadorPropiedad(posicion, IDpartida);
        }
        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }

        let propiedad = tablero[posicion - 1];

        // Comprobamos si la propiedad no pertenece a ningún jugador
        if (IDjugador_propiedad == -1) {
            console.log("| Partida:", IDpartida, " | Turno de bot:", IDJugador, "| Puede comprar propiedad:", propiedad);
            // Si tenemos dinero suficiente lo compramos
            ComprarPropiedad(IDJugador, posicion, IDpartida);
        }
        // Comprobamos si la propiedad es de otro jugador -> tiene que pagarle
        else if (IDjugador_propiedad != IDJugador) {
            console.log("| Partida:", IDpartida, " | Turno de bot:", IDJugador, "| Pagando alquiler a otro jugador");
            try {
                let precioPagar = await API.obtenerPrecioPropiedad(IDpartida, posicion);
                // Multiplicamos el precio a pagar por la economía
                let precio = precioPagar * ECONOMIA;
                // Pagamos el alquiler con el nuevo precio
                if (API.pagarAlquiler(IDJugador, IDjugador_propiedad, posicion, IDpartida, precio)) {
                    let dineroJugadorPaga = await API.obtenerDinero(IDJugador, IDpartida);
                    let sigueEnPartida = sigueEnPartida(IDJugador, IDpartida, dineroJugadorPaga);
                    if (!sigueEnPartida) {
                        await API.jugadorAcabadoPartida(IDJugador, IDpartida);
                        await enviarJugadorMuertoPartida(IDJugador, IDpartida);
                    }
                }
            }
            catch (error) {
                // Si hay un error en la Promesa, devolvemos false.
                console.error("Error en la Promesa: ", error);
                return false;
            }
        }
    }

    if (dadosDobles) {
        jugar(IDJugador, IDpartida);
    }
    else {
        jugador.FinTurno(IDJugador, IDpartida);
    }
}

// Realizar lo oportuno cuando se quiera comprar una propiedad
async function ComprarPropiedad(IDJugador, propiedad, IDpartida) {
    try {
        let precioPropiedad = await API.obtenerPrecioPropiedad(IDpartida, propiedad);
        API.comprarPropiedad(IDpartida, IDJugador, propiedad, precioPropiedad);
    }
    catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}