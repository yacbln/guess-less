import React, { useState } from 'react';
import {joinSession} from '../websocket/websocket';

const JoinSessionPage = () => {
  const [sessionId, setSessionId] = useState('');
  const [username, setUsername] = useState('');
  const [ws, setWs] = useState(null);
  
  const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8080');
  
      socket.onopen = () => {
          console.log('WebSocket connected');
          setWs(socket);
          joinSession(socket,sessionId,username);
      };
  
      socket.onmessage = (event) => {
          console.log('Received:', event.data);
          // Handle received messages from the server
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
    setSessionId(event.target.value);
  };

const handleInputChangeUsername = event => {
    setUsername(event.target.value);
  };

  return (
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
  );
};

export default JoinSessionPage;