/******************************************************************************\
* Asignatura: Proyecto Software (2022/2023)                                    *
* Fichero: exec_remote_sql.js                                                  *
* Autor: David Rivera Seves (NIP: 815124)                                      *
* Ejecución: node exec_remote_sql 'SHOW TABLES'                                *
\******************************************************************************/

const mysql = require('mysql');
const conexion = require('../../API/db');

// Lee la consulta SQL desde la línea de comandos
const args = process.argv.slice(2);
const sqlQuery = args[0];

// Verifica si se ha pasado un argumento
if (!sqlQuery) {
  console.error('Debes especificar la consulta SQL a ejecutar');
  process.exit(1);
}

// Crear la conexion
connection = conexion.crearConexion();

// Conéctate a la base de datos
connection.connect();

// Ejecuta la consulta SQL en la base de datos
connection.query(sqlQuery, function (error, results, fields) {
  if (error) throw error;
  console.log('La consulta SQL se ha ejecutado correctamente');
  if (results.length > 0) {
    console.log('[');
    // Extrae los valores de los objetos y los imprime en la consola
    results.forEach((result) => {
      console.log(Object.values(result));
    });
    console.log(']');
  } else {
    console.log('[]');
  }
  console.log();
});

// Cierra la conexión a la base de datos
connection.end();