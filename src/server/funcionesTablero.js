/*
 -------------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al juego/tablero
 --------------------------------------------------------------------------------
*/

const ECONOMIA = 1;

const API = require('../API/funcionesAPI');

async function LanzarDados(socket, ID_jugador, ID_partida) {
    try {
        // Calculamos el valor de los dados
        let dado1 = Math.floor(Math.random() % 6) + 1;
        let dado2 = Math.floor(Math.random() % 6) + 1;
        let sumaDados = dado1 + dado2;
        // Movemos al jugador -> obtenemos su nueva posición
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
            if(await API.modificarDinero(ID_jugador, 200)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, idPartida);
                socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
            }
        }

        // Comprobar la casilla y realizar la acción oportuna
        comprobarCasilla(posicionNueva, ID_jugador, ID_partida);

        // Enviar la nueva posición del jugador y el valor de los dados
        socket.send(`DADOS,${dado1},${dado2},${posicionNueva}`);
    }
    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }

}
exports.LanzarDados = LanzarDados;


async function comprobarCasilla(posicion, ID_jugador, ID_partida) {
    let tablero = ["Salida","Monterrey","Guadalajara","Treasure","Tax","AeropuertoNarita",
        "Tokio","Kioto","Superpoder","Osaka","Carcel","Roma","Milan","Casino","Napoles",
        "Estacion","Londres","Superpoder","Manchester","Edimburgo","Bote","Madrid",
        "Barcelona","Treasure","Zaragoza","AeropuertoOrly","Paris","Banco","Marsella",
        "Lyon","IrCarcel","Toronto","Vancouver","Treasure","Ottawa","AeropuertoDeLosAngeles",
        "NuevaYork","LosAngeles","LuxuryTax","Chicago"];
    
    // Comprobar si la nueva casilla es la de salida -> sumar 300$
    if (posicion == 1) {
        try {
            if(await API.modificarDinero(ID_jugador, 300)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, idPartida);
                socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
            }
        }
        catch(error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es la casilla del tax
    if (posicion == 5) {
        try {
            // 50€ + 20€ * número de propiedades
            let numPropiedades = await API.obtenerNumPropiedades(ID_jugador);
            let cantidad = 50 + 20 * numPropiedades;
            let dineroBote = await API.sumarDineroBote(cantidad, ID_partida);
            if(await API.modificarDinero(ID_jugador, -cantidad)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, idPartida);
                socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
            }
            socket.send(`NUEVO_DINERO_BOTE,${dineroBote}`);
        }

        catch(error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es la casilla del luxuryTax
    if (posicion == 5) {
        try {
            // 100€ + 50€ * número de propiedades
            let numPropiedades = await API.obtenerNumPropiedades(ID_jugador);
            let cantidad = 100 + 50 * numPropiedades;
            let dineroBote = await API.sumarDineroBote(cantidad, ID_partida);
            socket.send(`NUEVO_DINERO_BOTE,${dineroBote}`);
        }
        catch(error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de casino
    if (posicion == 14) {
        // Mandar mensaje: Cuanto quieres apostar
        socket.send(`DINERO_APOSTAR,${ID_jugador}`);
        // Recibir dinero: Cantidad (APOSTAR, cantidad)
        // Comprobar si cantidad es menor que dinero tiene jugador
        // Generar num aleatorio entre 0-1, si es 0 sumar cantidad a su cuenta
        //                                  si es 1 restar cantidad a su cuenta 
        // (funcion Apostar)
    }

    // Comprobar si la nueva casilla es la del bote
    if (posicion == 21) {
        try {
            let dineroBote = await API.obtenerDineroBote(ID_jugador);
            socket.send(`OBTENER_BOTE,${ID_jugador},${dineroBote}`);
        }

        catch(error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de banco
    if (posicion == 28) {
        // Mandar mensaje: Banco,cantidadEnElBanco
        socket.send(`ACCION_BANCO,${ID_jugador},${ID_partida}`);
        // Responde con sacar/meter,cantidad
        // (función meterBanco/sacarBanco)
    }

    // Comprobar si la nueva casilla es la de ir a la cárcel
    if (posicion == 31) {
        try {
            await API.enviarCarcel(ID_jugador);
            socket.send(`DENTRO_CARCEL,${ID_jugador}`);
        }

        catch(error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de treasure
    if (posicion == 4 || posicion == 24 || posicion == 34) {
        try {
            // Obtener dinero aleatorio entre -250 y 250
            // Generar un número aleatorio entre -250 y 250
            let cantidad = Math.floor(Math.random() * 501) - 250;
            if(await API.modificarDinero(ID_jugador, cantidad)) {
                let nuevoDinero = await API.obtenerDinero(ID_jugador, idPartida);
                socket.send(`NUEVO_DINERO_JUGADOR,${ID_jugador},${nuevoDinero}`);
            }
        }

        catch(error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }

    // Comprobar si es casilla de superpoder
    if (posicion == 9 || posicion == 18) {
        // Obtener carta
        // TODO:
    }

    // Si la nueva casilla es la de la cárcel (11) -> no hacer nada
    if (posicion == 11) {
        // No se hace nada, se pasa turno y ya
    }

    // Si no es ninguna de las anteriores -> es casilla de propiedad
    // TODO: Try catch de esto?
    let IDjugador_propiedad = await API.obtenerJugadorPropiedad(tablero[posicion - 1]);

    let propiedad = tablero[posicion - 1];
    // Comprobamos si la propiedad no pertenece a ningún jugador
    if (IDjugador_propiedad == -1) {
        // Dar opción de comprarla
        // Mandar mensaje: Comprar?
        socket.send(`QUIERES_COMPRAR_PROPIEDAD,${propiedad},${ID_jugador},${ID_partida}`)
        // Recibe mensaje: SI/NO
        //      Si el mensaje es SI -> Comprobar si tiene dinero, si tiene comprarla
        //              (funcion ComprarPropiedad)
        //      Si el mensaje es NO -> muy bien jugado, no hacer nada
    }
    // Comprobamos si la propiedad es de otro jugador -> tiene que pagarle
    else if (IDjugador_propiedad != ID_jugador) {
        try {
            // Pagar al jugador que posee la propiedad
            // pagarAlquiler(jugadorPaga, jugadorRecibe, propiedad)
            // obtenerPrecioPropiedad(propiedad, ID_partida)
            // multiplicarlo por ECONOMIA
            // pagarAlquiler(jugadorPaga, jugadorRecibe, precio)
            let precioPagar = await API.obtenerPrecioPropiedad(propiedad, ID_partida);
            // Multiplicamos el precio a pagar por la economía
            let precio = precioPagar * ECONOMIA;
            // Pagamos el alquiler con el nuevo precio
            let dineroResultante = await API.pagarAlquiler(jugadorPaga, jugadorRecibe, precio);
            let dinero = dineroResultante.split(",");
            let dineroJugadorPaga = dinero[0];
            let dineroJugadorRecibe = dinero[1];
            socket.send(`NUEVO_DINERO_ALQUILER,${dineroJugadorPaga},${dineroJugadorRecibe}`);
        }

        catch(error) {
            // Si hay un error en la Promesa, devolvemos false.
            console.error("Error en la Promesa: ", error);
            return false;
        }
    }
    else {
        // Pertenece al propio jugador, no habría que hacer nada especial
        // TODO: Hace falta mandar algo aquí?
    }
}

// Realiza la acción de apostar dinero
async function Apostar(socket, ID_jugador, ID_partida, cantidad) {
    try {
        // Recibir dinero: Cantidad (APOSTAR, cantidad)
        // Comprobar si cantidad es menor que dinero tiene jugador
        // Generar num aleatorio entre 0-1, si es 0 sumar cantidad a su cuenta
        //                                  si es 1 restar cantidad a su cuenta 
        let dineroJugador = await API.obtenerDinero(ID_jugador, ID_partida);
        if (dineroJugador < cantidad) {
            socket.send(`APOSTAR_NOOK,${ID_jugador},${ID_partida}`);
        }
        else {
            let accion = Math.round(Math.random());
            // Si es 0 sumamos la cantidad
            let nuevoDinero = 0;
            if (accion == 0) {
                nuevoDinero = await API.modificarDinero(ID_jugador, cantidad);
            }
            else { // Sino, se la restamos
                nuevoDinero = await API.modificarDinero(ID_jugador, -cantidad);
            }
            socket.send(`APOSTAR_OK,${ID_jugador},${nuevoDinero},${ID_partida}`);
        }
    }

    catch(error) {
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
        let dineroJugador = obtenerDinero(ID_jugador, ID_partida);
        socket.send(`METER_DINERO_BANCO,${ID_jugador},${ID_partida},${dineroJugadorBanco},${dineroJugador}`);
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.MeterBanco = MeterBanco;

// Sacar el dinero dado del banco del jugador en la partida dada
async function SacarBanco(socket, ID_jugador, ID_partida, cantidad) {
    try {
        let dineroJugadorBanco = await API.sacarDineroBanco(ID_jugador, ID_partida, cantidad);
        let dineroJugador = obtenerDinero(ID_jugador, ID_partida);
        socket.send(`SACAR_DINERO_BANCO,${ID_jugador},${ID_partida},${dineroJugadorBanco},${dineroJugador}`);
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.SacarBanco = SacarBanco;

// Realizar lo oportuno cuando se quiera comprar una propiedad
async function ComprarPropiedad(socket, ID_jugador, propiedad, ID_partida) {
    try {
        let dinero = await API.comprarPropiedad(ID_jugador, propiedad);
        if (dinero == -1) { // No se ha podido comprar
            socket.send(`COMPRAR_NO_OK,${ID_jugador},${propiedad},${ID_partida}`)
        }
        else { // Se ha comprado la propiedad, devolvemos el dinero resultante del jugador
            socket.send(`COMPRAR_OK,${ID_jugador},${propiedad},${dinero},${ID_partida}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.ComprarPropiedad = ComprarPropiedad;

// Cuando se quiere vender una propiedad
async function VenderPropiedad(socket, ID_jugador, propiedad) {
    try {
        let dinero = await API.venderPropiedad(ID_jugador, propiedad);
        if (dinero == -1) { // No se ha podido vender
            socket.send(`VENDER_NO_OK,${ID_jugador},${propiedad}`)
        }
        else { // Se ha vendido la propiedad, devolvemos el dinero resultante del jugador
            socket.send(`VENDER_OK,${propiedad},${dinero}`);
        }
    }

    catch(error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.VenderPropiedad = VenderPropiedad;

// Se obtiene la lista de posibles casas a edificar con su precio y se devuelve al cliente
async function PropiedadesDispEdificar(socket,ID_jugador,ID_partida) {
    let propiedadesDisponibles = await API.propiedadesEdificar(ID_jugador, ID_partida);
    // PropiedadesDisponibles en un string de propiedad1-precio1,propiedad2-precio2...
    // Lo mandamos tal cual lo recibimos
    socket.send(`EDIFICAR,${ID_jugador},${propiedadesDisponibles}`);

}
exports.PropiedadesDispEdificar = PropiedadesDispEdificar;

// Edifica, si se tiene dinero suficiente, la propiedad dada
async function EdificarPropiedad(socket,ID_jugador,ID_partida,propiedadPrecio) {
    // Servidor comprueba que tenga dinero suficiente para edificar y en ese caso mando EDIFICAR_OK,propiedad,nuevoDineroJugador
    let dineroJugador = obtenerDinero(ID_jugador);
    let lista = propiedadPrecio.split('-');
    let propiedad = lista[0];
    let precioProp = lista[1];
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

