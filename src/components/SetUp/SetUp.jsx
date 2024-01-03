import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './SetUp.css';

export const SetUp = () => {
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('url_de_la_api/update', {
        method: 'PUT',  // Utiliza el método PUT para la actualización
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Incluye el token de autenticación
        },
        body: JSON.stringify({
          currentUsername,
          currentPassword,
          newUsername,
          newPassword,
        }),
      });

      if (response.ok) {
        // Actualización exitosa, puedes redirigir a otra página o realizar otras acciones
        navigate('/Lobby');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error de red:', error.message);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleUpdate}>
        <h1>Actualizar Datos</h1>
        <div className='input-box'>
          <input
            type='text'
            placeholder='Usuario actual'
            value={currentUsername}
            onChange={(e) => setCurrentUsername(e.target.value)}
            required
          />
          <FaUser className='icon' />
        </div>
        <div className='input-box'>
          <input
            type='password'
            placeholder='Contraseña actual'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <FaLock className='icon' />
        </div>

        <div className='input-box'>
          <input
            type='text'
            placeholder='Nuevo Usuario'
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
          <FaUser className='icon' />
        </div>
        <div className='input-box'>
          <input
            type='password'
            placeholder='Nueva Contraseña'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <FaLock className='icon' />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className='textBot'>
          <button type='submit'>Actualizar</button>
          <div className='register-link'>
            <p>
              ¿Ya se encuentra registrado? <Link to='/'>Inicio de Sesión</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};