--
-- Proyecto Software (2022/2023)
-- Fichero: poblar_example.sql
-- Autor: David Rivera Seves (NIP: 815124)
--




-- Skins
INSERT INTO Skins (precioGemas, idSkin) VALUES
(0, 'default'),
(10, 'skin1'),
(15, 'skin2');

-- Jugadores
INSERT INTO Jugador (gemas, nombre, pass, email) VALUES
(10, 'jugador1', '1234', 'jugador1@example.com'),
(20, 'jugador2', '1234', 'jugador2@example.com'),
(30, 'jugador3', '1234', 'jugador3@example.com');

-- Jugador tiene Skin
INSERT INTO tieneSkins (idSkin, email) VALUES
('default', 'jugador1@example.com'),
('default', 'jugador2@example.com'),
('default', 'jugador3@example.com');




-- Partida rapida
INSERT INTO Partida (ronda, bote, evento, economia, precioBase) VALUES
(0, 0.0, 'Inicial', 0.0, 0.0);

-- Juegan
INSERT INTO juega (numPropiedades, dineroInvertido, nTurnosCarcel, posicion, dinero, skin, puestoPartida, email, idPartida) VALUES
(0, 0.0, 0, 0, 0.0, 'default', 'jugador1@example.com', 1),  -- Realemnte no puede usar dos skins iguales, pero para probar sirve
(0, 0.0, 0, 0, 0.0, 'default', 'jugador2@example.com', 1);




-- Torneo
INSERT INTO Torneo (nPartidas, estaActivo) VALUES
(2, NULL);

-- Jugadores en este torneo
INSERT INTO estaEnTorneo (idTorneo, email) VALUES
(1, 'jugador2@example.com'),
(1, 'jugador3@example.com');

-- Dos partidas de torneos
INSERT INTO Partida (ronda, bote, evento, economia, precioBase, perteneceTorneo) VALUES
(0, 0.0, 'Inicial', 0.0, 0.0, 1),
(0, 0.0, 'Inicial', 0.0, 0.0, 1);

-- Juegan en la primera partida del torneo, la segunda en esta prueba me da igual
INSERT INTO juega (numPropiedades, dineroInvertido, nTurnosCarcel, posicion, dinero, skin, puestoPartida, email, idPartida) VALUES
(0, 0.0, 0, 0, 0.0, 'default', 'jugador2@example.com', 2),  -- Realemnte no puede usar dos skins iguales, pero para probar sirve
(0, 0.0, 0, 0, 0.0, 'default', 'jugador3@example.com', 2);

