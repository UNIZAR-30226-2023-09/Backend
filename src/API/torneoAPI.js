/*
 ----------------------------------------------------------------------------
 * Fichero: torneoAPI.js
 * Autores: Jesus Lizama Moreno, Cesar Vela Martínez y David Rivera Seves
 * NIPs: 816473, 816590, 815124
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha ultima actualizacion: 17/03/2023
 ----------------------------------------------------------------------------
*/

const db = require('./db');



/*
===================CREAR TORNEO CON ID_JUGADOR Y NPARTIDAS =========================================
*/

// Devuelve el id_torneo del torneo recien creado por el jugador idJugador
//En caso de que no pueda crearse el torneo, o el jugador idJugador no exista devuelve -1.
function crearTorneo(idJugador, nPartidas) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT * FROM Jugador WHERE email = '${idJugador}'`;       // Vemos si existe el jugador
        con.query(query, (error, results) => {
            if (error) {                            // Caso -- ERROR
                con.end();
                reject(error);
            } else if (results.length === 0) {      // Caso -- No existe Jugador
                con.end();
                resolve(-1);
            } else {                                // Caso -- Existe Jugador
                const sql = `INSERT INTO Torneo (nPartidas, estaActivo) VALUES ('${nPartidas}', true);`;;
                con.query(sql, (error, results2) => {
                    if (error) {                        // Caso -- ERROR al crear el torneo
                        con.end();
                        reject(error);
                    } else {                            // Caso -- Se creo el Torneo correctamente
                        let devolver = results2.insertId;
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
    });
}


exports.crearTorneo = crearTorneo;





/*
===================AÑADIR JUGADOR CON ID_JUGADOR A TORNEO CON ID_TORNEO =========================================
*/

// Devuelve el true si se ha añadido al jugador id_jugador, al torneo con id_torneo
//En caso de que no exista el torneo o el jugador devuelve false o ya se haya metido al jugador en ese torneo.
function unirseTorneo(idJugador, idTorneo) {
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
=================== OBTENER PUNTUACIONES TORNEO =========================================================
*/
// Devuelve el listado de los jugadores y sus puntuaciones totales en el torneo (Menor es que ha quedado mas veces primero)
// ejemplo=> jugador1 - puntuacion1 , jugador2 - puntuacion2
// En caso de que no exista el torneo, o no tenga partidas acabadas para poder sacar datos, devuelve false
function verClasificacionTorneo(idTorneo) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect();
        const query = `SELECT * FROM Torneo WHERE idTorneo = '${idTorneo}'`;
        con.query(query, (error, results) => {                    // Caso -- Error
            if (error) {
                con.end();
                reject(error);
            } else if (results.length === 0) {                      // Caso -- No existe el Torneo
                con.end();
                resolve(false);
            } else {                                                // Caso --  Existe el Torneo
                const query2 = `SELECT email, sum(puestoPartida) AS puntos FROM (SELECT B.email, B.puestoPartida 
          FROM juega B INNER JOIN Partida A ON A.idPartida = B.idPartida 
          WHERE A.perteneceTorneo = '${idTorneo}' AND A.enCurso = false) AS AUX1 GROUP BY email ORDER BY puntos ASC;`;
                con.query(query2, (error, results2) => {                // Caso -- Error
                    if (error) {
                        con.end();
                        reject(error);
                    } else if (results2.length === 0) {                  // Caso -- No hay partidas terminadas
                        con.end();
                        resolve(false);
                    } else {                                            // Caso --  Se obtienen bien los resultados
                        const respuesta = [];
                        results2.forEach((row, i) => {
                            let aux = [];
                            aux[0] = row.email;
                            aux[1] = row.puntos;
                            respuesta[i] = aux.join("-");
                        });
                        let cadena = respuesta.join(",");
                        con.end();
                        resolve(cadena)
                    }
                });
            }
        });
    });
}


exports.verClasificacionTorneo = verClasificacionTorneo;