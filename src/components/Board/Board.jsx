import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './Board.css';

const socket = io('http://localhost:5000');

export const Board = () => {
  const [userList, setUserList] = useState([]);
  const [bingoCard, setBingoCard] = useState(generarNuevoCarton());
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [balotas, setBalotas] = useState([]);
  const [currentBalota, setCurrentBalota] = useState(null);
  const [uniqueBalotas, setUniqueBalotas] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    // Escuchar cambios en la lista de usuarios desde el servidor
    socket.connect();
    socket.on('userList', (updatedUserList) => {
      setUserList(updatedUserList);
      console.log('Usuarios Logueados:', updatedUserList);
    });

    socket.on('balotas', (receivedBalotas) => {
      setBalotas(receivedBalotas);
    });

    socket.on('nuevaBalota', (nuevaBalota) => {
      setBalotas((prevBalotas) => [...prevBalotas, nuevaBalota]);
      setCurrentBalota(nuevaBalota);

      setUniqueBalotas((prevUniqueBalotas) => new Set([...prevUniqueBalotas, nuevaBalota]));

      verificarGanador();
    });

    // Limpiar el socket cuando el componente se desmonta
    return () => {
      socket.disconnect();
    };
  }, []);

  function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 75) + 1;
  }

  function generarColumna() {
    const columna = [];
    while (columna.length < 5) {
      const nuevoNumero = generarNumeroAleatorio();
      if (!columna.includes(nuevoNumero)) {
        columna.push(nuevoNumero);
      }
    }
    return columna;
  }

  function generarNuevoCarton() {
    const carton = {
      B: generarColumna(),
      I: generarColumna(),
      N: generarColumna(),
      G: generarColumna(),
      O: generarColumna(),
    };
    return carton;
  }

  function handleNumeroClick(letra, numero) {
    const isSelected = selectedNumbers.some(
      (selected) => selected.letra === letra && selected.numero === numero
    );

    if (isSelected) {
      setSelectedNumbers(
        selectedNumbers.filter(
          (selected) => !(selected.letra === letra && selected.numero === numero)
        )
      );
    } else {
      setSelectedNumbers([...selectedNumbers, { letra, numero }]);
    }
  }

  const verificarGanador = useCallback(() => {
    const lineasGanadoras = [
      // Líneas horizontales
      ['B1', 'B2', 'B3', 'B4', 'B5'],
      ['I1', 'I2', 'I3', 'I4', 'I5'],
      ['N1', 'N2', 'N3', 'N4', 'N5'],
      ['G1', 'G2', 'G3', 'G4', 'G5'],
      ['O1', 'O2', 'O3', 'O4', 'O5'],
      // Líneas verticales
      ['B1', 'I1', 'N1', 'G1', 'O1'],
      ['B2', 'I2', 'N2', 'G2', 'O2'],
      ['B3', 'I3', 'N3', 'G3', 'O3'],
      ['B4', 'I4', 'N4', 'G4', 'O4'],
      ['B5', 'I5', 'N5', 'G5', 'O5'],
      // Líneas diagonales
      ['B1', 'I2', 'N3', 'G4', 'O5'],
      ['B5', 'I4', 'N3', 'G2', 'O1'],
      // Cuatro esquinas
      ['B1', 'B5', 'O1', 'O5'],
    ];

    for (const linea of lineasGanadoras) {
      const todosSeleccionados = linea.every((casilla) =>
        selectedNumbers.some((selected) => selected.letra + selected.numero === casilla)
      );

      if (todosSeleccionados) {
        alert(`¡Felicidades! Jugador ha ganado con una línea en ${linea.join(', ')}.`);
        return true;
      }
    }

    return false;
  }, [selectedNumbers]);

  const handleBingoClick = () => {
    const esGanador = verificarGanador();

    if (esGanador) {
      alert('¡Felicidades! ¡Eres el ganador!');
    } else {
      // Redirigir a la página de inicio ('/home') en caso de descalificación
      alert('estas descalificado')
      navigate('/lobby');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const letras = ['B', 'I', 'N', 'G', 'O'];
      let letraAleatoria, numeroAleatorio;

      do {
        letraAleatoria = letras[Math.floor(Math.random() * letras.length)];
        numeroAleatorio = generarNumeroAleatorio();
      } while (uniqueBalotas.has(`${letraAleatoria}${numeroAleatorio}`));

      const nuevaBalota = `${letraAleatoria}${numeroAleatorio}`;

      setBalotas((prevBalotas) => [...prevBalotas, nuevaBalota]);
      setCurrentBalota(nuevaBalota);

      setUniqueBalotas((prevUniqueBalotas) => new Set([...prevUniqueBalotas, nuevaBalota]));

      verificarGanador();
    }, 5000);

    return () => clearInterval(interval);
  }, [verificarGanador, uniqueBalotas, selectedNumbers]);

  return (
    <div className='container'>
      <header>
        <a className='title'>EL BINGO GRAN BUDA</a>
        <nav className='navbar'>
          <a>Inicio</a>
          <a>Salir</a>
        </nav>
      </header>

      <div className='listUsers'>
        <h2 className='title2'>Sala de espera</h2>
        <h3>Lista de Usuarios</h3>
        <ul>
          {userList.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>

      <div className='bingoCard'>
        <h2>Cartón de Bingo</h2>
        <div className='bingoGrid'>
          {Object.keys(bingoCard).map((letra) => (
            <div key={letra} className='columna'>
              <div className='letra'>{letra}</div>
              {bingoCard[letra].map((numero) => (
                <div
                  key={numero}
                  className={`numero ${selectedNumbers.some(
                    (selected) => selected.letra === letra && selected.numero === numero
                  ) ? 'selected' : ''}`}
                  onClick={() => handleNumeroClick(letra, numero)}
                >
                  {numero}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          {/* <button onClick={handleGenerarCarton}>Generar</button> */}
          <button onClick={handleBingoClick} className='bingoButton'>BINGO</button>
      </div>
      </div>

      <div className='balotaBox'>
        <h2>Balotas del Bingo</h2>
        <div className='balotas-container'>
          {balotas.reduce((rows, balota, index) => {
            if (index % 5 === 0) {
              rows.push([]);
            }
            rows[rows.length - 1].push(balota);
            return rows;
          }, []).map((row, rowIndex) => (
            <div key={rowIndex} className='balotas-row'>
              {row.map((balota, colIndex) => (
                <span key={colIndex}>{balota}{colIndex < row.length - 1 ? ' - ' : ''}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className='currentBalota'>
        <h2>Balota Actual</h2>
        <div className='balota'>{currentBalota}</div>
      </div>
    </div>
  );
};
