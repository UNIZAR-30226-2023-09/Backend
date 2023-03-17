/*
 ----------------------------------------------------------------------------
 * Fichero: funcionesAPI.js
 * Autores: Jesus Lizama Moreno, Cesar Vela Martínez y David Rivera Seves
 * NIPs: 816473, 816590, 815124
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha ultima actualizacion: 16/03/2023
 ----------------------------------------------------------------------------
*/

const db = require('./db');

const POSICION_CARCEL = 11;
const POSICION_BOTE = 21;
const NUM_TURNOS_CARCEL = 3;

/*
======================INSERTAR USUARIO=====================================
*/

/*
  insertarUsuario(userData);
  Dado un email, inserta un nuevo usuario al juego del Monopòly.
*/
function insertarUsuario(userData) {
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect(function(err) {
      if (err) {
        reject(err);
      } else {
        const [username, password, email, gemas] = userData.split(',');
        const query = `SELECT * FROM Jugador WHERE email = '${email}'`;
        con.query(query, (error, results) => {
          if (error) {
            resolve(false);
            con.end(); // Cerrar conexión
          } else {
            if (results.length > 0) {
              resolve(false);
              con.end(); // Cerrar conexión
            } else {
              const sql = `INSERT INTO Jugador (gemas, nombre, pass, email) VALUES (?, ?, ?, ?)`;
              const gemasInt = parseInt(gemas, 10);
              const values = [gemasInt, username.trim(), password.trim(), email.trim()];
              con.query(sql, values, (error, results2, fields) => {
                if (error) {
                  con.end(); // Cerrar conexión
                  resolve(false);
                } else {
                  con.end(); // Cerrar conexión
                  resolve(true);
                }
              });
            }
          }
        });
      }
    });

  });
}

exports.insertarUsuario = insertarUsuario;




/*
======================COMPROBAR EXISTE USUARIO=====================================
*/


// Comprueba si el jugador tiene una cuenta asociada con el email y contraseña 
// correspondiente
// Si es correcto -> devuelve el número de gemas que tiene el jugador
// Si no es correcto -> devuelve -1 (no puede tener gemas negativas así que 
// entendemos de que no existe un email/contraseña asociados

/*

  Pasos a seguir para que sea seguro:
    1. Buscamos que el usuario exista y devolvemos la contraseña de la base.
    2. Si la contraseña que devuelve la query es igual que la que nos pasan como parametro devolvemos las gemas. 
       En caso contrario, devolvemos false.
*/

function comprobarInicioSesion(email, contrasenya){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect(function(err) {
      if (err) {
        reject(err);
      } else {
        const query = `SELECT pass,gemas FROM Jugador WHERE email = '${email}'`;
        con.query(query, (error, results) => {
          if (error) {
            resolve(false);
            con.end(); // Cerrar conexión
          } 
          else if (results.length === 0) {
            // Si el jugador no existe, devolver false.
            console.log("No existe el jugador. :(");
            con.end();  // Cerrar conexión
            resolve(-1);
          } 
          else {
            let gemas, pass;
            gemas = results[0].gemas; //guardamos las gemas para devolverlas si la contraseña coincide.
            pass = results[0].pass;   //guardamos la contrasenya para poder compararla y verificar si es correecta o no.
            if(pass == contrasenya){
              //son iguales, devolvemos numero de gemas.
              resolve(gemas);
            }
            else{
              //no son iguales las contrasenyas, devolvemos false.
              resolve(-1);
            }
            con.end(); // Cerrar conexión
          }
        });
      }
    });

  });

}

exports.comprobarInicioSesion = comprobarInicioSesion;



/*
=====================BORRAR USUARIO DEL MONOPOLY===========================
*/

/*
  borrarUsuario(email);
  Dado un email, si existe lo borra y devuelve true, sino devuelve false.
*/

// FALTA REVISAR BIEN FUNCION DE BORRAR Y ANALIZAR EL CORRECTO ORDEN PARA BORRAR!!!
function borrarUsuario(email) {

  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    // Verifica si el usuario existe
    con.query(`SELECT * FROM Jugador WHERE email='${email}'`, (error, results) => {
      if (error) {
        con.end();
        reject(error);
      } else if (results.length === 0) {
        // Si el usuario no existe, devuelve false
        con.end();
        resolve(false);
      } else {
        // Si el usuario existe, borra el registro de todas las tablas relacionadas
        con.query(`DELETE FROM juega WHERE email='${email}'`, (error) => {
          if (error) {
            con.end();
            reject(error);
          } else {
            con.query(`DELETE FROM Partida WHERE carta1='${email}' OR carta2='${email}'`, (error) => {
              if (error) {
                con.end();
                reject(error);
              } else {
                con.query(`DELETE FROM tieneSkins WHERE email='${email}'`, (error) => {
                  if (error) {
                    con.end();
                    reject(error);
                  } else {
                    con.query(`DELETE FROM estaEnTorneo WHERE email='${email}'`, (error) => {
                      if (error) {
                        con.end();
                        reject(error);
                      }  else {
                        con.query(`DELETE FROM Jugador WHERE email='${email}'`, (error) => {
                          if (error) {
                            con.end();
                            reject(error);
                          } else {
                            // Si se pudo borrar el usuario, devuelve true
                            con.end();
                            resolve(true);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

exports.borrarUsuario = borrarUsuario;


/*
=====================MOVER JUGADOR DEL MONOPOLY===========================
*/

/*
// Mover el jugador, número veces hacia delante , devolviendo la posicion acutal en la que se encuentra el usuario.
// En caso de error devolera 0.
// Ej: moverJugador(1, 5) -> mover el jugador 1, 5 casillas, es decir, su nueva posición // será la actual + 5
moverJugador(jugador, numero);
*/


function moverJugador(jugador, posiciones, idPartida) {
    return new Promise((resolve, reject) => {
      var con = db.crearConexion();
      con.connect();
      // Comprobar si el jugador existe en la tabla "juega".
      const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
      con.query(query, (error, results) => {
          if (error) {
              con.end();
              reject(error);
          } else if (results.length === 0) {
              // Si el jugador no existe, devolver 0.
              con.end();
              resolve(0);
          } else {
              // Si el jugador existe, actualizar su posición
              const partidaId = results[0].idPartida;
              const nuevaPosicion = results[0].posicion + posiciones;
              const updateQuery = `UPDATE juega SET posicion = ? WHERE email = ? AND idPartida = ?`;
              //si metes entre [] los valores, son los de la query que ponemos interrogantes.
              con.query(updateQuery, [nuevaPosicion, jugador, partidaId], (error, results) => {
                  if (error) {
                  con.end();
                  reject(error);
                  } else {
                  // Devolver la nueva posicion si todo ha ido bien.
                  con.end();
                  resolve(nuevaPosicion);
                  }
              });
          }
      });
    });
}

exports.moverJugador = moverJugador;



/*
===================MODIFICAR DINERO JUGADOR DEL MONOPOLY===================
*/


/*
// Modificar el dinero del jugador en la cantidad proporcionada, (la cantidad puede
// ser positiva o negativa)
modificarDinero(jugador, cantidad);
*/
function modificarDinero(jugador, cantidad) {
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    // Comprobar si el jugador existe en la tabla "juega".
    const query = `SELECT dinero FROM juega WHERE email = '${jugador}'`;
    console.log(query);
    con.query(query, (error, results) => {
      if (error) {
        console.log("ERROR!!");
        con.end();
        reject(error);
      } else if (results.length === 0) {
        // Si el jugador no existe, devolver false
        console.log("Esta vacio lenght");
        con.end();
        resolve(false);
      } 
      else {
        // Realizar la consulta para modificar el dinero del jugador
        const query = `UPDATE juega SET dinero = ? WHERE email = ?`;
        let dinero = results[0].dinero;
        dinero += cantidad;
        const values = [dinero, jugador];
        con.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
          con.end();
        });
      }
    });
  });
}

exports.modificarDinero = modificarDinero;


/*
===================PAGAR IMPUESTOS=========================================
*/

// Pagar impuestos a la banca de un cierto jugador en cierta partida. Eso significa, que el jugador se le resta
// la cantidad de dinero y se le suma al bote de cierta partida con identificador idPartida.
/*
* 1º-> Comprobar que el usuario este en la partida.
* 2-> Si esta en la partida, le quitamos el dinero, y se lo sumamos a la banca. Aunque se le quede dinero negativo, se le 
* resta igualmente. devuleve true si todo ha ido bien, y false en caso contrario.
*/
function pagarImpuestos(jugador, cantidad, idPartida){
  return new Promise((resolve, reject) => {
    con.connect();
    var con = db.crearConexion();
    const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
    console.log(query);
    con.query(query, (error, results) => {
      if (error) {
        con.end(); // Aquí se debe cerrar la conexión
        reject(error);
      } else if (results.length === 0) {
        con.end(); // Aquí se debe cerrar la conexión
        resolve(false);
      } else {
        const query = `UPDATE juega SET dinero = ? WHERE email = ?`;
        let dinero = results[0].dinero;
        dinero -= cantidad;
        const values = [dinero, jugador];
        con.query(query, values, (error, results) => {
          if (error) {
            con.end(); // Aquí se debe cerrar la conexión
            reject(error);
          } else {
            const query2 = `SELECT bote FROM Partida WHERE idPartida = '${idPartida}'`;
            con.query(query2, (error, results2) => {
              if (error) {
                con.end(); // Aquí se debe cerrar la conexión
                reject(error);
              } else {
                let banca = results2[0].bote;
                banca += cantidad;
                const query3 = `UPDATE Partida SET bote = '${banca}' WHERE idPartida = '${idPartida}'`;
                con.query(query3, (error, results3) => {
                  if (error) {
                    con.end(); // Aquí se debe cerrar la conexión
                    reject(error);
                  } else {
                    con.end(); // Aquí se debe cerrar la conexión
                    resolve(true);
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}


exports.pagarImpuestos = pagarImpuestos;


/*
===================OBTENER DINERO JUGADOR EN PARTIDA=========================================
*/


// Obtener el dinero actual de un jugador en cierta partida. Primero comprobamos que el jugador este en la 
// partida y despues devolvemos el dinero. Sería conveniente hacer una funcion externa que devuleca true esi 
//cierto usuario esta en cierta partida.
function obtenerDinero(jugador, idPartida) {
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    // Conectar a la base de datos
    con.connect((err) => {
      if (err) {
        reject(err);
      } else {
        // Comprobar si el jugador existe en la tabla "juega" (si está en la partida)
        const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
        con.query(query, (error, results) => {
          if (error) {
            // Si hay un error, rechazar la promesa y cerrar la conexión
            reject(error);
          } else if (results.length === 0) {
            // Si el jugador no existe en la partida, resolver la promesa con -1 y cerrar la conexión
            resolve(-1);
          } else {
            // Una vez comprobado que está en la partida, realizar una consulta para devolver el dinero del jugador
            const query3 = `SELECT dinero FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
            con.query(query3, (error, results3) => {
              if (error) {
                // Si hay un error, rechazar la promesa y cerrar la conexión
                reject(error);
              } else {
                // Si todo ha ido bien, resolver la promesa con el dinero y cerrar la conexión
                let dinero = results3[0].dinero;
                resolve(dinero);
              }
            });
          }
          // Cerrar la conexión a la base de datos
          con.end();
        });
      }
    });
  });
}


exports.obtenerDinero = obtenerDinero;







/*
===================MOVER JUGADOR CARCEL=========================================
*/



// Enviar a un jugador a la cárcel(mover posición del jugador a la carcel(9) y poner numero de tiradas en carcel = 3).
function enviarCarcel(jugador,idPartida){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
    const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
    con.query(query, (error, results) => {
      if (error) {
        console.log("ERROR!!");
        con.end();
        reject(error);
      } else if (results.length === 0) {
        // Si el jugador no existe en la partida, devolver false.
        console.log("Esta vacio lenght");
        con.end();
        resolve(false);
      } 
      else {
        //una vez comprobado que esta en la partida, realizaremos consulta para ver si se ecnuentra en la posicion 
        //de carcel, si es asi devuelve true y no lo mueve de posicion, y en caso contrario lo mueve a la posicion de la carcel y actualiza 
        //el numero de tiradas en carcel a 3.
        const query2 = `SELECT posicion FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
        con.query(query2, (error, results2) => {
          if (error) {
            reject(error);
          } else {
            //si ha ido bien devolvemos la posicion.
            let posicion = results2[0].posicion;
            if(posicion == POSICION_CARCEL){
              //esta en la casilla de la carcel, devuelve true y no se le actualiza la posicion.
              con.end();
              resolve(true);
            }
            else{
              //no esta en la casilla de la carcel, devuelve true cuando se le ha actualizado la posicion y el numero de tiradas 
              //restringidas.
              let vari = POSICION_CARCEL;
              const query3 = `UPDATE juega SET posicion= '${vari}' WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
              con.query(query3, (error, results3) => {
                if (error) {
                  con.end();
                  reject(error);
                } 
                else {
                  //ha actualizado la posicion del jugador y ahora se encuentra en la carcel.
                  //ahora actualizaremos el numero de tiradas en carcel.
                  const query4 = `UPDATE juega SET posicion= '${vari}' WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
                  con.query(query4, (error, results4) => {
                    if (error) {
                      con.end();
                      reject(error);
                    } 
                    else {
                      //ha actualizado la posicion del jugador y ahora se encuentra en la carcel.
                      //ahora actualizaremos el numero de tiradas en carcel. 
                      const query5 = `UPDATE juega SET nTurnosCarcel= '${NUM_TURNOS_CARCEL}' WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
                      con.query(query5, (error, results5) => {
                        if (error) {
                          con.end();
                          reject(error);
                        } 
                        else {
                          //ha actualizado el numero de turnos en la carcel correctamente y devuelve true.
                          con.end();
                          resolve(true);       
                        }
                      });        
                    }
                  });
                  
                }
              });
              
            }            
          }
        });
      }
    });
  });
}
exports.enviarCarcel = enviarCarcel;


/*
===================VERIFICA JUGADOR EN CARCEL=========================================
*/

// Verificar si un jugador se encuentra en la posicion correspondiente a la carcel. Suponemos que la carcel 
// es la posicion "POSICION_CARCEL".
function verificarCarcel(jugador, idPartida){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
    const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
    console.log(query);
    con.query(query, (error, results) => {
      if (error) {
        console.log("ERROR!!");
        con.end();
        reject(error);
      } else if (results.length === 0) {
        // Si el jugador no existe en la partida, devolver false.
        console.log("Esta vacio lenght");
        con.end();
        resolve(false);
      } 
      else {
        //una vez comprobado que esta en la partida, realizaremos consulta para ver si se encuentra en la posicion 
        //de carcel, si es asi devuelve true, y en caso contrario devuelve false.
        const query2 = `SELECT posicion FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
        con.query(query2, (error, results2) => {
          if (error) {
            con.end();
            reject(error);
          } else {
            //si ha ido bien devolvemos la posicion.
            let posicion = results2[0].posicion;
            if(posicion == POSICION_CARCEL){
              //esta en la casilla de la carcel, devuelve true.
              con.end();
              resolve(true);
            }
            else{
              //no esta en la casilla de la carcel, devuelve false.
              con.end();
              resolve(false);
            }            
          }
        });
      }
    });
  });
}
exports.verificarCarcel = verificarCarcel;




/*
===================SUMAR DINERO AL BOTE DE UNA PARTIDA=========================================
*/


// Sumar el dinero dado al bote, dado el dinero que queremos añadir, y el identificador de la partida a la que queremos añadirlo.
/*
  Pasos:
    1. Sacamos el bote de la partida. (no es necesario comprobar que la partida esta activa, ya que el idPartida que nos dan es el de la partida actual que se esta jugando).
    2. Le sumamos la cantidad.
    3. Actualizamos el bote de la partida. Devolvemos -1 si ha ido mal y devolvemos el dinero del bote si ha ido bien.
*/
function sumarDineroBote(cantidad,idPartida){

  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    //Selecciona el bote de la partida.
    const query = `SELECT bote FROM partida WHERE idPartida = '${idPartida}'`;
    con.query(query, (error, results) => {
      if (error) {
        console.log("ERROR!!");
        con.end();
        reject(error);
      } else if (results.length === 0) {
        // Si la partida no existe, devolver false
        con.end();
        resolve(-1);
      } 
      else {
        // Realizar la consulta para modificar el dinero del jugador
        const query = `UPDATE partida SET bote = ? WHERE idPartida = ?`;
        let bote = results[0].bote;
        bote += cantidad;
        const values = [bote, idPartida];
        con.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            //todo ha ido okey, devolvemos el bote actualizado de la partida.
            resolve(bote);
          }
          con.end();
        });
      }
    });
  });

}


exports.sumarDineroBote = sumarDineroBote;



/*
===================SUMAR DINERO DEL BOTE A UN JUGADOR=========================================
*/


// Sumarle al jugador dado el dinero que hay en la casilla del bote (casilla 21).
/*
  Pasos: 
    1. Primero verificaremos que el jugador este en la partida.
    2. Verificaremos que el jugador este en la casilla 21.
    3. Obtendremos el bote y se lo sumaremos al saldo del jugador
  
    Devolveremos el dinero que tiene el jugador una vez actualicemos su dinero. En caso de que haya ido algo mal, devolveremos -1.
*/
function obtenerDineroBote(id_jugador,id_partida){

  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
    const query = `SELECT bote from partida where idPartida = '${id_partida}'`;
    console.log(query);
    con.query(query, (error, results) => {
      if (error) {
        console.log("ERROR!!");
        con.end();
        reject(error);
      } else if (results.length === 0) {
        // Si el jugador no existe en la partida, devolver false.
        con.end();
        resolve(-1);
      } 
      else {
        //una vez comprobado que esta en la partida, realizaremos consulta para ver si se encuentra en la posicion 
        //de bote, si es asi, se le añadira el bote a su cuenta. En caso contrario, devolveremos -1.
        let bote = results[0].bote;
        const query2 = `SELECT posicion, dinero FROM juega WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
        con.query(query2, (error, results2) => {
          if (error) {
            con.end();
            reject(error);
          } else {
            //si ha ido bien devolvemos la posicion y comprobamos.
            let posicion = results2[0].posicion;
            if(posicion == POSICION_BOTE){
              //esta en la casilla de bote, actualizamos el dinero del jugador y devolvemos el dinero resultante.
              const query3 = `UPDATE juega SET dinero = ? WHERE email = ? `;
              let dinero = results2[0].dinero;
              dinero +=bote;
              const values = [dinero, id_jugador];
              con.query(query3,values, (error, results3) => {
                if (error) {
                  con.end();
                  reject(error);
                } else {
                  //ha ido todo bien, actualizamos el bote a 0.
                  const query4 = `UPDATE partida SET bote = ? WHERE idPartida = ?`;
                  var dineroCero = 0;
                  const values2 = [dineroCero, id_partida];
                  con.query(query4,values2, (error, results3) => {
                    if (error) {
                      con.end();
                      reject(error);
                    } else {
                      //ha ido todo bien, devolvemos el dinero actualizado del jugador.
                      con.end();
                      resolve(dinero);    
                    }
                  });
                }
              });
            }
            else{
              //no esta en la casilla de bote, devuelve -1.
              con.end();
              resolve(-1);
            }            
          }
        });
      }
    });
  });
}

exports.obtenerDineroBote = obtenerDineroBote;



/*
===================DEVUELVE DINERO DE UN JUGADOR EN UNA PARTIDA=========================================
*/

// Dado un jugador, devuelve la cantidad de dinero que tiene en el banco. Si existe en la partida devuelve el dinero, en caso
// contrario, devuelve -1.
function dineroBanco(idJugador,idPartida){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
    const query = `SELECT dinero FROM juega WHERE email = '${idJugador}' AND idPartida = '${idPartida}'`;
    con.query(query, (error, results) => {
      if (error) {
        con.end();
        reject(error);
      } else if (results.length === 0) {
        // Si el jugador no existe en la partida, devolver false.
        con.end();
        resolve(-1);
      } 
      else {
        //una vez comprobado que esta en la partida, devuelve el dinero que tiene el jugador.
        let dinero = results[0].dinero;
        resolve(dinero);
      }
      con.end();
    });
  });
}

exports.dineroBanco = dineroBanco;



/*
===================NUMERO DE PROPIEDADES DE UN JUGADOR EN UNA PARTIDA=========================================
*/

// Obtener el número de propiedades dado un jugador y una partida.
// Devuelve -1, si algo ha ido mal.
function obtenerNumPropiedades(idJugador,idPartida){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
    const query = `SELECT num_propiedades FROM juega WHERE email = '${idJugador}' AND idPartida = '${idPartida}'`;
    con.query(query, (error, results) => {
      if (error) {
        con.end();
        reject(error);
      } else if (results.length === 0) {
        // Si el jugador no existe en la partida, devolver false.
        con.end();
        resolve(-1);
      } 
      else {
        //una vez comprobado que esta en la partida, devuelve el numero de propiedades del jugador.
        let numProp = results[0].num_propiedades;
        resolve(numProp);
      }
      con.end();
    });
  });
}

exports.obtenerNumPropiedades = obtenerNumPropiedades;



/*
===================METER DINERO AL BANCO DE UN JUGADOR=========================================
*/


// Dado un jugador, una partida y una cantidad meter ese dinero al banco(variable dineroInvertido).
// Devuelve la cantidad de dinero que tiene el jugador en el banco
function meterDineroBanco(idJugador, idPartida, cantidad) {
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    //comprobando que está en la partida, obtenemos el dinero del banco del jugador.
    const query = 'SELECT dineroInvertido FROM juega WHERE email = ? AND idPartida = ?';
    const values = [idJugador, idPartida];
    con.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        // Si no existe en juega, devolver -1.
        resolve(-1);
      } else {
        let dineroInver = results[0].dineroInvertido;
        const query2 = 'UPDATE juega SET dineroInvertido = ? WHERE email = ? AND idPartida = ?';
        dineroInver += cantidad;
        const values2 = [dineroInver, idJugador, idPartida];        
        con.query(query2, values2, (error, results2) => {
          if (error) {
            console.log(query2);
            reject(error);
          } else {
            //todo ha ido okey, devolvemos la cantidad de dinero que tiene en el banco el usuario.
            resolve(dineroInver);
          }
        });
      }
      con.end();
    }); 
  });
}

exports.meterDineroBanco = meterDineroBanco;


/*
===================ID_PARTIDA DE UN JUGADOR=========================================
*/

// Devuelve el id de la partida ACTIVA en la que esta el usuario "email". 
//En caso de que no tenga ninguna partida activa, devuelve -1.
function jugadorEnPartida(email){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    const query = `SELECT DISTINCT idPartida FROM juega WHERE email = '${email}'`;
    con.query(query, (error, results) => {
      if (error) {
        con.end();
        reject(error);
      } else if (results.length === 0) {
        con.end();
        resolve(-1);
      } else {
        let activa = false;
        for(let i = 0; i < results.length; i++){
          let partida = results[i].idPartida;
          const query2 = `SELECT * FROM partida WHERE idPartida = '${partida}' AND enCurso='1'`;
          con.query(query2, (error, results2) => {
            if (error) {
              con.end();
              reject(error);
            } else if (results2.length != 0) {
              activa = true;
              resolve(partida);
            }
            if (i === results.length - 1 && !activa) {
              con.end();
              resolve(-1);
            }
          });
        }
        con.end(); // Cerrar la conexión después de terminar el bucle.
      }
    });
  });
}


exports.jugadorEnPartida = jugadorEnPartida;



/*
===================OBTENER INFORMACION DE UN JUGADOR =========================================
*/

// Obtener información básica sobre un jugador (nombre, gemas, email, pass)
//devuelve una cadena de la siguiente forma: " email,gemas,nombre,pass".

function obtenerInformacionJugador(id_jugador){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    const query1 = `SELECT * FROM jugador WHERE email = '${id_jugador}'`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
      } else if (results1.length === 0) {
        resolve(-1);
      } else {
        //devolvemos en un vector los valores del usuario.
        let vector = [];
        vector[0] = results1[0].email;
        vector[1] = results1[0].gemas;
        vector[2] = results1[0].nombre;
        vector[3] = results1[0].pass;
        let cadena = vector.join(",");
        resolve(cadena);
      }
      con.end();
    });
  });
}

exports.obtenerInformacionJugador = obtenerInformacionJugador;


/*
===================OBTENER DUEÑO DE UNA PROPIEDAD =========================================
*/

// Devuelve el ID_jugador al que pertenezca la propiedad dada (-1 si no pertenece a nadie)
// Propiedad es un (integer) con el numero de propiedad.
function obtenerJugadorPropiedad(n_propiedad, id_partida){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    var concat = 'propiedad' + n_propiedad;
    const query1 = `SELECT ${concat} as nombre_propietario FROM Partida WHERE idPartida = ${id_partida}`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
      } else if (results1.length === 0) {
        resolve(-1);
      } else {
        let propietario = results1[0].nombre_propietario;
        if(propietario == null){
          //no tiene propietario, con lo que devolvemos -1.
          resolve(-1);
        }
        else{
          //tiene propietario, con lo que devolvemos el id_jugador(email).
          resolve(propietario);
        }
      }
    });
    con.end();
  });
}

exports.obtenerJugadorPropiedad = obtenerJugadorPropiedad;


/*
===================OBTENER POSICION DE UN JUGADOR =========================================
*/

// Obtener la posición actual de un jugador en una partida dada.

function obtenerPosicion(id_jugador, id_partida){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    const query1 = `SELECT posicion FROM juega WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
      } else if (results1.length === 0) {
        resolve(-1);
      } else {
        //devolvemos en un vector los valores del usuario.
        let pos = results1[0].posicion;
        resolve(pos);
      }
      con.end();
    });
  });
}
exports.obtenerPosicion=obtenerPosicion;


/*
===================COMPROBAR DINERO JUGADOR=========================================
*/

// Comprobar si el jugador dado tiene más dinero disponible que cantidad.
// Si lo tiene, actualiza su dinero con esa nueva cantidad(puede ser negativa) y devuelve true.
// Si no lo tiene que devuelva false.
function comprobarDinero(id_partida,id_jugador, cantidad){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    const query1 = `SELECT dinero FROM juega WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
      } else if (results1.length === 0) {
        resolve(-1);
      } else {
        //devolvemos el dinero del usuario.
        let dinero = results1[0].dinero;
        if(dinero >= cantidad){
          dinero+= cantidad;
          const query2 = `UPDATE juega SET dinero = '${dinero}' WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
          con.query(query2, (error, results2) => {
            if (error) {
              reject(error);
            }
            else {
              //devolvemos true si ha ido todo bien, habiendo actualizado el dinero del jugador.
              resolve(true);     
            }
          });
        }
        else{
          //no tiene suficiente dinero, devuelve false;
          resolve(false);
        }
      }
      con.end();
    });
  });
}
exports.comprobarDinero=comprobarDinero;


/*
===================OBTENER NUMERO DE PROPIEDADES JUGADOR EN PARTIDA =========================================
*/

// Obtener el número de propiedades dado un jugador. Devuelve -1 sino existe el jugador en la partida.
function obtenerNumPropiedades(id_partida,id_jugador){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    const query1 = `SELECT numPropiedades FROM juega WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
      } else if (results1.length === 0) {
        resolve(-1);
      } else {
        //devolvemos el dinero del usuario.
        let numProp = results1[0].numPropiedades;
        resolve(numProp);
      }
    });
    con.end();
  });

}
exports.obtenerNumPropiedades=obtenerNumPropiedades;


/*
===================COMPRAR PROPIEDAD =========================================
*/

// Compra una propiedad la cual tiene QUE ESTAR VACIA SI O SI. devuelve true, si ha ido correcto devuelve true
// y false en caso de que no haya sido posible comprarla. 
function comprarPropiedad(id_partida,id_jugador, n_propiedad,precio_propiedad){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    var concat = 'propiedad' + n_propiedad;
    const query1 = `SELECT ${concat} AS duenyo FROM Partida WHERE idPartida = '${id_partida}'`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
      } else if (results1.length === 0) {
        resolve(-1);
      } else {
        //devolvemos el dinero del usuario.
        let propiet = results1[0].duenyo;
        if(propiet != null){
          //tiene dueño, con lo que devolvemos false
          resolve(false);
        }
        else{
          //esta vacia, con lo que comprobamos que tenga saldo suficiente, y si es asi se lo resta al id_jugador y la compra.
          const query2 = `SELECT dinero, numPropiedades FROM juega WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
          con.query(query2, (error, results2) => {
            if (error) {
              reject(error);
            } else if (results2.length === 0) {
              resolve(-1);
            } else {
              //devolvemos el dinero del usuario.
              let moneyJugador = results2[0].dinero;
              if(moneyJugador >= precio_propiedad){
                //tiene suficiente dinero, con lo que la compra y se le descuenta el dinero.
                moneyJugador-= precio_propiedad;
                const query3 = `UPDATE juega SET dinero = ${moneyJugador} WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
                con.query(query3, (error, results3) => {
                  if (error) {
                    reject(error);
                  } else if (results3.affectedRows === 0) {
                    resolve(false);
                  } else {
                    //una vez actualizado el dinero, actualizamos para que la propiedad sea del jugador y el numPropiedades del jugador ++.
                    let prop = results2[0].numPropiedades;
                    prop++;
                    const query4 = `UPDATE juega SET numPropiedades = ${prop} WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
                    con.query(query4, (error, results4) => {
                      if (error) {
                        reject(error);
                      } else if (results4.affectedRows === 0) {
                        resolve(false);
                      } else {
                        //nos queda solamente actualizar la propieda con el nuevo propietario.
                        const query5 = `UPDATE Partida SET ${concat} = ${id_jugador} WHERE idPartida = '${id_partida}'`;
                        con.query(query5, (error, results5) => {
                          if (error) {
                            reject(error);
                          } else if (results5.affectedRows === 0) {
                            resolve(false);
                          } else {
                            //todo ha ido bien, asi que devolvemos true;
                            resolve(true);
                          }
                        });
                      }
                    });
                  }
                });
              } else {
                //si no tiene suficiente dinero, devolvemos false.
                resolve(false);
              }
            }
          });
        }
      }
    });
    con.end();
  });
}


exports.comprarPropiedad = comprarPropiedad;



/*
===================OBTENER PROPIEDADES JUGADOR EN PARTIDA =========================================
*/
// Obtener la lista de propiedades de un jugador. Si no tiene ninguna propiedad devuelve la cadena vacia (null).
//Las propiedades van devueltas en una cadena separada por comas: "propiedad1,propiedad2".
function obtenerPropiedades(id_partida,id_jugador){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    let propiedades = [];
    let n_propiedad = NUM_MINIMO_PROPIEDAD;

    for(; n_propiedad < NUM_MAX_PROPIEDAD; n_propiedad++){
      let concat = 'propiedad' + n_propiedad;
      const query = `SELECT ${concat} AS propiedad FROM Partida WHERE idPartida = '${id_partida}'`;
      con.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          resolve(null);
        } else {
          //comprobamos si es del usuario, si lo es, concatenamos, sino avanzamos siguiente propiedad.
          let dueño = results[0].propiedad;
          if(dueño == id_jugador){
            //es del dueño, agregamos la propiedad al final del vector.
            propiedades.push(concat);
          }
        }
      });
    }
    con.on('end', () => {
      let cadena = propiedades.join(",");
      if(cadena == ""){
        resolve(null);
      }
      else{
        resolve(cadena);
      }
    });
    con.end();
  });
}


exports.obtenerPropiedades=obtenerPropiedades;




/*
===================CREAR TORNEO CON ID_JUGADOR Y NPARTIDAS =========================================
*/

// Devuelve el id_torneo del torneo recien creado por el jugador idJugador
//En caso de que no pueda crearse el torneo, o el jugador idJugador no exista devuelve -1.
function crearTorneo(idJugador, nPartidas){
  return new Promise((resolve, reject) => {
    var con = db.crearConexion();
    con.connect();
    const query = `SELECT * FROM Jugador WHERE email = '${idJugador}'`;       // Vemos si existe el jugador
    con.query(query, (error, results) => {
      if (error) {                            // Caso -- ERROR
        con.end();
        reject(error);
      } else if (results.length === 0) {      // Caso -- No existe
        con.end();
        resolve(-1);
      } else {                                // Caso -- Existe
        const query2 = `SELECT MAX(idTorneo) AS maxid FROM Torneo;`;
        con.query(query2, (error, results2) => {
          if (error) {
            con.end();
            reject(error); 
          } else {

            let nuevoId = results2[0].maxid;
            let devolver = 0;
            let sql = ``;

            if(nuevoId == null){            // Caso -- No hay ningun Torneo hasta la fecha
              sql = `INSERT INTO Torneo (nPartidas, estaActivo, idTorneo) VALUES ('${nPartidas}', true, 1);`;
              devolver = 1;
            }
            else{                           // Caso -- Cogemos idTorneo maximo +1 y lo asignamos al nuevo torneo
              sql = `INSERT INTO Torneo (nPartidas, estaActivo, idTorneo) VALUES ('${nPartidas}', true, '${nuevoId+1}');`;
              devolver = nuevoId+1;
            }

            con.query(sql, (error, results) => {
              if (error) {                            // Caso -- ERROR
                con.end();
                reject(error);
              } else {                                // Caso -- Se creo el Torneo correctamente
                const sql2 = `INSERT INTO estaEnTorneo (idTorneo, email) VALUES ('${devolver}', '${idJugador}');`;
                con.query(sql2, (error, results) => {
                  if (error) {                        // Caso -- ERROR
                    con.end();
                    reject(error);
                  } else {                            // Caso -- Se asocio el jugador al torneo correctamente
                    con.end();
                    resolve(devolver);
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}


exports.crearTorneo = crearTorneo;





/*
===================AÑADIR JUGADOR CON ID_JUGADOR A TORNEO CON ID_TORNEO =========================================
*/

// Devuelve el true si se ha añadido al jugador id_jugador, al torneo con id_torneo
//En caso de que no exista el torneo o el jugador devuelve false o ya se haya metido al jugador en ese torneo.
function unirseTorneo(idJugador, idTorneo){
    return new Promise((resolve, reject) => {
      var con = db.crearConexion();
      con.connect();
      const query = `SELECT * FROM Jugador WHERE email = '${idJugador}'`;       // Vemos si existe el jugador
      con.query(query, (error, results) => {
        if (error) {                                    // Caso -- ERROR
          con.end();
          reject(error);
        } else if (results.length === 0) {              // Caso -- No existe JUGADOR
          con.end();
          resolve(false);
        } else {                                        // Caso -- Existe JUGADOR

          const query2 = `SELECT * FROM Torneo WHERE idTorneo = '${idTorneo}';`;
          con.query(query2, (error, results2) => {
            if (error) {                                // Caso -- ERROR
              con.end();
              reject(error);
            } else if (results2.length === 0) {         // Caso -- No existe TORNEO
              con.end();
              resolve(false); 
            } else {                                    // Caso -- Existe TORNEO

              const query3 = `SELECT * FROM estaEnTorneo WHERE idTorneo = '${idTorneo}' AND email = '${idJugador}';`;
              con.query(query3, (error, results3) => {
                if (error) {                            // Caso -- ERROR
                  con.end();
                  reject(error);
                } else if (results3.length === 0) {     // Caso -- No existe una entrada ya en estaEnTorneo -> SE AÑADE

                  const sql = `INSERT INTO estaEnTorneo (idTorneo, email) VALUES ('${idTorneo}', '${idJugador}');`;
                  con.query(sql, (error, results) => {
                    if (error) {                        // Caso -- ERROR
                    con.end();
                    reject(error);
                    } else {                            // Caso -- Se asocio el jugador al torneo correctamente
                    con.end();
                    resolve(true);
                    }
                  });

                } else {                                // Caso --  Existe una entrada ya en estaEnTorneo
                  con.end();
                  resolve(false);
                }
              });
            }
          });
        }
      });
    });
  }
  
  
  exports.unirseTorneo = unirseTorneo;
  


/*
=================== CREAR PARTIDA =========================================
*/

// Devuelve el id de la partida creada
// crearPartida(id_jugador) crea partida rapida
// crearPartida(id_jugador, id_torneo) crea partida asociada a un torneo
function crearPartida(id_jugador, id_torneo = null) {
  return new Promise((resolve, reject) => {
    const con = db.crearConexion();
    con.connect();
    const query1 = `SELECT * FROM Jugador WHERE email = '${id_jugador}'`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
        con.end();
        return;
      }
      if (results1.length === 0) {
        resolve(-1); // Si no existe jugador
        con.end();
        return;
      }
      const jugador_id = results1[0].email;
      const perteneceTorneo = (id_torneo === null) ? "NULL" : parseInt(id_torneo);
      const query2 = `INSERT INTO Partida (ronda, bote, evento, economia, precioBase, enCurso, perteneceTorneo) VALUES (0, 0, 0, 0, 0, NULL, ${perteneceTorneo})`;
      con.query(query2, (error, results2) => {
        if (error) {
          reject(error);
          con.end();
          return;
        }
        const partida_id = results2.insertId;
        const query3 = `SELECT * FROM Jugador WHERE email = '${id_jugador}'`;
        con.query(query3, (error, results3) => {
          if (error) {
            reject(error);
            con.end();
            return;
          }
          // Unir al jugador a la partida
          const partida_id = results2.insertId;
          const query3 = `INSERT INTO juega (numPropiedades, dineroInvertido, nTurnosCarcel, posicion, dinero, skin, email, idPartida) VALUES (0, 0, 0, 0, 0, 'default', '${id_jugador}', ${partida_id})`;
          con.query(query3, (error, results3) => {
            if (error) {
              reject(error);
              con.end();
              return;
            }
            resolve(partida_id);
            con.end();
          });
        });
      });
    });
  });
}

  exports.crearPartida = crearPartida;



/*
=================== UNIRSE A PARTIDA =========================================
*/

// Devuelve true si se ha unido con éxito, false de lo contrario
function unirsePartida(id_jugador, id_partida) {
  return new Promise((resolve, reject) => {
    const con = db.crearConexion();
    con.connect();
    const query1 = `SELECT * FROM Jugador WHERE email = '${id_jugador}'`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
        con.end();
        return;
      }
      if (results1.length === 0) {
        resolve(false); // Si no existe jugador
        con.end();
        return;
      }
      const jugador_id = results1[0].email;
      const query2 = `SELECT * FROM Partida WHERE idPartida = ${id_partida}`;
      con.query(query2, (error, results2) => {
        if (error) {
          reject(error);
          con.end();
          return;
        }
        if (results2.length === 0) {
          resolve(false); // Si no existe partida
          con.end();
          return;
        }
        const query3 = `INSERT INTO juega (numPropiedades, dineroInvertido, nTurnosCarcel, posicion, dinero, skin, email, idPartida) VALUES (0, 0, 0, 0, 0, 'default', '${id_jugador}', ${id_partida})`;
        con.query(query3, (error, results3) => {
          if (error) {
            reject(error);
            con.end();
            return;
          }
          resolve(true); // Devolver true si todo ha ido bien
          con.end();
        });
      });
    });
  });
}

exports.unirsePartida = unirsePartida;



/*
=================== EMPEZAR LA PARTIDA =========================================
*/

// Devuelve true si se ha empezado la partida con éxito, false de lo contrario
// Empezar una partida existente, solo la puede llamar el líder que ha creado la partida
function empezarPartida(id_partida, id_lider) {
  return new Promise((resolve, reject) => {
    const con = db.crearConexion();
    con.connect();
    const query1 = `SELECT * FROM Jugador WHERE email = '${id_lider}'`;
    con.query(query1, (error, results1) => {
      if (error) {
        reject(error);
        con.end();
        return;
      }
      if (results1.length === 0) {
        resolve(false); // Si no existe jugador
        con.end();
        return;
      }
      const jugador_id = results1[0].email;
      const query2 = `SELECT * FROM juega WHERE idPartida = ${id_partida} AND email = '${id_lider}'`;
      con.query(query2, (error, results2) => {
        if (error) {
          reject(error);
          con.end();
          return;
        }
        if (results2.length === 0) {
          resolve(false); // Si el jugador no participa en esta partida
          con.end();
          return;
        }
        const query3 = `UPDATE Partida SET enCurso = true WHERE idPartida = ${id_partida}`;
        con.query(query3, (error, results3) => {
          if (error) {
            reject(error);
            con.end();
            return;
          }
          resolve(true);
          con.end();
        });
      });
    });
  });
}

exports.empezarPartida = empezarPartida;

