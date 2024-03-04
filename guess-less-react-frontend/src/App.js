import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WebSocketProvider } from './websocket/WebSocketContext';

import HomePage from './components/HomePage';
import CreateSessionPage from './components/CreateSessionPage';
import JoinSessionPage from './components/JoinSessionPage';
import RunningSessionPage from './components/RunningSessionPage';
const App = () => {
  return ( 
    <WebSocketProvider>
    <Router>
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route path="/create-session" element={<CreateSessionPage/>} />
          <Route path="/join-session" element={<JoinSessionPage/>} />
          <Route path="/run-session" element={<RunningSessionPage/>} />
        </Routes>
    </Router>
    </WebSocketProvider>
  );
};

export default App;