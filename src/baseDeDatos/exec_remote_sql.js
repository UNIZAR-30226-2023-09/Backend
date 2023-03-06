/******************************************************************************\
* Asignatura: Proyecto Software (2022/2023)                                    *
* Fichero: exec_remote_sql.js                                                  *
* Autor: David Rivera Seves (NIP: 815124)                                      *
* Ejecución: node exec_remote_sql 'SHOW TABLES'                                *
\******************************************************************************/

const mysql = require('mysql');

// Lee la consulta SQL desde la línea de comandos
const args = process.argv.slice(2);
const sqlQuery = args[0];

// Verifica si se ha pasado un argumento
if (!sqlQuery) {
  console.error('Debes especificar la consulta SQL a ejecutar');
  process.exit(1);
}

// Establece los detalles de conexión a la base de datos
const connection = mysql.createConnection({
  host: '34.175.167.234',
  user: 'root',
  password: 'psbackend1234',
  database: 'otterfortune_main_db',
});

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
