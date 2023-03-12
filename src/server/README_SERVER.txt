METER SOCKET EN TODAS LAS FUNCIONES
Registrarse funciona OK -> si registra un usuario que ya existe peta


-------FORMATO MENSAJES-------
// Cuando creo un torneo
CREADOT_OK,id_torneo

// Unirse OK a un torneo
UNIRSET_OK,ID_Torneo,ID_jugador

// No puede unirse a un torneo
UNIRSET_NO_OK,ID_Torneo,ID_jugador

// Cuando creo una partida
CREADAP_OK,id_partida

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

// Cuando un jugador no puede comprar una propiedad
COMPRAR_NO_OK,ID_jugador,propiedad

// Cuando un jugador compra correctamente una propiedad
COMPRAR_OK,propiedad,dineroResultanteJugador

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
