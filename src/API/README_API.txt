AQUI PONDREMOS LAS FUNCIONES YA ACABADAS CON SUS EXPLICACIONES DE LO QUE HACEN Y LO QUE DEVUELVEN, ADEMAS DE LOS PARAMETROS QUE NECESITEN.

//Dado un userData el cual continene [username,password,email,gemas], devuelve true si ha conseguido 
//introducir un nuevo usuario, en caso de que no se pueda introducir se devuleve false.
insertarUsuario(userData);


// Comprueba si el jugador tiene una cuenta asociada con el email y contraseña 
// correspondiente
// Si es correcto -> devuelve el número de gemas que tiene el jugador
// Si no es correcto -> devuelve -1 (no puede tener gemas negativas así que 
// entendemos de que no existe un email/contraseña asociados)
function comprobarInicioSesion(email, contrasenya);


// Mover el jugador, número veces hacia delante 
// Ej: moverJugador(1, 5) -> mover el jugador 1, 5 casillas, es decir, su nueva posición // será la actual + 5
// Devuelve la nueva posición del jugador en caso de que vaya correcto y devuelve 0 si algo no ha ido bien.
moverJugador(jugador, numero);


// Modificar el dinero del jugador en la cantidad proporcionada, (la cantidad puede
// ser positiva o negativa). Devuelve true si ha ido todo bien, en caso de que haya ido algo mal
// devuleve false.
modificarDinero(jugador, cantidad);


// Pagar impuestos a la banca de un cierto jugador en cierta partida. Eso significa, que el jugador se le resta
// la cantidad de dinero y se le suma al bote de cierta partida con identificador idPartida.
pagarImpuestos(jugador, cantidad, idPartida);


// Obtener el dinero actual de un jugador en cierta partida. Primero comprobamos que el jugador este en la 
// partida y despues devolvemos el dinero. Sería conveniente hacer una funcion externa que devuleca true esi 
//cierto usuario esta en cierta partida.
obtenerDinero(jugador, idPartida);


// Enviar a un jugador a la cárcel(mover posición de cárcel), devolviendo true si ha ido todo correcto, 
// devuleve false en caso de que haya ido mal.
enviarCarcel(jugador,idPartida);


// Verificar si un jugador se encuentra en la posicion correspondiente a la carcel. Suponemos que la carcel 
// es la posicion "POSICION_CARCEL".
verificarCarcel(jugador,idPartida);


// Sumar el dinero dado al bote, dado el dinero que queremos añadir, y el identificador de la partida a la que queremos añadirlo.
// Devuleve el bote de la partida actualizado si ha ido todo bien, devolvera -1 si algo ha ido mal.
function sumarDineroBote(cantidad,idPartida);


// Sumarle al jugador dado el dinero que hay en la casilla del bote (casilla 21).
// Devolveremos el dinero que tiene el jugador una vez actualicemos su dinero. En caso de que haya ido algo mal, devolveremos -1.
function obtenerDineroBote(id_jugador,id_partida);


// Dado un jugador, devuelve la cantidad de dinero que tiene en el banco. Si existe en la partida devuelve el dinero, en caso
// contrario, devuelve -1.
function dineroBanco(idJugador,idPartida);


// Obtener el número de propiedades dado un jugador y una partida.
// Devuelve -1, si algo ha ido mal.
function obtenerNumPropiedades(idJugador,idPartida);


// Dado un jugador, una partida y una cantidad meter ese dinero al banco(variable dineroInvertido).
// Devuelve la cantidad de dinero que tiene el jugador en el banco
function meterDineroBanco(idJugador, idPartida, cantidad);


// Devuelve el id de la partida ACTIVA en la que esta el usuario "email". 
//En caso de que no tenga ninguna partida activa, devuelve -1.
function jugadorEnPartida(email);


// Obtener información básica sobre un jugador (nombre, gemas, email, pass)
//devuelve una cadena de la siguiente forma: " email,gemas,nombre,pass".
function obtenerInformacionJugador(id_jugador)


// Devuelve el id_torneo del torneo recien creado por el jugador idJugador
//En caso de que no pueda crearse el torneo, o el jugador idJugador no exista devuelve -1.
function crearTorneo(idJugador, nPartidas);


// Devuelve el true si se ha añadido al jugador id_jugador, al torneo con id_torneo
//En caso de que no exista el torneo o el jugador devuelve false o ya se haya metido al jugador en ese torneo.
function unirseTorneo(idJugador, idTorneo);


// Obtener la posición actual de un jugador en una partida dada.
function obtenerPosicion(id_jugador, id_partida);


// Devuelve el id de la partida creada
// crearPartida(id_jugador) crea partida rapida
// crearPartida(id_jugador, id_torneo) crea partida asociada a un torneo
function crearPartida(id_jugador, id_torneo = null);


// Devuelve true si se ha unido con éxito, false de lo contrario
function unirsePartida(id_jugador, id_partida);


// Devuelve true si se ha empezado la partida con éxito, false de lo contrario
// Empezar una partida existente, solo la puede llamar el líder que ha creado la partida
function empezarPartida(id_partida, id_lider);

// Comprobar si el jugador dado tiene más dinero disponible que cantidad.
// Si lo tiene, actualiza su dinero con esa nueva cantidad(puede ser negativa) y devuelve true.
// Si no lo tiene que devuelva false.
function comprobarDinero(id_partida,id_jugador, cantidad);