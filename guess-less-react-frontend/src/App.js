import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './components/HomePage';
import CreateSessionPage from './components/CreateSessionPage';
import JoinSessionPage from './components/JoinSessionPage';
import GameSessionPage from './components/GameSessionPage';
const App = () => {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route path="/create-session" element={<CreateSessionPage/>} />
          <Route path="/join-session" element={<JoinSessionPage/>} />
          <Route path="/game-session" element={<GameSessionPage/>} />
        </Routes>
    </Router>
  );
};

export default App;