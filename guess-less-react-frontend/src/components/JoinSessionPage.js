import React, { useState } from 'react';
import {joinSession} from '../websocket/websocket';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import Usernames from './misc/Usernames';


const JoinSessionPage = ({setWs,setSessionId,ws,sessionId,setHint, setInitTurn}) => {
  const [username, setUsername] = useState('');
  const [usersJoinedList, setUsersJoinedList] = useState([]);
  const navigate = useNavigate();
  const [sessionStatus, setSessionStatus] = useState('SessionNotJoined');
  const [sessionIdToJoin, setSessionIdToJoin] = useState(null);

  const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8080');
  
      socket.onopen = () => {
          console.log('WebSocket connected');
          setWs(socket);
          joinSession(socket,sessionIdToJoin,username);
      };
  
      socket.onmessage = (event) => {
          const data_received = JSON.parse(event.data)
          console.log('Received:', data_received);

          if (data_received.type == "session_joined"){
            console.log('You joined the session');
            setSessionStatus('SessionJoined');
            setSessionId(sessionIdToJoin)
          }

          if (data_received.type == "session_started"){
            setHint(data_received.hint)
            setInitTurn(data_received.turn)
            navigate('/run-session');
          }
      };
  
      socket.onclose = () => {
          console.log('WebSocket disconnected');
          setWs(null);
      };
  };

const handleJoinSession = () => {
  connectWebSocket();
};


const handleInputChangeSession = event => {
    setSessionIdToJoin(event.target.value);
  };

const handleInputChangeUsername = event => {
    setUsername(event.target.value);
  };

const addUser = (user) => {
    setUsersJoinedList((prevUsersJoinedList) => [...prevUsersJoinedList, user]);
};
  return (

    <div className="home-container">
      <img src={logo} alt="Logo" className="logo" />
      {sessionStatus == 'SessionNotJoined' && (
      <div>
      <h3>Join a Session</h3>
      <div className="input-group mb-3">
        <input
          type="text"
          placeholder="Enter session ID"
          className="form-control"
          value={sessionId}
          onChange={handleInputChangeSession}
        />
        <input
          type="text"
          placeholder="Enter Username"
          className="form-control"
          value={username}
          onChange={handleInputChangeUsername}
        />
        <button onClick={handleJoinSession} className="btn btn-primary">Join Session</button>
      </div>
    </div>
      )}
      {sessionStatus == 'SessionJoined' && (
      <div>
        <h3>You joined the session, Please hold tight until the owner starts it.</h3>
      </div>
      )}
    </div>


  );
};

export default JoinSessionPage;