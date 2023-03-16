/*
 ----------------------------------------------------------------------------
 * Fichero: index.js
 * Autores: Jesus Lizama Moreno, Cesar Vela Martínez y David Rivera Seves
 * NIPs: 816473, 816590, 815124
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha ultima actualizacion: 16/03/2023
 ----------------------------------------------------------------------------
*/


const test = require('./funcionesAPI')
const con = require('./db');


//funciona OKEY.
async function obtenerResultadoInsertar(userData) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      const resultado = await test.insertarUsuario(userData);
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
    const resultado = await test.comprobarInicioSesion(email,pass);
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
      const resultado = await test.borrarUsuario(userData);
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
    const resultado = await test.moverJugador(a,b,c);
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
    const resultado = await test.modificarDinero(email,dinero);
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
    const resultado = await test.pagarImpuestos(email,dinero,idPartida);
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
    const resultado = await test.obtenerDinero(email,idPartida);
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
    const resultado = await test.enviarCarcel(email,idPartida);
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
    const resultado = await test.verificarCarcel(email,idPartida);
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
    const resultado = await test.sumarDineroBote(cantidad,idPartida);
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
    const resultado = await test.obtenerDineroBote(idJugador,idPartida);
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
    const resultado = await test.dineroBanco(idJugador,idPartida);
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
    const resultado = await test.meterDineroBanco(idJugador,idPartida,cantidad);
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
    const resultado = await test.jugadorEnPartida(idJugador);
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
    const resultado = await test.crearTorneo(idJugador, nPartidas);
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
    const resultado = await test.unirseTorneo(idJugador, idTorneo);
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
    resultado = await test.obtenerInformacionJugador(id_jugador);
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
    resultado = await test.obtenerPosicion(id_jugador,id_partida);
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
    resultado = await test.crearPartida(id_jugador, id_torneo);
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
    resultado = await test.unirsePartida(id_jugador, id_partida);
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
    resultado = await test.empezarPartida(id_partida, id_lider);
    console.log("El resultado obtenido de empezar partida es :", resultado);
    
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
//obtenerResultadoEmpezarPartida(1, 'david@gmail.com')