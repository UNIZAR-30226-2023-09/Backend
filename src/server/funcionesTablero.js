/*
 -------------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al juego/tablero
 --------------------------------------------------------------------------------
*/

const API = require('../API/partidaAPI');
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
    }
    catch (error) {
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
        API.restarTurnoCarcel(ID_jugador, ID_partida, estaCarcel);
        estaCarcel = 0;
        posicionNueva = await API.obtenerPosicion(ID_jugador, ID_partida);
    } else if (estaCarcel > 0) {
        // Si estás en la cárcel restamos un turno
        API.restarTurnoCarcel(ID_jugador, ID_partida, 1);
        posicionNueva = await API.obtenerPosicion(ID_jugador, ID_partida);
    } else {
        // Movemos al jugador -> obtenemos su nueva posición
        posicionNueva = await API.moverJugador(ID_jugador, sumaDados, ID_partida);
    }
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
        }
        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es la casilla del tax
    else if (posicion == 5) {
        try {
            // 50€ + 20€ * número de propiedades
            let sigue = true;
            let partidaContinua = true;
            let numPropiedades = await API.obtenerNumPropiedades(ID_partida, ID_jugador);
            let cantidad = 50 + 10 * numPropiedades;
            let dineroBote = await API.sumarDineroBote(cantidad, ID_partida);
            await enviarDineroBote(ID_partida, ID_jugador, dineroBote);
            if (await API.modificarDinero(ID_partida, ID_jugador, -cantidad)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
                sigue = SigueEnPartida(ID_jugador, ID_partida, nuevoDinero);
                if (sigue) {
                    socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
                    escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla de impuestos");
                } else {
                    socket.send(`ELIMINADO`);
                    console.log("Jugador:", ID_jugador, "eliminado de la partida:", ID_partida);
                    await API.jugadorAcabadoPartida(ID_jugador, ID_partida);
                    partidaContinua = await enviarJugadorMuertoPartida(ID_jugador, ID_partida);
                    escribirEnArchivo("El jugador " + ID_jugador + " ha sido eliminado de la partida");
                }
            }
            if (sigue && partidaContinua) {
                enviarDineroBote(ID_partida, dineroBote);
            }
        }
        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es la casilla del luxuryTax
    else if (posicion == 39) {
        try {
            // 100€ + 50€ * número de propiedades
            let sigue = true;
            let partidaContinua = true;
            let numPropiedades = await API.obtenerNumPropiedades(ID_partida, ID_jugador);
            let cantidad = 100 + 30 * numPropiedades;
            let dineroBote = await API.sumarDineroBote(cantidad, ID_partida);
            await enviarDineroBote(ID_partida, ID_jugador, dineroBote);
            if (await API.modificarDinero(ID_partida, ID_jugador, -cantidad)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
                sigue = SigueEnPartida(ID_jugador, ID_partida, nuevoDinero);
                if (sigue) {
                    socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
                } else {
                    socket.send(`ELIMINADO`);
                    console.log("Jugador:", ID_jugador, "eliminado de la partida:", ID_partida);
                    await API.jugadorAcabadoPartida(ID_jugador, ID_partida);
                    partidaContinua = await enviarJugadorMuertoPartida(ID_jugador, ID_partida);
                    escribirEnArchivo("El jugador " + ID_jugador + " ha sido eliminado de la partida");
                }
            }
            if (sigue && partidaContinua) {
                enviarDineroBote(ID_partida, dineroBote);
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
        }

        catch (error) {
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
            API.enviarCarcel(ID_jugador, ID_partida);
            socket.send(`DENTRO_CARCEL,${ID_jugador}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha caido en la casilla de ir a la carcel en la partida " + ID_partida);
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
            if (await API.modificarDinero(ID_partida, ID_jugador, cantidad)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, ID_partida);
                sigue = SigueEnPartida(ID_jugador, ID_partida, nuevoDinero);
                if (sigue) {
                    socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
                } else {
                    socket.send(`ELIMINADO`);
                    console.log("Jugador:", ID_jugador, "eliminado de la partida:", ID_partida);
                    await API.jugadorAcabadoPartida(ID_jugador, ID_partida);
                    await enviarJugadorMuertoPartida(ID_jugador, ID_partida);
                    escribirEnArchivo("El jugador " + ID_jugador + " ha sido eliminado de la partida");
                }
            }
            escribirEnArchivo("El jugador " + ID_jugador + " ha obtenido " + cantidad + "€" + "por caer en la casilla de Treasure en la partida " + ID_partida);
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
        let superPoder = Math.ceil(Math.random() * 5) + 1;
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
                CaerCasilla(socket, ID_jugador, ID_partida, nuevaPosicion);

                break;
            case 6:
                // "Aumentar" la suerte en el casino
                socket.send(`AUMENTAR_SUERTE`);
                break;
            default:
                break;
        }

        escribirEnArchivo("El jugador " + ID_jugador + " ha sacado la carta de superpoder " + superPoder + "en la partida " + ID_partida);

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
        let IDjugador_propiedad;
        try {
            IDjugador_propiedad = await API.obtenerJugadorPropiedad(posicion, ID_partida);
        }
        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }

        // Comprobamos si la propiedad no pertenece a ningún jugador
        if (IDjugador_propiedad == -1) {
            let precio = await API.obtenerPrecioPropiedad(ID_partida, posicion);

            // Actualizar el precio de la propiedad en funcion de la economia
            let economia = await API.obtenerEconomia(ID_partida);
            precio = precio * economia;
            // redondear el precio para que no tenga decimales
            precio = Math.round(precio);

            // Dar opción de comprarla
            socket.send(`QUIERES_COMPRAR_PROPIEDAD,${posicion},${ID_jugador},${ID_partida},${precio}`)
            escribirEnArchivo("El jugador " + ID_jugador + " puede comprar la propiedad " + posicion + "en la partida " + ID_partida + " por " + precio + "€");
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
                let dineroJugadorPagaAntes = await API.obtenerDinero(ID_jugador, ID_partida);
                let dineroJugadorRecibeAntes = await API.obtenerDinero(IDjugador_propiedad, ID_partida);
                // Escribir el dinero de los jugadores antes 
                escribirEnArchivo("El jugador " + ID_jugador + " tiene " + dineroJugadorPagaAntes + "€ antes de pagar el alquiler en la partida " + ID_partida);

                let precio = await API.obtenerPrecioPropiedad(ID_partida, posicion);
                let precioAlquiler = await API.pagarAlquiler(ID_jugador, IDjugador_propiedad, posicion, ID_partida, precio);
                // obtener dinero de ambos jugadores
                let dineroJugadorPaga = await API.obtenerDinero(ID_jugador, ID_partida);
                let dineroJugadorRecibe = await API.obtenerDinero(IDjugador_propiedad, ID_partida);
                let sigue = SigueEnPartida(ID_jugador, ID_partida, dineroJugadorPaga);
                if (sigue) {
                    socket.send(`NUEVO_DINERO_ALQUILER,${dineroJugadorPaga},${dineroJugadorRecibe}`);
                    escribirEnArchivo("El jugador " + ID_jugador + " ha pagado " + precioAlquiler + "€ al jugador " + IDjugador_propiedad + " por la propiedad " + posicion + " en la partida " + ID_partida);
                    escribirEnArchivo("El jugador " + ID_jugador + " tiene " + dineroJugadorPaga + "€ despues de pagar el alquiler en la partida " + ID_partida);
                    escribirEnArchivo("El jugador " + IDjugador_propiedad + " tiene " + dineroJugadorRecibe + "€ despues de recibir el alquiler en la partida " + ID_partida);
                } else {
                    socket.send(`ELIMINADO`);
                    console.log("Jugador:", ID_jugador, "eliminado de la partida:", ID_partida);
                    await API.jugadorAcabadoPartida(ID_jugador, ID_partida);
                    await enviarJugadorMuertoPartida(ID_jugador, ID_partida);
                    escribirEnArchivo("El jugador " + ID_jugador + " ha sido eliminado de la partida");
                }

                // Mandarle al jugador de la propiedad en la que has caido la actualizacion
                if (API.jugadorEsBot(IDjugador_propiedad, ID_partida) === 0) {
                    let conexion = con.buscarUsuario(IDjugador_propiedad);
                    conexion.send(`NUEVO_DINERO_ALQUILER_RECIBES,${dineroJugadorRecibe},${ID_jugador},${dineroJugadorPaga}`)
                }
            }

            catch (error) {
                // Si hay un error en la Promesa, devolvemos false.
                console.error("Error en la Promesa: ", error);
                return false;
            }
        }
        else {
            // Pertenece al propio jugador, no habría que hacer nada especial
            socket.send(`NADA`);
        }
    }
    // Este mensaje sirve para desbloquear al usuario
    socket.send("CASILLA");
}

async function CaerCasilla(socket, ID_jugador, ID_partida, posicion) {
    // Obtener a quien pertenece la propiedad
    let IDjugador_propiedad;
    try {
        IDjugador_propiedad = await API.obtenerJugadorPropiedad(posicion, ID_partida);
    }
    catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }

    // Comprobamos si la propiedad no pertenece a ningún jugador
    if (IDjugador_propiedad == -1) {
        // Modificar precio en funcion de la economia
        let precio = await API.obtenerPrecioPropiedad(ID_partida, posicion);
        let economia = await API.obtenerEconomia(ID_partida);
        precio = precio * economia;
        precio = Math.round(precio);
        // Dar opción de comprarla
        socket.send(`QUIERES_COMPRAR_PROPIEDAD,${posicion},${ID_jugador},${ID_partida},${precio}`);
        escribirEnArchivo("El jugador " + ID_jugador + " puede comprar la propiedad " + posicion + "en la partida " + ID_partida + " por " + precio + "€");

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
            let precioPagar = await API.obtenerPrecioPropiedad(ID_partida, posicion);
            // 
            let precio = precioPagar;
            // Pagamos el alquiler con el nuevo precio
            if (await API.pagarAlquiler(ID_jugador, IDjugador_propiedad, posicion, ID_partida, precio)) {
                // obtener dinero de ambos jugadores
                let dineroJugadorPaga = await API.obtenerDinero(ID_jugador, ID_partida);
                let dineroJugadorRecibe = await API.obtenerDinero(IDjugador_propiedad, ID_partida);
                let sigue = SigueEnPartida(ID_jugador, ID_partida, dineroJugadorPaga);
                if (sigue) {
                    socket.send(`NUEVO_DINERO_ALQUILER,${dineroJugadorPaga},${dineroJugadorRecibe}`);
                    escribirEnArchivo("El jugador " + ID_jugador + " ha pagado " + precio + "€ al jugador " + IDjugador_propiedad + " por la propiedad " + posicion);
                } else {
                    socket.send(`ELIMINADO`);
                    console.log("Jugador:", ID_jugador, "eliminado de la partida:", ID_partida);
                    await API.jugadorAcabadoPartida(ID_jugador, ID_partida);
                    await enviarJugadorMuertoPartida(ID_jugador, ID_partida);
                    escribirEnArchivo("El jugador " + ID_jugador + " ha sido eliminado de la partida");
                }

                // Mandarle al jugador de la propiedad en la que has caido la actualizacion
                if (API.jugadorEsBot(IDjugador_propiedad, ID_partida) === 0) {
                    let conexion = con.buscarUsuario(IDjugador_propiedad);
                    conexion.send(`NUEVO_DINERO_ALQUILER_RECIBES,${dineroJugadorRecibe},${ID_jugador},${dineroJugadorPaga}`)
                }
            }
        }

        catch (error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }
    else {
        // Pertenece al propio jugador, no habría que hacer nada especial
        socket.send(`NADA`);
    }
}

// Funcion que dado el id de la partida y el dinero del bote le envia a todos los jugadores de la partida el dinero del bote
async function enviarDineroBote(ID_partida, dineroBote) {
    let jugadores = await obtenerJugadoresPartida(ID_partida);
    for (let i = 0; i < jugadores.length; i++) {
        if (jugadores[i].esBot === "0") {
            let conexion = con.buscarUsuario(jugadores[i].ID_jugador);
            if (conexion != null) {
                conexion.send(`NUEVO_DINERO_BOTE,${dineroBote}`);
            }
        }
    }
}


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
        }
        else {
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
                socket.send(`ELIMINADO`);
                console.log("Jugador:", ID_jugador, "eliminado de la partida:", ID_partida);
                await API.jugadorAcabadoPartida(ID_jugador, ID_partida);
                await enviarJugadorMuertoPartida(ID_jugador, ID_partida);
                escribirEnArchivo("El jugador " + ID_jugador + " ha sido eliminado de la partida " + ID_partida);
            }
        }
    }

    catch (error) {
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
    }

    catch (error) {
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
        }
        else {
            let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
            socket.send(`SACAR_DINERO_BANCO,${ID_jugador},${ID_partida},${dineroJugadorBanco},${dineroJugador}`);
        }
    }

    catch (error) {
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
        }
        else { // Se ha comprado la propiedad, devolvemos el dinero resultante del jugador

            socket.send(`COMPRAR_OK,${ID_jugador},${propiedad},${dinero},${ID_partida}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha comprado la propiedad " + propiedad)
        }
    }

    catch (error) {
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
        // Obtener precio jugador
        let ok = await API.venderPropiedadBanca(ID_partida, ID_jugador, propiedad);

        if (!ok) { // No se ha podido vender
            socket.send(`VENDER_NO_OK,${ID_jugador},${propiedad}`);
            escribirEnArchivo("El jugador " + ID_jugador + " no ha podido vender la propiedad " + propiedad);
        }
        else { // Se ha vendido la propiedad, devolvemos el dinero resultante del jugador
            let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
            socket.send(`VENDER_OK,${propiedad},${dineroJugador}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha vendido la propiedad " + propiedad + " por " + dineroPropiedad);
        }
    }

    catch (error) {
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
        }
        else {
            // Se ha vendido la propiedad, devolvemos el dinero resultante del jugador
            let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
            socket.send(`VENDER_EDIFICACION_OK,${propiedad},${dineroJugador}`);
            escribirEnArchivo("El jugador " + ID_jugador + " ha vendido la edificacion de la propiedad " + propiedad);
        }
    }

    catch (error) {
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
    }
    catch (error) {
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

    let propiedadesParaConstruir = propiedadesParaEdificar(tablero, nombresPropiedades);
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
    }
    catch (error) {
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
    }
    else {
        // Tiene dinero -> edificamos y devolvemos el nuevo dinero disponible
        let dineroResultante = await API.edificarPropiedad(ID_jugador, ID_partida, propiedad);
        socket.send(`EDIFICAR_OK,${propiedad},${dineroResultante}`);
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
async function enviarJugadorMuertoPartida(ID_jugador, ID_partida) {
    let jugadores_struct = await obtenerJugadoresPartida(ID_partida);
    let num_bots = 0;

    if (jugadores_struct.length === 1) {
        // Es el ultimo jugador
        await API.acabarPartida(ID_partida);
        let clasificacion = await API.resultadoPartida(ID_partida);
        console.log(clasificacion);
        asignarGemas(clasificacion);
        let conexion = con.buscarUsuario(jugadores_struct[0].id);
        conexion.send(`FinPartida,${ID_partida}`);
        escribirEnArchivo("La partida " + ID_partida + " ha acabado.");
        return;
    }

    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let conexion = con.buscarUsuario(jugadores_struct[i].id);
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
        let clasificacion = await API.resultadoPartida(ID_partida);
        // Divide la clasificacion en los diferentes jugadores y sus gemas
        // y envia a cada jugador sus nuevas gemas
        let aux = clasificacion.split(",");
        let jugadores = [];
        let gemas = [];
        for (let i = 0; i < aux.length; i++) {
            let aux2 = aux[i].split(":");
            let jugador = aux2[0];
            let gema = aux2[1];

            // Dar gemas en funcion de la posicion en la clasificacion
            if (gema === "1") {
                gema = 5;
            } else if (gema === "2") {
                gema = 3;
            } else if (gema === "3") {
                gema = 2;
            } else {
                gema = 1;
            }

            // Comprobar que el jugador no sea un bot
            let esBot = await API.esBot(jugador);
            if (!esBot) {
                socket.send(`SUMAR_GEMAS,${gema}`);
            }
        }
        for (let i = 0; i < jugadores.length; i++) {
            let conexion = con.buscarUsuario(jugadores[i]);
            conexion.send(`FinPartida,${ID_partida},${gemas[i]}`);
        }

        escribirEnArchivo("La partida " + ID_partida + " ha acabado.");
        return false;
    }
    return true;
}
exports.enviarJugadorMuertoPartida = enviarJugadorMuertoPartida;

function SigueEnPartida(ID_jugador, ID_partida, dinero) {
    return dinero > 0;
}
exports.SigueEnPartida = SigueEnPartida;

// Almacenar el usuario y si es un bot
function Usuario(id, esBot) {
    this.id = id;
    this.esBot = esBot;
}

async function DesplazarJugador(socket, ID_jugador, ID_partida, posicion) {
    socket.send(`DESPLAZAR_JUGADOR,${posicion}`);
    await API.moverJugador(ID_jugador, posicion, ID_partida);
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
        if (jugadores_struct[i].id != IDJugador && jugadores_struct[i].esBot === "0") {
            let socketJugador = con.buscarUsuario(jugadores_struct[i].id);
            socketJugador.send(`NUEVO_DINERO_BOTE,${dineroBote}`);
        }
    }
}