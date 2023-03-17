#!/bin/bash

################################################################################
# Asignatura: Proyecto Software (2022/2023)                                    #
# Fichero: ejecutarSQL.sh                                                      #
# Autor: David Rivera Seves (NIP: 815124)                                      #
# Ejecución: bash ejecutarSQL.sh                                               #
################################################################################

ejecutar=$1

if [ $ejecutar -eq 1 ]
then
	# Create tables
	node exec_remote_sql '''
	CREATE TABLE Skins (
		precioGemas     INT NOT NULL,
		idSkin          VARCHAR(255) PRIMARY KEY
	);
	'''
	node exec_remote_sql '''
	CREATE TABLE Jugador (
		gemas           INT NOT NULL,
		nombre          VARCHAR(255) NOT NULL,
		pass            VARCHAR(255) NOT NULL,
		email           VARCHAR(255) PRIMARY KEY
	);
	'''
	node exec_remote_sql '''
	CREATE TABLE tieneSkins (
		idSkin          VARCHAR(255),
		email           VARCHAR(255),
		PRIMARY KEY (email, idSkin),
		FOREIGN KEY (idSkin) REFERENCES Skins(idSkin),
		FOREIGN KEY (email) REFERENCES Jugador(email)
	);
	'''
	node exec_remote_sql '''
	CREATE TABLE Torneo (
		nPartidas       INT NOT NULL,
		estaActivo      BOOLEAN,
		idTorneo        INT AUTO_INCREMENT PRIMARY KEY
	);
	'''
	node exec_remote_sql '''
	CREATE TABLE Partida (
		ronda           INT NOT NULL,
		bote            FLOAT NOT NULL,
		evento          VARCHAR(255) NOT NULL,
		economia        FLOAT NOT NULL,
		precioBase      FLOAT NOT NULL,
		propiedad1      VARCHAR(255),
		propiedad2      VARCHAR(255),
		propiedad3      VARCHAR(255),
		propiedad4      VARCHAR(255),
		propiedad5      VARCHAR(255),
		propiedad6      VARCHAR(255),
		propiedad7      VARCHAR(255),
		propiedad8      VARCHAR(255),
		propiedad9      VARCHAR(255),
		propiedad10     VARCHAR(255),
		propiedad11     VARCHAR(255),
		propiedad12     VARCHAR(255),
		propiedad13     VARCHAR(255),
		propiedad14     VARCHAR(255),
		propiedad15     VARCHAR(255),
		propiedad16     VARCHAR(255),
		propiedad17     VARCHAR(255),
		propiedad18     VARCHAR(255),
		propiedad19     VARCHAR(255),
		propiedad20     VARCHAR(255),
		propiedad21     VARCHAR(255),
		propiedad22     VARCHAR(255),
		propiedad23     VARCHAR(255),
		propiedad24     VARCHAR(255),
		propiedad25     VARCHAR(255),
		propiedad26     VARCHAR(255),
		propiedad27     VARCHAR(255),
		propiedad28     VARCHAR(255),
		propiedad29     VARCHAR(255),
		propiedad30     VARCHAR(255),
		propiedad31     VARCHAR(255),
		propiedad32     VARCHAR(255),
		propiedad33     VARCHAR(255),
		propiedad34     VARCHAR(255),
		propiedad35     VARCHAR(255),
		propiedad36     VARCHAR(255),
		propiedad37     VARCHAR(255),
		propiedad38     VARCHAR(255),
		propiedad39     VARCHAR(255),
		propiedad40     VARCHAR(255),
		carta1          VARCHAR(255),
		carta2          VARCHAR(255),
		turno           VARCHAR(255),
		nCasasPropiedad1        INT,
		nCasasPropiedad2        INT,
		nCasasPropiedad3        INT,
		nCasasPropiedad4        INT,
		nCasasPropiedad5        INT,
		nCasasPropiedad6        INT,
		nCasasPropiedad7        INT,
		nCasasPropiedad8        INT,
		nCasasPropiedad9        INT,
		nCasasPropiedad10       INT,
		nCasasPropiedad11       INT,
		nCasasPropiedad12       INT,
		nCasasPropiedad13       INT,
		nCasasPropiedad14       INT,
		nCasasPropiedad15       INT,
		nCasasPropiedad16       INT,
		nCasasPropiedad17       INT,
		nCasasPropiedad18       INT,
		nCasasPropiedad19       INT,
		nCasasPropiedad20       INT,
		nCasasPropiedad21       INT,
		nCasasPropiedad22       INT,
		nCasasPropiedad23       INT,
		nCasasPropiedad24       INT,
		nCasasPropiedad25       INT,
		nCasasPropiedad26       INT,
		nCasasPropiedad27       INT,
		nCasasPropiedad28       INT,
		nCasasPropiedad29       INT,
		nCasasPropiedad30       INT,
		nCasasPropiedad31       INT,
		nCasasPropiedad32       INT,
		nCasasPropiedad33       INT,
		nCasasPropiedad34       INT,
		nCasasPropiedad35       INT,
		nCasasPropiedad36       INT,
		nCasasPropiedad37       INT,
		nCasasPropiedad38       INT,
		nCasasPropiedad39       INT,
		nCasasPropiedad40       INT,
		enCurso         BOOLEAN,
		perteneceTorneo INT,
		idPartida       INT AUTO_INCREMENT PRIMARY KEY,
		FOREIGN KEY (propiedad1) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad2) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad3) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad4) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad5) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad6) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad7) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad8) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad9) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad10) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad11) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad12) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad13) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad14) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad15) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad16) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad17) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad18) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad19) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad20) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad21) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad22) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad23) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad24) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad25) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad26) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad27) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad28) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad29) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad30) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad31) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad32) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad33) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad34) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad35) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad36) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad37) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad38) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad39) REFERENCES Jugador(email),
		FOREIGN KEY (propiedad40) REFERENCES Jugador(email),
		FOREIGN KEY (carta1) REFERENCES Jugador(email),
		FOREIGN KEY (carta2) REFERENCES Jugador(email),
		FOREIGN KEY (turno) REFERENCES Jugador(email),
		FOREIGN KEY (perteneceTorneo) REFERENCES Torneo(idTorneo)
	);
	'''
	node exec_remote_sql '''
	CREATE TABLE juega (
		numPropiedades  INT NOT NULL,
		dineroInvertido FLOAT NOT NULL,
		nTurnosCarcel   INT NOT NULL,
		posicion        INT NOT NULL,
		dinero          FLOAT NOT NULL,
		skin            VARCHAR(255) NOT NULL,
		puestoPartida   INT,
		email           VARCHAR(255),
		idPartida       INT,
		PRIMARY KEY (idPartida, email),
		FOREIGN KEY (email) REFERENCES Jugador(email),
		FOREIGN KEY (idPartida) REFERENCES Partida(idPartida),
		FOREIGN KEY (skin) REFERENCES Skins(idSkin)
	);
	'''
	node exec_remote_sql '''
	CREATE TABLE estaEnTorneo (
		idTorneo        INT,
		email           VARCHAR(255),
		PRIMARY KEY (email, idTorneo),
		FOREIGN KEY (idTorneo) REFERENCES Torneo(idTorneo),
		FOREIGN KEY (email) REFERENCES Jugador(email)
	);
	'''
	sleep 1

	# Poblar tables
	node exec_remote_sql '''
	INSERT INTO Skins (precioGemas, idSkin) VALUES
	(0, "default"),
	(10, "skin1"),
	(15, "skin2")
	'''
	node exec_remote_sql '''
	INSERT INTO Jugador (gemas, nombre, pass, email) VALUES
	(10, "jugador1", "1234", "jugador1@example.com"),
	(20, "jugador2", "1234", "jugador2@example.com"),
	(30, "jugador3", "1234", "jugador3@example.com")
	'''
	node exec_remote_sql '''
	INSERT INTO tieneSkins (idSkin, email) VALUES
	("default", "jugador1@example.com"),
	("default", "jugador2@example.com"),
	("default", "jugador3@example.com")
	'''
	node exec_remote_sql '''
	INSERT INTO Partida (ronda, bote, evento, economia, precioBase) VALUES
	(0, 0.0, "Inicial", 0.0, 0.0)
	'''
	node exec_remote_sql '''
	INSERT INTO juega (numPropiedades, dineroInvertido, nTurnosCarcel, posicion, dinero, skin, email, idPartida) VALUES
	(0, 0.0, 0, 0, 0.0, "default", "jugador1@example.com", 1),
	(0, 0.0, 0, 0, 0.0, "default", "jugador2@example.com", 1)
	'''
	node exec_remote_sql '''
	INSERT INTO Torneo (nPartidas, estaActivo) VALUES
	(2, NULL)
	'''
	node exec_remote_sql '''
	INSERT INTO estaEnTorneo (idTorneo, email) VALUES
	(1, "jugador2@example.com"),
	(1, "jugador3@example.com")
	'''
	node exec_remote_sql '''
	INSERT INTO Partida (ronda, bote, evento, economia, precioBase, perteneceTorneo) VALUES
	(0, 0.0, "Inicial", 0.0, 0.0, 1),
	(0, 0.0, "Inicial", 0.0, 0.0, 1)
	'''
	node exec_remote_sql '''
	INSERT INTO juega (numPropiedades, dineroInvertido, nTurnosCarcel, posicion, dinero, skin, email, idPartida) VALUES
	(0, 0.0, 0, 0, 0.0, "default", "jugador2@example.com", 2),
	(0, 0.0, 0, 0, 0.0, "default", "jugador3@example.com", 2)
	'''

elif [ $ejecutar -eq 2 ]
then
	# Drop tables
	node exec_remote_sql 'DROP TABLE IF EXISTS estaEnTorneo;'
	node exec_remote_sql 'DROP TABLE IF EXISTS juega;'
	node exec_remote_sql 'DROP TABLE IF EXISTS Partida;'
	node exec_remote_sql 'DROP TABLE IF EXISTS Torneo;'
	node exec_remote_sql 'DROP TABLE IF EXISTS tieneSkins;'
	node exec_remote_sql 'DROP TABLE IF EXISTS Jugador;'
	node exec_remote_sql 'DROP TABLE IF EXISTS Skins;'
	node exec_remote_sql 'SHOW TABLES'
fi
