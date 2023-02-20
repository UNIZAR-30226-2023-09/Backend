--
-- Proyecto Software (2022/2023)
-- Fichero: create_tables.sql
--


CREATE TABLE Skins (
	precioGemas     INT NOT NULL,
	idSkin          VARCHAR(255) PRIMARY KEY
);


CREATE TABLE Jugador (
	gemas           INT NOT NULL,
	nombre          VARCHAR(255) NOT NULL,
	pass            VARCHAR(255) NOT NULL,
	email           VARCHAR(255) PRIMARY KEY
);


CREATE TABLE tieneSkins (
	idSkin          VARCHAR(255),
	email           VARCHAR(255),
	PRIMARY KEY (email, idSkin),
	FOREIGN KEY (idSkin) REFERENCES Skins(idSkin),
	FOREIGN KEY (email) REFERENCES Jugador(email)
);


CREATE TABLE Torneo (
	nPartidas		INT NOT NULL,
	estaActivo		BOOLEAN,
	idTorneo        INT AUTO_INCREMENT PRIMARY KEY
);


CREATE TABLE Partida (
	ronda           INT NOT NULL,
	bote            FLOAT NOT NULL,
	evento          VARCHAR(255) NOT NULL,
	economia        FLOAT NOT NULL,
	propiedad1      VARCHAR(255),
	propiedad2      VARCHAR(255),
	carta1          VARCHAR(255),
	carta2          VARCHAR(255),
	turno           VARCHAR(255),
	nCasasProp1     INT,
	nCasasProp2     INT,
	enCurso         BOOLEAN,
	perteneceTorneo INT,
	idPartida       INT AUTO_INCREMENT PRIMARY KEY,
	FOREIGN KEY (propiedad1) REFERENCES Jugador(email),
	FOREIGN KEY (propiedad2) REFERENCES Jugador(email),
	FOREIGN KEY (carta1) REFERENCES Jugador(email),
	FOREIGN KEY (carta2) REFERENCES Jugador(email),
	FOREIGN KEY (turno) REFERENCES Jugador(email),
	FOREIGN KEY (perteneceTorneo) REFERENCES Torneo(idTorneo)
);


CREATE TABLE juega (
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


CREATE TABLE estaEnTorneo (
	idTorneo INT,
	email VARCHAR(255),
	PRIMARY KEY (email, idTorneo),
	FOREIGN KEY (idTorneo) REFERENCES Torneo(idTorneo),
	FOREIGN KEY (email) REFERENCES Jugador(email)
);
