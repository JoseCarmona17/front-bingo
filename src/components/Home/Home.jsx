/* El código define un componente funcional de React llamado `Home`. */
import { useState, useEffect } from 'react';  // Importar hooks de React
import { useNavigate } from 'react-router-dom';  // Importar hook de navegación de React Router
import io from 'socket.io-client';  // Importar cliente Socket.IO para la comunicación en tiempo real
import './Home.css';  // Importar estilos específicos del componente

// Establecer la conexión del socket con el servidor
const socket = io('http://localhost:5000');

// Definir y exportar el componente funcional Home
export const Home = () => {
  // Estados locales para el temporizador, la lista de usuarios y la navegación
  const [timer, setTimer] = useState(30);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  // Efecto para manejar el temporizador y la navegación cuando llega a 0
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Navegar a la ruta '/board' cuando el temporizador llega a 0
      navigate('/board');
    }
  }, [timer, navigate]);

  // Efecto para escuchar cambios en la lista de usuarios desde el servidor
  useEffect(() => {
    socket.connect();
    socket.on('userList', (updatedUserList) => {
      setUserList(updatedUserList);
      console.log('Usuarios Logueados:', updatedUserList);
    });

    // Limpiar el socket cuando el componente se desmonta
    return () => {
      socket.disconnect();
    };
  }, []);

  // Renderizar la interfaz de la página principal
  return (
    <div>
      <header>
        <a className='title'>EL BINGO GRAN BUDA</a>
        <p>Cronómetro: {timer} segundos</p>

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
    </div>
  );
};
