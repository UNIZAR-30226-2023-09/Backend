/*
 ----------------------------------------------------------------------------
 * Fichero: --.js
 * Autor: ---
 * NIP: ---
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha: 21/02/2023
 ----------------------------------------------------------------------------
*/

const con = require('./db');

/*
======================INSERTAR USUARIO=====================================
*/
function insertarUsuario(userData) {
  return new Promise((resolve, reject) => {
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
              con.query(sql, values, (error, results, fields) => {
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
=====================BORRAR USUARIO DEL MONOPOLY===========================
*/

/*
    borrarUsuario(email);
    Dado un email, si existe lo borra y devuelve true, sino devuelve false.
*/

function borrarUsuario(email) {

  return new Promise((resolve, reject) => {
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
// Mover el jugador, número veces hacia delante 
// Ej: moverJugador(1, 5) -> mover el jugador 1, 5 casillas, es decir, su nueva posición // será la actual + 5
moverJugador(jugador, numero);
*/


function moverJugador(jugador, posiciones, idPartida) {
    return new Promise((resolve, reject) => {
      con.connect();
      // Comprobar si el jugador existe en la tabla "juega".
      const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
      con.query(query, (error, results) => {
          if (error) {
              con.end();
              reject(error);
          } else if (results.length === 0) {
              // Si el jugador no existe, devolver false
              console.log("Esta vacio lenght");
              con.end();
              resolve(false);
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
                  // Devolver true si todo ha ido bien
                  con.end();
                  resolve(true);
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
