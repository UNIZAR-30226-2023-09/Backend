--------------------------------------------------------------------------------
-- Proyecto Software (2022/2023)                                              --
-- Fichero: poblar_example.sql                                                --
--------------------------------------------------------------------------------


-- Skins
INSERT INTO Skins (precioGemas, idSkin) VALUES
(10, 'skin1'),
(15, 'skin2'),
(20, 'skin3'),
(25, 'skin4'),
(30, 'skin5');


-- Jugadores
INSERT INTO Jugador (gemas, nombre, pass, email) VALUES
(10, 'Pedro', '123456', 'pedro@example.com'),
(20, 'Laura', 'abcdef', 'laura@example.com'),
(5, 'Juan', 'qwerty', 'juan@example.com'),
(50, 'Sara', 'p@ssw0rd', 'sara@example.com');


-- Jugador compra Skin
INSERT INTO tieneSkins (idSkin, email) VALUES ('skin1', 'pedro@example.com');
INSERT INTO tieneSkins (idSkin, email) VALUES ('skin2', 'laura@example.com');
INSERT INTO tieneSkins (idSkin, email) VALUES ('skin3', 'juan@example.com');
INSERT INTO tieneSkins (idSkin, email) VALUES ('skin4', 'sara@example.com');


-- Torneos
INSERT INTO Torneo (nPartidas, estaActivo, idTorneo) VALUES (2, true, DEFAULT);
INSERT INTO Torneo (nPartidas, estaActivo, idTorneo) VALUES (4, null, DEFAULT);


-- Jugador esta en Torneo
INSERT INTO estaEnTorneo (idTorneo, email) VALUES
(1, 'pedro@example.com'),
(1, 'laura@example.com'),
(1, 'juan@example.com'),
(1, 'sara@example.com');


-- Partidas
INSERT INTO Partida (ronda, bote, evento, economia, propiedad1, propiedad2, carta1, carta2, turno, nCasasProp1, nCasasProp2, enCurso, perteneceTorneo) VALUES
(5, 2000, 'Compra', -100, 'pedro@example.com', 'laura@example.com', 'juan@example.com', 'sara@example.com', 'sara@example.com', 2, 1, true, 1);
INSERT INTO Partida (ronda, bote, evento, economia, propiedad1, propiedad2, carta1, carta2, turno, nCasasProp1, nCasasProp2, enCurso, perteneceTorneo) VALUES
(1, 1000, 'Inversión', 100, NULL, NULL, NULL, NULL, 'NULL', 0, 0, null, 1);


-- Juegan
INSERT INTO juega (dineroInvertido, nTurnosCarcel, posicion, dinero, skin, puestoPartida, email, idPartida) VALUES
(0.0, 0, 0, 1000.0, 'skin1', 1, 'pedro@example.com', 1),
(0.0, 0, 0, 1000.0, 'skin2', 2, 'laura@example.com', 1),
(0.0, 0, 0, 1000.0, 'skin3', 3, 'juan@example.com', 1),
(0.0, 0, 0, 1000.0, 'skin4', 4, 'sara@example.com', 1);
