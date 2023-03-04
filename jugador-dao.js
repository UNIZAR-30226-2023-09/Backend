// npm install mysql
// node ejemplo.js
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'pass';
//		https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
// flush privileges;

const mysql = require('mysql');

class JugadorDAO {
	constructor() {
		this.connection = mysql.createConnection({
			host: '34.175.167.234',
			user: 'root',
			password: 'psbackend1234',
			database: 'otterfortune_main_db',
		});
	}
	
	crearJugador(email, nombre, pass, gemas) {
		return new Promise((resolve, reject) => {
			const sql = 'INSERT INTO Jugador (email, nombre, pass, gemas) VALUES (?, ?, ?, ?)';
			const values = [email, nombre, pass, gemas];
			this.connection.query(sql, values, (error, results, fields) => {
				if (error) reject(error);
				resolve(results.insertId);
			});
		});
	}
	
	obtenerJugadores() {
		return new Promise((resolve, reject) => {
			const sql = 'SELECT * FROM Jugador';
			this.connection.query(sql, (error, results, fields) => {
				if (error) reject(error);
				resolve(results);
			});
		});
	}
	
	actualizarGemasJugador(email, nuevasGemas) {
		return new Promise((resolve, reject) => {
			const sql = 'UPDATE Jugador SET gemas = ? WHERE email = ?';
			const values = [nuevasGemas, email];
			this.connection.query(sql, values, (error, results, fields) => {
				if (error) reject(error);
				resolve(results.affectedRows);
			});
		});
	}
	
	eliminarJugador(email) {
		return new Promise((resolve, reject) => {
			const sql = 'DELETE FROM Jugador WHERE email = ?';
			const values = [email];
			this.connection.query(sql, values, (error, results, fields) => {
				if (error) reject(error);
				resolve(results.affectedRows);
			});
		});
	}
	
	destroyConnection() {
		this.connection.end();
	}
}

module.exports = JugadorDAO;
