--
-- Proyecto Software (2022/2023)
-- Fichero: create_tables.sql
-- Autor: David Rivera Seves (NIP: 815124)
--


CREATE TABLE Skins (
    precioGemas     INT NOT NULL,
    idSkin          VARCHAR(255) PRIMARY KEY
);


CREATE TABLE Jugador (
    gemas           INT NOT NULL,
    nombre          VARCHAR(255) NOT NULL,
    pass            VARCHAR(255) NOT NULL,
    skinEquipada    VARCHAR(255) NOT NULL,
    email           VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY (skinEquipada) REFERENCES Skins(idSkin)
);


CREATE TABLE tieneSkins (
    idSkin          VARCHAR(255),
    email           VARCHAR(255),
    PRIMARY KEY (email, idSkin),
    FOREIGN KEY (idSkin) REFERENCES Skins(idSkin),
    FOREIGN KEY (email) REFERENCES Jugador(email)
);


CREATE TABLE Torneo (
    nPartidas       INT NOT NULL,
    estaActivo      BOOLEAN,
    idTorneo        INT AUTO_INCREMENT PRIMARY KEY
);


CREATE TABLE Partida (
    ronda           INT NOT NULL,
    bote            FLOAT NOT NULL,
    evento          VARCHAR(255) NOT NULL,
    economia        FLOAT NOT NULL,
    
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
    
    precioPropiedad1      FLOAT NOT NULL,
    precioPropiedad2      FLOAT NOT NULL,
    precioPropiedad3      FLOAT NOT NULL,
    precioPropiedad4      FLOAT NOT NULL,
    precioPropiedad5      FLOAT NOT NULL,
    precioPropiedad6      FLOAT NOT NULL,
    precioPropiedad7      FLOAT NOT NULL,
    precioPropiedad8      FLOAT NOT NULL,
    precioPropiedad9      FLOAT NOT NULL,
    precioPropiedad10     FLOAT NOT NULL,
    precioPropiedad11     FLOAT NOT NULL,
    precioPropiedad12     FLOAT NOT NULL,
    precioPropiedad13     FLOAT NOT NULL,
    precioPropiedad14     FLOAT NOT NULL,
    precioPropiedad15     FLOAT NOT NULL,
    precioPropiedad16     FLOAT NOT NULL,
    precioPropiedad17     FLOAT NOT NULL,
    precioPropiedad18     FLOAT NOT NULL,
    precioPropiedad19     FLOAT NOT NULL,
    precioPropiedad20     FLOAT NOT NULL,
    precioPropiedad21     FLOAT NOT NULL,
    precioPropiedad22     FLOAT NOT NULL,
    precioPropiedad23     FLOAT NOT NULL,
    precioPropiedad24     FLOAT NOT NULL,
    precioPropiedad25     FLOAT NOT NULL,
    precioPropiedad26     FLOAT NOT NULL,
    precioPropiedad27     FLOAT NOT NULL,
    precioPropiedad28     FLOAT NOT NULL,
    precioPropiedad29     FLOAT NOT NULL,
    precioPropiedad30     FLOAT NOT NULL,
    precioPropiedad31     FLOAT NOT NULL,
    precioPropiedad32     FLOAT NOT NULL,
    precioPropiedad33     FLOAT NOT NULL,
    precioPropiedad34     FLOAT NOT NULL,
    precioPropiedad35     FLOAT NOT NULL,
    precioPropiedad36     FLOAT NOT NULL,
    precioPropiedad37     FLOAT NOT NULL,
    precioPropiedad38     FLOAT NOT NULL,
    precioPropiedad39     FLOAT NOT NULL,
    precioPropiedad40     FLOAT NOT NULL,
    
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
    turno           VARCHAR(255),
    
    
    enCurso         BOOLEAN,
    perteneceTorneo INT,
    idPartida       INT AUTO_INCREMENT PRIMARY KEY,
    numTurnosSubasta INT,
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
    FOREIGN KEY (turno) REFERENCES Jugador(email),
    FOREIGN KEY (perteneceTorneo) REFERENCES Torneo(idTorneo)
);


CREATE TABLE juega (
    turno           INT,
    esBotInicial    BOOLEAN NOT NULL,
    esBot           BOOLEAN NOT NULL,
    jugadorVivo     BOOLEAN NOT NULL,
    numPropiedades  INT NOT NULL,
    dineroInvertido FLOAT NOT NULL,
    nTurnosCarcel   INT NOT NULL,
    posicion        INT NOT NULL,
    dinero          FLOAT NOT NULL,
    skin            VARCHAR(255) NOT NULL,
    puestoPartida   INT,
    email           VARCHAR(255),
    idPartida       INT,
    propiedadSubastar VARCHAR(255),
    precioSubastar FLOAT,
    PRIMARY KEY (idPartida, email),
    FOREIGN KEY (email) REFERENCES Jugador(email),
    FOREIGN KEY (idPartida) REFERENCES Partida(idPartida),
    FOREIGN KEY (skin) REFERENCES Skins(idSkin)
);


CREATE TABLE estaEnTorneo (
    idTorneo        INT,
    email           VARCHAR(255),
    PRIMARY KEY (email, idTorneo),
    FOREIGN KEY (idTorneo) REFERENCES Torneo(idTorneo),
    FOREIGN KEY (email) REFERENCES Jugador(email)
);


INSERT INTO Skins (precioGemas, idSkin) VALUES
(0, 'PLEX'),
(1, 'BAXTER'),
(10, 'BERTA'),
(15, 'DIONIX'),
(20, 'JEANCARLO'),
(0, 'JULS'),
(3, 'LUCAS'),
(50, 'TITE');
(0, 'TABLERO1');
(20, 'TABLERO2');
(100, 'TABLERO3');
(50, 'TABLERO4');
