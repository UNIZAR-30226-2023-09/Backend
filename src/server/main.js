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
        if (mensaje == 'registrarse') {
            // Descomponer el mensaje
            let email = mensaje[0];
            let contrasenya = mensaje[1];
            let nombre = mensaje[2];
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
        if (mensaje == 'iniciarSesion') {
            // Descomponer el mensaje
            let email = mensaje[0];
            let contrasenya = mensaje[1];
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

        // Si el mensaje es que se han lanzado los dados
        if (mensaje === 'lanzarDados') {
            let tiradaDados1 = Math.floor(Math.random() % 6) + 1;
            let tiradaDados2 = Math.floor(Math.random() % 6) + 1;
            let sumaDados = tiradaDados1 + tiradaDados2;
	        // enviar a la base de datos posicion jugador
            socket.send(`Has sacado un ${sumaDados}`);
        }

    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});
