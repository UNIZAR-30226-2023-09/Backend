/*
 ---------------------------------------------------------------------------
 * Fichero: funcionesJugador.js
 * Autor: César Moro Latorre, Alejandro Lalaguna Maza
 * NIP: 815078, 819860
 * Descripción: Fichero de funciones que permiten gestionar la conexion con websockets
 ---------------------------------------------------------------------------
*/

// Creamos un array vacío para almacenar las conexiones de los usuarios
const connections = [];

// Creamos un objeto vacío para asociar el nombre de usuario con su posición en el array de conexiones
const usuarios = {};

function agregarUsuario(socket, nombreUsuario) {
    console.log('Nuevo usuario:', nombreUsuario);
  
    // Creamos un objeto para almacenar la información del usuario
    const usuario = { name: nombreUsuario, socket };
  
    // Agregamos la conexión del usuario al array de conexiones
    connections.push(usuario);
  
    // Asociamos el nombre de usuario con la posición en el array de conexiones
    usuarios[nombreUsuario] = connections.indexOf(usuario);
  
    // Escuchamos los eventos 'login' y 'disconnect' del usuario
    socket.on('login', (IDusuario) => handleLogin(IDusuario, usuario));
    socket.on('disconnect', () => handleDisconnect(usuario));
}
  

function eliminarUsuario(nombreUsuario) {
    console.log('Usuario desconectado:', nombreUsuario);
  
    // Obtenemos la conexión del usuario a partir del nombre de usuario
    const usuario = usuarios[nombreUsuario];
    if (!usuario) return; // Si no encontramos al usuario, salimos de la función
  
    // Eliminamos la conexión del usuario del array de conexiones
    const index = connections.indexOf(usuario.socket);
    if (index !== -1) connections.splice(index, 1);
  
    // Eliminamos al usuario del diccionario de usuarios
    delete usuarios[nombreUsuario];
}
  

// Devuelve la conexion asociada al usuario
function buscarUsuario(IDusuario) {
    const index = usuarios[IDusuario];
    if (index !== undefined) {
      return connections[index].socket;
    }
    return null;
  }
  

// Creamos un objeto para almacenar todas las funciones que queremos exportar
const funciones = {
    agregarUsuario,
    eliminarUsuario,
    buscarUsuario
  };
  
// Exportamos el objeto que contiene las funciones
module.exports = funciones;
  
