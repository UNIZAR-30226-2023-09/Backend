/*
 ---------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero que gestiona las jugadas de un bot
 ---------------------------------------------------------------------------
*/

const con = require('./conexiones');
const API = require('../API/partidaAPI');
const jugador = require('./funcionesJugador');
const Tablero = require('./funcionesTablero');
const APIpartida = require('../API/partidaAPI');
const fs = require('fs');
const ECONOMIA = 1;

let sigueVivo = true;

/**
 * Realiza el movimiento de un bot.
 * Si el jugador está en la cárcel, se restará un turno.
 * Si el jugador está en la cárcel y saca dobles, saldrá de la cárcel.
 * @param {string} IDJugador - El ID del jugador que va a realizar el movimiento.
 * @param {int} IDpartida - El ID de la partida en la que está jugando el jugador.
 */
async function moverBot(IDJugador, IDpartida) {
    // Calculamos los valores de los dados en funcion del evento actual 
    let dado1 = Math.ceil(Math.random() * 6);
    let dado2 = Math.ceil(Math.random() * 6);
    let sumaDados = await calcularSumaDados(IDpartida, dado1, dado2);
    let estaCarcel = await API.verificarCarcel(IDJugador, IDpartida);

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

async function calcularSumaDados(IDpartida, dado1, dado2) {
    let evento = await API.obtenerEvento(IDpartida);
    let sumaDados;
    if (evento === "dadoDoble") {
        sumaDados = (dado1 + dado2) * 2;
    } else if (evento === "dadoMitad") {
        sumaDados = (dado1 + dado2) / 2;
    } else {
        sumaDados = dado1 + dado2;
    }
    return sumaDados;
}

// Funcion que automatiza la jugada de un bot
async function jugar(IDusuario, IDpartida) {
    sigueVivo = true;

    try {
        let { dado1, dado2, posicionNueva, estaCarcel, sumaDados } = await moverBot(IDusuario, IDpartida);
        let dadosDobles = (dado1 === dado2);
        console.log("| Partida:", IDpartida, " | Turno de bot:", IDusuario, "| Posicion:", posicionNueva, "| Dados:", dado1, ",", dado2);
        // Comprobar si ha pasado por la casilla de salida en este turno
        if ((posicionNueva - sumaDados) <= 0) {
            // Si ha pasado, le sumamos 200$ al jugador
            await API.modificarDinero(IDpartida, IDusuario, 200);
        }

        casillaActual(IDusuario, IDpartida, posicionNueva, dadosDobles);

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
            await API.modificarDinero(IDpartida, IDJugador, 100);
            escribirEnArchivo("El bot " + IDJugador + " ha caido en la casilla de salida");
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
            await CasillaTax(IDpartida, IDJugador);
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
            await CasillaLuxuryTax(IDpartida, IDJugador);
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
            await API.obtenerDineroBote(IDJugador, IDpartida);
            escribirEnArchivo("El bot " + IDJugador + " ha caido en la casilla del bote en la partida " + IDpartida);
            // Enviar a los demas usuarios el dinero del bote actualizado
            await enviarDineroBote(IDpartida, IDJugador, 0);
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
            await CasillaTreasure(IDpartida, IDJugador);
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
        // Obtener carta
        await CasillaSuperpoder(IDJugador, IDpartida);
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
        if (IDjugador_propiedad === -1) {
            await CasillaComprarPropiedad(IDJugador, IDpartida, propiedad, posicion);
        }
        // Comprobamos si la propiedad es de otro jugador -> tiene que pagarle
        else if (IDjugador_propiedad != IDJugador) {
            console.log("| Partida:", IDpartida, " | Turno de bot:", IDJugador, "| Pagando alquiler a otro jugador");
            try {
                await CasillaPagarAlquiler(IDpartida, posicion, IDJugador, IDjugador_propiedad, propiedad);
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

async function CasillaPagarAlquiler(IDpartida, posicion, IDJugador, IDjugador_propiedad, propiedad) {
    let precioPagar = await API.obtenerPrecioPropiedad(IDpartida, posicion);
    // Multiplicamos el precio a pagar por la economía
    let precio = precioPagar * ECONOMIA;
    // Pagamos el alquiler con el nuevo precio
    if (API.pagarAlquiler(IDJugador, IDjugador_propiedad, posicion, IDpartida, precio)) {
        let dineroJugadorPaga = await API.obtenerDinero(IDJugador, IDpartida);
        escribirEnArchivo("El bot " + IDJugador + " ha pagado " + precio + " al jugador " + IDjugador_propiedad + " por la propiedad " + propiedad + " en la partida " + IDpartida);
        let sigue = Tablero.SigueEnPartida(IDJugador, IDpartida, dineroJugadorPaga);
        if (!sigue) {
            await API.jugadorAcabadoPartida(IDJugador, IDpartida);
            await Tablero.enviarJugadorMuertoPartida(IDJugador, IDpartida);
            escribirEnArchivo("El bot " + IDJugador + " ha sido eliminado de la partida");
            sigueVivo = false;
        }
        if (API.jugadorEsBot(IDjugador_propiedad, IDpartida) === 0) {
            let conexion = con.buscarUsuario(IDjugador_propiedad);
            conexion.send(`NUEVO_DINERO_ALQUILER_RECIBES,${dineroJugadorRecibe},${IDjugador_propiedad},${dineroJugadorPaga}`);
        }
    }
}

async function CasillaComprarPropiedad(IDJugador, IDpartida, propiedad, posicion) {
    let dineroJugador = await API.obtenerDinero(IDJugador, IDpartida);
    if (dineroJugador > 500) {
        // Comprar la propiedad
        console.log("| Partida:", IDpartida, " | Turno de bot:", IDJugador, "| Compra propiedad:", propiedad);
        ComprarPropiedad(IDJugador, posicion, IDpartida);
        escribirEnArchivo("El bot " + IDJugador + " ha comprado la propiedad " + propiedad + " en la partida " + IDpartida);
    } else {
        console.log("| Partida:", IDpartida, " | Turno de bot:", IDJugador, "| No compra propiedad:", propiedad);
        escribirEnArchivo("El bot " + IDJugador + " no ha comprado la propiedad " + propiedad + " en la partida " + IDpartida);
    }
}

async function CasillaSuperpoder(IDJugador, IDpartida) {
    let superPoder = Math.ceil(Math.random() * 5) + 1;
    let nuevaPosicion;
    switch (superPoder) {
        case 1:
            break;
        case 2:
            // Ir a la casilla del banco
            nuevaPosicion = 28;
            await API.desplazarJugadorACasilla(IDJugador, nuevaPosicion, IDpartida);
            break;
        case 3:
            // Ir a la casilla del casino
            nuevaPosicion = 14;
            await API.desplazarJugadorACasilla(IDJugador, nuevaPosicion, IDpartida);
            break;
        case 4:
            // Ir a la casilla de salida
            nuevaPosicion = 1;
            await API.desplazarJugadorACasilla(IDJugador, nuevaPosicion, IDpartida);
            await API.modificarDinero(IDpartida, IDJugador, 300);
            break;
        case 5:
            break;
        case 6:
            break;
        default:
            break;
    }

    escribirEnArchivo("El bot " + IDJugador + " ha sacado la carta de superpoder " + superPoder + "en la partida " + IDpartida);
}

async function CasillaTreasure(IDpartida, IDJugador) {
    let cantidad = Math.floor(Math.random() * 501) - 250;
    let nuevoDinero = await API.modificarDinero(IDpartida, IDJugador, cantidad);
    let sigue = Tablero.SigueEnPartida(IDJugador, IDpartida, nuevoDinero);
    if (!sigue) {
        await API.jugadorAcabadoPartida(IDJugador, IDpartida);
        await Tablero.enviarJugadorMuertoPartida(IDJugador, IDpartida);
        escribirEnArchivo("El bot " + IDJugador + " ha sido eliminado de la partida");
        sigueVivo = false;
    }
}

async function CasillaLuxuryTax(IDpartida, IDJugador) {
    let numPropiedades = await API.obtenerNumPropiedades(IDpartida, IDJugador);
    let cantidad = 100 + 50 * numPropiedades;
    let dineroBote = await API.sumarDineroBote(cantidad, IDpartida);
    await enviarDineroBote(IDpartida, IDJugador, dineroBote);
    let nuevoDinero = API.modificarDinero(IDpartida, IDJugador, -cantidad);
    let sigue = Tablero.SigueEnPartida(IDJugador, IDpartida, nuevoDinero);
    escribirEnArchivo("El bot " + IDJugador + " ha caido en la casilla de impuestos luxury");
    if (!sigue) {
        await API.jugadorAcabadoPartida(IDJugador, IDpartida);
        await Tablero.enviarJugadorMuertoPartida(IDJugador, IDpartida);
        escribirEnArchivo("El bot " + IDJugador + " ha sido eliminado de la partida");
        sigueVivo = false;
    }
}

async function CasillaTax(IDpartida, IDJugador) {
    let numPropiedades = await API.obtenerNumPropiedades(IDpartida, IDJugador);
    let cantidad = 50 + 20 * numPropiedades;
    let dineroBote = await API.sumarDineroBote(cantidad, IDpartida);
    await enviarDineroBote(IDpartida, IDJugador, dineroBote);
    let nuevoDinero = await API.modificarDinero(IDpartida, IDJugador, -cantidad);
    let sigue = Tablero.SigueEnPartida(IDJugador, IDpartida, nuevoDinero);
    escribirEnArchivo("El bot " + IDJugador + " ha caido en la casilla de impuestos");
    if (!sigue) {
        await API.jugadorAcabadoPartida(IDJugador, IDpartida);
        await Tablero.enviarJugadorMuertoPartida(IDJugador, IDpartida);
        escribirEnArchivo("El bot " + IDJugador + " ha sido eliminado de la partida");
        sigueVivo = false;
    }
}

async function enviarDineroBote(IDpartida, IDJugador, dineroBote) {
    let jugadores_struct = await obtenerJugadoresPartida(IDpartida);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].id != IDJugador && jugadores_struct[i].esBot === "0") {
            let socketJugador = con.buscarUsuario(jugadores_struct[i].id);
            socketJugador.send(`NUEVO_DINERO_BOTE,${dineroBote}`);
        }
    }
}

async function obtenerJugadoresPartida(ID_partida) {
    let jugadores = await API.obtenerJugadoresPartida(ID_partida);
    let jugadoresPartida = jugadores.split(",");
    let jugadores_struct = new Array(jugadoresPartida.length);

    for (let i = 0; i < jugadoresPartida.length; i++) {
        let aux = jugadoresPartida[i].split(":");
        jugadores_struct[i] = new Usuario(aux[0], aux[1]);
    }
    return jugadores_struct;
}

// Realizar lo oportuno cuando se quiera comprar una propiedad
async function ComprarPropiedad(IDJugador, propiedad, IDpartida) {
    try {
        let precioPropiedad = await API.obtenerPrecioPropiedad(IDpartida, propiedad);
        let economia = await API.obtenerEconomia(IDpartida);
        let precio = precioPropiedad * economia;
        // redondear el precio para que no tenga decimales
        precio = Math.round(precio);
        API.comprarPropiedad(IDpartida, IDJugador, propiedad, precio);
    }
    catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

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

// Almacenar el usuario y si es un bot
function Usuario(id, esBot) {
    this.id = id;
    this.esBot = esBot;
}