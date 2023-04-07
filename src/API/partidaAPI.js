/*
 ----------------------------------------------------------------------------
 * Fichero: funcionesAPI.js
 * Autores: Jesus Lizama Moreno, Cesar Vela Martínez 
 * NIPs: 816473, 816590
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha ultima actualizacion: 16/03/2023
 ----------------------------------------------------------------------------
*/

const db = require('./db');
const Jugador = require('./jugadorAPI');

const POSICION_CARCEL = 11;
const POSICION_BOTE = 21;
const NUM_TURNOS_CARCEL = 3;
const NUM_MINIMO_PROPIEDAD = 1;
const NUM_MAX_PROPIEDAD = 40;
const NUM_JUGADORES = 4;
const MAX_CASILLAS = 40;


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
                resolve(-1);
            }
            else {
                // Si el jugador existe, actualizar su posición
                const partidaId = results[0].idPartida;
                let nuevaPosicion = (results[0].posicion + posiciones) % 41;
                if (nuevaPosicion === 0) {
                    nuevaPosicion = 1;
                }
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
// Modificar el dinero del jugador en la cantidad proporcionada, (la cantidad puede
// ser positiva o negativa). Devuelve true si todo ha ido bien, y devuelve false si algo ha ido mal.
function modificarDinero(idPartida, jugador, cantidad) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        // Comprobar si el jugador existe en la tabla "juega".
        const query = `SELECT dinero FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
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
                const query = `UPDATE juega SET dinero = ? WHERE email = ? AND idPartida = ?`;
                let dinero = results[0].dinero;
                dinero += cantidad;
                const values = [dinero, jugador, idPartida];
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
function pagarImpuestos(jugador, cantidad, idPartida) {
    return new Promise((resolve, reject) => {
        con.connect();
        var con = db.crearConexion();
        const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
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
function enviarCarcel(jugador, idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
        const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
        con.query(query, (error, results) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {
                // Si el jugador no existe en la partida, devolver false.
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
                        if (posicion == POSICION_CARCEL) {
                            //esta en la casilla de la carcel, devuelve true y no se le actualiza la posicion.
                            con.end();
                            resolve(true);
                        }
                        else {
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
function verificarCarcel(jugador, idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
        const query = `SELECT * FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
        con.query(query, (error, results) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {
                // Si el jugador no existe en la partida, devolver false.
                con.end();
                resolve(false);
            }
            else {
                //una vez comprobado que esta en la partida, realizaremos consulta para ver si se encuentra en la posicion 
                //de carcel, si es asi devuelve true, y en caso contrario devuelve false.
                const query2 = `SELECT nTurnosCarcel FROM juega WHERE email = '${jugador}' AND idPartida = '${idPartida}'`;
                con.query(query2, (error, results2) => {
                    if (error) {
                        con.end();
                        reject(error);
                    } else {
                        //si ha ido bien devolvemos la posicion.
                        let turnosCarcel = results2[0].nTurnosCarcel;
                        con.end();
                        resolve(turnosCarcel);

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
function sumarDineroBote(cantidad, idPartida) {

    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        //Selecciona el bote de la partida.
        const query = `SELECT bote FROM Partida WHERE idPartida = '${idPartida}'`;
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
                const query = `UPDATE Partida SET bote = ? WHERE idPartida = ?`;
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
function obtenerDineroBote(id_jugador, id_partida) {

    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
        const query = `SELECT bote from Partida where idPartida = '${id_partida}'`;
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
                        if (posicion == POSICION_BOTE) {
                            //esta en la casilla de bote, actualizamos el dinero del jugador y devolvemos el dinero resultante.
                            const query3 = `UPDATE juega SET dinero = ? WHERE email = ? `;
                            let dinero = results2[0].dinero;
                            dinero += bote;
                            const values = [dinero, id_jugador];
                            con.query(query3, values, (error, results3) => {
                                if (error) {
                                    con.end();
                                    reject(error);
                                } else {
                                    //ha ido todo bien, actualizamos el bote a 0.
                                    const query4 = `UPDATE Partida SET bote = ? WHERE idPartida = ?`;
                                    var dineroCero = 0;
                                    const values2 = [dineroCero, id_partida];
                                    con.query(query4, values2, (error, results3) => {
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
                        else {
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
function dineroBanco(idJugador, idPartida) {
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
function jugadorEnPartida(email) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT DISTINCT idPartida FROM juega WHERE email = '${email}'`;
        con.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length === 0) {
                resolve(-1);
            } else {
                let activa = false;
                for (let i = 0; i < results.length; i++) {
                    let partida = results[i].idPartida;
                    const query2 = `SELECT * FROM Partida WHERE idPartida = '${partida}' AND enCurso='1'`;
                    con.query(query2, (error, results2) => {
                        if (error) {
                            reject(error);
                        } else if (results2.length != 0) {
                            activa = true;
                            resolve(partida);
                        }
                        if (i === results.length - 1 && !activa) {
                            resolve(-1);
                        }
                    });
                }
            }
            con.end(); // Cerrar la conexión después de terminar el bucle.
        });
    });
}

exports.jugadorEnPartida = jugadorEnPartida;



/*
===================OBTENER DUEÑO DE UNA PROPIEDAD =========================================
*/

// Devuelve el ID_jugador al que pertenezca la propiedad dada (-1 si no pertenece a nadie)
// Propiedad es un (integer) con el numero de propiedad.
function obtenerJugadorPropiedad(n_propiedad, id_partida) {
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
                if (propietario == null) {
                    //no tiene propietario, con lo que devolvemos -1.
                    resolve(-1);
                }
                else {
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

function obtenerPosicion(id_jugador, id_partida) {
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

exports.obtenerPosicion = obtenerPosicion;


/*
===================COMPROBAR DINERO JUGADOR=========================================
*/
// Comprobar si el jugador dado tiene más dinero disponible que cantidad.
// Si lo tiene, actualiza su dinero con esa nueva cantidad(puede ser negativa) y devuelve true.
// Si no lo tiene que devuelva false.
function comprobarDinero(id_partida, id_jugador, cantidad) {
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
                if (dinero >= cantidad) {
                    dinero += cantidad;
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
                else {
                    //no tiene suficiente dinero, devuelve false;
                    resolve(false);
                }
            }
            con.end();
        });
    });
}
exports.comprobarDinero = comprobarDinero;


/*
===================OBTENER NUMERO DE PROPIEDADES JUGADOR EN PARTIDA =========================================
*/

// Obtener el número de propiedades dado un jugador. Devuelve -1 sino existe el jugador en la partida.
function obtenerNumPropiedades(id_partida, id_jugador) {
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
exports.obtenerNumPropiedades = obtenerNumPropiedades;


/*
===================COMPRAR PROPIEDAD =========================================
*/
// Compra una propiedad la cual tiene QUE ESTAR VACIA SI O SI. devuelve true, si ha ido correcto devuelve true
// y false en caso de que no haya sido posible comprarla. 
function comprarPropiedad(id_partida, id_jugador, n_propiedad, precio_propiedad) {
    console.log("COMPRAR", id_partida, id_jugador, n_propiedad, precio_propiedad);
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
                let propiet = results1[0].duenyo;
                if (propiet != null) {
                    resolve(false);
                }
                else {
                    const query2 = `SELECT dinero, numPropiedades FROM juega WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
                    con.query(query2, (error, results2) => {
                        if (error) {
                            reject(error);
                        } else if (results2.length === 0) {
                            resolve(-1);
                        } else {
                            let moneyJugador = results2[0].dinero;
                            if (moneyJugador >= precio_propiedad) {
                                moneyJugador -= precio_propiedad;
                                const query3 = `UPDATE juega SET dinero = ${moneyJugador} WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
                                con.query(query3, (error, results3) => {
                                    if (error) {
                                        reject(error);
                                    } else if (results3.affectedRows === 0) {
                                        resolve(false);
                                    } else {
                                        let prop = results2[0].numPropiedades;
                                        prop++;
                                        const query4 = `UPDATE juega SET numPropiedades = ${prop} WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
                                        con.query(query4, (error, results4) => {
                                            if (error) {
                                                reject(error);
                                            } else if (results4.affectedRows === 0) {
                                                resolve(false);
                                            } else {
                                                const query5 = `UPDATE Partida SET ${concat} = '${id_jugador}' WHERE idPartida = '${id_partida}'`;
                                                con.query(query5, (error, results5) => {
                                                    if (error) {
                                                        reject(error);
                                                    } else if (results5.affectedRows === 0) {
                                                        resolve(false);
                                                    } else {
                                                        resolve(true);
                                                    }
                                                    // Aquí cerramos la conexión
                                                    con.end();
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                resolve(false);
                            }
                        }
                    });
                }
            }
        });
    });
}



exports.comprarPropiedad = comprarPropiedad;



/*
===================OBTENER PROPIEDADES JUGADOR EN PARTIDA =========================================
*/
// Obtener la lista de propiedades de un jugador. Si no tiene ninguna propiedad devuelve la cadena vacia (null).
//Las propiedades van devueltas en una cadena separada por comas: "propiedad1,propiedad2".
function obtenerPropiedades(id_partida, id_jugador) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        let propiedades = [];
        let n_propiedad = NUM_MINIMO_PROPIEDAD;

        for (; n_propiedad < NUM_MAX_PROPIEDAD; n_propiedad++) {
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
                    if (dueño == id_jugador) {
                        //es del dueño, agregamos la propiedad al final del vector.
                        propiedades.push(concat);
                    }
                }
            });
        }
        con.on('end', () => {
            let cadena = propiedades.join(",");
            if (cadena == "") {
                resolve(null);
            }
            else {
                resolve(cadena);
            }
        });
        con.end();
    });
}


exports.obtenerPropiedades = obtenerPropiedades;






/*
=================== CREAR PARTIDA =========================================
*/


// Devuelve el id de la partida creada
// crearPartida(id_jugador) crea partida rapida sin asociarse a ningun torneo.
function crearPartida(id_jugador) {
    return new Promise((resolve, reject) => {
        const con = db.crearConexion();
        con.connect();
        const query1 = `SELECT * FROM Jugador WHERE email = '${id_jugador}'`;
        con.query(query1, (error, results1) => {
            if (error) {
                reject(error);
                con.end();
            }
            else if (results1.length === 0) {
                resolve(-1); // Si no existe jugador
                con.end();
            }
            else {
                const jugador_id = results1[0].email;
                const query2 = `INSERT INTO Partida (ronda, bote, evento, economia, precioPropiedad1,
          precioPropiedad2,precioPropiedad3,precioPropiedad4,precioPropiedad5,precioPropiedad6,precioPropiedad7,precioPropiedad8,
          precioPropiedad9,precioPropiedad10,precioPropiedad11,precioPropiedad12,precioPropiedad13,precioPropiedad14,precioPropiedad15,
          precioPropiedad16,precioPropiedad17,precioPropiedad18,precioPropiedad19,precioPropiedad20,precioPropiedad21,precioPropiedad22,
          precioPropiedad23,precioPropiedad24,precioPropiedad25,precioPropiedad26,precioPropiedad27,precioPropiedad28,precioPropiedad29,
          precioPropiedad30,precioPropiedad31,precioPropiedad32,precioPropiedad33,precioPropiedad34,precioPropiedad35,precioPropiedad36,
          precioPropiedad37,precioPropiedad38,precioPropiedad39,precioPropiedad40) VALUES (0, 0.0, 'Inicial', 1.0, 0.0,60.0,60.0,0.0,0.0,200.0,100.0,100.0,
          0.0,120.0,0.0,140.0,140.0,0.0,160.0,200.0,180.0,0.0,180.0,200.0,0.0,220.0,220.0,0.0,240.0,200.0,260.0,0.0,260.0,280.0,0.0,300.0,300.0,0.0,320.0,200.0,350.0,350.0,0.0,400.0)`;
                con.query(query2, (error, results2) => {
                    if (error) {
                        reject(error);
                        con.end();
                    }
                    else if (results1.length === 0) {
                        resolve(-1); // Si no existe jugador
                        con.end();
                    }
                    else {
                        //obtener el maximo idPartida, ya que sera el ultimo y lo devolvemos.
                        const query3 = `SELECT MAX(idPartida) as maximo FROM Partida`;
                        con.query(query3, (error, results3) => {
                            if (error) {
                                reject(error);
                                con.end();
                            }
                            else if (results3.length === 0) {
                                resolve(-1); // Si no existe jugador
                                con.end();
                            }
                            else {
                                //ahora hay que enlazarlo con la tabla juega
                                let maxIdPartida = results3[0].maximo;  //id de la partida creada.
                                const query3 = `INSERT INTO juega ( esBotInicial, esBot, numPropiedades, jugadorVivo, dineroInvertido, nTurnosCarcel, posicion, dinero, skin, puestoPartida, 
                  email, idPartida) VALUES ( false, false, 0, true, 0.0, 0, 0, 1000.0, 'default', 0 , '${id_jugador}', ${maxIdPartida})`;
                                con.query(query3, (error, results3) => {
                                    if (error) {
                                        reject(error);
                                        con.end();
                                    }
                                    else if (results3.length === 0) {
                                        resolve(-1); // Si no existe jugador
                                        con.end();
                                    }
                                    else {
                                        resolve(maxIdPartida);
                                        con.end();
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

exports.crearPartida = crearPartida;



/*
  =================== UNIRSE A PARTIDA =========================================
*/
// Se añade el jugador con IDJugador a la partida
// Devuelve false si el jugador o la partida no existen, o si el jugador ya está metido en esa partida o esta jugando ya otra
// Devuelve true en caso contrario


function unirsePartida(idJugador, idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();

        const query = `SELECT idPartida FROM Partida WHERE idPartida = '${idPartida}'`;
        con.query(query, (error, results) => {                            // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                              // Caso -- No existe esa Partida
                con.end();
                resolve(false);
            } else {                                                        // Caso --  Existe esa Partida  
                const query2 = `SELECT email FROM Jugador WHERE email = '${idJugador}'`;
                con.query(query2, (error, results2) => {                      // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                         // Caso -- No existe ese Jugador
                        con.end();
                        resolve(false);
                    } else {                                                    // Caso --  Existe ese Jugador

                        const query3 = `SELECT * FROM juega WHERE email = '${idJugador}' AND idPartida = '${idPartida}'`;
                        con.query(query3, (error, results3) => {                  // Caso -- Error
                            if (error) {
                                con.end();
                                reject(error);
                            } else if (results3.length != 0) {                      // Caso -- El jugador ya esta jugando esa partida
                                con.end();
                                resolve(false);
                            } else {                                                // Caso -- El jugador no esta jugando esa partida

                                const query4 = `SELECT B.idPartida FROM juega A INNER JOIN Partida B ON A.idPartida = B.idPartida 
                                WHERE A.email = '${idJugador}' AND B.enCurso = true`;
                                con.query(query4, (error, results4) => {              // Caso -- Error
                                    if (error) {
                                        con.end();
                                        reject(error);
                                    } else if (results4.length != 0) {                  // Caso -- El jugador ya esta jugando una partida
                                        con.end();
                                        resolve(false);
                                    } else {                                            // Caso -- El jugador no esta jugando ninguna partida
                                        const sql = `INSERT INTO juega ( esBotInicial, esBot, numPropiedades,jugadorVivo, dineroInvertido, nTurnosCarcel, posicion, 
                                        dinero, skin, puestoPartida, email, idPartida) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
                                        const values = [false, false, 0,true,  0.0, 0, 0, 1000.0, 'default', 0, idJugador, idPartida];
                                        con.query(sql, values, (error, results5) => {      // Caso -- Error
                                            if (error) {
                                                con.end();
                                                reject(error);
                                            } else {                                         // Caso -- Insert okay
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
    });
}


exports.unirsePartida = unirsePartida;



/*
=================== RESTAR TURNOS CARCEL =========================================
*/


// Dado un jugador y una partida, restarle a turnosCarcel los turnos dados. 
function restarTurnoCarcel(id_jugador, id_partida, turnos) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        // Comprobar si el jugador existe en la tabla "juega".(Si esta en la partida).
        const query = `SELECT nTurnosCarcel FROM juega WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
        con.query(query, (error, results) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {
                // Si el jugador no existe en la partida, devolver false.
                con.end();
                resolve(false);
            }
            else {
                //Actualizamos el numero de turnos en la enviarCarcel.
                let turnosCarcel = results[0].nTurnosCarcel;
                turnosCarcel -= turnos;
                const query2 = `UPDATE juega SET nTurnosCarcel = ${turnosCarcel} WHERE email = '${id_jugador}' AND idPartida = '${id_partida}'`;
                con.query(query2, (error, results2) => {
                    if (error) {
                        con.end();
                        reject(error);
                    } else {
                        //si ha ido bien,cerramos conexion
                        con.end();
                    }
                });
            }
        });
    });
}
exports.restarTurnoCarcel = restarTurnoCarcel;





/*
===================OBTENER LISTADO JUGADORES EN PARTIDA CON CON ID_PARTIDA =========================================
*/
// Devuelve el listado de jugadores que hay asociados a una partida separados por comas, si son bots pondra -1 en vez de email
// En caso de que no no exista la partida devuelve false
function obtenerJugadoresPartida(idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT * FROM Partida WHERE idPartida = '${idPartida}'`;
        con.query(query, (error, results) => {                // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                  // Caso -- No existe la Partida
                con.end();
                resolve(false);
            } else {                                            // Caso --  Existe la partida

                const query2 = `SELECT email, esBot, esBotInicial FROM juega WHERE idPartida = '${idPartida}'`;
                const respuesta = [];
                con.query(query2, (error, results2) => {
                    if (error) {
                        con.end();
                        reject(error);
                    } else {

                        results2.forEach((row, i) => {
                            if (row.esBot || row.esBotInicial) {
                                let aux = [];
                                aux[0] = row.email;
                                aux[1] = 1;
                                respuesta[i] = aux.join(":");
                            } else {
                                let aux = [];
                                aux[0] = row.email;
                                aux[1] = 0;
                                respuesta[i] = aux.join(":");
                            }

                        });
                        /*while (respuesta.length < 4) {
                          respuesta.push("-1");
                        }*/
                        let cadena = respuesta.join(",");
                        con.end();
                        resolve(cadena)
                    }
                });
            }
        });
    });
}


exports.obtenerJugadoresPartida = obtenerJugadoresPartida;


/*
===================INTERCAMBIAR PROPIEDADES JUGADORES =========================================
*/

//Intercambiar propiedades con otro jugador, sin tener en cuenta el dinero ni nada, solamente se cambia el nombre del propietario.
function intercambiarPropiedades(id_partida, id_jugador1, id_jugador2, propiedad1, propiedad2) {
    return new Promise((resolve, reject) => {
        const con = db.crearConexion();
        let propiedad_n1 = 'propiedad' + propiedad1;
        let propiedad_n2 = 'propiedad' + propiedad2;
        const query1 = `SELECT ${propiedad_n1} AS prop1, ${propiedad_n2} AS prop2 FROM Partida WHERE idPartida = '${id_partida}'`;

        con.query(query1, (error, results1) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results1.length === 0) {
                con.end();
                resolve(false);
            } else {
                let propietario_1 = results1[0].prop1;
                let propietario_2 = results1[0].prop2;

                const query2 = `UPDATE Partida SET ${propiedad_n1} = '${propietario_2}' WHERE idPartida = '${id_partida}'`;
                con.query(query2, (error, results2) => {
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.affectedRows === 0) {
                        con.end();
                        resolve(false);
                    } else {
                        const query3 = `UPDATE Partida SET ${propiedad_n2} = '${propietario_1}' WHERE idPartida = '${id_partida}'`;
                        con.query(query3, (error, results3) => {
                            con.end();

                            if (error) {
                                reject(error);
                            } else if (results3.affectedRows === 0) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                });
            }
        });
    });
}

exports.intercambiarPropiedades = intercambiarPropiedades;



/*
===================OBTENER NUMERO DE CASAS DE LA PROPIEDAD =========================================
*/

//devuelve el numero de casas de la propiedad "nCasasPropiedadX". Devuelve -1 si algo ha ido mal
function obtenerNumCasasPropiedad(idPartida, propiedad) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        let numCasas = 'nCasasPropiedad' + propiedad;
        const query1 = `SELECT ${numCasas} as num_casas FROM Partida WHERE idPartida = '${idPartida}'`;
        con.query(query1, (error, results1) => {
            if (error) {
                reject(error);
            } else if (results1.length === 0) {
                resolve(-1);
            } else {
                //devolvemos el dinero del usuario.
                let numCas = results1[0].num_casas;
                resolve(numCas);
            }
        });
        con.end();
    });
}
exports.obtenerNumCasasPropiedad = obtenerNumCasasPropiedad;


/*
===================LIBERAR PROPIEDAD JUGADOR=========================================
*/

// Eliminar al jugador dado la propiedad dada, sumanodle el dinero de la propiedad.
function liberarPropiedadJugador(id_partida, id_jugador, propiedad, dineroJugador, dineroPropiedad) {
    return new Promise((resolve, reject) => {
        var concat = 'propiedad' + propiedad;
        var concat2 = 'nCasasPropiedad' + propiedad;
        var con = db.crearConexion();
        con.connect();
        // Primero ponemos a null el propietario.
        const query = `UPDATE Partida SET ${concat} = NULL WHERE idPartida = '${id_partida}'`;
        con.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else if (results.affectedRows === 0) {
                // Si el jugador no existe en la partida, devolver false.
                resolve(-1);
            }
            else {
                //Ponemos a 0 el numero de casas de dicha propiedad.
                let suma = dineroJugador + dineroPropiedad;
                const query2 = `UPDATE Juega SET dinero = '${suma}' WHERE idPartida = '${id_partida}' AND email = '${id_jugador}'`;
                con.query(query2, (error, results2) => {
                    if (error) {
                        reject(error);
                    } else if (results2.affectedRows === 0) {
                        // Si el jugador no existe en la partida, devolver false.
                        resolve(-1);
                    }
                    else {
                        //Todo bien, devolvemos true.
                        resolve(true);
                    }
                });
            }
            con.end();
        });
    });
}
exports.liberarPropiedadJugador = liberarPropiedadJugador;



/*
===================OBTENER PRECIO PROPIEDAD=========================================
*/

//obtener el precio de la propiedad en una partida.
function obtenerPrecioPropiedad(idPartida, numPropiedades) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        let precio = 'precioPropiedad' + numPropiedades;
        const query1 = `SELECT ${precio} as price FROM Partida WHERE idPartida = '${idPartida}'`;
        con.query(query1, (error, results) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results.affectedRows === 0) {
                con.end();
                resolve(-1);
            } else {
                //TODO HA SALIDO CORRECTO, CON LO CUAL DEVOLVEMOS TRUE.
                let precio = results[0].price;
                resolve(precio);
                con.end();
            }
        });
    });
}
exports.obtenerPrecioPropiedad = obtenerPrecioPropiedad;

/*
===================PAGAR ALQUILER=========================================
*/

// jugadorPaga paga el alquiler al jugadorRecibe por estar en propiedad si pertenece 
// al jugadorRecibe
async function pagarAlquiler(id_jugadorPaga, id_jugadorRecibe, propiedad, idPartida, precioPropiedad) {
    try {
        //sacamos el numero de casas que tiene en dicha propiedad.
        const numCasas = await obtenerNumCasasPropiedad(idPartida, propiedad);

        //le aplicamos la formula para saber que dinero tiene que pagar.
        let alquiler = precioPropiedad * ((numCasas * 20) / 100);

        //le sumamos ese dinero al jugadorRecibe.
        const res = await modificarDinero(idPartida, id_jugadorPaga, -alquiler);

        //le restamos el dinero al jugadorPaga.
        const res2 = await modificarDinero(idPartida, id_jugadorRecibe, alquiler);

        return res2 && res;

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}
exports.pagarAlquiler = pagarAlquiler;





/*
===================SACAR DINERO BANCO=========================================
*/

//funcion que saca dinero del banco y lo mete en dinero de la cuenta del jugador.
//Devuelve el dinero del jugador sacado del banco.
//Devuelve -2 si no tiene el dinero suficiente en el banco para sacarlo.
//Devuelve -1 si ha ido algo mal.
function sacarDineroBancoAPartida(id_partida, id_jugador, cantidad) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        // Primero ponemos a null el propietario.
        const query = `SELECT dineroInvertido, dinero FROM juega WHERE idPartida = '${id_partida}' AND email = '${id_jugador}'`;
        con.query(query, (error, results) => {
            if (error) {
                reject(error);
                con.end();
            } else if (results.length === 0) {
                // Si el jugador no existe en la partida, devolver false.
                resolve(-1);
                con.end();
            }
            else {
                //comparamos y vemos si la cantidad a sacar es menor que el dinero del banco, sino es asi devolvemos -1.
                let dineroBanco = results[0].dineroInvertido;
                let dineroJugador = results[0].dinero;
                if (cantidad <= dineroBanco) {
                    //actualizamos el dinero del banco y del jugador en la partida.
                    dineroJugador += cantidad;
                    const query2 = `UPDATE juega SET dinero = ${dineroJugador} WHERE idPartida = '${id_partida}' AND email = '${id_jugador}'`;
                    con.query(query2, (error, results2) => {
                        if (error) {
                            reject(error);
                            con.end();
                        } else if (results2.affectedRows === 0) {
                            // Si el jugador no existe en la partida, devolver false.
                            resolve(-1);
                            con.end();
                        }
                        else {
                            //ahora actualizamos el dinero del banco.
                            dineroBanco -= cantidad;
                            const query3 = `UPDATE juega SET dineroInvertido = ${dineroBanco} WHERE idPartida = '${id_partida}' AND email = '${id_jugador}'`;
                            con.query(query3, (error, results3) => {
                                if (error) {
                                    reject(error);
                                    con.end();
                                } else if (results3.affectedRows === 0) {
                                    // Si el jugador no existe en la partida, devolver false.
                                    resolve(-1);
                                    con.end();
                                }
                                else {
                                    //todo okey, devolvemos el dinero del jugador en la partida ahora.
                                    resolve(dineroBanco);
                                    con.end();
                                }
                            });
                        }
                    });
                }
                else {
                    //no tenemos dinero suficinete, con lo que devolvemos -1.
                    resolve(-2);
                    con.end();
                }
            }
        });
    });
}
exports.sacarDineroBancoAPartida = sacarDineroBancoAPartida;




/*
=================== SUSTITUIR JUGADOR IDJUGADOR POR BOT =========================================================
*/
// Devuelve false si no existe partida o jugador o ese jugador no esta en esa partida
//Devuelve true si se ha sustituido por bot correctamente
// Si el jugador ya era bot da igual devuelve true otra vez y le vuelve a convertir en bot
function sustituirJugadorPorBot(idJugador, idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT email FROM Jugador WHERE email = '${idJugador}'`;
        con.query(query, (error, results) => {                          // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                          // Caso -- No existe el Jugador
                con.end();
                resolve(false);
            } else {                                                    // Caso --  Existe el jugador
                const query2 = `SELECT * FROM Partida WHERE idPartida = '${idPartida}'`;
                con.query(query2, (error, results2) => {                // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                 // Caso -- No existe La partida
                        con.end();
                        resolve(false);
                    } else {                                            // Caso -- Existe la partida
                        const query2 = `SELECT * FROM juega WHERE idPartida = '${idPartida}' AND email = '${idJugador}'`;
                        con.query(query2, (error, results2) => {        // Caso -- Error
                            if (error) {
                                con.end();
                                reject(error);
                            } else if (results2.length === 0) {         // Caso -- No existe el Jugador en esa partida
                                con.end();
                                resolve(false);
                            } else {
                                const sql = `UPDATE juega SET esBot = 1 WHERE idPartida = '${idPartida}' AND email = '${idJugador}'`;
                                con.query(sql, (error, results3) => {        // Caso -- Error
                                    if (error) {
                                        con.end();
                                        reject(error);
                                    } else {
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
    });
}


exports.sustituirJugadorPorBot = sustituirJugadorPorBot;




/*
=================== SUSTITUIR BOT POR JUGADOR IDJUGADOR (Vuelve a conectarse) =========================================================
*/
// Devuelve false si no existe partida o jugador o ese jugador no esta en esa partida
//Devuelve true si se ha sustituido por bot por jugador correctamente
// Si el jugador ya era jugador da igual devuelve true otra vez y le vuelve a convertir en jugador
function sustituirBotPorJugador(idJugador, idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT email FROM Jugador WHERE email = '${idJugador}'`;
        con.query(query, (error, results) => {                          // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                          // Caso -- No existe el Jugador
                con.end();
                resolve(false);
            } else {                                                    // Caso --  Existe el jugador
                const query2 = `SELECT * FROM Partida WHERE idPartida = '${idPartida}'`;
                con.query(query2, (error, results2) => {                // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                 // Caso -- No existe La partida
                        con.end();
                        resolve(false);
                    } else {                                            // Caso -- Existe la partida
                        const query2 = `SELECT * FROM juega WHERE idPartida = '${idPartida}' AND email = '${idJugador}'`;
                        con.query(query2, (error, results2) => {        // Caso -- Error
                            if (error) {
                                con.end();
                                reject(error);
                            } else if (results2.length === 0) {         // Caso -- No existe el Jugador en esa partida
                                con.end();
                                resolve(false);
                            } else {
                                const sql = `UPDATE juega SET esBot = 0 WHERE idPartida = '${idPartida}' AND email = '${idJugador}'`;
                                con.query(sql, (error, results3) => {        // Caso -- Error
                                    if (error) {
                                        con.end();
                                        reject(error);
                                    } else {
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
    });
}


exports.sustituirBotPorJugador = sustituirBotPorJugador;



/*
=================== OBTENER SIGUIENTE JUGADOR =========================================================
*/
// Devuelve false si no existe partida o jugador o ese jugador no esta en esa partida
// Devuelve el id del siguiente jugador y si es bot y si es fin de partida
// ejemplo jugador bot y no fin --> pedro@gmail.com : 1 , 0
function obtenerSiguienteJugador(idJugador, idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        //const turno_siguiente = 0;
        con.connect();
        const query = `SELECT email FROM Jugador WHERE email = '${idJugador}'`;
        con.query(query, (error, results) => {                          // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                          // Caso -- No existe el Jugador
                con.end();
                resolve(false);
            } else {                                                  // Caso --  Existe el jugador
                const query2 = `SELECT * FROM Partida WHERE idPartida = '${idPartida}'`;
                con.query(query2, (error, results2) => {                // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                 // Caso -- No existe La partida
                        con.end();
                        resolve(false);
                    } else {                                          // Caso -- Existe la partida
                        const query2 = `SELECT turno, email FROM juega WHERE idPartida = '${idPartida}' AND email = '${idJugador}'`;
                        con.query(query2, (error, results2) => {        // Caso -- Error
                            if (error) {
                                con.end();
                                console.log("3");
                                reject(error);
                            } else if (results2.length === 0) {         // Caso -- No existe el Jugador en esa partida
                                con.end();
                                resolve(false);
                            } else {
                                let turno_siguiente = (results2[0].turno + 1) % 4;
                                if (turno_siguiente === 0) {
                                    turno_siguiente = 4;
                                }
                                const sql = `SELECT esBotInicial, esBot, email FROM juega WHERE idPartida = '${idPartida}' AND turno = '${turno_siguiente}'`;
                                con.query(sql, (error, results3) => {        // Caso -- Error
                                    if (error) {
                                        con.end();
                                        reject(error);
                                    } else {
                                        const respuesta = [];
                                        const aux = [];
                                        aux[0] = results3[0].email;
                                        if (results3[0].esBot || results3[0].esBotInicial) {
                                            aux[1] = 1;
                                        } else {
                                            aux[1] = 0;
                                        }
                                        respuesta[0] = aux.join(":");
                                        if (turno_siguiente === 4) {
                                            respuesta[1] = 1;
                                        } else {
                                            respuesta[1] = 0;
                                        }
                                        let cadena = respuesta.join(",");
                                        con.end();
                                        resolve(cadena);
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


exports.obtenerSiguienteJugador = obtenerSiguienteJugador;






/*
=================== OBTENER LISTADO DE PROPIEDADES A EDIFICAR   =========================================================
*/

//  Se obtienen todas las propiedades que tiene el usuario se obtiene el numero de 
//  casas que tiene en cada una y se devuelve un string indicando que propiedades 
//  tiene el usuario y cuanto le costaría edificar teniendo en cuenta el numero de 
//  casas que tiene en cada propiedad, se obtiene un string de la siguiente forma:
//  propiedad1-precio1,propiedad2-precio2,propiedad3-precio3,etc…
//Si el jugador o la partida no existen devuelve false


// OJOO , el nCasas al comprar la propiedad se debe poner a 0 pq esta puesto a null

function propiedadesEdificar(idJugador, idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();

        const query = `SELECT email FROM Jugador WHERE email = '${idJugador}'`;
        con.query(query, (error, results) => {                          // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                          // Caso -- No existe el Jugador
                con.end();
                resolve(false);
            } else {                                                  // Caso --  Existe el jugador
                const query2 = `SELECT * FROM Partida WHERE idPartida = '${idPartida}'`;
                con.query(query2, (error, results2) => {                // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                 // Caso -- No existe La partida
                        con.end();
                        resolve(false);
                    } else {
                        let resultado = '';
                        // Iterar por todas las propiedades de la tabla
                        for (let i = 1; i <= 40; i++) {
                            // Construir la consulta SQL para obtener las propiedades del usuario 'idJugador' en 'idPartida'
                            let consulta = `SELECT CONCAT('propiedad', ${i}) AS propiedad, precioPropiedad${i} AS precio, nCasasPropiedad${i} AS nCasas FROM Partida 
                            WHERE propiedad${i} = '${idJugador}' AND idPartida = '${idPartida}';`;
                            // Ejecutar la consulta en la base de datos y obtener el resultado
                            con.query(consulta, (err, res) => {
                                if (err) {
                                    con.end;
                                    reject(err);
                                } else {
                                    // Iterar por el resultado y agregar cada propiedad al resultado final
                                    res.forEach((fila) => {
                                        precioAux = fila.precio * (20 * fila.nCasas / 100)
                                        resultado += `${fila.propiedad}-${precioAux},`;
                                    });
                                    if (i === 40) {
                                        con.end();
                                        resolve(resultado.slice(0, -1))
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });
}


exports.propiedadesEdificar = propiedadesEdificar;



/*
=================== USUARIO EDIFICAR PROPIEDAD  =========================================================
*/
// Devuelve el dinero que le queda al usuario despues edificar la propiedad IdPropiedad y
//  gastar X dinero obtenido del precio base y el numero de casas que tiene edificado.
// En caso de que no exista jugador o partida o que la propiedad no sea suya o ya haya edificado el maximo devuelve false 

// OJOO maximo de casas a edificar es 5

function edificarPropiedad(idJugador, idPartida, propiedad) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        let propiedadAux = "propiedad" + propiedad;
        let precioAux = "precioPropiedad" + propiedad;
        let nCasasAux = "nCasasPropiedad" + propiedad;
        const query = `SELECT email FROM Jugador WHERE email = '${idJugador}'`;
        con.query(query, (error, results) => {                                              // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                                              // Caso -- No existe el Jugador
                con.end();
                resolve(false);
            } else {                                                                        // Caso --  Existe el jugador
                const query2 = `SELECT * FROM Partida WHERE idPartida = '${idPartida}'`;
                con.query(query2, (error, results2) => {                                    // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                                     // Caso -- No existe La partida
                        con.end();
                        resolve(false);
                    } else {
                        const query3 = `SELECT ${propiedadAux} AS propietario, ${precioAux} AS precio, ${nCasasAux} AS nCasas 
                        FROM Partida WHERE idPartida = '${idPartida}'`;
                        con.query(query3, (error, results3) => {                            // Caso -- Error
                            if (error) {
                                con.end();
                                reject(error);
                            } else {

                                if (results3[0].propietario != idJugador || (results3[0].nCasas + 1) > 5) {
                                    con.end();                                              // Caso -- Propiedad no es suya o ya ha edificado todo
                                    resolve(false);
                                } else {                                                    // Caso -- Propiedad es suya
                                    let dineroQuitar = results3[0].precio * (20 * (results3[0].nCasas + 1) / 100);
                                    const sql4 = `SELECT dinero FROM juega WHERE idPartida = '${idPartida}' 
                                                    AND email = '${idJugador}'`;
                                    con.query(sql4, (error, results7) => {                  // Caso -- Error
                                        if (error) {
                                            con.end();
                                            reject(error);
                                        } else if (results7[0].dinero < dineroQuitar) {
                                            con.end();                                      // Caso -- No tiene dinero para pagar
                                            resolve(false);
                                        } else {
                                            const sql = `UPDATE Partida SET ${nCasasAux} = ${nCasasAux} + 1 WHERE idPartida = '${idPartida}'`;
                                            con.query(sql, (error, results4) => {           // Caso -- Error
                                                if (error) {
                                                    con.end();
                                                    reject(error);                          // Caso -- Se ha modificado el numero de casas
                                                } else {

                                                    console.log("dinero", dineroQuitar);
                                                    const sql2 = `UPDATE juega SET dinero = dinero - ${dineroQuitar} WHERE idPartida = '${idPartida}' 
                                                    AND email = '${idJugador}'`;
                                                    con.query(sql2, (error, results5) => {  // Caso -- Error
                                                        if (error) {
                                                            con.end();
                                                            reject(error);
                                                        } else {                            // Caso -- Se ha modificado el dinero del jugador

                                                            const sql3 = `SELECT dinero FROM juega WHERE idPartida = '${idPartida}' 
                                                            AND email = '${idJugador}'`;
                                                            con.query(sql3, (error, results6) => {// Caso -- Error
                                                                if (error) {
                                                                    con.end();
                                                                    reject(error);
                                                                } else {
                                                                    con.end();
                                                                    resolve(results6[0].dinero);
                                                                }
                                                            });
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
            }
        });
    });
}


exports.edificarPropiedad = edificarPropiedad;


/*
===================AÑADIR PROPIEDAD AL JUGADOR COMPRADOR===================
*/

//Funcion que dado un comprador y un vendedor, verifica que la casa sea del vendedor y el comprador realiza la compra.
function anyadirPropiedadCompradorVendedor(id_partida, id_jugador_comprador, id_jugador_vendedor, n_propiedad) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        var concat = 'propiedad' + n_propiedad;
        const query = `SELECT P.${concat} AS nombre_propietario, P.nCasasPropiedad${n_propiedad} AS num_casas_propiedad , J.numPropiedades AS num_propiedades_totales FROM Partida P INNER JOIN juega J ON P.idPartida=J.idPartida WHERE P.idPartida = '${id_partida}'`;
        con.query(query, (error, results) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {
                con.end();
                console.log("hemos entrado en el lenght = 0");
                resolve(-1);
            } else {
                let nombre_propietario = results[0].nombre_propietario;
                if (nombre_propietario === id_jugador_vendedor) {
                    //la propiedad es del vendedor, con lo cual se la vamos a dar al comprador.
                    let n_propiedades = results[0].num_propiedades_totales;
                    n_propiedades--;
                    const query2 = `UPDATE Juega SET numPropiedades = '${n_propiedades}' WHERE idPartida = '${id_partida}' AND email = '${id_jugador_vendedor}'`;
                    con.query(query2, (error, results2) => {
                        if (error) {
                            reject(error);
                            con.end();
                        } else if (results2.affectedRows === 0) {
                            resolve(-2);
                            con.end();
                        } else {
                            //una vez actualizado el numero de propiedades del vendedor, ahora actualizaremos la propiedad para que sea del comprador.
                            //HAY QUE OBTENER EL NUMERO DE PROPIEDADES_TOTALES QUE TENIA ANTES DE COMPRAR ESTA PROPIEDAD EL COMPRADOR PARA PODER ACTUALIZARLO.
                            const query3 = `SELECT numPropiedades FROM juega WHERE idPartida = '${id_partida}' AND email = '${id_jugador_comprador}' `;
                            con.query(query3, (error, results3) => {
                                if (error) {
                                    reject(error);
                                    con.end();
                                } else if (results3.length === 0) {
                                    resolve(-3);
                                    con.end();
                                } else {
                                    //Actualizamos el numero de propiedades del comprador en + 1.
                                    let total_propiedades_comprador = results3[0].numPropiedades;
                                    total_propiedades_comprador++;
                                    const query4 = `UPDATE juega SET numPropiedades = '${total_propiedades_comprador}' WHERE idPartida = '${id_partida}' AND email = '${id_jugador_comprador}' `;
                                    con.query(query4, (error, results4) => {
                                        if (error) {
                                            reject(error);
                                            con.end();
                                        } else if (results4.affectedRows === 0) {
                                            resolve(-4);
                                            con.end();
                                        } else {
                                            //Actualizamos la propiedad para que sea del comprador.
                                            let n_casas = results[0].num_casas_propiedad;     //ESTO ES LO QUE HAY QUE VER SI DEJAMOS EL NUMERO DE CASAS QUE YA ESTABA O EMPIEZA CON 1 CASA SOLO.
                                            const query5 = `UPDATE Partida SET nCasasPropiedad${n_propiedad} = '${n_casas}' WHERE idPartida = '${id_partida}' `;
                                            con.query(query5, (error, results5) => {
                                                if (error) {
                                                    reject(error);
                                                    con.end();
                                                } else if (results5.affectedRows === 0) {
                                                    resolve(-5);
                                                    con.end();
                                                } else {
                                                    //Actualizamos la propiedad, para que aparezca como dueño el comprador.
                                                    const query6 = `UPDATE Partida SET propiedad${n_propiedad} = '${id_jugador_comprador}' WHERE idPartida = '${id_partida}' `;
                                                    con.query(query6, (error, results6) => {
                                                        if (error) {
                                                            reject(error);
                                                            con.end();
                                                        } else if (results5.affectedRows === 0) {
                                                            resolve(-6);
                                                            con.end();
                                                        } else {
                                                            //TODO HA SALIDO BIEN, DEVOLVEMOS 1.
                                                            resolve(1);
                                                            con.end();
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
                else {
                    //caso de no ser el propietario, directamente devolvemos -7.
                    resolve(-7);
                    con.end();
                }
            }
        });
    });
}


exports.anyadirPropiedadCompradorVendedor = anyadirPropiedadCompradorVendedor;



/*
===================VENDER PROPIEDAD A UN JUGADOR DADO===================

 
  El propietario de la vivienda pasara a ser el vendedor. 
  Al comprador se le restara la cantidad y si es mayor que 0 el saldo aceptara la transferencia, 
  en caso de que no haya dinero devolvera -1, en caso de que vaya todo bien, devolvera 1.
*/

async function venderPropiedadJugador(id_partida, id_jugador_vendedor, id_jugador_comprador, cantidad, n_propiedad) {
    //llamaremos a la funcion comprarPropiedad para que el id_jugador_comprador tenga su nueva propiedad.
    try {
        const dinero = await dineroBanco(id_jugador_comprador, id_partida);
        console.log("Dinero del comprador: ", dinero);
        if (dinero >= cantidad) {
            //tiene dinero suficiente para comprarla. Primero le restamos el dinero y despues la compramos.
            const res = await modificarDinero(id_partida, id_jugador_comprador, -cantidad);
            console.log("Res1: ", res);
            const res2 = await modificarDinero(id_partida, id_jugador_vendedor, cantidad);
            console.log("Res2: ", res2);
            const resultado = await anyadirPropiedadCompradorVendedor(id_partida, id_jugador_comprador, id_jugador_vendedor, n_propiedad);

            if (resultado == -7) {
                //no era del propietario, asi que volvemos a actualizar el dinero.
                const res = await modificarDinero(id_partida, id_jugador_comprador, cantidad);
                console.log("Res1: ", res);
                const res2 = await modificarDinero(id_partida, id_jugador_vendedor, -cantidad);
                console.log("Res2: ", res2);
            }
            return resultado;
        }
        else {
            //no tenemos dinero suficiente, con lo cual devolvemos -1.
            return -1;
        }

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.venderPropiedadJugador = venderPropiedadJugador;



/*
=================== CREAR PARTIDA TORNEO =========================================
*/

//funcion la cual crea una partida y la enlaza con el torneo id_torneo.
//El torneo tiene que existir y el jugador tambien.
async function crearPartidaTorneo(id_jugador, id_torneo) {

    try {

        //llamamos a la funcion crearPartida.
        let idPartidaCreada = await crearPartida(id_jugador);

        //actualizamos la partida para que pertenezca al torneo id_torneo.
        const query = `UPDATE Partida SET perteneceTorneo = ${id_torneo} WHERE idPartida = ${idPartidaCreada}`;
        con.query(query, (error, results) => {
            if (error) {
                reject(error);
                con.end();
            }
            else if (results.length === 0) {
                resolve(-1); // Si no existe jugador
                con.end();
            }
            else {
                resolve(true);
                con.end();
            }
        });

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.crearPartidaTorneo = crearPartidaTorneo;




/*
=================== ESTABLECER ORDEN DE JUGADORES EN PARTIDA IDPARTIDA =========================================================
*/
// Establece el orden de los jugadores en la partida definida
// En caso de que no existan los jugadores en juega devuelve faslse, sino true
function establecerOrdenPartida(idPartida, idJugador1, idJugador2, idJugador3, idJugador4) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT idPartida FROM juega WHERE idPartida = '${idPartida}' AND email = '${idJugador1}'`;
        con.query(query, (error, results) => {                                                              // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                                                              // Caso -- No existe el jugador en juega
                con.end();
                resolve(false);
            } else {                                                                                        // Caso --  Existe el jugador en juega
                const query = `SELECT idPartida FROM juega WHERE idPartida = '${idPartida}' AND email = '${idJugador2}'`;
                con.query(query, (error, results) => {                                                      // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results.length === 0) {                                                      // Caso -- No existe el jugador en juega
                        con.end();
                        resolve(false);
                    } else {                                                                                // Caso --  Existe el jugador en juega
                        const query = `SELECT idPartida FROM juega WHERE idPartida = '${idPartida}' AND email = '${idJugador3}'`;
                        con.query(query, (error, results) => {                                              // Caso -- Error
                            if (error) {
                                con.end();
                                reject(error);
                            } else if (results.length === 0) {                                              // Caso -- No existe el jugador en juega
                                con.end();
                                resolve(false);
                            } else {                                                                        // Caso --  Existe el jugador en juega
                                const query = `SELECT idPartida FROM juega WHERE idPartida = '${idPartida}' AND email = '${idJugador4}'`;
                                con.query(query, (error, results) => {                                      // Caso -- Error
                                    if (error) {
                                        con.end();
                                        reject(error);
                                    } else if (results.length === 0) {                                      // Caso -- No existe el jugador en juega
                                        con.end();
                                        resolve(false);
                                    } else {                                                                // Caso --  Existe el jugador en juega
                                        const query = `UPDATE juega set turno = 1 WHERE idPartida = '${idPartida}' AND email = '${idJugador1}'`;
                                        con.query(query, (error, results) => {                              // Caso -- Error
                                            if (error) {
                                                con.end();
                                                reject(error);
                                            } else {                                                        // Caso --  Update correcto
                                                const query = `UPDATE juega set turno = 2 WHERE idPartida = '${idPartida}' AND email = '${idJugador2}'`;
                                                con.query(query, (error, results) => {                      // Caso -- Error
                                                    if (error) {
                                                        con.end();
                                                        reject(error);
                                                    } else {                                                // Caso --  Update correcto
                                                        const query = `UPDATE juega set turno = 3 WHERE idPartida = '${idPartida}' AND email = '${idJugador3}'`;
                                                        con.query(query, (error, results) => {              // Caso -- Error
                                                            if (error) {
                                                                con.end();
                                                                reject(error);
                                                            } else {                                        // Caso --  Update correcto
                                                                const query = `UPDATE juega set turno = 4 WHERE idPartida = '${idPartida}' AND email = '${idJugador4}'`;
                                                                con.query(query, (error, results) => {      // Caso -- Error
                                                                    if (error) {
                                                                        con.end();
                                                                        reject(error);
                                                                    } else {                                // Caso --  Update correcto
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
                    }
                });
            }
        });
    });
}


exports.establecerOrdenPartida = establecerOrdenPartida;



//devuelve el numero de jugadores de una partida.
function comprobarJugadores(idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query1 = `SELECT DISTINCT COUNT(email) as jugadores FROM juega WHERE idPartida='${idPartida}'`;
        con.query(query1, (error, results1) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results1.length === 0) {
                con.end();
                resolve(-1);
            }
            else {
                //devuelve el numero de jugadores de la partida
                con.end();
                resolve(results1[0].jugadores);
            }
        });
    });
}



//unir un jugador a una partida dada.
function unirBotPartida(idJugador, idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const sql = `INSERT INTO juega ( esBotInicial, esBot, numPropiedades, jugadorVivo, dineroInvertido, nTurnosCarcel, posicion, dinero, skin, puestoPartida, 
        email, idPartida) VALUES ( true, true, 0, true, 0.0, 0, 0, 1000.0, 'default', 0 , '${idJugador}', ${idPartida})`;
        con.query(sql, (error, results) => {      // Caso -- Error
            if (error) {
                console.log(sql);
                con.end();
                reject(error);
            } else if (results.length == 0) {
                resolve(-1);
            }
            else {                                         // Caso -- Insert okay
                con.end();
                resolve(true);
            }
        });
    });
}



exports.unirBotPartida = unirBotPartida;



//inicializamos la partida (enCurso=1).
function inicializamosPartida(idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query2 = `UPDATE Partida SET enCurso='1' WHERE idPartida='${idPartida}'`;
        con.query(query2, (error, results2) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results2.length === 0) {
                con.end();
                resolve(-1);
            } else {
                //todo ha ido bien, con lo que devolvemos true.
                con.end();
                resolve(true);
            }

        });
    });
}


/*
=================== INICIAR UNA PARTIDA =========================================================
*/
//funcion la cual inicie una partida (poner a 1 enCurso). Si la partida tiene 4 jugadores la iniciamos normal, sino rellenamos con bots 
//hasta llegar a 4 jugadores y la iniciamos.
async function iniciarPartida(idPartida) {
    try {
        //comprobamos el numero de jugadores de la partida.
        let numJugadares = await comprobarJugadores(idPartida);
        console.log(numJugadares);
        if (numJugadares == 4) {
            //partida completa, la podemos inicializar.
            let partidaIni = await inicializamosPartida(idPartida);
            return partidaIni;
        }
        else {
            let jugadoresRestantes = NUM_JUGADORES - numJugadares;
            for (let i = 0; i < jugadoresRestantes; i++) {
                let randomNumber = Math.floor(Math.random() * 10000) + 1;
                let email = `bot@bot${randomNumber}.com`;
                let jugadorConcat = `bot${randomNumber}.com` + `,` + 1234 + `,` + email + `,` + 0;
                let resCrearJugador = await Jugador.insertarUsuario(jugadorConcat);
                let resUnirPartida = await unirBotPartida(email, idPartida);
            }
            let partidaIni = await inicializamosPartida(idPartida);
            return partidaIni;
        }

    } catch (error) {
        // Si hay un error en la Promesa, devolvemos false.
        console.error("Error en la Promesa: ", error);
        return false;
    }
}

exports.iniciarPartida = iniciarPartida;


/*
=================== ELIMINAR BOTS PARTIDA =========================================================
*/
//se eliminan todos los bots los cuales han sido creados para la partida con id, idPartida.
function eliminarBotsPartida(idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        //en la API de github hay que poner false en vez de 0.
        const query = `SELECT * FROM juega WHERE email LIKE 'bot@bot%' AND idPartida ='${idPartida}'`;
        con.query(query, (error, results) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {
                con.end();
                resolve(-1);
            } else {
                //todo ha ido bien, vamos a borrar de la tabla juega y de la tabla jugador los bots.
                results.forEach((row, i) => {
                    con.query(`DELETE FROM juega WHERE email = '${results[i].email}' AND idPartida = '${idPartida}'`, (error, result) => {
                        if (error) {
                            con.end();
                            reject(error);
                        } else {
                            con.query(`DELETE FROM Jugador WHERE email = '${results[i].email}'`, (error, result) => {
                                if (error) {
                                    con.end();
                                    reject(error);
                                } else {
                                    // Si se eliminaron correctamente las instancias de ambas tablas, se pasa a la siguiente línea de results.
                                    if (i === results.length - 1) {
                                        con.end();
                                        resolve(true);
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });
    });
}
exports.eliminarBotsPartida = eliminarBotsPartida;


/*
=================== ACABAR PARTIDA =========================================================
*/
//funcion la cual una vez acabada la partida, indica que dicha partida no esta en curso.
function acabarPartida(idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        //en la API de github hay que poner false en vez de 0.
        const query = `UPDATE partida SET enCurso='0' WHERE idPartida='${idPartida}'`;
        con.query(query, (error, results) => {
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {
                con.end();
                resolve(-1);
            } else {
                //todo ha ido bien, con lo que devolvemos true.
                con.end();
                resolve(true);
            }
        });
    });
}
exports.acabarPartida = acabarPartida;






/*
=================== OBTENER POSICION JUGADORES PARTIDA =========================================================
*/
// Devuelve el listado de jugadores y su posicion en la partida asi -> jugador1:posicion,jugaodr2:posicion ...
//En caso de que no exista la aprtida entonces devuelve false
function obtenerPosicionJugadores(idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT idPartida FROM Partida WHERE idPartida = '${idPartida}'`;
        con.query(query, (error, results) => {                // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                  // Caso -- No existe ninguna partida
                con.end();
                resolve(false);
            } else {                                            // Caso --  Existen la partida

                const query2 = `SELECT email, posicion FROM juega WHERE idPartida = '${idPartida}'`;
                con.query(query2, (error, results2) => {                // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                  // Caso -- No existe ninguna partida
                        con.end();
                        resolve(false);
                    } else {                                            // Caso --  Existen la partida

                        const respuesta = [];
                        results2.forEach((row, i) => {
                            let aux = [];
                            aux[0] = row.email;
                            aux[1] = row.posicion;
                            respuesta[i] = aux.join(":");
                        });

                        let cadena = respuesta.join(",");
                        con.end();
                        resolve(cadena);
                    }
                });
            }
        });
    });
}


exports.obtenerPosicionJugadores = obtenerPosicionJugadores;




/*
=================== OBTENER DINERO JUGADORES PARTIDA =========================================================
*/
// Devuelve el listado de jugadores y su dinero en la partida asi -> jugador1:dinero,jugaodr2:dinero ...
//En caso de que no exista la aprtida entonces devuelve false
function obtenerDineroJugadores(idPartida) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT idPartida FROM Partida WHERE idPartida = '${idPartida}'`;
        con.query(query, (error, results) => {                // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                  // Caso -- No existe ninguna partida
                con.end();
                resolve(false);
            } else {                                            // Caso --  Existen la partida

                const query2 = `SELECT email, dinero FROM juega WHERE idPartida = '${idPartida}'`;
                con.query(query2, (error, results2) => {                // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                  // Caso -- No existe ninguna partida
                        con.end();
                        resolve(false);
                    } else {                                            // Caso --  Existen la partida

                        const respuesta = [];
                        results2.forEach((row, i) => {
                            let aux = [];
                            aux[0] = row.email;
                            aux[1] = row.dinero;
                            respuesta[i] = aux.join(":");
                        });

                        let cadena = respuesta.join(",");
                        con.end();
                        resolve(cadena);
                    }
                });
            }
        });
    });
}


exports.obtenerDineroJugadores = obtenerDineroJugadores;


/*
=================== ESTADO JUGADOR PARTIDA =========================================================
*/

//funcion la cual devuelve los jugadores de la partida unidos con : y 1 si esta vivo y 0 sino esta vivo.
function estadoJugadoresPartida(idPartida) {
    return new Promise((resolve, reject) => {
      // Creamos una conexión a la base de datos
      const con = db.crearConexion();
      con.connect();
     
      // Consulta SQL para obtener el estado de los jugadores en la partida
      const query = `SELECT jugadorVivo,email FROM juega WHERE idPartida = '${idPartida}'`;
      con.query(query, (error, results) => {
        if (error) {
          con.end();
          reject(error);
        } 
        else if (results.length === 0) {
          // Si no hay resultados, resolvemos la promesa con un valor verdadero
          con.end();
          resolve(true);
        } 
        else {
          // Si hay resultados, creamos un array vacío para almacenar los resultados
          const resul = [];
          
          // Recorremos cada fila encontrada
          results.forEach((row) => {
            // Obtenemos la vida del jugador y su correo electrónico
            const vida = row.jugadorVivo;
            const jugador = row.email.trim(); // Aplicamos trim() para eliminar el espacio en blanco antes del nombre
  
            // Si el jugador está vivo, agregamos su correo electrónico y el valor 1 al resultado
            if (vida === 1) {
              resul.push(`${jugador}:1`);
            } 
            // De lo contrario, agregamos su correo electrónico y el valor 0 al resultado
            else {
              resul.push(`${jugador}:0`);
            }
          });
  
          // Cerramos la conexión a la base de datos y resolvemos la promesa con los resultados
          con.end();
          resolve(resul.join(","));
        }
      });
    });
  }
  
  // Exportamos la función para que pueda ser utilizada en otros archivos
  exports.estadoJugadoresPartida = estadoJugadoresPartida;
  
  
  
/*
=================== ACTUALIZAR POSICION JUGADOR PARTIDA =========================================================
*/
  
  //funcion la cual devuelve el jugador en la posicion establecida de la partida idPartida. Devuelve -1 si hay algo mal y la posicion actualizada si todo ha ido bien. 
  //Devuelve -2 si estaba en la carcel y no actualiza la posicion.
  function actualizarPosicionJugador(idJugador, idPartida, posicion) {
    return new Promise((resolve, reject) => {
      // Creamos una conexión a la base de datos
      const con = db.crearConexion();
      con.connect();
  
      //comprobar que la posicion que nos pasa no sea mayor que MAX_CASILLAS.
      if (posicion > MAX_CASILLAS) {
        con.end();
        resolve(-1);
      } else {
        //vamos a obtener la posicion actual del jugador y despues se la actualizaremos.
        const query1 = `SELECT posicion FROM juega WHERE email = '${idJugador}' AND idPartida = '${idPartida}'`;
        con.query(query1, (error, results1) => {
          if (error) {
            con.end();
            reject(error);
          } else if (results1.length === 0) {
            con.end();
            resolve(-1);
          } else {
            //ahora actualizamos la posicion del jugador.
            let posicionAnterior = results1[0].posicion; //se podria comprobar que no estuviese en la carcel.
            if (posicionAnterior == POSICION_CARCEL) {
              con.end();
              resolve(-2);
            } else {
              let nuevaPosicion = (posicion) % 41; // le hacemos le modulo para que no se lien las posicion en el tablero.
              if (nuevaPosicion === 0) {
                nuevaPosicion = 1;
              }
              const updateQuery = `UPDATE juega SET posicion = ? WHERE email = ? AND idPartida = ?`;
              //si metes entre [] los valores, son los de la query que ponemos interrogantes.
              con.query(updateQuery, [nuevaPosicion, idJugador, idPartida], (error, results2) => {
                if (error) {
                  con.end();
                  reject(error);
                } else if (results2.affectedRows === 0) {
                  con.end();
                  resolve(-1);
                } else {
                  // Devolver la nueva posicion si todo ha ido bien.
                  con.end();
                  resolve(nuevaPosicion);
                }
              });
            }
          }
        });
      }
    });
  }
  exports.actualizarPosicionJugador = actualizarPosicionJugador;


/*
=================== JUGADOR ACABA PARTIDA =========================================================
*/
  
  //funcion la cual determina que un jugador ya esta acabado de la partida.(jugadorVivo = 0).
  function jugadorAcabadoPartida(email, idPartida) {
    return new Promise((resolve, reject) => {
      // Creamos una conexión a la base de datos
      const con = db.crearConexion();
      con.connect();
  
      // Consulta SQL para actualizar el estado del jugador a "acabado" en la partida
      const query = `UPDATE juega SET jugadorVivo = false WHERE email = '${email}' AND idPartida = '${idPartida}'`;
      con.query(query, (error, result) => {
        if (error) {
          con.end();
          reject(error);
        } 
        else if (result.affectedRows === 0) {
          // Si no se afectó ninguna fila en la actualización, significa que el jugador no estaba en la partida
          con.end();
          resolve(false);
        } 
        else {
          // Si se afectó una fila en la actualización, significa que el jugador está acabado en la partida
          con.end();
          resolve(true);
        }
      });
    });
  }
  
  // Exportamos la función para que pueda ser utilizada en otros archivos
  exports.jugadorAcabadoPartida = jugadorAcabadoPartida;
  