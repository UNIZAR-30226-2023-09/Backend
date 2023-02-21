/*
 -----------------------------------------------------------------------
 * Fichero: main.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero main de servidor Backend
 -----------------------------------------------------------------------
*/

const PUERTO = 8080 // Puerto a elegir
const HOST = "127.0.0.1"

const WebSocket = require('ws');
const server = new WebSocket.Server({ host: HOST, port: PUERTO });

// Nueva conexion de cliente
server.on('connection', (socket) => {
    console.log('Cliente conectado');
    
    // Nuevo mensaje recibido
    socket.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);
        /*if (message === 'lanzarDados') {
            let tiradaDados1 = Math.floor(Math.random() % 6) + 1;
            let tiradaDados2 = Math.floor(Math.random() % 6) + 1;
            let sumaDados = tiradaDados1 + tiradaDados2;
	        // enviar a la base de datos posicion jugador
            socket.send(`Has sacado un ${sumaDados}`);
        }*/

        // Obtenemos el mensaje solicitado
        let mensaje = message.split(',');
        // TODO: Switch de diferentes mensajes recibidos
        // Si se quiere registrar
        if (mensaje[0] == 'registrarse') {
            // Descomponer el mensaje
            let email = mensaje[1];
            let contrasenya = mensaje[2];
            let nombre = mensaje[3];
            // Llamar a la función de la api correspondiente para el registro
            // TODO: Ver si se llama así o como
            // Si se ha registrado correctamente
            if (registrarJugador(email,contraseña,nombre)) {
                socket.send(`Registro correcto`);
            }
            else {
                // TODO: Habría que ver como mirar el motivo de por qué ha ido mal el registro
                socket.send(`Registro incorrecto`);
            }
        }

        // Si se quiere registrar
        if (mensaje[0] == 'iniciarSesion') {
            // Descomponer el mensaje
            let email = mensaje[1];
            let contrasenya = mensaje[2];
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
                }
                else {
                    socket.send(`El usuario tiene ${gemas} gemas`);
                }
            }
            else {
                socket.send(`Inicio de sesion incorrecto`);
            }
        }

        // Si el mensaje es que se ha creado una partida
        if (mensaje[0] == 'crearPartida') {
            // Descomponer el mensaje
            let ID_jugador = mensaje[1];
            let numJugadores = mensaje[2];
            // Creamos la partida y guardamos su ID
            let id_partida = crearPartida(numJugadores);
            socket.send(`Partida creada con ID: ${id_partida}`);
        }

        // Si el mensaje es que se ha creado una partida
        if (mensaje == 'unirsePartida') {
            // Descomponer el mensaje
            let ID_partida = mensaje[1];
            let ID_jugador = mensaje[2];
            // Unimos al jugador a la partida 
            if (unirPartida(ID_jugador, ID_partida)) {
                socket.send(`Jugador unido correctamente a la partida`);
            }
            else { // TODO: ¿Motivo?
                socket.send(`Jugador no unido correctamente`);
            }
        }




        // Si el mensaje es que se han lanzado los dados
        if (mensaje[0] === 'lanzarDados') {
            let tiradaDados1 = Math.floor(Math.random() % 6) + 1;
            let tiradaDados2 = Math.floor(Math.random() % 6) + 1;
            let sumaDados = tiradaDados1 + tiradaDados2;
            // TODO: El jugador lo llevamos nosotros o nos lo pasan por mensaje?
            let posicionNueva = moverJugador(jugador, sumaDados);
            // Comprobar si la nueva posición corresponde a la casilla de la cárcel
            if (comprobarCasillaCarcel(posicionNueva)) {
                socket.send(`El dado 1 es: ${tiradaDados1}`);
                socket.send(`El dado 2 es: ${tiradaDados2}`);
                enviarCarcel(jugador);
                // TODO: Definir la casilla de la carcel
                //socket.send(`La nueva posicion es: ${casillaCarcel}`);
            }
            else {
                // Comprobar si los dados son dobles
                if (tiradaDados1 == tiradaDados2) {
                    // TODO: Decirles que reenvien el mensaje porque es el turno del mismo jugador
                }
                // enviar a la base de datos posicion jugador
                socket.send(`El dado 1 es: ${tiradaDados1}`);
                socket.send(`El dado 2 es: ${tiradaDados2}`);
                socket.send(`La nueva posicion es: ${posicionNueva}`);
            }
        }

    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});
