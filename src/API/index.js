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


//obtenerResultadoInsertar('AE,1234,AE@gmail.com,11234');

//obtenerResultadoBorrar('sara@example.com');

//obtenerResultadoMover('juan@example.com',9,1);

//obtenerResultadoDinero('pedro@example.com',100);

