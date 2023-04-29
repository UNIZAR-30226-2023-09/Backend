/*
 ----------------------------------------------------------------------------
 * Fichero: jugadorAPI.js
 * Autores: Jesus Lizama Moreno, Cesar Vela Martínez 
 * NIPs: 816473, 816590
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha ultima actualizacion: 17/03/2023
 ----------------------------------------------------------------------------
*/

const db = require('./db');




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
        con.connect(function (err) {
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
  insertarUsuario(userData);
  Dado un email, inserta un nuevo usuario al juego del Monopòly y añade las skins "PLEX" y "JULS" en la tabla tieneSkins.
*/
async function insertarUsuarioConSkins(userData) {
    const success = await insertarUsuario(userData);
    if (!success) {
        return false;
    }

    const email = userData.split(',')[2].trim();
    const skinIds = ["PLEX", "JULS"];

    const query = `INSERT INTO tieneSkins (email, idSkin) VALUES (?, ?)`;

    try {
        const con = db.crearConexion();
        for (const skinId of skinIds) {
            const values = [email, skinId];
            await con.promise().execute(query, values);
        }
        con.end(); // Cerrar conexión
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

exports.insertarUsuarioConSkins = insertarUsuarioConSkins;




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

function comprobarInicioSesion(email, contrasenya) {
    return new Promise((resolve, reject) => {
        var con = db.crearConexion();
        con.connect(function (err) {
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
                        if (pass == contrasenya) {
                            //son iguales, devolvemos numero de gemas.
                            resolve(gemas);
                        }
                        else {
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
                                            } else {
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
===================OBTENER INFORMACION DE UN JUGADOR =========================================
*/

// Obtener información básica sobre un jugador (nombre, gemas, email, pass)
//devuelve una cadena de la siguiente forma: " email,gemas,nombre,pass".

function obtenerInformacionJugador(id_jugador) {
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
