/*
 ----------------------------------------------------------------------------
 * Fichero: skinsAPI.js
 * Autores: Jesus Lizama Moreno, Cesar Vela Martínez y David Rivera Seves
 * NIPs: 816473, 816590, 815124
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha ultima actualizacion: 18/03/2023
 ----------------------------------------------------------------------------
*/

const db = require('./db');


/*
=================== OBTENER LISTADO SKINS PARA COMPRAR =========================================================
*/
// Devuelve el listado de skins con id.Precio que estan en el sistema
//En caso de que no existan skins en el sistema devuelve false
function obtenerListadoSkins() {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT * FROM Skins`;
        con.query(query, (error, results) => {                // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                  // Caso -- No existe ninguna Skin
                con.end();
                resolve(false);
            } else {                                            // Caso --  Existen Skins

                const respuesta = [];
                results.forEach((row, i) => {
                    let aux = [];
                    aux[0] = row.idSkin;
                    aux[1] = row.precioGemas;
                    respuesta[i] = aux.join(".");
                });

                let cadena = respuesta.join(",");
                con.end();
                resolve(cadena)
            }
        });
    });
}


exports.obtenerListadoSkins = obtenerListadoSkins;



/*
=================== JUGADOR IDJUGADOR COMPRA SKIN CON IDSKIN =========================================================
*/
// Devuelve el true si se ha añadido la skin a las que tiene el jugador y se le ha actualizado el dinero
// En caso de que no exista la skin o el jugador devuelve false o si ya tiene esa skin
function comprarSkin(idJugador, idSkin) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT gemas FROM Jugador WHERE email = '${idJugador}'`;       // Vemos si existe el jugador
        con.query(query, (error, results) => {
            if (error) {                                            // Caso -- ERROR
                con.end();
                reject(error);
            } else if (results.length === 0) {                      // Caso -- No existe JUGADOR
                con.end();
                resolve(false);
            } else {                                                // Caso -- Existe JUGADOR

                let gemasJugador = results[0].gemas;

                const query2 = `SELECT precioGemas FROM Skins WHERE idSkin = '${idSkin}'`;       // Vemos si existe la Skin
                con.query(query2, (error, results2) => {
                    if (error) {                                        // Caso -- ERROR
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                 // Caso -- No existe Skin
                        con.end();
                        resolve(false);
                    } else {                                            // Caso -- Existe Skin
                        let precio = results2[0].precioGemas;
                        if (precio > gemasJugador) {                       // Caso -- Jugador no tiene suficiente dinero
                            con.end();
                            resolve(false);
                        } else {                                          // Caso -- Jugador tiene dinero para comprar

                            const query3 = `SELECT * FROM tieneSkins WHERE idSkin = '${idSkin}' AND email = '${idJugador}';`;
                            con.query(query3, (error, results3) => {
                                if (error) {                                  // Caso -- ERROR
                                    con.end();
                                    reject(error);
                                } else if (results3.length != 0) {            // Caso -- El jugador ya tiene esta skin
                                    con.end();
                                    resolve(false);
                                } else {                                      // Caso -- El jugador no tiene la Skin

                                    const sql = `INSERT INTO tieneSkins (idSkin, email) VALUES ('${idSkin}', '${idJugador}');`;
                                    con.query(sql, (error, results4) => {
                                        if (error) {                              // Caso -- ERROR
                                            con.end();
                                            reject(error);
                                        } else {                                  // Caso -- Insert hecho correctamente

                                            const sql2 = `UPDATE Jugador SET gemas = ${gemasJugador} - ${precio} WHERE email = '${idJugador}';`;
                                            con.query(sql2, (error, results5) => {
                                                if (error) {                          // Caso -- ERROR
                                                    con.end();
                                                    reject(error);
                                                } else {                              // Caso -- Update hecho correctamente
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


exports.comprarSkin = comprarSkin;
