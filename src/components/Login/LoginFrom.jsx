// Importar las bibliotecas y los estilos necesarios
import { Link, useNavigate } from 'react-router-dom';  // React Router para la navegación
import { FaUser, FaLock } from 'react-icons/fa';  // Iconos de usuario y candado
import { useState } from 'react';  // Hook de estado de React
//import io from 'socket.io-client';  // Asegúrate de importar 'io' de 'socket.io-client'
import './LoginFrom.css';  // Estilos específicos del componente

//const socket = io('http://localhost:5000');  // Asegúrate de crear el objeto socket

// Definir el componente funcional LoginFrom
export const LoginFrom = () => {
  // Utilizar el hook de navegación de React Router
  const navigate = useNavigate();
  // Estados locales para almacenar el nombre de usuario, la contraseña y posibles errores
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Función para manejar el envío del formulario de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Realizar una solicitud POST al servidor para la autenticación del usuario
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // Verificar si la respuesta del servidor es exitosa (status 200)
      if (response.ok) {
        // Extraer el token de la respuesta JSON y almacenarlo en el almacenamiento local
        const { token } = await response.json();
        localStorage.setItem('token', token);

        // Redirigir al usuario a la página del lobby
        navigate(`/lobby`);
      } else {
        // Si hay un error en la respuesta, extraer y mostrar el mensaje de error
        const { error } = await response.json();
        setError(error);
        localStorage.removeItem('token');
      }
    } catch (error) {
      // Manejar errores de red, como la incapacidad de conectarse al servidor
      console.error('Error de red:', error.message);
      setError('Error de red al intentar iniciar sesión');
      localStorage.removeItem('token');
    }
  };

  // Renderizar el formulario de inicio de sesión
  return (
    <div className='wrapper'>
      <form onSubmit={handleLogin}>
        <h1 className='name'>Bingo Gran Buda</h1>
        <h1>Iniciar Sesión</h1>
        <div className='input-box'>
          {/* Input para el nombre de usuario con icono de usuario */}
          <input
            type='text'
            placeholder='Usuario'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className='icon' />
        </div>
        <div className='input-box'>
          {/* Input para la contraseña con icono de candado */}
          <input
            type='password'
            placeholder='Contraseña'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className='icon' />
        </div>

        {/* Mostrar mensaje de error si hay un error */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className='textBot'>
          {/* Botón para enviar el formulario de inicio de sesión */}
          <button type='submit'>Ingresar</button>

          <div className='register-link'>
            {/* Enlace para registrarse */}
            <p>
              ¿No tienes una cuenta? <Link to='/register'>Registrarse</Link>
            </p>
            {/* Enlace para configurar la cuenta */}
            <p>
              <Link to='/setup'>Configurar Cuenta</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
