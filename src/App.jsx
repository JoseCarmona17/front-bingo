
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './components/Register/Register';
import { Home } from './components/Home/Home';
import { Board } from './components/Board/Board';
import { Lobby } from './components/Lobby/Lobby';
import { SetUp } from './components/SetUp/SetUp';
import { LoginFrom } from './components/Login/LoginFrom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginFrom/>} />
        <Route path="/register" element={<Register />} />
        <Route path="setup" element={<SetUp/>}/>
        <Route path="/home" element={<Home />} />
        <Route path="/board" element={<Board />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </Router>
  );
};

export default App;
