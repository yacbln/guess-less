import {React,useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import HomePage from './components/HomePage';
import CreateSessionPage from './components/CreateSessionPage';
import JoinSessionPage from './components/JoinSessionPage';
import RunningSessionPage from './components/RunningSessionPage';
const App = () => {

  const [ws, setWs] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [hint, setHint] = useState('');
  const [initTurn, setInitTurn] = useState(false);

  useEffect(() => {
    console.log('From App.js: WebSocket connection:', ws);
  }, [ws]);
  return ( 
    <div>
      <Router>
          <Routes>
            <Route exact path="/" element={<HomePage/>} />
            <Route path="/create-session" element={<CreateSessionPage setWs={setWs} setSessionId={setSessionId} ws={ws} sessionId={sessionId} setHint={setHint} setInitTurn={setInitTurn}/>} />
            <Route path="/join-session" element={<JoinSessionPage setWs={setWs} setSessionId={setSessionId} ws={ws} sessionId={sessionId} setHint={setHint} setInitTurn={setInitTurn}/>} />
            <Route path="/run-session" element={<RunningSessionPage setWs={setWs} ws={ws} sessionId={sessionId} hint={hint} initTurn={initTurn}/>} />
          </Routes>
      </Router>
    </div>
  );
};

export default App;