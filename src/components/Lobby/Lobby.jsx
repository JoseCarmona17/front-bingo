// Importar módulos y componentes necesarios
import { useEffect, useState } from 'react';  // Hooks de React
import { useNavigate, useLocation } from 'react-router-dom';  // React Router para la navegación
import io from 'socket.io-client';  // Cliente Socket.IO para la comunicación en tiempo real
import './Lobby.css';  // Estilos específicos del componente

// Establecer la conexión del socket con el servidor
const socket = io('http://localhost:5000');

// Definir y exportar el componente funcional Lobby
export const Lobby = () => {
  // Utilizar el hook useNavigate para la navegación programática
  const navigate = useNavigate();
  // Utilizar el hook useLocation para obtener la información de la ubicación actual
  const location = useLocation();
  // Obtener el nombre de usuario de la URL utilizando URLSearchParams
  const username = new URLSearchParams(location.search).get('username');
  // Estado local para almacenar la lista de usuarios en la sala de espera
  const [userList, setUserList] = useState([]);

  // Configurar efectos secundarios con useEffect
  useEffect(() => {
    // Escuchar cambios en la lista de usuarios desde el servidor
    socket.connect();
    socket.on('userList', (updatedUserList) => {
      setUserList(updatedUserList);
      console.log('Usuarios Logueados:', updatedUserList);
    });

    // Redirigir a /home cuando se recibe el evento 'redirectToHome'
    socket.on('redirectToHome', () => {
      navigate('/home');
    });

    // Limpiar el socket cuando el componente se desmonta
    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  // Manejar el evento de inicio de juego al hacer clic en el botón "Iniciar Juego"
  const handleStartGame = () => {
    // Emitir un mensaje al servidor indicando que se debe iniciar el juego
    socket.emit('startGame');
  };

  // Renderizar la interfaz de la sala de espera
  return (
    <div className='containerLobby'>
      <header>
        <a className='title'>EL BINGO GRAN BUDA</a>

        <nav className='navbar'>
          {/* Opciones de navegación (Inicio, Salir) */}
          <a>Inicio</a>
          <a>Salir</a>
        </nav>
      </header>

      <div className='listUsers'>
        {/* Título y lista de usuarios en la sala de espera */}
        <h2 className='title2'>Sala de espera</h2>
        <h3>Lista de Usuarios</h3>
        <ul>
          {userList.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>

      <div className='containerButton'>
        {/* Botón para iniciar el juego */}
        <button className='buttonInit' onClick={handleStartGame}>
          Iniciar Juego
        </button>
      </div>
    </div>
  );
};
