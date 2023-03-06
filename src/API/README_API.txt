AQUI PONDREMOS LAS FUNCIONES YA ACABADAS CON SUS EXPLICACIONES DE LO QUE HACEN Y LO QUE DEVUELVEN, ADEMAS DE LOS PARAMETROS QUE NECESITEN.

// Si se puede registrar correctamente -> devuelve true
// Si no se puede registrar -> devuelve false
insertarUsuario(email,contraseña,nombre);



// Comprueba si el jugador tiene una cuenta asociada con el email y contraseña 
// correspondiente
// Si es correcto -> devuelve el número de gemas que tiene el jugador
// Si no es correcto -> devuelve -1 (no puede tener gemas negativas así que 
// entendemos de que no existe un email/contraseña asociados)
function comprobarInicioSesion(email, contrasenya);



// Mover el jugador, número veces hacia delante 
// Ej: moverJugador(1, 5) -> mover el jugador 1, 5 casillas, es decir, su nueva posición // será la actual + 5
// Que devuelve la nueva posición del jugador (ver si guardamos el tablero como 
// matriz o como)
moverJugador(jugador, numero);



// Modificar el dinero del jugador en la cantidad proporcionada, (la cantidad puede
// ser positiva o negativa)
modificarDinero(jugador, cantidad);


// Pagar impuestos a la banca
pagarImpuestos(jugador, cantidad);


// Obtener el dinero actual de un jugador
obtenerDinero(jugador);



// Obtener la posición actual de un jugador
obtenerPosicion(jugador);



// jugadorPaga paga el alquiler al jugadorRecibe por estar en propiedad si pertenece // al jugadorRecibe
pagarAlquiler(jugadorPaga, jugadorRecibe, propiedad);



// Verificar si un jugador está en la cárcel
verificarCarcel(jugador);


// Enviar a un jugador a la cárcel(mover posición de cárcel)
enviarCarcel(jugador);


// Sumar el dinero dado al bote, dado el dinero que queremos añadir, y el identificador de la partida a la que queremos añadirlo.
function sumarDineroBote(cantidad,idPartida);



// Sumarle al jugador dado el dinero que hay en la casilla del bote (casilla 21).
function obtenerDineroBote(id_jugador,id_partida);


