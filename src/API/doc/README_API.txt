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

// Funcion que dado un jugador y una partida desplaza al jugador a la casilla indicada.
desplazarJugadorACasilla(jugador, casilla, idPartida);


// Modificar el dinero del jugador en la cantidad proporcionada, (la cantidad puede
// ser positiva o negativa). Devuelve true si ha ido todo bien, en caso de que haya ido algo mal
// devuleve false.
modificarDinero(idPartida,jugador, cantidad);


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


// Se añade el jugador con IDJugador a la partida
// Devuelve false si el jugador o la partida no existen, o si el jugador ya está metido en esa partida o esta jugando ya otra
// Devuelve true en caso contrario
function unirsePartida(idJugador, idPartida);


// Devuelve true si se ha empezado la partida con éxito, false de lo contrario
// Empezar una partida existente, solo la puede llamar el líder que ha creado la partida
function empezarPartida(id_partida, id_lider);

// Comprobar si el jugador dado tiene más dinero disponible que cantidad.
// Si lo tiene, actualiza su dinero con esa nueva cantidad(puede ser negativa) y devuelve true.
// Si no lo tiene que devuelva false.
function comprobarDinero(id_partida,id_jugador, cantidad);

// Obtener el número de propiedades dado un jugador. Devuelve -1 sino existe el jugador en la partida.
function obtenerNumPropiedades(id_partida,id_jugador);

// Compra una propiedad la cual tiene QUE ESTAR VACIA SI O SI. devuelve true, si ha ido correcto devuelve true
// y false en caso de que no haya sido posible comprarla. 
function comprarPropiedad(id_partida,id_jugador, n_propiedad,precio_propiedad);

// Obtener la lista de propiedades de un jugador. Si no tiene ninguna propiedad devuelve la cadena vacia (null).
//Las propiedades van devueltas en una cadena separada por comas: "propiedad1,propiedad2".
function obtenerPropiedades(id_partida,id_jugador);

// Devuelve el ID_jugador al que pertenezca la propiedad dada (-1 si no pertenece a nadie)
// Propiedad es un (integer) con el numero de propiedad.
function obtenerJugadorPropiedad(n_propiedad, id_partida);

// Dado un jugador y una partida, restarle a turnosCarcel los turnos dados. 
function restarTurnoCarcel(id_jugador, id_partida, turnos);

// Devuelve el listado de jugadores que hay asociados a una partida separados por comas, si son bots pondra -1 en vez de email
// En caso de que no no exista la partida devuelve false
function obtenerJugadoresPartida(idPartida);

// Devuelve el listado de skins con id.Precio que estan en el sistema
//En caso de que no existan skins en el sistema devuelve false
function obtenerListadoSkins();

// Devuelve el true si se ha añadido la skin a las que tiene el jugador y se le ha actualizado el dinero
// En caso de que no exista la skin o el jugador devuelve false o si ya tiene esa skin
function comprarSkin(idJugador, idSkin);

//Intercambiar propiedades con otro jugador, sin tener en cuenta el dinero ni nada, solamente se cambia el nombre del propietario.
function intercambiarPropiedades(id_partida, id_jugador1, id_jugador2, propiedad1, propiedad2);

//devuelve el numero de casas de la propiedad "nCasasPropiedadX". Devuelve -1 si algo ha ido mal
function obtenerNumCasasPropiedad(idPartida,propiedad);

//devuelve el numero de casas de la propiedad "nCasasPropiedadX". Devuelve -1 si algo ha ido mal
function obtenerNumCasasPropiedad(idPartida,propiedad);

// Eliminar al jugador dado la propiedad dada, sumanodle el dinero de la propiedad.
function liberarPropiedadJugador(id_partida, id_jugador, propiedad, dineroJugador, dineroPropiedad)

//obtener el precio de la propiedad en una partida.
function obtenerPrecioPropiedad(idPartida, numPropiedades);


// jugadorPaga paga el alquiler al jugadorRecibe por estar en propiedad si pertenece 
// al jugadorRecibe
async function pagarAlquiler(id_jugadorPaga, id_jugadorRecibe, propiedad, idPartida, precioPropiedad);


// Devuelve el listado de los jugadores y sus puntuaciones totales en el torneo (Menor es que ha quedado mas veces primero)
// ejemplo=> jugador1 - puntuacion1 , jugador2 - puntuacion2
// En caso de que no exista el torneo, o no tenga partidas acabadas para poder sacar datos, devuelve false
function verClasificacionTorneo(idTorneo);


//funcion que saca dinero del banco y lo mete en dinero de la cuenta del jugador.
//Devuelve el dinero del jugador sacado del banco.
//Devuelve -2 si no tiene el dinero suficiente en el banco para sacarlo.
//Devuelve -1 si ha ido algo mal.
function sacarDineroBancoAPartida(id_partida,id_jugador,cantidad);


// Devuelve false si no existe partida o jugador o ese jugador no esta en esa partida
//Devuelve true si se ha sustituido por bot correctamente
// Si el jugador ya era bot da igual devuelve true otra vez y le vuelve a convertir en bot
function sustituirJugadorPorBot(idJugador, idPartida);

// Devuelve false si no existe partida o jugador o ese jugador no esta en esa partida
//Devuelve true si se ha sustituido por bot por jugador correctamente
// Si el jugador ya era jugador da igual devuelve true otra vez y le vuelve a convertir en jugador
function sustituirBotPorJugador(idJugador, idPartida);

// Devuelve false si no existe partida o jugador o ese jugador no esta en esa partida
// Devuelve el id del siguiente jugador y si es bot y si es fin de partida
// ejemplo jugador bot y no fin --> pedro@gmail.com : 1 , 0
function obtenerSiguienteJugador(idJugador, idPartida);


// Devuelve el dinero que le queda al usuario despues edificar la propiedad IdPropiedad y
//  gastar X dinero obtenido del precio base y el numero de casas que tiene edificado.
// En caso de que no exista jugador o partida o que la propiedad no sea suya o ya haya edificado el maximo devuelve false 
// OJOO maximo de casas a edificar es 5
function edificarPropiedad(idJugador, idPartida, propiedad);


//  Se obtienen todas las propiedades que tiene el usuario se obtiene el numero de 
//  casas que tiene en cada una y se devuelve un string indicando que propiedades 
//  tiene el usuario y cuanto le costaría edificar teniendo en cuenta el numero de 
//  casas que tiene en cada propiedad, se obtiene un string de la siguiente forma:
//  propiedad1-precio1,propiedad2-precio2,propiedad3-precio3,etc…
//Si el jugador o la partida no existen devuelve false
// OJOO , el nCasas al comprar la propiedad se debe poner a 0 pq esta puesto a null
function propiedadesEdificar(idJugador, idPartida);


// El propietario de la vivienda pasara a ser el vendedor. 
// Al comprador se le restara la cantidad y si es mayor que 0 el saldo aceptara la transferencia, 
// en caso de que no haya dinero devolvera -1, en caso de que vaya todo bien, devolvera 1.
async function venderPropiedadJugador(id_partida, id_jugador_vendedor, id_jugador_comprador, cantidad, n_propiedad);

//FUNCION INTERNA LA CUAL SE LE LLAMA DESDE UNA FUNCION, NO LLAMARLA EN LA LOGICA.
//Funcion que dado un comprador y un vendedor, verifica que la casa sea del vendedor y el comprador realiza la compra.
function anyadirPropiedadCompradorVendedor(id_partida,id_jugador_comprador,id_jugador_vendedor,n_propiedad);

//funcion la cual crea una partida y la enlaza con el torneo id_torneo.
//El torneo tiene que existir y el jugador tambien.
async function crearPartidaTorneo(id_jugador, id_torneo);


// Establece el orden de los jugadores en la partida definida
// En caso de que no existan los jugadores en juega devuelve faslse, sino true
function establecerOrdenPartida(idPartida,idJugador1,idJugador2,idJugador3,idJugador4);

//funcion la cual inicie una partida (poner a 1 enCurso). Si la partida tiene 4 jugadores la iniciamos normal, sino rellenamos con bots 
//hasta llegar a 4 jugadores y la iniciamos.
async function iniciarPartida(idPartida);

//funcion la cual una vez acabada la partida, indica que dicha partida no esta en curso.
function acabarPartida(idPartida);

//se eliminan todos los bots los cuales han sido creados para la partida con id, idPartida.
function eliminarBotsPartida(idPartida);


// Devuelve el listado de jugadores y su posicion en la partida asi -> jugador1:posicion,jugaodr2:posicion ...
//En caso de que no exista la aprtida entonces devuelve false
function obtenerPosicionJugadores(idPartida);


// Devuelve el listado de jugadores y su dinero en la partida asi -> jugador1:dinero,jugaodr2:dinero ...
//En caso de que no exista la aprtida entonces devuelve false
function obtenerDineroJugadores(idPartida);

//
//  SEGUNDA VERSION, por si la primera falla
function obtenerDineroJugadores2(idPartida);


//funcion la cual devuelve el jugador en la posicion establecida de la partida idPartida. Devuelve -1 si hay algo mal y la posicion actualizada si todo ha ido bien. 
//Devuelve -2 si estaba en la carcel y no actualiza la posicion.
function actualizarPosicionJugador(idJugador, idPartida, posicion);

//funcion la cual devuelve los jugadores de la partida unidos con : y 1 si esta vivo y 0 sino esta vivo.
function estadoJugadoresPartida(idPartida);

//devuelve 1 si es un bot y 0 si es un jugador
function jugadorEsBot(ID_jugador, ID_partida);

//modificar las gemas del usuario.
function modificarGemas(ID_usuario, cantidad);

//funcion que devuelva cada jugador y en que posicion ha quedado cada uno al acabar dicha partida. (jugador1:posicion,jugador2:posicion)
function resultadoPartida(idPartida);

//funcion la cual dado un jugador, una propiedad y una partida, te devuelve dicha propiedad cambiando el jugador que habia por el nuevo jugador.
//devuelve true si ha ido todo bien, -1 si has intentado cambiar el propietario por el mismo que ya esta y false si algo ha ido mal.
function expropieseSeñorAlcalde(idPartida, idJugador, propiedad);


// De un vector con los turnos posibles, se busca el siguiente mayor al turno dado pero usando 
// algebra modular
//
function encontrarNumeroMayor(vector, numero)


// Devuelve el listado de skins y si las tienje el jugador dado con email idJugador (1 si la tiene, 0 si no)
//  con el siguiente formato, ->    skin1:0,skin2:1
function obtenerSkinsJugador(idJugador)

// Devuelve la economía de la partida dado el id de la partida
function obtenerEconomia(idPartida);

// Dado el id de la partida y una economia la actualiza 
function actualizarEconomia(idPartida, economia);

// Devuelve el evento de la partida dado el id de la partida
function obtenerEvento(idPartida);

// Dado el id de la partida y un evento, lo actualiza 
function actualizarEvento(idPartida, evento);

// Devuelve la ronda de la partida dado el id de la partida
function obtenerRonda(idPartida);

// Dado el id de la partida y una ronda, la actualiza 
function actualizarRonda(idPartida, ronda);

// Dado el id de la partida, el id de jugador y el numero de propiedad, vende una casa de esa propiedad 
function venderCasa(idPartida, idJugador, n_propiedad);

// Dado el id de la partida, el id de jugador y el numero de propiedad, vende la propiedad a la banca y el jugador
// recibe el dinero de la venta (el dinero es la mitad de lo que cuesta la propiedad).
// Si la propiedad tenia propiedades, se devuelve la mitad de lo que ha costado cada propiedad.
// Las propiedades cuestan en cada fila 50 mas. Fila 1: 50, Fila2: 100, etc...
function venderPropiedadBanca(idPartida, idJugador, n_propiedad);

//funcion la cual inserta en la tabla tieneSkin el usaurio y la skin.
function insertarSkin(idUsuario, idSkin);

//Dado un email, inserta un nuevo usuario al juego del Monopòly y añade una skin default en la tabla tieneSkin.
async function insertarUsuarioConSkin(userData);

//Actualiza el precio de la propiedad subastada en una partida específica para el jugador con el email indicado.
function actualizarPrecioSubasta(idPartida, precio, email);

//Actualiza el precio de la propiedad subastada en una partida específica para el jugador con el email indicado.
function actualizarPropiedadSubasta(idPartida, nombre, email);

//Devuelve el precio de la propiedad subastada en una partida específica para el jugador con el email indicado.
function obtenerPrecioSubasta(idPartida, email);

// Actualiza el turno de una partida para saber quien es el siguiente en jugar
function actualizarTurno(idPartida, email);

//Devuelve el nombre de la propiedad subastada en una partida específica para el jugador con el email indicado.
function obtenerNombreSubasta(idPartida, email);

//Dada una partida y un numero(entero), pone el valor de numTurnosSubasta al valor de ese numero.
function actualizarNumTurnosSubasta(idPartida, numTurnosSubasta);

//Dada una partida, devuelve el numero de turnos activos. Sino hay subasta(es null) devuelve 0.
function obtenerNumTurnosActivos(idPartida);

//funcion que dada una partida y un jugador, devuelva todas las propiedades a la banca.
async function devolverPropiedadesBanca(idPartida, idJugador) ;



// Con esta fucnion se le quita al jugador de la partida poniendo estaVivo a 0 y asignandole 
// la posicion en la que ha quedado
function matarJugador(email, idPartida)


// Libera las propiedades de la partida dada 
// En caso de que no exista esa partida devuelve false, en caso contrario true
//
function liberarPropiedadesJugador(idPartida, propiedades)



// Con esta funcion se le expropia al jugador y además se le elimina de la partida, 
//se le pone a 0 estaVivo y se le asigna la posicion en que ha quedado

async function jugadorAcabadoPartida(idJugador, idPartida)

// Funcion la cual devuelve true si la partida dada pertenece a un torneo.
async function perteneceTorneo(ID_Partida);

// Funcion que actualiza la posicion en la que quedan los jugadores ( o revisar la funcoon de eliminarJugadorPartida para que lo haga)

// Funcion que me devuelva el numero de partidas que se han jugado dado el ID_Torneo

//funcion la cual devuelve un string con los jugadores separados por una coma.
function obtenerJugadoresTorneo(ID_Torneo);


// / Funcion que me devuelva el lider del torneo, y si no hay nadie asociado al torneo devuelve false
function obtenerLiderTorneo(idTorneo);

//Añadimos bot al torneo
async function AnyadirBotTorneo(ID_Torneo);

