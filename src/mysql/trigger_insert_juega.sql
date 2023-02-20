--
-- Proyecto Software (2022/2023)
-- Fichero: trigger_insert_juega.sql
--
-- Descripción:
--    Comprueba que un jugador no pueda jugar varias partidas en curso
--

DELIMITER $$
CREATE TRIGGER trigger_juega_insert
BEFORE INSERT ON juega
FOR EACH ROW
BEGIN
	DECLARE en_curso BOOLEAN;
	SELECT enCurso INTO en_curso FROM Partida WHERE idPartida = NEW.idPartida;
	IF en_curso AND EXISTS(SELECT * FROM juega WHERE email = NEW.email AND idPartida != NEW.idPartida AND enCurso) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El jugador ya está en una partida en curso';
	END IF;
END$$
DELIMITER ;
