import React, { useState } from 'react';
import {joinSession} from '../websocket/websocket';
import { useNavigate } from 'react-router-dom';


const JoinSessionPage = ({setWs,setSessionId,ws,sessionId}) => {
  const [username, setUsername] = useState('');
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

  return (

    <div>
      {sessionStatus == 'SessionNotJoined' && (
      <div>
      <h2>Join an Existing Session</h2>
      <input
        type="text"
        placeholder="Enter session ID"
        value={sessionId}
        onChange={handleInputChangeSession}
      />
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={handleInputChangeUsername}
      />
      <button onClick={handleJoinSession}>Join Session</button>
    </div>
      )}
      {sessionStatus == 'SessionJoined' && (
      <div>
        <h2>You joined the session, Please hold tight until the owner starts the game.</h2>
      </div>
      )}
    </div>


  );
};

export default JoinSessionPage;