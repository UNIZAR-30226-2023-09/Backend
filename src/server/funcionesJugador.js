/*
 ---------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones auxiliares correspondientes al jugador
 ---------------------------------------------------------------------------
*/

// const con = require('../API/db');
const API = require('../API/jugadorAPI');
const APIpartida = require('../API/partidaAPI');
const conexion = require('./conexiones');
const bot = require('./bot');
const con = require('./conexiones');
const fs = require('fs');


// Registra al jugador dado si es posible
async function Registrarse(socket, email, contrasenya, nombre) {
    try {
        // Si se ha registrado correctamente
        let insert = nombre + "," + contrasenya + "," + email + "," + 0;
        if (await API.insertarUsuarioConSkin(insert)) {
            socket.send("REGISTRO_OK");
            escribirEnArchivo("Registro correcto" + "Nombre: " + nombre + "Contraseña: " + contrasenya + "Email: " + email);
        }
        else {
            // TODO: Habría que ver como mirar el motivo de por qué ha ido mal el registro
            socket.send("REGISTRO_NO_OK");
            escribirEnArchivo("Registro incorrecto" + "Nombre: " + nombre + "Contraseña: " + contrasenya + "Email: " + email);
        }

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.Registrarse = Registrarse;

// Inicia sesión del jugador dado si es posible
async function IniciarSesion(socket, email, contrasenya) {
    try {
        // Llamar a la función de la api correspondiente para comprobar inicio de sesión
        // Obtenemos el valor devuelto por la función (el num de gemas de ese usuario)
        let gemas = await API.comprobarInicioSesion(email, contrasenya);
        // Si ha iniciado sesión correctamente
        if (gemas >= 0) {
            conexion.agregarUsuario(socket, email);
            // Comprobams si está en una partida existente
            let id_partida = await APIpartida.jugadorEnPartida(email);
            // Está en una partida
            if (id_partida >= 0) {
                // TODO: Ver como devuelven los datos de la partida y mandárselos al cliente
                //let datosPartida = await API.obtenerDatosPartida(id_partida);
                // Mandar los datos de la partida para mostrarlos
                let estadoPartida = await APIpartida.obtenerEstadoPartida(id_partida);
                socket.send(`INICIO_OK,${email},${gemas}`);
                socket.send(`ESTADO_PARTIDA,${estadoPartida}`);
                escribirEnArchivo("El jugador ya estaba en la partida " + id_partida + " y se le ha enviado el estado de la partida");
                return;
            }
            socket.send(`INICIO_OK,${email},${gemas}`);
            escribirEnArchivo("Inicio sesion correcto. Email: " + email + " Contraseña: " + contrasenya + " Gemas: " + gemas);
        }
        else {
            socket.send(`INICIO_NO_OK`);
            escribirEnArchivo("Inicio sesion incorrecto. Email: " + email + " Contraseña: " + contrasenya);
        }

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.IniciarSesion = IniciarSesion;

async function FinTurno(ID_jugador, ID_partida) {
    // Comprobar si es fin de ronda para lo de los eventos, para actualizar saldos bancos, actualizar economía
    // Si es un jugador mando: TURNO,ID_jugador,ID_partida
    // Buscar todos los jugadores de la partida y si no son bots, enviar la info actualizada de su jugada a los demas jugadores

    // Comprobar si la partida está en curso
    let partidaEnCurso = await APIpartida.partidaEnCurso(ID_partida);
    if (!partidaEnCurso) {
        return;
    }

    // Llamar a la función de la api para obtener el siguiente jugador
    let siguienteJugador = await APIpartida.obtenerSiguienteJugador(ID_jugador, ID_partida);
    console.log("Siguiente jugador: ", siguienteJugador);
    let resultado = siguienteJugador.split(",");
    let resultado2 = resultado[0].split(":");
    let jugador = resultado2[0];
    let esBot = resultado2[1];
    let finRonda = resultado[1];

    let jugadores_struct = await obtenerJugadoresPartida(ID_partida);

    // Actualizar los turnos vivos que le quedan a la subasta
    let haySubasta = await APIpartida.obtenerNumTurnosActivos(ID_partida);
    if (haySubasta > 0) {
        escribirEnArchivo("Quedan " + haySubasta + " turnos de subasta");
        await API.actualizarNumTurnosSubasta(ID_partida, haySubasta - 1);
    }

    // Comprobar si es fin de ronda y realizar lo oportuno con esta
    if (finRonda == 1) {
        // Actualizar informacion fin de ronda
        await finDeRonda(ID_partida, jugadores_struct);
        await actualizarFinRonda(jugadores_struct, ID_partida);
    }

    for (let i = 0; i < jugadores_struct.length; i++) {
        // Si el jugador no es un bot
        if (jugadores_struct[i].esBot === "0" && jugadores_struct[i].id != ID_jugador) {
            let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
            if (conexionUsuario === null) {
                console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
                return;
            }
            let dinero = await APIpartida.obtenerDinero(ID_jugador, ID_partida);
            let casilla = await APIpartida.obtenerPosicion(ID_jugador, ID_partida);
            let propiedades = await APIpartida.obtenerPropiedades(ID_partida, ID_jugador);
            conexionUsuario.send(`ACTUALIZAR_USUARIO,${ID_jugador},${dinero},${casilla},${propiedades}`);
        }
    }

    // Si le toca a un bot
    if (esBot === "1") {
        bot.Jugar(jugador, ID_partida);
    }
    else {   // Es un jugador
        // Buscar jugadores en el pool 
        let conexionUsuario = conexion.buscarUsuario(jugador);
        console.log("| Partida:", ID_partida, " | Turno de jugador:", ID_jugador);
        conexionUsuario.send(`TURNO,${jugador},${ID_partida}`);
    }

    escribirEnArchivo("Fin de turno de jugador: " + ID_jugador + " Partida: " + ID_partida + " Siguiente jugador: " + jugador + " Fin de ronda: " + finRonda);
}
exports.FinTurno = FinTurno;

// Función que envía a los jugadores el mensaje de fin de ronda y la ronda actualizada
async function finDeRonda(ID_partida, jugadores_struct) {
    let ronda = await APIpartida.obtenerRonda(ID_partida);
    ronda = ronda + 1;
    await APIpartida.actualizarRonda(ID_partida, ronda);
    // Enviar a los jugadores la ronda actualizada
    for (let i = 0; i < jugadores_struct.length; i++) {
        // Si el jugador no es un bot
        if (jugadores_struct[i].esBot === "0") {
            let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
            if (conexionUsuario === null) {
                console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
            } else {
                conexionUsuario.send(`FIN_RONDA,${ronda}`);
            }
        }
    }
}

// Función que actualiza los dineros de los bancos y el evento de los jugadores al final de la ronda
async function actualizarFinRonda(jugadores_struct, ID_partida) {
    // Comprobar si el jugador tiene dinero en el banco y si es así, multiplicar 
    // por el interés y actualizar el saldo del banco
    await ActualizarInteresesBanco(jugadores_struct, ID_partida);

    // Actualizar la economia de la partida sumando o restando de manera aleatoria 
    // 0.1 hasta un minimo de 0.7 y un maximo de 1.3
    await modificarEconomiaPartida(ID_partida, jugadores_struct);
    // Obtener la ronda en la que esta la partida y si es ronda par y mayor que 10, 
    // generar evento aleatorio
    let ronda = await APIpartida.obtenerRonda(ID_partida);
    if (ronda >= 10 && ronda % 5 === 0) {
        await generarEventoAleatorio(ID_partida, jugadores_struct);
    } else {
        await APIpartida.actualizarEvento(ID_partida, "Ninguno");
        // Enviar a los jugadores que no hay ningun evento
        for (let i = 0; i < jugadores_struct.length; i++) {
            if (jugadores_struct[i].esBot === "0") {
                let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
                if (conexionUsuario === null) {
                    console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
                } else {
                    conexionUsuario.send(`EVENTO,Ninguno`);
                }
            }
        }
    }
}

// Función que actualiza los intereses de los bancos de los jugadores de la partida.
async function ActualizarInteresesBanco(jugadores_struct, ID_partida) {
    for (let i = 0; i < jugadores_struct.length; i++) {
        let dineroBanco = await APIpartida.dineroBanco(jugadores_struct[i].id, ID_partida);
        if (dineroBanco > 0) {
            let interes = 1.1;
            let dinero = dineroBanco * interes;
            // Redondear el dinero
            dinero = Math.round(dinero);
            let bien = await APIpartida.modificarDineroBanco(ID_partida, jugadores_struct[i].id, dinero);
            if (!bien) {
                escribirEnArchivo("Error al actualizar el dinero del banco del jugador: " + jugadores_struct[i].id + " Partida: " + ID_partida);
                return;
            }
            escribirEnArchivo("Se ha actualizado el dinero del banco del jugador: " + jugadores_struct[i].id + " Partida: " + ID_partida + " Dinero: " + dinero);
            // Enviar a los jugadores la nueva cantidad de dinero que tienen en el banco
            if (jugadores_struct[i].esBot === "0") {
                let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
                if (conexionUsuario === null) {
                    console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
                } else {
                    // Enviar al usuario el nuevo dinero que tiene en el banco
                    conexionUsuario.send(`ACTUALIZAR_BANCO,${dinero}`)
                }
            }
        }
    }
}

// Actualizar la economia de la partida sumando o restando de manera aleatoria 
// 0.1 hasta un minimo de 0.7 y un maximo de 1.3
async function modificarEconomiaPartida(ID_partida, jugadores_struct) {
    let economia = await APIpartida.obtenerEconomia(ID_partida);
    let aleatorio = Math.random();
    if (aleatorio < 0.5) {
        economia += 0.1;
    } else {
        economia -= 0.1;
    }
    if (economia < 0.7) {
        economia = 0.8;
    } else if (economia > 1.3) {
        economia = 1.2;
    }
    // Dejar la economia con 1 decimal
    economia = economia.toFixed(1);
    await APIpartida.actualizarEconomia(ID_partida, economia);

    // Enviar a los jugadores la nueva economia
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
            if (conexionUsuario === null) {
                console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
            } else {
                conexionUsuario.send(`ECONOMIA,${economia}`);
            }
        }
    }
}

// Funcion que dada una partida genera un evento aleatorio entre 1 y 5, almacenandolo 
// en la base de datos y enviandolo a los jugadores que no son bots
async function generarEventoAleatorio(ID_partida, jugadores_struct) {
    let evento = Math.floor(Math.random() * 5) + 1;
    switch (evento) {
        case 1:
            // El banco quiebra y se le quita el dinero a los usuarios
            await eventoBancaRota(ID_partida, jugadores_struct);
            break;
        case 2:
            // El banco se dispara y se multiplica el dinero del banco de los 
            // usuarios por 3
            await eventoBancoDispara(ID_partida, jugadores_struct);
            break;
        case 3:
            // Los dados esta ronda se multiplican por 2
            await eventoDadosDobles(ID_partida, jugadores_struct);
            break;
        case 4:
            // Los dados esta ronda se dividen por 2
            await eventoDadosMitad(ID_partida, jugadores_struct);
            break;
        case 5:
            // La economia se vuelve inestable y puede ser muy alta o muy baja
            await eventoEconomiaInestable(ID_partida, jugadores_struct);
            break;
    }
}

// Evento que hace que el banco pierda todo su dinero.
async function eventoBancaRota(ID_partida, jugadores_struct) {
    let efecto = "BancaRota";
    await APIpartida.actualizarEvento(ID_partida, efecto);
    // Actualizar el dinero de los bancos de todos los jugadores a 0
    for (let i = 0; i < jugadores_struct.length; i++) {
        await APIpartida.modificarDineroBanco(ID_partida, jugadores_struct[i].id, 0);
        if (jugadores_struct[i].esBot === "0") {
            let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
            if (conexionUsuario === null) {
                console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
            } else {
                conexionUsuario.send(`EVENTO,${efecto}`);
                conexionUsuario.send(`ACTUALIZAR_DINERO_BANCO,0`);
            }
        }
    }
    return efecto;
}

// Evento que multiplica el dinero del banco de los jugadores por 3
async function eventoBancoDispara(ID_partida, jugadores_struct) {
    efecto = "BancoDispara";
    await APIpartida.actualizarEvento(ID_partida, efecto);
    for (let i = 0; i < jugadores_struct.length; i++) {
        let dineroBanco = await APIpartida.dineroBanco(jugadores_struct[i].id, ID_partida);
        dineroBanco = dineroBanco * 3;
        await APIpartida.modificarDineroBanco(ID_partida, jugadores_struct[i].id, dineroBanco);
        if (jugadores_struct[i].esBot === "0") {
            let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
            if (conexionUsuario === null) {
                console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
            } else {
                conexionUsuario.send(`EVENTO,${efecto}`);
                conexionUsuario.send(`ACTUALIZAR_DINERO_BANCO,${dineroBanco}`);
            }
        }
    }
    return efecto;
}

// Evento que multiplica los dados de los jugadores por 2
async function eventoDadosDobles(ID_partida, jugadores_struct) {
    let efecto = "DadosDobles";
    await APIpartida.actualizarEvento(ID_partida, efecto);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
            if (conexionUsuario === null) {
                console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
            } else {
                conexionUsuario.send(`EVENTO,${efecto}`);
            }
        }
    }
    return efecto;
}

// Evento que divide los dados de los jugadores por 2
async function eventoDadosMitad(ID_partida, jugadores_struct) {
    let efecto = "DadosMitad";
    await APIpartida.actualizarEvento(ID_partida, efecto);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
            if (conexionUsuario === null) {
                console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
            } else {
                conexionUsuario.send(`EVENTO,${efecto}`);
            }
        }
    }
    return efecto;
}

// Evento que hace que la economia sea inestable y puede ser muy alta o muy baja
async function eventoEconomiaInestable(ID_partida, jugadores_struct) {
    let efecto = "EconomiaInestable";
    await APIpartida.actualizarEvento(ID_partida, efecto);
    // La economía será o 0.5 o 2
    let economia = Math.floor(Math.random() * 2) + 1;
    if (economia === 1) {
        economia = 0.5;
    } else {
        economia = 2;
    }
    await APIpartida.actualizarEconomia(ID_partida, economia);
    for (let i = 0; i < jugadores_struct.length; i++) {
        if (jugadores_struct[i].esBot === "0") {
            let conexionUsuario = con.buscarUsuario(jugadores_struct[i].id);
            if (conexionUsuario === null) {
                console.log('NO SE ENCUENTRA ESE USUARIO NO BOT');
            } else {
                conexionUsuario.send(`EVENTO,${efecto}`);
                conexionUsuario.send(`ECONOMIA,${economia}`);
            }
        }
    }
    return efecto;
}

// Función que devuelve un array con los jugadores de la partida y si son bots o no
async function obtenerJugadoresPartida(ID_partida) {
    let jugadores = await APIpartida.obtenerJugadoresPartida(ID_partida);
    let jugadoresPartida = jugadores.split(",");
    let jugadores_struct = new Array(jugadoresPartida.length);
    let aux;
    for (let i = 0; i < jugadoresPartida.length; i++) {
        aux = jugadoresPartida[i].split(":");
        jugadores_struct[i] = new Usuario(aux[0], aux[1]);
    }
    return jugadores_struct
}

// Almacenar el usuario y si es un bot
function Usuario(id, esBot) {
    this.id = id;
    this.esBot = esBot;
}

// Escribe en el archivo logs.txt el mensaje que se le pasa.
function escribirEnArchivo(datos) {
    // Obtener la fecha y hora actual en la zona horaria de España
    const fechaActual = new Date();
    fechaActual.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

    // Añadir al archivo logs.txt el mensaje que se le pasa junto al día y la hora actual en España
    datos = fechaActual.toLocaleString() + " " + datos + " " + "\n";

    // Escribir datos al final del archivo logs.txt
    fs.appendFile("logs.txt", datos, (error) => {
        if (error) {
            console.error(`Error al escribir en el archivo logs.txt: ${error}`);
        }
    });
}


