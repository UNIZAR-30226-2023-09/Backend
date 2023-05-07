/*
 -------------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al juego/tablero
 --------------------------------------------------------------------------------
*/

const API = require('../API/partidaAPI');
const APIJugador = require('../API/jugadorAPI');
const con = require('./conexiones');
const fs = require('fs');

const gruposDePropiedades = {
    mexico: ["Monterrey", "Guadalajara"],
    japon: ["Tokio", "Kioto", "Osaka"],
    italia: ["Roma", "Milan", "Napoles"],
    inglaterra: ["Londres", "Manchester", "Edimburgo"],
    francia: ["Paris", "Marsella", "Lyon"],
    canada: ["Toronto", "Vancouver", "Ottawa"],
    estadosUnidos: ["NuevaYork", "LosAngeles", "Chicago"],
    espana: ["Madrid", "Barcelona", "Zaragoza"]
};

async function LanzarDados(socket, ID_jugador, ID_partida) {
    try {
        // Calculamos el valor de los dados
        let { dado1, dado2, posicionNueva, estaCarcel, sumaDados } = await moverJugador(ID_jugador, ID_partida);
        console.log(`DADOS,${dado1},${dado2},${posicionNueva},${estaCarcel}, sumaDados: ${sumaDados}, jugador: ${ID_jugador}`);
        // Enviar la nueva posición del jugador, el valor de los dados y el numero de turnos en la carcel
        socket.send(`DADOS,${dado1},${dado2},${posicionNueva},${estaCarcel}`);

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
        if ((posicionNueva - sumaDados) < 0) {
            // Si ha pasado, le sumamos 200$ al jugador
            if (await API.modificarDinero(ID_partida, ID_jugador, 200)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
                socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
            }
        }

        // Comprobar la casilla y realizar la acción oportuna
        comprobarCasilla(socket, posicionNueva, ID_jugador, ID_partida);
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }

}

exports.LanzarDados = LanzarDados;

/**
 * Realiza el movimiento de un jugador.
 * Si el jugador está en la cárcel, se restará un turno.
 * Si el jugador está en la cárcel y saca dobles, saldrá de la cárcel.
 * @param {string} ID_jugador - El ID del jugador que va a realizar el movimiento.
 * @param {int} ID_partida - El ID de la partida en la que está jugando el jugador.
 */
async function moverJugador(ID_jugador, ID_partida) {

    // Calculamos los valores de los dados en funcion del evento actual 
    let dado1 = Math.ceil(Math.random() * 6);
    let dado2 = Math.ceil(Math.random() * 6);
    let evento = await API.obtenerEvento(ID_partida);
    let sumaDados;
    if (evento === "DadosDobles") {
        sumaDados = (dado1 + dado2) * 2;
    } else if (evento === "DadosMitad") {
        sumaDados = (dado1 + dado2) / 2;
        // Redondear sumaDados para que no tenga decimales
        sumaDados = Math.round(sumaDados);
    } else {
        sumaDados = dado1 + dado2;
    }

    let posicionNueva;
    let estaCarcel = await API.verificarCarcel(ID_jugador, ID_partida);
    // Si estás en la cárcel y has sacado dobles -> sales
    if (dado1 === dado2 && estaCarcel > 0) {
        await API.restarTurnoCarcel(ID_jugador, ID_partida, estaCarcel);
        estaCarcel = 0;
        posicionNueva = await API.obtenerPosicion(ID_jugador, ID_partida);
        await enviarJugadoresFueraCarcel(ID_jugador, ID_partida);
    } else if (estaCarcel > 0) {
        // Si estás en la cárcel restamos un turno
        await API.restarTurnoCarcel(ID_jugador, ID_partida, 1);
        posicionNueva = await API.obtenerPosicion(ID_jugador, ID_partida);
        // Enviar a todos los jugadores que el jugador esta en la carcel
        if (estaCarcel === 1) {
            await enviarJugadoresFueraCarcel(ID_jugador, ID_partida);
        }
    } else {
        // Movemos al jugador -> obtenemos su nueva posición
        posicionNueva = await API.moverJugador(ID_jugador, sumaDados, ID_partida);
    }
    escribirEnArchivo("El bot " + ID_jugador + "en la partida " + ID_partida + " ha sacado " + dado1 + " y " + dado2 + " y se ha movido a la casilla " + posicionNueva + "\n");
    return { dado1, dado2, posicionNueva, estaCarcel, sumaDados };
}

async function comprobarCasilla(socket, posicion, ID_jugador, ID_partida) {
    let tablero = ["Salida", "Monterrey", "Guadalajara", "Treasure", "Tax", "AeropuertoNarita", // 6
        "Tokio", "Kioto", "Superpoder", "Osaka", "Carcel", "Roma", "Milan", "Casino", "Napoles", // 15
        "Aeropuerto Heathrow", "Londres", "Superpoder", "Manchester", "Edimburgo", "Bote", "Madrid", // 22
        "Barcelona", "Treasure", "Zaragoza", "AeropuertoOrly", "Paris", "Banco", "Marsella", // 29
        "Lyon", "IrCarcel", "Toronto", "Vancouver", "Treasure", "Ottawa", "AeropuertoDeLosAngeles", // 36
        "NuevaYork", "LosAngeles", "LuxuryTax", "Chicago"];

    let posicionTablero = [];

    // inicializamos el vector con números del 1 al 40
    for (let i = 1; i <= 40; i++) {
        posicionTablero.push(i);
    }

    // Comprobar si la nueva casilla es la de salida -> sumar 100$ + 200 de salida
    if (posicion == 1) {
        try {
            if (await API.modificarDinero(ID_partida, ID_jugador, 100)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
                socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
                escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla de salida");
            }
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
            await GestionTax(ID_partida, ID_jugador, socket);
        } catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es la casilla del luxuryTax
    else if (posicion == 39) {
        try {
            // 100€ + 50€ * número de propiedades
            await GestionLuxuryTax(ID_partida, ID_jugador, socket);
        } catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de casino
    else if (posicion == 14) {
        // Mandar mensaje: Cuanto quieres apostar
        socket.send(`DINERO_APOSTAR,${ID_jugador}`);
        // Recibir dinero: Cantidad (APOSTAR, cantidad)
        // Comprobar si cantidad es menor que dinero tiene jugador
        // Generar num aleatorio entre 0-1, si es 0 sumar cantidad a su cuenta
        //                                  si es 1 restar cantidad a su cuenta 
        // (funcion Apostar)
    }

    // Comprobar si la nueva casilla es la del bote
    else if (posicion == 21) {
        try {
            let dineroBote = await API.obtenerDineroBote(ID_jugador, ID_partida);
            socket.send(`OBTENER_BOTE,${ID_jugador},${dineroBote}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla del bote en la partida " + ID_partida);
            // Enviar a los demas usuarios el dinero del bote actualizado
            await enviarDineroBote(ID_partida, ID_jugador, 0);
        } catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de banco
    else if (posicion == 28) {
        let dineroBanco = await API.dineroBanco(ID_jugador, ID_partida);
        // Mandar mensaje: Banco,cantidadEnElBanco
        socket.send(`ACCION_BANCO,${ID_jugador},${ID_partida},${dineroBanco}`);
        escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla del banco en la partida " + ID_partida);
        // Responde con sacar/meter,cantidad
        // (función meterBanco/sacarBanco)
    }

    // Comprobar si la nueva casilla es la de ir a la cárcel
    else if (posicion == 31) {
        try {
            await GestionIrCarcel(ID_jugador, ID_partida, socket);
        } catch (error) {
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
            await GestionTreasure(ID_partida, ID_jugador, socket);
        } catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de superpoder
    else if (posicion == 9 || posicion == 18) {
        // Obtener carta
        await GestionSuperPoder(socket, ID_jugador, ID_partida, posicion);

    }

    // Si la nueva casilla es la de la cárcel (11) -> no hacer nada
    else if (posicion == 11) {
        // No se hace nada, se pasa turno y ya
        socket.send(`NADA`);
        escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla de la carcel de visita en la partida " + ID_partida);
    }

    // Si no es ninguna de las anteriores -> es casilla de propiedad
    else {
        // Obtener a quien pertenece la propiedad
        await GestionPropiedad(posicion, ID_partida, socket, ID_jugador);
    }
    // Este mensaje sirve para desbloquear al usuario
    socket.send("CASILLA");
}

// Gestiona el caer en una propiedad normal
async function GestionPropiedad(posicion, ID_partida, socket, ID_jugador) {
    let IDjugador_propiedad;
    try {
        IDjugador_propiedad = await API.obtenerJugadorPropiedad(posicion, ID_partida);
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        //return false;
    }

    // Comprobamos si la propiedad no pertenece a ningún jugador
    if (IDjugador_propiedad == -1) {
        await GestionCompraPropiedad(ID_partida, posicion, socket, ID_jugador);
        // Recibe mensaje: SI/NO
        //      Si el mensaje es SI -> Comprobar si tiene dinero, si tiene comprarla
        //              (funcion ComprarPropiedad)
        //      Si el mensaje es NO -> muy bien jugado, no hacer nada
    }

    // Comprobamos si la propiedad es de otro jugador -> tiene que pagarle
    else if (IDjugador_propiedad != ID_jugador) {
        try {
            // Pagar al jugador que posee la propiedad
            // obtenerPrecioPropiedad(propiedad, ID_partida)
            // 
            // pagarAlquiler(jugadorPaga, jugadorRecibe, precio)
            // Pagamos el alquiler con el nuevo precio
            await GestionPagoAlquiler(ID_jugador, ID_partida, IDjugador_propiedad, posicion, socket);
        } catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            //return false;
        }
    } else {
        // Pertenece al propio jugador, no habría que hacer nada especial
        // Comprobar si la casilla es un aeropuerto o una estación 
        let ronda = await API.obtenerRonda(ID_partida);
        if (ronda > 1) { // TODO: Ronda mayor que 10
            // Permite viajar si la ronda es mayor que 10
            await GestionViajeAeropuerto(posicion, ID_partida, ID_jugador, socket);
        }
    }
}

// Gestiona el desplazamiento entre aeropuertos del mismo propietario
async function GestionViajeAeropuerto(posicion, ID_partida, ID_jugador, socket) {
    if (posicion == 6 || posicion == 16 || posicion == 26 || posicion == 36) {
        let propiedadesJugador = await API.obtenerPropiedades(ID_partida, ID_jugador);
        let numEstaciones = 0;
        let aeropuertos = [];
        let posicionADesplazarse;
        // Dividir propiedadesJugador en un array con cada una de las componentes
        let arrayPropiedades = propiedadesJugador.split(",");
        // Recorrer el array y contar el número de estaciones que tiene el jugadorRecibe
        for (let i = 0; i < arrayPropiedades.length; i++) {
            console.log("Revisando propiedad: " + arrayPropiedades[i] + " en la posicion " + i + " del array");
            // Quitar los primeros 9 caracteres de cada componente del array
            arrayPropiedades[i] = arrayPropiedades[i].substring(9);
            if (arrayPropiedades[i] === "6" || arrayPropiedades[i] === "16" || arrayPropiedades[i] === "26" || arrayPropiedades[i] === "36") {
                console.log("El jugador tiene una estacion");
                numEstaciones++;
                // Añadir al array de aeropuertos el aeropuerto
                aeropuertos.push(arrayPropiedades[i]);
            }
        }

        console.log("Aeropuertos:", aeropuertos);
        if (numEstaciones > 1) {
            console.log("El jugador tiene más de un aeropuerto")
            for (let i = 0; i < aeropuertos.length; i++) {
                console.log("Comprobando a que aeropuerto se desplaza")
                if (parseInt(posicion) === parseInt(aeropuertos[i])) {
                    console.log("El jugador se desplaza al aeropuerto " + aeropuertos[(i + 1) % aeropuertos.length]);
                    posicionADesplazarse = aeropuertos[(i + 1) % aeropuertos.length];
                    await API.desplazarJugadorACasilla(ID_jugador, posicionADesplazarse, ID_partida);
                    socket.send(`DESPLAZAR_JUGADOR_AVION,${posicionADesplazarse}`);
                }
            }
        } else {
            socket.send(`NADA`);
        }
        // Enviarle al jugador su nueva posicion
        escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla de la estacion " + posicion + " en la partida " + ID_partida + " y se desplaza al aeropuerto " + posicionADesplazarse);
    } else {
        socket.send(`NADA`);
    }
}

async function GestionTax(ID_partida, ID_jugador, socket) {
    let sigue = true;
    let partidaContinua = true;
    let numPropiedades = await API.obtenerNumPropiedades(ID_partida, ID_jugador);
    let cantidad = 50 + 30 * numPropiedades;
    let dineroBote = await API.sumarDineroBote(cantidad, ID_partida);
    await enviarDineroBote(ID_partida, ID_jugador, dineroBote);
    if (await API.modificarDinero(ID_partida, ID_jugador, -cantidad)) {
        let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
        sigue = SigueEnPartida(ID_jugador, ID_partida, nuevoDinero);
        if (sigue) {
            socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla de impuestos");
        } else {
            partidaContinua = await gestionarMuerteJugador(ID_jugador, ID_partida, socket);
        }
    }
}

async function GestionLuxuryTax(ID_partida, ID_jugador, socket) {
    let sigue = true;
    let partidaContinua = true;
    let numPropiedades = await API.obtenerNumPropiedades(ID_partida, ID_jugador);
    let cantidad = 200 + 50 * numPropiedades;
    let dineroBote = await API.sumarDineroBote(cantidad, ID_partida);
    await enviarDineroBote(ID_partida, ID_jugador, dineroBote);
    if (await API.modificarDinero(ID_partida, ID_jugador, -cantidad)) {
        let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
        sigue = SigueEnPartida(ID_jugador, ID_partida, nuevoDinero);
        if (sigue) {
            socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
        } else {
            partidaContinua = await gestionarMuerteJugador(ID_jugador, ID_partida, socket);
        }
    }
}

async function GestionIrCarcel(ID_jugador, ID_partida, socket) {
    escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla de ir a la carcel en la partida " + ID_partida);
    await API.enviarCarcel(ID_jugador, ID_partida);
    // Obtener todos los jugadores y enviarles que estoy en la carcel
    let jugadores_struct = await obtenerJugadoresPartida(ID_partida);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            socket.send(`DENTRO_CARCEL,${ID_jugador}`);
        }
    }
}

async function GestionTreasure(ID_partida, ID_jugador, socket) {
    let cantidad = Math.floor(Math.random() * 501) - 250;
    if (await API.modificarDinero(ID_partida, ID_jugador, cantidad)) {
        let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
        sigue = SigueEnPartida(ID_jugador, ID_partida, nuevoDinero);
        if (sigue) {
            socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
        } else {
            let partidaContinua = await gestionarMuerteJugador(ID_jugador, ID_partida, socket);
        }
    }
    escribirEnArchivo("El jugador " + ID_jugador + " ha obtenido " + cantidad + "€" + "por caer en la casilla de Treasure en la partida " + ID_partida);
}

async function GestionSuperPoder(socket, ID_jugador, ID_partida, posicion) {
    let superPoder = Math.ceil(Math.random() * 12);
    // let superPoder = 1;
    let nuevaPosicion;
    socket.send(`SUPERPODER,${superPoder}`);
    switch (superPoder) {
        case 1:
            // Elegir que vas a sacar en la proxima tirada
            socket.send(`ELEGIR_CASILLA`);
            break;
        case 2:
            // Ir a la casilla del banco
            socket.send(`DESPLAZAR_JUGADOR,28`);
            nuevaPosicion = 28;
            await API.desplazarJugadorACasilla(ID_jugador, nuevaPosicion, ID_partida);
            let dineroBanco = await API.dineroBanco(ID_jugador, ID_partida);
            socket.send(`ACCION_BANCO,${ID_jugador},${ID_partida},${dineroBanco}`);
            break;
        case 3:
            // Ir a la casilla del casino
            socket.send(`DESPLAZAR_JUGADOR,14`);
            nuevaPosicion = 14;
            await API.desplazarJugadorACasilla(ID_jugador, nuevaPosicion, ID_partida);
            socket.send(`DINERO_APOSTAR,${ID_jugador}`);
            break;
        case 4:
            // Ir a la casilla de salida
            socket.send(`DESPLAZAR_JUGADOR,1`);
            nuevaPosicion = 1;
            await API.desplazarJugadorACasilla(ID_jugador, nuevaPosicion, ID_partida);
            if (await API.modificarDinero(ID_partida, ID_jugador, 300)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
                socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
            }
            break;
        case 5:
            // Volver 3 casillas atras
            nuevaPosicion = posicion - 3;
            socket.send(`DESPLAZAR_JUGADOR,${nuevaPosicion}`);
            await API.desplazarJugadorACasilla(ID_jugador, nuevaPosicion, ID_partida);
            // Si estaba en la primera casilla de superPoder va al aeropuerto

            await GestionPropiedad(nuevaPosicion, ID_partida, socket, ID_jugador);
            // CaerCasilla(socket, ID_jugador, ID_partida, nuevaPosicion);

            break;
        case 6:
            // "Aumentar" la suerte en el casino
            socket.send(`AUMENTAR_SUERTE`);
            break;
        case 7:
            // Ir a la carcel
            await GestionIrCarcel(ID_jugador, ID_partida, socket);
            break;
        case 8:
            // Ir al bote
            nuevaPosicion = 21;
            await API.desplazarJugadorACasilla(ID_jugador, nuevaPosicion, ID_partida);
            socket.send(`DESPLAZAR_JUGADOR,21`);
            let dineroBote = await API.obtenerDineroBote(ID_jugador, ID_partida);
            socket.send(`OBTENER_BOTE,${ID_jugador},${dineroBote}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla del bote en la partida " + ID_partida);
            // Enviar a los demas usuarios el dinero del bote actualizado
            await enviarDineroBote(ID_partida, ID_jugador, 0);
            break;
        case 9:
            // Ir a la casilla de Zaragoza
            nuevaPosicion = 25;
            socket.send(`DESPLAZAR_JUGADOR,${nuevaPosicion}`);
            await API.desplazarJugadorACasilla(ID_jugador, nuevaPosicion, ID_partida);
            await GestionPropiedad(nuevaPosicion, ID_partida, socket, ID_jugador);
        case 10:
            // Easter egg: Zarazaga nos pone un 10
            break;
        case 11:
            // Ir a la casilla de tokyo
            nuevaPosicion = 7;
            socket.send(`DESPLAZAR_JUGADOR,${nuevaPosicion}`);
            await API.desplazarJugadorACasilla(ID_jugador, nuevaPosicion, ID_partida);
            await GestionPropiedad(nuevaPosicion, ID_partida, socket, ID_jugador);
            break;
        case 12:
            // Ganar 2 euros
            if (await API.modificarDinero(ID_partida, ID_jugador, 2)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
                socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
            }
            break;
        default:
            break;
    }

    escribirEnArchivo("El jugador " + ID_jugador + " ha sacado la carta de superpoder " + superPoder + "en la partida " + ID_partida);
}

async function GestionCompraPropiedad(ID_partida, posicion, socket, ID_jugador) {
    let precio = await API.obtenerPrecioPropiedad(ID_partida, posicion);

    // Actualizar el precio de la propiedad en funcion de la economia
    let economia = await API.obtenerEconomia(ID_partida);
    precio = precio * economia;
    // redondear el precio para que no tenga decimales
    precio = Math.round(precio);

    // Dar opción de comprarla
    socket.send(`QUIERES_COMPRAR_PROPIEDAD,${posicion},${ID_jugador},${ID_partida},${precio}`);
    escribirEnArchivo("El jugador " + ID_jugador + " puede comprar la propiedad " + posicion + "en la partida " + ID_partida + " por " + precio + "€");
}

async function GestionPagoAlquiler(ID_jugador, ID_partida, IDjugador_propiedad, posicion, socket) {
    let dineroJugadorPagaAntes = await API.obtenerDinero(ID_jugador, ID_partida);
    let dineroJugadorRecibeAntes = await API.obtenerDinero(IDjugador_propiedad, ID_partida);
    // Escribir el dinero de los jugadores antes 
    escribirEnArchivo("El jugador " + ID_jugador + " tiene " + dineroJugadorPagaAntes + "€ antes de pagar el alquiler en la partida " + ID_partida);

    let precioPagar = await API.precioAlquiler(IDjugador_propiedad, posicion, ID_partida);
    let economia = await API.obtenerEconomia(ID_partida);
    let precio = precioPagar * economia;
    await API.pagarAlquiler(ID_jugador, IDjugador_propiedad, posicion, ID_partida, precio);
    // obtener dinero de ambos jugadores
    let dineroJugadorPaga = await API.obtenerDinero(ID_jugador, ID_partida);
    let dineroJugadorRecibe = await API.obtenerDinero(IDjugador_propiedad, ID_partida);
    let sigue = SigueEnPartida(ID_jugador, ID_partida, dineroJugadorPaga);
    if (sigue) {
        socket.send(`NUEVO_DINERO_ALQUILER,${dineroJugadorPaga},${dineroJugadorRecibe}`);
        escribirEnArchivo("El jugador " + ID_jugador + " ha pagado " + precio + "€ al jugador " + IDjugador_propiedad + " por la propiedad " + posicion + " en la partida " + ID_partida);
        escribirEnArchivo("El jugador " + ID_jugador + " tiene " + dineroJugadorPaga + "€ despues de pagar el alquiler en la partida " + ID_partida);
        escribirEnArchivo("El jugador " + IDjugador_propiedad + " tiene " + dineroJugadorRecibe + "€ despues de recibir el alquiler en la partida " + ID_partida);
    } else {
        let partidaContinua = await gestionarMuerteJugador(ID_jugador, ID_partida, socket);
    }

    // Mandarle al jugador de la propiedad en la que has caido la actualizacion
    let esBot = await API.jugadorEsBot(IDjugador_propiedad, ID_partida);
    if (!esBot) {
        let conexion = con.buscarUsuario(IDjugador_propiedad);
        conexion.send(`NUEVO_DINERO_ALQUILER_RECIBES,${dineroJugadorRecibe},${ID_jugador},${dineroJugadorPaga}`);
    }
}

async function gestionarMuerteJugador(ID_jugador, ID_partida, socket) {
    console.log("Jugador:", ID_jugador, "eliminado de la partida:", ID_partida);
    await API.jugadorAcabadoPartida(ID_jugador, ID_partida);
    let partidaContinua = await enviarJugadorMuertoPartida(socket, ID_jugador, ID_partida);
    escribirEnArchivo("El jugador " + ID_jugador + " ha sido eliminado de la partida");
    return partidaContinua;
}

// async function CaerCasilla(socket, ID_jugador, ID_partida, posicion) {
//     // Obtener a quien pertenece la propiedad
//     let IDjugador_propiedad;
//     try {
//         IDjugador_propiedad = await API.obtenerJugadorPropiedad(posicion, ID_partida);
//     }
//     catch (error) {
//         // Si hay un error en la Promesa, devolvemos false.
//         console.error("Error en la Promesa: ", error);
//         return false;
//     }

//     // Comprobamos si la propiedad no pertenece a ningún jugador
//     if (IDjugador_propiedad == -1) {
//         // Modificar precio en funcion de la economia
//         let precio = await API.obtenerPrecioPropiedad(ID_partida, posicion);
//         let economia = await API.obtenerEconomia(ID_partida);
//         precio = precio * economia;
//         precio = Math.round(precio);
//         // Dar opción de comprarla
//         socket.send(`QUIERES_COMPRAR_PROPIEDAD,${posicion},${ID_jugador},${ID_partida},${precio}`);
//         escribirEnArchivo("El jugador " + ID_jugador + " puede comprar la propiedad " + posicion + "en la partida " + ID_partida + " por " + precio + "€");

//         // Recibe mensaje: SI/NO
//         //      Si el mensaje es SI -> Comprobar si tiene dinero, si tiene comprarla
//         //              (funcion ComprarPropiedad)
//         //      Si el mensaje es NO -> muy bien jugado, no hacer nada
//     }
//     // Comprobamos si la propiedad es de otro jugador -> tiene que pagarle
//     else if (IDjugador_propiedad != ID_jugador) {
//         try {
//             // Pagar al jugador que posee la propiedad
//             // obtenerPrecioPropiedad(propiedad, ID_partida)
//             // 
//             // pagarAlquiler(jugadorPaga, jugadorRecibe, precio)
//             let precioPagar = await API.obtenerPrecioPropiedad(ID_partida, posicion);
//             // 
//             let precio = precioPagar;
//             // Pagamos el alquiler con el nuevo precio
//             if (await API.pagarAlquiler(ID_jugador, IDjugador_propiedad, posicion, ID_partida, precio)) {
//                 // obtener dinero de ambos jugadores
//                 let dineroJugadorPaga = await API.obtenerDinero(ID_jugador, ID_partida);
//                 let dineroJugadorRecibe = await API.obtenerDinero(IDjugador_propiedad, ID_partida);
//                 let sigue = SigueEnPartida(ID_jugador, ID_partida, dineroJugadorPaga);
//                 if (sigue) {
//                     socket.send(`NUEVO_DINERO_ALQUILER,${dineroJugadorPaga},${dineroJugadorRecibe}`);
//                     escribirEnArchivo("El jugador " + ID_jugador + " ha pagado " + precio + "€ al jugador " + IDjugador_propiedad + " por la propiedad " + posicion);
//                 } else {
//                     partidaContinua = await gestionarMuerteJugador(ID_jugador, ID_partida, socket);
//                 }

//                 // Mandarle al jugador de la propiedad en la que has caido la actualizacion
//                 let esBot = await API.jugadorEsBot(IDjugador_propiedad, ID_partida);
//                 if (!esBot) {
//                     let conexion = con.buscarUsuario(IDjugador_propiedad);
//                     conexion.send(`NUEVO_DINERO_ALQUILER_RECIBES,${dineroJugadorRecibe},${ID_jugador},${dineroJugadorPaga}`)
//                 }
//             }
//         }

//         catch (error) {
//             // Si hay un error en la Promesa, devolvemos false.
//             console.error("Error en la Promesa: ", error);
//             return false;
//         }
//     }
//     else {
//         // Pertenece al propio jugador, no habría que hacer nada especial
//         socket.send(`NADA`);
//     }
// }

// Realiza la acción de apostar dinero
async function Apostar(socket, ID_jugador, ID_partida, cantidad, suerte) {
    try {
        // Recibir dinero: Cantidad (APOSTAR, cantidad)
        // Comprobar si cantidad es menor que dinero tiene jugador
        // Generar num aleatorio entre 0-1, si es 0 sumar cantidad a su cuenta
        //                                  si es 1 restar cantidad a su cuenta 
        let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
        let cantidadInt = parseInt(cantidad);
        if (dineroJugador < cantidadInt) {
            socket.send(`APOSTAR_NOOK,${ID_jugador},${ID_partida}`);
        } else {
            let accion;
            let haGanado;
            if (suerte === "1") { // Si la suerte es 1, generar un número aleatorio entre 0 y 9
                let randomNum = Math.floor(Math.random() * 10);
                accion = randomNum < 8 ? 0 : 1; // 80% de probabilidad de apostar bien (accion = 0)
            } else { // Si la suerte no es 1, generar un número aleatorio normal
                accion = Math.random() < 0.5 ? 0 : 1; // 50% de probabilidad de apostar bien (accion = 0)
            }
            // Si es 0 sumamos la cantidad y se guarda que ha ganado
            if (accion === 0) {
                await API.modificarDinero(ID_partida, ID_jugador, cantidadInt);
                haGanado = true;
            } else { // Sino, se la restamos y se guarda que ha perdido
                await API.modificarDinero(ID_partida, ID_jugador, -cantidadInt);
                haGanado = false;
            }
            let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);

            socket.send(`APOSTAR_OK,${ID_jugador},${nuevoDinero},${ID_partida}`);
            sigue = SigueEnPartida(ID_jugador, ID_partida, nuevoDinero);
            if (sigue) {
                socket.send(`REINICIAR_SUERTE`);
            } else {
                let partidaContinua = await gestionarMuerteJugador(ID_jugador, ID_partida, socket);
            }
        }
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }

}

exports.Apostar = Apostar;

// Meter el dinero dado al banco del jugador en la partida dada
async function MeterBanco(socket, ID_jugador, ID_partida, cantidad) {
    try {
        let dineroJugadorBanco = await API.meterDineroBanco(ID_jugador, ID_partida, cantidad);
        await API.modificarDinero(ID_partida, ID_jugador, -cantidad);
        let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
        socket.send(`METER_DINERO_BANCO,${ID_jugador},${ID_partida},${dineroJugadorBanco},${dineroJugador}`);
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.MeterBanco = MeterBanco;

// Sacar el dinero dado del banco del jugador en la partida dada
async function SacarBanco(socket, ID_jugador, ID_partida, cantidad) {
    try {
        let cantidadInt = parseInt(cantidad);
        let dineroJugadorBanco = await API.sacarDineroBancoAPartida(ID_partida, ID_jugador, cantidadInt);
        console.log(ID_partida, ID_jugador, cantidadInt, dineroJugadorBanco);
        if (dineroJugadorBanco === -2) {
            // No ha podido sacarlo porque la cantidad era mayor al dinero del jugador en el banco
            socket.send(`SACAR_DINERO_BANCO_NO_OK,${ID_jugador},${ID_partida}`);
        } else {
            let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
            socket.send(`SACAR_DINERO_BANCO,${ID_jugador},${ID_partida},${dineroJugadorBanco},${dineroJugador}`);
        }
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.SacarBanco = SacarBanco;

// Realizar lo oportuno cuando se quiera comprar una propiedad
async function ComprarPropiedad(socket, ID_jugador, propiedad, ID_partida) {
    try {
        let precioPropiedad = await API.obtenerPrecioPropiedad(ID_partida, propiedad);
        let economia = await API.obtenerEconomia(ID_partida);
        let precio = precioPropiedad * economia;
        // redondear el precio para que no tenga decimales
        precio = Math.round(precio);
        let correcto = await API.comprarPropiedad(ID_partida, ID_jugador, propiedad, precio);
        let dinero = await API.obtenerDinero(ID_jugador, ID_partida);
        if (correcto === false) { // No se ha podido comprar
            socket.send(`COMPRAR_NO_OK,${ID_jugador},${propiedad},${ID_partida}`)
            escribirEnArchivo("El jugador " + ID_jugador + " no ha podido comprar la propiedad " + propiedad)
        } else { // Se ha comprado la propiedad, devolvemos el dinero resultante del jugador

            socket.send(`COMPRAR_OK,${ID_jugador},${propiedad},${dinero},${ID_partida}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha comprado la propiedad " + propiedad)
        }
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.ComprarPropiedad = ComprarPropiedad;

// Cuando se quiere vender una propiedad
async function VenderPropiedad(socket, ID_jugador, propiedad, ID_partida) {
    try {
        // Obtener precio propiedad
        let dineroPropiedad = await API.obtenerPrecioPropiedad(ID_partida, propiedad);
        dineroPropiedad = dineroPropiedad * 0.5;
        // Obtener precio jugador
        let ok = await API.venderPropiedadBanca(ID_partida, ID_jugador, propiedad);

        if (!ok) { // No se ha podido vender
            socket.send(`VENDER_NO_OK,${ID_jugador},${propiedad}`);
            escribirEnArchivo("El jugador " + ID_jugador + " no ha podido vender la propiedad " + propiedad);
        } else { // Se ha vendido la propiedad, devolvemos el dinero resultante del jugador
            let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
            socket.send(`VENDER_OK,${propiedad},${dineroJugador}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha vendido la propiedad " + propiedad + " por " + dineroPropiedad);
        }
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.VenderPropiedad = VenderPropiedad;

// Funcion que vende una edificacion de una propiedad dada la partida y el jugador
async function VenderEdificacion(socket, ID_jugador, ID_partida, propiedad) {
    try {
        // Intentar vender una edificacion dada la propiedad
        let ok = await API.venderCasa(ID_partida, ID_jugador, propiedad);
        if (!ok) {
            // No se ha podido vender, enviamos error
            socket.send(`VENDER_EDIFICACION_NO_OK,${ID_jugador},${propiedad}`)
            escribirEnArchivo("El jugador " + ID_jugador + " no ha podido vender la edificacion de la propiedad " + propiedad);
        } else {
            // Se ha vendido la propiedad, devolvemos el dinero resultante del jugador
            let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
            socket.send(`VENDER_EDIFICACION_OK,${propiedad},${dineroJugador}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha vendido la edificacion de la propiedad " + propiedad);
        }
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.VenderEdificacion = VenderEdificacion;

// Se obtiene la lista de posibles casas a edificar con su precio y se devuelve al cliente
async function PropiedadesDispEdificar(socket, ID_jugador, ID_partida) {
    let propiedadesDisponibles;
    let tablero = ["Salida", "Monterrey", "Guadalajara", "Treasure", "Tax", "AeropuertoNarita", // 6
        "Tokio", "Kioto", "Superpoder", "Osaka", "Carcel", "Roma", "Milan", "Casino", "Napoles", // 15
        "Aeropuerto Heathrow", "Londres", "Superpoder", "Manchester", "Edimburgo", "Bote", "Madrid", // 22
        "Barcelona", "Treasure", "Zaragoza", "AeropuertoOrly", "Paris", "Banco", "Marsella", // 29
        "Lyon", "IrCarcel", "Toronto", "Vancouver", "Treasure", "Ottawa", "AeropuertoDeLosAngeles", // 36
        "NuevaYork", "LosAngeles", "LuxuryTax", "Chicago"];
    try {
        propiedadesDisponibles = await API.obtenerPropiedades(ID_partida, ID_jugador);
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }

    if (propiedadesDisponibles === null) {
        socket.send(`EDIFICAR,${ID_jugador}`);
        return;
    }
    // Obtener una lista de los nombres de las propiedades (en string concatenado)
    let nombresPropiedades = obtenerNombresDePropiedades(propiedadesDisponibles, tablero);

    let propiedadesParaConstruir = propiedadesParaEdificar(tablero, nombresPropiedades, ID_partida);
    if (propiedadesParaConstruir.length === 0) {
        socket.send(`EDIFICAR,${ID_jugador}`);
        return;
    }

    // propiedadesParaConstruir tiene los nombres de las propiedades en las que se puede edificar
    let costes = calcularCosteEdificacion(tablero, propiedadesParaConstruir);
    let indicesPropiedades = obtenerIndicePropiedades(tablero, propiedadesParaConstruir)
    let resultadoFinal = concatenarArrays(indicesPropiedades, costes);
    socket.send(`EDIFICAR,${ID_jugador},${resultadoFinal}`);

}

exports.PropiedadesDispEdificar = PropiedadesDispEdificar;

// Edifica, si se tiene dinero suficiente, la propiedad dada
async function EdificarPropiedad(socket, ID_jugador, ID_partida, propiedadPrecio) {
    // Servidor comprueba que tenga dinero suficiente para edificar y en ese caso mando EDIFICAR_OK,propiedad,nuevoDineroJugador
    let dineroJugador;
    try {
        dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }

    let lista = propiedadPrecio.split('-');
    let propiedad = lista[0];
    let precioProp = parseInt(lista[1]);
    // Comprobamos si el jugador tiene suficiente dinero para edificar
    if (dineroJugador < precioProp) {
        // No tiene suficiente dinero -> no se edifica
        socket.send(`EDIFICAR_NOOK,${propiedad}`);
    } else {
        // Tiene dinero -> edificamos y devolvemos el nuevo dinero disponible
        let dineroResultante = await API.edificarPropiedad(ID_jugador, ID_partida, propiedad, precioProp);
        if (dineroResultante === false) {
            socket.send(`EDIFICAR_NOOK,${propiedad}`);
        } else {
            socket.send(`EDIFICAR_OK,${propiedad},${dineroResultante}`);
        }
    }

}

exports.EdificarPropiedad = EdificarPropiedad;

// Dado un string que contiene las propiedades de un jugador concatenadas con comas,
// devuelve un array con aquellas propiedades en las que puede edificar
function propiedadesParaEdificar(tablero, propiedades) {
    const propiedadesParaConstruir = [];
    const propiedadesArray = propiedades.split(","); // convertimos la cadena de propiedades en un array

    for (let grupo in gruposDePropiedades) {
        const propiedadesDelGrupo = gruposDePropiedades[grupo];
        const propiedadesFaltantes = propiedadesDelGrupo.filter(p => !propiedadesArray.includes(p));
        if (propiedadesFaltantes.length === 0 && propiedadesArray.some(p => propiedadesDelGrupo.includes(p))) {
            propiedadesDelGrupo.forEach(p => {
                if (tablero.includes(p)) {
                    propiedadesParaConstruir.push(p);
                }
            });
        }
    }

    return propiedadesParaConstruir;
}


function obtenerIndicePropiedades(tablero, propiedades) {
    const indicePropiedades = [];
    for (let i = 0; i < tablero.length; i++) {
        if (propiedades.includes(tablero[i])) {
            let indice = i + 1;
            indicePropiedades.push(`propiedad${indice}`);
        }
    }
    return indicePropiedades.join(",");
}

// Devuelve un string con las propiedades con sus nombres reales
function obtenerNombresDePropiedades(stringPropiedades, tablero) {
    const indices = stringPropiedades.split(",").map(x => parseInt(x.replace("propiedad", "")) - 1);
    return indices.map(i => tablero[i]).join(",");
}

// Devuelve un array con los costes de edificar en cada propiedad
function calcularCosteEdificacion(tablero, propiedadesArray) {
    let preciosPropiedades = [];
    for (let i = 0; i < tablero.length; i++) {
        if (propiedadesArray.includes(tablero[i])) {
            if (i < 10) {
                preciosPropiedades.push(50);
            } else if (i < 20) {
                preciosPropiedades.push(100);
            } else if (i < 30) {
                preciosPropiedades.push(150);
            } else {
                preciosPropiedades.push(200);
            }
        }
    }
    return preciosPropiedades;
}

// Concatena uno a uno los elementos de los arrays utilizando el separador "-"
function concatenarArrays(propiedades, arr2) {
    let arr1 = propiedades.split(",");
    console.log(arr1);
    console.log(arr2);
    if (arr1.length !== arr2.length) {
        throw new Error("Los arrays deben tener la misma longitud");
    }

    const resultado = [];

    for (let i = 0; i < arr1.length; i++) {
        resultado.push(`${arr1[i]}-${arr2[i]}`);
    }

    return resultado;
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

// Devuelve true si continua la partida y false si se ha acabado
async function enviarJugadorMuertoPartida(socket, ID_jugador, ID_partida) {
    let jugadores_struct = await obtenerJugadoresPartida(ID_partida);
    let num_bots = 0;

    // Dar gemas en funcion de la posicion en la clasificacion
    let posicion = jugadores_struct.length + 1;
    let gema = 0;

    if (posicion === 1) {
        gema = 5;
    } else if (posicion === 2) {
        gema = 3;
    } else if (posicion === 3) {
        gema = 2;
    } else {
        gema = 1;
    }
    await API.modificarGemas(ID_jugador, gema);
    let esBot = await API.jugadorEsBot(ID_jugador, ID_partida);
    if (!esBot) {
        let info = await APIJugador.obtenerInformacionJugador(jugadores_struct[0].id);
        let aux = info.split(",");
        let gemas = parseInt(aux[1]);
        socket.send(`ELIMINADO,${posicion},${gemas}`);
        escribirEnArchivo("El jugador " + ID_jugador + " ha sido eliminado de la partida " + ID_partida + " y ha recibido " + gema + " gemas.");
    }

    // Comprobamos si es el ultimo jugador
    if (jugadores_struct.length === 1) {
        await API.modificarGemas(ID_jugador, 5);
        if (jugadores_struct[0].esBot === "0") {
            let conexion = con.buscarUsuario(jugadores_struct[0].id);
            let info = await APIJugador.obtenerInformacionJugador(jugadores_struct[0].id);
            let aux = info.split(",");
            let gemas = parseInt(aux[1]);
            conexion.send(`GANADOR,${gemas}`);
            escribirEnArchivo("El jugador " + jugadores_struct[0].id + " ha ganado la partida " + ID_partida + " y ha recibido 5 gemas.");
        }

        await API.acabarPartida(ID_partida);
        escribirEnArchivo("La partida " + ID_partida + " ha acabado.");
        return false;
    }

    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let conexion = con.buscarUsuario(jugadores_struct[i].id);
            escribirEnArchivo("Notificando a " + jugadores_struct[i].id + " de que el jugador " + ID_jugador + " ha muerto.");
            conexion.send(`JugadorMuerto,${ID_jugador}`);
        } else {
            num_bots++;
        }
    }
    escribirEnArchivo("El jugador " + ID_jugador + " ha muerto y los jugadores restantes han sido notificados.");

    if (num_bots === jugadores_struct.length) {
        escribirEnArchivo("Solo quedan bots en la partida " + ID_partida + ".");
        // Solo quedan bots en la partida
        await API.acabarPartida(ID_partida);
        return false;
    }
    return true;
}

exports.enviarJugadorMuertoPartida = enviarJugadorMuertoPartida;

// Funcion que acaba la partida 
async function acabarPartida(ID_partida) {
    await API.acabarPartida(ID_partida);
    let clasificacion = await API.resultadoPartida(ID_partida);
    // Divide la clasificacion en los diferentes jugadores y sus gemas
    // y envia a cada jugador sus nuevas gemas
    let aux = clasificacion.split(",");
    escribirEnArchivo("Clasificacion: " + clasificacion);
    let gemas = [];
    // Obtener los jugadores de la partida
    let jugadoresPartida = await API.obtenerTodosJugadoresPartida(ID_partida);
    // for (let i = 0; i < jugadoresPartida.length; i++) {
    //     if (jugadoresPartida[i].esBot === "0") {
    //         let conexion = con.buscarUsuario(jugadoresPartida[i].id);
    //         conexion.send(`FinPartida,${ID_partida},${gemas[i]}`);
    //     }
    // }
    escribirEnArchivo("El jugador " + jugadoresPartida[i].id + " ha ganado " + gemas[i] + " gemas. Y ha sido notificado de que la partida ha acabado.");
    escribirEnArchivo("La partida " + ID_partida + " ha acabado.");
}

function SigueEnPartida(ID_jugador, ID_partida, dinero) {
    return dinero > 0;
}

exports.SigueEnPartida = SigueEnPartida;

// Almacenar el usuario y si es un bot
function Usuario(id, esBot) {
    this.id = id;
    this.esBot = esBot;
}

async function DesplazarJugador(socket, ID_jugador, ID_partida, posicionDesplazada) {
    socket.send(`DESPLAZAR_JUGADOR,${posicionDesplazada}`);
    await API.moverJugador(ID_jugador, posicionDesplazada, ID_partida);
    comprobarCasilla(socket, posicionDesplazada, ID_jugador, ID_partida);
}

exports.DesplazarJugador = DesplazarJugador;

// Devolver el precio de venta de la propiedad
async function PropiedadesDispVender(socket, ID_jugador, ID_partida, propiedad) {
    let precio = await API.obtenerPrecioPropiedad(ID_partida, propiedad);
    socket.send(`PRECIO_VENTA,${precio}`);
}

exports.PropiedadesDispVender = PropiedadesDispVender;

// Dada una clasificacion que es un string concatenado por comas, con el formato
// (jugador1:posicion,jugador2:posicion), devuelve un array con las gemas de cada
// jugador utilizando la funcion API.modificarGemas
async function asignarGemas(clasificacion) {
    let clasificacionArray = clasificacion.split(",");
    let aux;
    for (let i = 0; i < clasificacionArray.length; i++) {
        aux = clasificacionArray[i].split(":");
        await API.modificarGemas(aux[0], aux[1]);
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

async function enviarDineroBote(IDpartida, IDJugador, dineroBote) {
    let jugadores_struct = await obtenerJugadoresPartida(IDpartida);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let socketJugador = con.buscarUsuario(jugadores_struct[i].id);
            if (socketJugador != null) {
                socketJugador.send(`NUEVO_DINERO_BOTE,${dineroBote}`);
            }
        }
    }
}

// Dado el ID del jugador, el ID de la partida, una propiedad que posee el jugador
// y el precio por la que lo quiere subastar, se envia a todos los jugadores de la
// partida el mensaje de que se ha subastado la propiedad y el precio por la que se
// ha subastado.
async function Subastar(socket, ID_partida, ID_jugador, propiedad, precio) {
    // TODO: Comprobar que no exista otra subasta, y actualizar turnos en finTurno
    let haySubasta = await API.obtenerNumTurnosActivos(ID_partida);
    if (haySubasta > 0) {
        socket.send(`SUBASTA_OCUPADA`);
        return;
    }
    await API.actualizarNumTurnosSubasta(ID_partida, 4);
    let jugadores_struct = await obtenerJugadoresPartida(ID_partida);
    // Actualizar la subasta en la base de datos
    precio = parseInt(precio);
    socket.send("SUBASTA_OK");
    await API.actualizarPropiedadSubasta(ID_partida, propiedad, ID_jugador);
    await API.actualizarPrecioSubasta(ID_partida, precio, ID_jugador);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0" && jugadores_struct[i].id != ID_jugador) {
            let socketJugador = con.buscarUsuario(jugadores_struct[i].id);
            if (socketJugador != null) {
                socketJugador.send(`SUBASTA,${ID_jugador},${propiedad},${precio}`);
            }
        }
    }
}

exports.Subastar = Subastar;

// Dado el ID del jugador, el ID de la partida, el ID del jugador del que quiere 
// comprar la propiedad y envia a todos los jugadores de la partida el mensaje de
// que se ha comprado la propiedad.
async function ComprarSubasta(socket, ID_jugador, ID_partida, ID_propietario) {
    // Obtener el dinero que tiene el jugador que compra
    let dinero = await API.obtenerDinero(ID_jugador, ID_partida);

    // Obtener la propiedad que se subasta
    let propiedadSubasta = await API.obtenerNombreSubasta(ID_partida, ID_propietario);

    // Obtener el precio de la subasta
    let precioSubasta = await API.obtenerPrecioSubasta(ID_partida, ID_propietario);
    if (precioSubasta === null) {
        socket.send(`SUBASTA_NO_OK`);
        escribirEnArchivo(`El jugador ${ID_jugador} ha intentado comprar la propiedad ${propiedadSubasta} de ${ID_propietario} pero no se ha podido obtener el precio de la subasta`)
        return;
    }
    // Comprobar si el jugador tiene suficiente dinero para comprar la propiedad
    if (dinero < precioSubasta) {
        socket.send(`SUBASTA_NO_OK`);
        escribirEnArchivo(`El jugador ${ID_jugador} ha intentado comprar la propiedad ${propiedadSubasta} de ${ID_propietario} pero no tiene suficiente dinero`)
        return;
    }
    // Obtener el numero de edificaciones que tiene la propiedad
    let edificaciones = await API.obtenerNumCasasPropiedad(ID_partida, propiedadSubasta);
    // Si tiene edificaciones, no se acepta la subasta
    if (edificaciones > 0) {
        socket.send(`SUBASTA_NO_OK`);
        escribirEnArchivo(`El jugador ${ID_jugador} ha intentado comprar la propiedad ${propiedadSubasta} de ${ID_propietario} pero tiene edificaciones`);
        return;
    }
    precioSubasta = parseInt(precioSubasta);
    // Le restamos el dinero al jugador que compra
    await API.modificarDinero(ID_partida, ID_jugador, -precioSubasta);
    // Le sumamos el dinero al jugador que vende
    await API.modificarDinero(ID_partida, ID_propietario, precioSubasta);

    // Dar la propiedad al jugador que la compra
    await API.expropieseSeñorAlcalde(ID_partida, ID_jugador, propiedadSubasta);

    // Quitar la propiedad de la subasta, y poner precio a null
    await API.actualizarPropiedadSubasta(ID_partida, null, ID_propietario);
    await API.actualizarPrecioSubasta(ID_partida, null, ID_propietario);

    let dineroComprador = await API.obtenerDinero(ID_jugador, ID_partida);
    let dineroPropietario = await API.obtenerDinero(ID_propietario, ID_partida);

    // Enviar al vendedor que la compra ha sido correcta
    let esBot = await API.jugadorEsBot(ID_propietario, ID_partida);
    if (!esBot) {
        let socketVendedor = con.buscarUsuario(ID_propietario);
        if (socketVendedor != null) {
            socketVendedor.send(`SUBASTA_COMPRADA,${ID_jugador},${dineroPropietario},${propiedadSubasta}`);
        }
    }

    // Enviar al comprador que la compra ha sido correcta
    esBot = await API.jugadorEsBot(ID_jugador, ID_partida);
    if (!esBot) {
        let socketVendedor = con.buscarUsuario(ID_jugador);
        if (socketVendedor != null) {
            socketVendedor.send(`SUBASTA_COMPRADA_TU,${ID_propietario},${dineroComprador},${propiedadSubasta}`);
        }
    }
}

exports.ComprarSubasta = ComprarSubasta;

// Enviar a todos los jugadores que el jugador esta en la carcel
async function enviarJugadoresCarcel(ID_jugador, ID_partida) {
    let jugadores_struct = await obtenerJugadoresPartida(ID_partida);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let socketJugador = con.buscarUsuario(jugadores_struct[i].id);
            if (socketJugador != null) {
                socketJugador.send(`DENTRO_CARCEL,${ID_jugador}`);
            }
        }
    }
}

// Enviar a todos los jugadores que el jugador esta en la carcel
async function enviarJugadoresFueraCarcel(ID_jugador, ID_partida) {
    let jugadores_struct = await obtenerJugadoresPartida(ID_partida);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let socketJugador = con.buscarUsuario(jugadores_struct[i].id);
            if (socketJugador != null) {
                socketJugador.send(`FUERA_CARCEL,${ID_jugador}`);
            }
        }
    }
}

// Funcion que le resta 50 al jugador en la partida dada y le libera de la carcel
async function PagarLiberarseCarcel(socket, ID_jugador, ID_partida) {
    let dinero = await API.obtenerDinero(ID_jugador, ID_partida);
    if (dinero < 50) {
        socket.send(`CARCEL_NO_PAGADA`);
        return;
    }
    let estaCarcel = await API.verificarCarcel(ID_jugador, ID_partida);
    // Si estás en la cárcel y has sacado dobles -> sales
    await API.restarTurnoCarcel(ID_jugador, ID_partida, estaCarcel);
    await API.modificarDinero(ID_partida, ID_jugador, -50);

    socket.send(`CARCEL_PAGADA,${dinero - 50}`);
    enviarJugadoresFueraCarcel(ID_jugador, ID_partida);
    escribirEnArchivo(`El jugador ${ID_jugador} ha pagado 50 para salir de la carcel`);
}

exports.PagarLiberarseCarcel = PagarLiberarseCarcel;