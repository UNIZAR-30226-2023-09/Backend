/*
 ----------------------------------------------------------------------------
 * Fichero: db.js
 * Autor: Jesus Lizama Moreno 
 * NIP: 816473
 * Descripción: Fichero de funciones API para el acceso a la base de datos.
 * Fecha Ultima Actualizacion: 23/02/2023
 ----------------------------------------------------------------------------
*/



var mysql = require('mysql');

//valores para conectarse a la base.
var con = mysql.createConnection({
  host: '34.175.167.234',
  user: 'root',
  password: 'psbackend1234',
  database: 'otterfortune_main_db'
});

module.exports = con;
