const test = require('./app')
const con = require('./db');




//FUNCIONA OKEY.
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

//obtenerResultadoInsertar('AEASD,1234,AEoooo@gmail.com,11234');

//obtenerResultadoBorrar('sara@example.com');

//obtenerResultadoMover('juan@example.com',9,1);

//obtenerResultadoDinero('pedro@example.com',100);

//obtenerResultadoImpuesto('pedro@example.com',50,1);

//obtenerResultadoDineroJugador('pedro@example.com',1);

//obtenerResultadoMoverCarcel('juan@example.com',1);

//obtenerResultadoEstaEnCarcel('juan@example.com',1);

