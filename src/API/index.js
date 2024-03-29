/*
 ----------------------------------------------------------------------------
 * Fichero: index.js
 * Autores: Jesus Lizama Moreno, Cesar Vela Martínez 
 * NIPs: 816473, 816590
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
async function obtenerResultadoComprobarUser(email, pass) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testJugador.comprobarInicioSesion(email, pass);
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
async function obtenerResultadoMover(a, b, c) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.moverJugador(a, b, c);
        console.log("Resultado de mover:", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}


//funciona OKEY.
async function obtenerResultadoDinero(email, dinero) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.modificarDinero(email, dinero);
        console.log("Resultado de mover:", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//funciona OKEY.
async function obtenerResultadoImpuesto(email, dinero, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.pagarImpuestos(email, dinero, idPartida);
        console.log("Resultado de pagar impuestos:", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//funciona OKEY.
async function obtenerResultadoDineroJugador(email, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.obtenerDinero(email, idPartida);
        console.log("Resultado de obtener dinero: ", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}


//funciona OKEY.
async function obtenerResultadoMoverCarcel(email, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.enviarCarcel(email, idPartida);
        console.log("Resultado de mover jugador carcel: ", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//funciona OKEY.
async function obtenerResultadoEstaEnCarcel(email, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.verificarCarcel(email, idPartida);
        console.log("Resultado de esta en la carcel : ", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoActualizarBote(cantidad, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.sumarDineroBote(cantidad, idPartida);
        console.log("El resultado obtenido de actualizar el bote es :", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}


//FUNCIONA OKEY.
async function obtenerResultadoDineroBote(idJugador, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.obtenerDineroBote(idJugador, idPartida);
        console.log("El resultado obtenido de actualizar el dinero de un jugador dado el bote es :", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoDineroJugador(idJugador, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.dineroBanco(idJugador, idPartida);
        console.log("El resultado obtenido de devolver el dinero de un jugador en la partida :", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoActualizarDinero(idJugador, idPartida, cantidad) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await testPartida.meterDineroBanco(idJugador, idPartida, cantidad);
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
        resultado = await testPartida.obtenerPosicion(id_jugador, id_partida);
        console.log("El resultado obtenido de Obtener Informacion Jugador es :", resultado);

        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}


//FUNCIONA OKEY.
async function obtenerResultadoCrearPartida(id_jugador,) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.crearPartida(id_jugador,);
        console.log("El resultado obtenido de crear partida Jugador es :", resultado);

        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}


//FUNCIONA OKEY.
async function obtenerResultadoUnirsePartida(id_jugador, id_partida) {
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
async function obtenerResultadoEmpezarPartida(id_partida, id_lider) {
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
async function obtenerResultadoComprobarDinero(id_partida, id_jugador, cantidad) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.comprobarDinero(id_partida, id_jugador, cantidad);
        console.log("El resultado obtenido de comprobar dinero es :", resultado);

        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoObtenerNumPropiedades(id_partida, id_jugador) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.obtenerNumPropiedades(id_partida, id_jugador);
        console.log("El resultado obtenido de obtener numero de propiedades es :", resultado);

        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}


//FUNCIONA OKEY.
async function obtenerResultadoComprarPropiedad(id_partida, id_jugador, n_propiedad, precio_propiedad) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.comprarPropiedad(id_partida, id_jugador, n_propiedad, precio_propiedad);
        console.log("El resultado obtenido de obtener numero de propiedades es :", resultado);

        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoObtenerPropiedades(id_partida, id_jugador) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.obtenerPropiedades(id_partida, id_jugador);
        console.log("El resultado obtenido de obtener propiedades concatenadas es :", resultado);

        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoObtenerJugadorPropiedad(n_propiedad, id_partida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.obtenerJugadorPropiedad(n_propiedad, id_partida);
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
async function obtenerResultadoObtenerNumCasasPropiedad(idPartida, propiedad) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.obtenerNumCasasPropiedad(idPartida, propiedad);
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
async function obtenerResultadoObtenerNumCasasPropiedad(idPartida, propiedad) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.obtenerNumCasasPropiedad(idPartida, propiedad);
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
        resultado = await testPartida.pagarAlquiler(id_jugadorPaga, id_jugadorRecibe, propiedad, idPartida, precioPropiedad);
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
        const resultado = await testTorneo.verClasificacionTorneo(idTorneo);
        console.log("El resultado obtenido de calsificacion Torneo es:", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoSacarDineroBancoAPartida(id_partida, id_jugador, cantidad) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        let resultado;
        resultado = await testPartida.sacarDineroBancoAPartida(id_partida, id_jugador, cantidad);
        console.log("El resultado obtenido de sacar dinero del banco es :", resultado);

        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}


//FUNCIONA OKEY.
async function obtenerSustituirJugadorPorBot(idJugador, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.sustituirJugadorPorBot(idJugador, idPartida);
        console.log("El resultado obtenido de sustituir jugador por bot es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerSustituirBotPorJugador(idJugador, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.sustituirBotPorJugador(idJugador, idPartida);
        console.log("El resultado obtenido de sustituir jugador por bot es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerObtenerSiguienteJugador(idJugador, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.obtenerSiguienteJugador(idJugador, idPartida);
        console.log("El resultado obtenido de siguiente jugfador es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }


  //FUNCIONA OKEY.
async function obtenerPropiedadesEdificar(idJugador, idPartida) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.obtenerPropiedadesEdificaciones(idJugador, idPartida);
        console.log("El resultado obtenido de obtener propiedades que edificiar es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerEdificarPropiedad(idJugador, idPartida, propiedad) {
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.edificarPropiedad(idJugador, idPartida, propiedad);
        console.log("El resultado obtenido de edificar propiedad es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoAnyadirPropiedadCompradorVendedor(id_partida, id_jugador_vendedor, id_jugador_comprador, cantidad, n_propiedad) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.venderPropiedadJugador(id_partida, id_jugador_vendedor, id_jugador_comprador, cantidad, n_propiedad);
      console.log("El resultado obtenido de compraVenta del inmueble :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoCrearPartidaTorneo(id_jugador,id_torneo) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.crearPartidaTorneo(id_jugador,id_torneo);
      console.log("El resultado obtenido de crear Partida en torneo:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }


//FUNCIONA OKEY.
async function obtenerEstablecerOrdenPartida(idPartida,idJugador1,idJugador2,idJugador3,idJugador4){
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.establecerOrdenPartida(idPartida,idJugador1,idJugador2,idJugador3,idJugador4);
        console.log("El resultado obtenido de obtener orden partida es:", resultado);
        return resultado;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoIniciarPartida(idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.iniciarPartida(idPartida);
      console.log("El resultado obtenido de iniciar Partida es:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
}

//FUNCIONA OKEY.
async function obtenerResultadoEliminarBotsPartida(idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.eliminarBotsPartida(idPartida);
      console.log("El resultado obtenido de eliminar bots de una partida es :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
}


  //FUNCIONA OKEY.
async function obtenerResultadoAcabarPartida(idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.acabarPartida(idPartida);
      console.log("El resultado obtenido de acabar partida es:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
}


//FUNCIONA OKEY.
async function obtenerObtenerPosicionJugadores(idPartida){
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.obtenerPosicionJugadores(idPartida);
        console.log("El resultado obtenido de obtener posicion partida es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerObtenerDineroJugadores(idPartida){
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.obtenerDineroJugadores(idPartida);
        console.log("El resultado obtenido de obtener dinero partida es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }


//FUNCIONA OKEY.
async function obtenerResultadoEstadoJugadoresPartida(idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.estadoJugadoresPartida(idPartida);
      console.log("El resultado obtenido de analizar el estado de la partida es:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoActualizarPosicionJugador(idJugador,idPartida,posiciones) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.actualizarPosicionJugador(idJugador,idPartida,posiciones);
      console.log("El resultado obtenido de actualizar posicion de un jugador es:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
//FUNCIONA OKEY.
async function obtenerResultadoJugadorAcabadoPartida(idJugador,idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.jugadorAcabadoPartida(idJugador,idPartida);
      console.log("El resultado obtenido de acabar partida para ujn jugador es:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoPartida(idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.resultadoPartida(idPartida);
      console.log("El resultado obtenido de la partida es:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoModificarGemas(ID_usuario, cantidad) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.modificarGemas(ID_usuario, cantidad);
      console.log("El resultado obtenido de modificar gemas:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  //FUNCIONA OKEY.
  async function obtenerResultadoJugadorEsBot(idJugador,idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.jugadorEsBot(idJugador,idPartida);
      console.log("El resultado obtenido de :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }

  //FUNCIONA OKEY.
  async function obtenerResultadoExpropiarJugador(idPartida, idJugador, propiedad) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.expropieseSeñorAlcalde(idPartida, idJugador, propiedad);
      console.log("El resultado obtenido de exporpiar es :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }


  //FUNCIONA OKEY.
async function obtenerObtenerSkinsJugador(idJugador){
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.obtenerSkinsJugador(idJugador);
        console.log("El resultado obtenido las skins de jugador es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }
  

  //FUNCIONA OKEY.
async function obtenerResultadoObtenerEvento(idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.obtenerEvento(idPartida);
      console.log("El resultado obtenido de obtener el evento es :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoActualizarEvento(idPartida, evento) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.actualizarEvento(idPartida, evento);
      console.log("El resultado obtenido de actualizar el evento es :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoObtenerRonda(idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.obtenerRonda(idPartida);
      console.log("El resultado obtenido de obtener la ronda es :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoActualizarRondao(idPartida, ronda) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.actualizarRonda(idPartida, ronda);
      console.log("El resultado obtenido de actualizar la ronda es :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoModificarDineroBanco(idPartida, idJugador, cantidad) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.modificarDineroBanco(idPartida, idJugador, cantidad);
      console.log("El resultado obtenido de modificar el dinero es:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }

  //FUNCIONA OKEY.
  async function obtenerResultadoActualizarEconomia(idPartida, economia) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.actualizarEconomia(idPartida, economia);
      console.log("El resultado obtenido de actualizar la economia es :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoObtenerEconomia(idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.obtenerEconomia(idPartida);
      console.log("El resultado obtenido de obtener la economia es :", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }

  //FUNCIONA OKEY.
async function obtenerResultadoObtenerSiguienteJugador(idJugador, idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.obtenerSiguienteJugador(idJugador, idPartida);
      console.log("El resultado obtenido de obtenerSiguienteJugador:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }


  //FUNCIONA OKEY.
async function obtenerObtenerSiguienteJugador2(idJugador, idPartida) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      const resultado = await test.obtenerSiguienteJugador2(idJugador, idPartida);
      console.log("El resultado obtenido de siguiente jugfador es:", resultado);
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }


  //FUNCIONA OKEY.
async function obtenerVenderCasa(idPartida, idJugador, nPropiedad){
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.venderCasa(idPartida, idJugador, nPropiedad);
        console.log("El resultado obtenido vender Casa es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerVenderPropiedadBanca(idPartida, idJugador, nPropiedad){
    try {
        // Hacemos la llamada a la función que devuelve una Promesa.
        const resultado = await test.venderPropiedadBanca(idPartida, idJugador, nPropiedad);
        console.log("El resultado obtenido las skins de jugador es:", resultado);
        return resultado;
  
    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
  }

  //FUNCIONA OKEY.
async function obtenerResultadoActualizarPrecioSubasta(idPartida, precio, email) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.actualizarPrecioSubasta(idPartida, precio, email);
      console.log("El resultado obtenido de actualizar precio subasta:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoActualizarPropiedadSubasta(idPartida, nombre, email) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.actualizarPropiedadSubasta(idPartida, nombre, email);
      console.log("El resultado obtenido de actualizar propiedad subasta:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoObtenerPrecioSubasta(idPartida, email){
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.obtenerPrecioSubasta(idPartida, email);
      console.log("El resultado obtenido de precio subasta:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }
  
  
  //FUNCIONA OKEY.
  async function obtenerResultadoObtenerNombreSubasta(idPartida, email) {
    try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      let resultado;
      resultado = await test.obtenerNombreSubasta(idPartida, email);
      console.log("El resultado obtenido de obtener subasta:", resultado);
  
      return resultado;
  
    } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
    }
  }

  //FUNCIONA OKEY.
async function obtenerResultadoObtenerNumTurnosActivos(idPartida){
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.obtenerNumTurnosActivos(idPartida);
    console.log("El resultado obtenido de precio subasta:", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoActualizarNumTurnosSubasta(idPartida, numTurnosSubasta) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await testPartida.actualizarNumTurnosSubasta(idPartida, numTurnosSubasta)
    console.log("El resultado obtenido de obtener subasta:", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoDevolverPropiedadesBanca(idPartida, idJugador) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await test.devolverPropiedadesBanca(idPartida, idJugador);
    console.log("El resultado obtenido de devolver propiedades a la banca:", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerObtenerEstadoPartida(idPartida){
  try {
      // Hacemos la llamada a la función que devuelve una Promesa.
      const resultado = await test.obtenerEstadoPartida(idPartida);
      console.log("El estado global es:", resultado);
      return resultado;

  } catch (error) {
      // Si hay un error en la Promesa, devolvemos false.
      console.error("Error en la Promesa: ", error);
      return false;
  }
}

//FUNCIONA OKEY.
async function obtenerResultadoObtenerJugadoresTorneo(idTorneo) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await test.obtenerJugadoresTorneo(idTorneo);
    console.log("El resultado obtenido de obtener Jugadores Torneo:", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}


//FUNCIONA OKEY.
async function obtenerResultadoAnyadirBotTorneo(idTorneo) {
  try {
    // Hacemos la llamada a la función que devuelve una Promesa.
    let resultado;
    resultado = await test.AnyadirBotTorneo(idTorneo);
    console.log("El resultado obtenido de añadir bot al Torneo:", resultado);

    return resultado;

  } catch (error) {
    // Si hay un error en la Promesa, devolvemos false.
    console.error("Error en la Promesa: ", error);
    return false;
  }
}

// obtenerResultadoAnyadirBotTorneo(1);

// obtenerResultadoObtenerJugadoresTorneo(2);

// obtenerResultadoObtenerNumTurnosActivos(1);

// obtenerResultadoActualizarNumTurnosSubasta(1,5);

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

// obtenerResultadoSacarDineroBancoAPartida(1,'juan@example.com',5500);

//obtenerVerClasificacionTorneo(1);

//obtenerSustituirJugadorPorBot('chemita@example.com', 1);

//obtenerSustituirBotPorJugador('chemita@example.com', 1);

//obtenerObtenerSiguienteJugador('miguelito@example.com', 1);

//obtenerPropiedadesEdificar('albertito@example.com', 1);

//obtenerEdificarPropiedad('albertito@example.com', 1, 1);

//obtenerResultadoAnyadirPropiedadCompradorVendedor(2 ,'juan@example.com','juan.perez@example.com',50, 2);

// obtenerResultadoCrearPartidaTorneo('juan@example.com',1);

// obtenerEstablecerOrdenPartida(2,'albertito@example.com','chemita@example.com','miguelito@example.com','pedrito@example.com');

// obtenerResultadoIniciarPartida(5);

// obtenerResultadoEliminarBotsPartida(2);

// obtenerResultadoAcabarPartida(5);

//obtenerObtenerPosicionJugadores(1);

//obtenerObtenerDineroJugadores(1);

// obtenerResultadoEstadoJugadoresPartida(1);

// obtenerResultadoActualizarPosicionJugador('juan@example.com',1,20);

// obtenerResultadoJugadorAcabadoPartida('juan@example.com',1);

// obtenerResultadoPartida(1);

// obtenerResultadoModificarGemas('juan@example.com',30);

// obtenerResultadoJugadorEsBot('juan@example.com',1);

// obtenerResultadoExpropiarJugador(2,'maria@example.com',2);

// obtenerResultadoObtenerEconomia(1);

// obtenerResultadoActualizarEconomia(1,500);

// obtenerResultadoObtenerEvento(1);

// obtenerResultadoActualizarEvento(1,'Sexo');

// obtenerResultadoObtenerRonda(1);

// obtenerResultadoActualizarRondao(1,4)

// obtenerResultadoModificarDineroBanco(1,'juan@example.com',500)

// obtenerResultadoObtenerSiguienteJugador('jesus@example.com',1);

// obtenerResultadoObtenerSiguienteJugador2('jesus@example.com',1);

//obtenerVenderCasa(1, 'jugador1@example.com', 9);

//obtenerVenderPropiedadBanca(1, 'jugador1@example.com', 39);

// obtenerResultadoActualizarPrecioSubasta(1, 3300, 'cesar@example.com');

// obtenerResultadoActualizarPropiedadSubasta(1, 'propiedad5', 'cesar@example.com');

// obtenerResultadoObtenerPrecioSubasta(1,'cesar@example.com');

// obtenerResultadoObtenerNombreSubasta(1,'cesar@example.com');

// obtenerResultadoDevolverPropiedadesBanca(1,'juan@example.com');




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
// obtenerObtenerSkinsJugador('jugador1@example.com');



// obtenerObtenerEstadoPartida(1);
