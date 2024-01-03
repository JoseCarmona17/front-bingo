// Importar módulos y componentes necesarios
import { Link, useNavigate } from 'react-router-dom';  // React Router para la navegación
import { FaUser, FaLock } from 'react-icons/fa';  // Iconos de usuario y candado
import { useState } from 'react';  // Hook de estado de React
import './Register.css';  // Estilos específicos del componente

// Definir y exportar el componente funcional Register
export const Register = () => {
  // Inicializar el hook useNavigate para la navegación programática
  const navigate = useNavigate();
  // Utilizar el hook useState para manejar el estado del nombre de usuario, contraseña y errores
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Manejar el evento de registro al enviar el formulario
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Realizar una solicitud POST al servidor para el registro del usuario
      const response = await fetch('http://localhost:5000/register', {
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
        // Extraer el mensaje de éxito de la respuesta JSON y mostrarlo en la consola
        const { message } = await response.json();
        console.log(message);
        // Redirigir al usuario a la página de inicio de sesión
        navigate('/');
      } else {
        // Si hay un error en la respuesta, extraer y mostrar el mensaje de error
        const { error } = await response.json();
        setError(error);
        localStorage.removeItem('token'); // Limpiar token en caso de error
      }
    } catch (error) {
      // Manejar errores de red, como la incapacidad de conectarse al servidor
      console.error('Error de red:', error.message);
      setError('Error de red al intentar registrar usuario');
      localStorage.removeItem('token'); // Limpiar token en caso de error
    }
  };

  // Renderizar el formulario de registro
  return (
    <div className='wrapper'>
      <form onSubmit={handleRegister}>
        <h1>Registro</h1>
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
          {/* Botón para enviar el formulario de registro */}
          <button type='submit'>Registrar</button>
          <div className='register-link'>
            {/* Enlace para iniciar sesión */}
            <p>
              ¿Ya se encuentra registrado? <Link to='/'>Inicio de Sesión</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
