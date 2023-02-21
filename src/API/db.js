var mysql = require('mysql');

//valores para conectarse a la base.
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "xxx",
  database: 'xxx'
});

module.exports = con;
