const JugadorDAO = require('./jugador-dao');

const jugadorDao = new JugadorDAO();

async function test() {
  const jugadores = await jugadorDao.obtenerJugadores();
  console.log(jugadores);
  jugadorDao.destroyConnection();
}

test();
