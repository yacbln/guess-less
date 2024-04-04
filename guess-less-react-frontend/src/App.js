import {React,useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import HomePage from './components/HomePage';
import CreateSessionPage from './components/CreateSessionPage';
import JoinSessionPage from './components/JoinSessionPage';
import RunningSessionPage from './components/RunningSessionPage';
const App = () => {
  const [ws, setWs] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [usersJoinedList, setUsersJoinedList] = useState([]);
  const [hint, setHint] = useState('');
  const [initTurnIdx, setInitTurnIdx] = useState(false);
  const [username, setUsername] = useState('');

  return ( 
    <div>
      <Router>
          <Routes>
            <Route exact path="/" element={<HomePage/>} />
            <Route path="/create-session" element={<CreateSessionPage setWs={setWs} setSessionId={setSessionId} ws={ws} sessionId={sessionId} usersJoinedList={usersJoinedList} setUsersJoinedList={setUsersJoinedList} setHint={setHint} setInitTurn={setInitTurnIdx} username={username} setUsername={setUsername}/>} />
            <Route path="/join-session" element={<JoinSessionPage setWs={setWs} setSessionId={setSessionId} ws={ws} sessionId={sessionId} usersJoinedList={usersJoinedList} setUsersJoinedList={setUsersJoinedList} setHint={setHint} setInitTurn={setInitTurnIdx} username={username} setUsername={setUsername}/>} />
            <Route path="/run-session" element={<RunningSessionPage setWs={setWs} ws={ws} sessionId={sessionId} usersJoinedList={usersJoinedList} hint={hint} initTurnIdx={initTurnIdx} username={username}/>} />
          </Routes>
      </Router>
    </div>
  );
};

export default App;