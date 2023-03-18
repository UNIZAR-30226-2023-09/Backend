METER SOCKET EN TODAS LAS FUNCIONES
Registrarse funciona OK -> si registra un usuario que ya existe peta


-------FORMATO MENSAJES-----------------------------------------
// Cuando creo un torneo
CREADOT_OK,id_torneo

// Si no se puede crear el torneo
CREADOT_NOOK,ID_jugador

// Unirse OK a un torneo
UNIRSET_OK,ID_Torneo,ID_jugador

// No puede unirse a un torneo
UNIRSET_NO_OK,ID_Torneo,ID_jugador

// Cuando creo una partida
CREADAP_OK,id_partida

// Cuando no se puede crear una partida (por si acaso)
CREADAP_NOOK,ID_jugador

// Cuando empieza una partida bien se mandan los 4 ids de jugadores en el orden correspondiente
EMPEZAR_OK,ID_partida,ID_jugador1,ID_jugador2,ID_jugador3,ID_jugador4

// Cuando no empieza una partida bien
EMPEZAR_NO_OK,ID_partida

// Unirse ok a una partida
UNIRP_OK,ID_partida,ID_jugador

// No se une correctamente a una partida
UNIRP_NO_OK,ID_partida,ID_jugador

// Después de lanzar los dados
DADOS,dado1,dado2,posicionNueva

// Cuando modifico dinero de un jugador
NUEVO_DINERO_JUGADOR,ID_jugador,nuevoDinero; 

// Cuando modifico dinero del BOTE
NUEVO_DINERO_BOTE,dineroBote;

// Cuando se cae en la casilla de BOTE -> te llevas su dinero
OBTENER_BOTE,ID_jugador,dineroBote

// Cuando un jugador no puede vender una propiedad
VENDER_NO_OK,ID_jugador,propiedad

// Cuando un jugador vende correctamente una propiedad
VENDER_OK,propiedad,dineroResultanteJugador

// Cuando cae en la casilla de casino 
// Espero recibir:  APOSTAR,cantidad
DINERO_APOSTAR,ID_jugador

// Si el dinero a apostar es mayor que el dinero disponible del jugador
APOSTAR_NOOK,ID_jugador,ID_partida

// Ha apostado correctamente
APOSTAR_OK,ID_jugador,nuevoDinero,ID_partida

// Si le toca ir a la carcel
DENTRO_CARCEL,ID_jugador

// Cuando un jugador le tiene que pagar el alquiler a otro
NUEVO_DINERO_ALQUILER,dineroJugadorPaga,dineroJugadorRecibe

// Cuando se cae en la casilla del banco
// Espero recibir:  METER/SACAR,ID_jugador,ID_partida,cantidad  (en funcion de lo que quiera hacer el jugador)
ACCION_BANCO,ID_jugador,ID_partida,cantidad

// Si es meter dinero en el banco
METER_DINERO_BANCO,ID_jugador,ID_partida,dineroJugadorBanco,dineroJugador

// Si es sacar dinero del banco
SACAR_DINERO_BANCO,ID_jugador,ID_partida,dineroJugadorBanco,dineroJugador

// Cuando caes en una casilla de propiedad libre -> dar opción de comprarla
// Espero recibir: SI/NO_COMPRAR_PROPIEDAD,ID_jugador,propiedad,ID_partida
QUIERES_COMPRAR_PROPIEDAD,ID_jugador,propiedad,ID_partida

// Cuando un jugador no puede comprar una propiedad
COMPRAR_NO_OK,ID_jugador,propiedad,ID_partida

// Cuando un jugador compra correctamente una propiedad
COMPRAR_OK,ID_jugador,propiedad,dineroResultanteJugador,ID_partida

// Cuando un jugador quiera vender propiedad espero recibir: venderPropiedad,ID_jugador,propiedad,ID_partida


// Espero recibir QUIERO_EDIFICAR,ID_jugador,ID_partida
Servidor genera una lista con las propiedades que puede edificar -> EDIFICAR,ID_jugador,propiedad1-precio1,propiedad2-precio2,..
// Espero recibir EDIFICAR,ID_jugador,ID_partida,propiedad-precio
Servidor comprueba que tenga dinero suficiente para edificar y en ese caso mando EDIFICAR_OK,propiedad,nuevoDineroJugador
                                                                    si no tiene  EDIFICAR_NOOK,propiedad

// Cuando es finTurno espero recibir: finTurno,ID_jugador,ID_partida  (el jugador que ha acabado el turno)
Si es un jugador mando: TURNO,ID_jugador,ID_partida
Si es un bot no mando nada

-------------------------------------------------------------------------------------------------------------------------------------
LOS DE LA BASE TIENEN QUE HACER UNA FUNCION QUE DEVUELVA DADO UN JUGADOR, TODAS LAS PROPIEDADES QUE PUEDE EDIFICAR JUNTO A SU PRECIO DE EDIFICAR
(propiedad1-precio1,propiedad2-precio2,...), ES DECIR, ESTE JUGADOR TIENE TODAS LAS PROPIEDAS DEL MISMO COLOR.

modificarDinero -> QUE DEVUELVA EL DINERO RESULTANTE