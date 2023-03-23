/*
 ----------------------------------------------------------------------------
 * Fichero: index.js
 * Autores: Jesus Lizama Moreno, Cesar Vela Martínez y David Rivera Seves
 * NIPs: 816473, 816590, 815124
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha ultima actualizacion: 17/03/2023
 ----------------------------------------------------------------------------
*/


const testPartida = require('./partidaAPI');  //habria que cambiar este require por cada uno de los ficheros nuevos creados.
const testTorneo = require('./torneoAPI');
const testJugador = require('./jugadorAPI');
const testSkin = require('./skins');
const con = require('./db');


//funciona OKEY.
async function obtenerResultadoInsertar(userData) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      const resultado = await testJugador.insertarUsuario(userData);
      console.log("El resultado obtenido de la consulta es:", resultado);
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
}


//FUNCIONA OKEY.
async function obtenerResultadoComprobarUser(email,pass) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testJugador.comprobarInicioSesion(email,pass);
    console.log("El resultado obtenido de la comprobarUsuario es :", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//REVISAR FUNCIONAMIENTO BORRAR.
async function obtenerResultadoBorrar(userData) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      const resultado = await testJugador.borrarUsuario(userData);
      console.log("Resultado de borrar:", resultado);
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
}


//funciona OKEY.
async function obtenerResultadoMover(a,b,c) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.moverJugador(a,b,c);
    console.log("Resultado de mover:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//funciona OKEY.
async function obtenerResultadoDinero(email,dinero) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.modificarDinero(email,dinero);
    console.log("Resultado de mover:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//funciona OKEY.
async function obtenerResultadoImpuesto(email,dinero,idPartida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.pagarImpuestos(email,dinero,idPartida);
    console.log("Resultado de pagar impuestos:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//funciona OKEY.
async function obtenerResultadoDineroJugador(email,idPartida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.obtenerDinero(email,idPartida);
    console.log("Resultado de obtener dinero: ", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//funciona OKEY.
async function obtenerResultadoMoverCarcel(email,idPartida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.enviarCarcel(email,idPartida);
    console.log("Resultado de mover jugador carcel: ", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//funciona OKEY.
async function obtenerResultadoEstaEnCarcel(email,idPartida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.verificarCarcel(email,idPartida);
    console.log("Resultado de esta en la carcel : ", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoActualizarBote(cantidad,idPartida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.sumarDineroBote(cantidad,idPartida);
    console.log("El resultado obtenido de actualizar el bote es :", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoDineroBote(idJugador,idPartida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.obtenerDineroBote(idJugador,idPartida);
    console.log("El resultado obtenido de actualizar el dinero de un jugador dado el bote es :", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoDineroJugador(idJugador,idPartida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.dineroBanco(idJugador,idPartida);
    console.log("El resultado obtenido de devolver el dinero de un jugador en la partida :", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoActualizarDinero(idJugador,idPartida,cantidad) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.meterDineroBanco(idJugador,idPartida,cantidad);
    console.log("El resultado obtenido de actualizar el dinero del banco es :", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoJugadorEnPartida(idJugador) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.jugadorEnPartida(idJugador);
    console.log("El resultado obtenido de devolver el id_partida es:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoCrearTorneo(idJugador, nPartidas) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testTorneo.crearTorneo(idJugador, nPartidas);
    console.log("El resultado obtenido de devolver el id_Torneo es:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoUnirseTorneo(idJugador, idTorneo) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testTorneo.unirseTorneo(idJugador, idTorneo);
    console.log("El resultado obtenido de devolver el id_Torneo es:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoObtenerInformacionJugador(id_jugador) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.obtenerInformacionJugador(id_jugador);
    console.log("El resultado obtenido de Obtener Informacion Jugador es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoObtenerPosicion(id_jugador, id_partida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.obtenerPosicion(id_jugador,id_partida);
    console.log("El resultado obtenido de Obtener Informacion Jugador es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoCrearPartida(id_jugador, id_torneo = null){
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.crearPartida(id_jugador, id_torneo);
    console.log("El resultado obtenido de crear partida Jugador es :", resultado);
    
    return resultado;
    
  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoUnirsePartida(id_jugador, id_partida){
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.unirsePartida(id_jugador, id_partida);
    console.log("El resultado obtenido de crear partida Jugador es :", resultado);
    
    return resultado;
    
  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoEmpezarPartida(id_partida, id_lider){
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.empezarPartida(id_partida, id_lider);
    console.log("El resultado obtenido de empezar partida es :", resultado);
    
    return resultado;
    
  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoComprobarDinero(id_partida,id_jugador,cantidad) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.comprobarDinero(id_partida,id_jugador,cantidad);
    console.log("El resultado obtenido de comprobar dinero es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoObtenerNumPropiedades(id_partida,id_jugador) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.obtenerNumPropiedades(id_partida,id_jugador);
    console.log("El resultado obtenido de obtener numero de propiedades es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoComprarPropiedad(id_partida,id_jugador, n_propiedad,precio_propiedad) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.comprarPropiedad(id_partida,id_jugador, n_propiedad,precio_propiedad);
    console.log("El resultado obtenido de obtener numero de propiedades es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoObtenerPropiedades(id_partida,id_jugador) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.obtenerPropiedades(id_partida,id_jugador);
    console.log("El resultado obtenido de obtener propiedades concatenadas es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoObtenerJugadorPropiedad(n_propiedad,id_partida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.obtenerJugadorPropiedad(n_propiedad,id_partida);
    console.log("El resultado obtenido de hallar dueño de la propiedad es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//funciona OKEY.
async function obtenerResultadoRestarTurnoCarcel(id_jugador, id_partida, turnos) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.restarTurnoCarcel(id_jugador, id_partida, turnos);
    console.log("Resultado de estae en la carcel : ", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoObtenerJugadoresPartida(idPartida) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testPartida.obtenerJugadoresPartida(idPartida);
    console.log("El resultado obtenido el listado de jugadores en la partida es:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoObtenerListadoSkins() {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testSkin.obtenerListadoSkins();
    console.log("El resultado obtenido de devolver listado de skins es:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerComprarSkin(idJugador, idSkin) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await testSkin.comprarSkin(idJugador, idSkin);
    console.log("El resultado obtenido de comprar la skin es:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoIntercambiarPropiedades(id_partida, id_jugador1, id_jugador2, propiedad1, propiedad2) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.intercambiarPropiedades(id_partida, id_jugador1, id_jugador2, propiedad1, propiedad2);
    console.log("El resultado obtenido de intercambiar propiedades es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoObtenerNumCasasPropiedad(idPartida,propiedad) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.obtenerNumCasasPropiedad(idPartida,propiedad);
    console.log("El resultado obtenido de obtener numero de casas de la propiedades es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoLiberarPropiedadJugador(id_partida, id_jugador, propiedad, dineroJugador, dineroPropiedad) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.liberarPropiedadJugador(id_partida, id_jugador, propiedad, dineroJugador, dineroPropiedad);
    console.log("El resultado obtenido de liberar propiedad es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoObtenerNumCasasPropiedad(idPartida,propiedad) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.obtenerNumCasasPropiedad(idPartida,propiedad);
    console.log("El resultado obtenido de obtener numero de casas de la propiedades es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoPagarAlquiler(id_jugadorPaga, id_jugadorRecibe, propiedad, idPartida, precioPropiedad) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await test.pagarAlquiler(id_jugadorPaga, id_jugadorRecibe, propiedad, idPartida, precioPropiedad);
    console.log("El resultado obtenido de pagar el alquiler es :", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerVerClasificacionTorneo(idTorneo) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    const resultado = await test.verClasificacionTorneo(idTorneo);
    console.log("El resultado obtenido de calsificacion Torneo es:", resultado);
    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//obtenerResultadoInsertar('AEASD,1234,AEoooo@gmail.com,11234');

//obtenerResultadoBorrar('sara@example.com');

//obtenerResultadoMover('juan@example.com',9,1);

//obtenerResultadoDinero('pedro@example.com',100);

//obtenerResultadoImpuesto('pedro@example.com',50,1);

//obtenerResultadoDineroJugador('pedro@example.com',1);

//obtenerResultadoMoverCarcel('juan@example.com',1);

//obtenerResultadoEstaEnCarcel('juan@example.com',2);

//obtenerResultadoComprobarUser('AEoooo@gmail.com',1234);

//obtenerResultadoActualizarBote(2000,'2');

//obtenerResultadoDineroBote('laura@example.com',1);

//obtenerResultadoDineroJugador('juan@example.com',1);

//obtenerResultadoActualizarDinero('juan@example.com',1,300);

//obtenerResultadoJugadorEnPartida('juan@example.com');

//obtenerResultadoCrearTorneo('AEoooo@gmail.com', 3);

//obtenerResultadoUnirseTorneo('pedro@example.com', 2);

//obtenerResultadoObtenerInformacionJugador('pedroSANCHEZ@example.com');

//obtenerResultadoObtenerPosicion('pedroSANCHEZ@example.com',1);

//obtenerResultadoComprobarDinero(1,'laura@example.com',11000);

//obtenerResultadoObtenerNumPropiedades(1,'laura@example.com');

//obtenerResultadoComprarPropiedad(1,'laura@example.com',1,3700);

//obtenerResultadoObtenerPropiedades(1,'juan@example.com');

// obtenerResultadoObtenerJugadorPropiedad(2,1);

// obtenerResultadoRestarTurnoCarcel('juan@example.com',1,2);

//obtenerResultadoIntercambiarPropiedades(1,'juan@example.com','laura@example.com',1,2);

// obtenerResultadoObtenerNumCasasPropiedad(1,1);

//obtenerResultadoLiberarPropiedadJugador(1,'pedro@example.com', 1, 750, 100);

// obtenerResultadoObtenerNumCasasPropiedad(1,1);


// obtenerResultadoPagarAlquiler('juan@example.com','laura@example.com',1,1,200);

//obtenerVerClasificacionTorneo(1);


// Probar partida rapida
//obtenerResultadoInsertar('david,1234,david@gmail.com,10');
//obtenerResultadoCrearPartida('david@gmail.com');

// Probar partida en torneo
//obtenerResultadoInsertar('david,1234,david@gmail.com,10');
//obtenerResultadoCrearTorneo('david@gmail.com', 1);
//obtenerResultadoCrearPartida('david@gmail.com', 1);

// Probar unirse a una partida
//obtenerResultadoInsertar('david,1234,david@gmail.com,10');
//obtenerResultadoInsertar('jesus,1234,jesus@gmail.com,10');
//obtenerResultadoCrearTorneo('david@gmail.com', 1);
//obtenerResultadoCrearPartida('david@gmail.com', 1);
//obtenerResultadoUnirsePartida('jesus@gmail.com', 1)

// Probar empezar partida
//obtenerResultadoInsertar('david,1234,david@gmail.com,10');
//obtenerResultadoCrearPartida('david@gmail.com');
//obtenerResultadoEmpezarPartida(2, 'david@gmail.com');

//obtenerResultadoObtenerJugadoresPartida(1);

// Probar Skins
//obtenerResultadoObtenerListadoSkins();
//obtenerComprarSkin('AEoooo@gmail.com', 'default2');