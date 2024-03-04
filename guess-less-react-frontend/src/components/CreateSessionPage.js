import React, { useState, useEffect } from 'react';
import {createSession,requestStartSession} from '../websocket/websocket';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../websocket/WebSocketContext';

const CreateSessionPage = () => {
  const [ws, setWs] = useState(null);
  const [usersJoinedList, setUsersJoinedList] = useState([]);
  const [sessionId, setSessionID] = useState(null)
  const [sessionStatus, setSessionStatus] = useState('SessionNotCreated');
  const navigate = useNavigate();
  const { setWebSocket } = useWebSocket();

  useEffect(() => {
    console.log('WebSocket connection:', ws);
  }, [ws]);
  const connectWebSocket = () => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        console.log('WebSocket connected');
        setWs(socket);
        setWebSocket(socket);
        createSession(socket);
    };
    socket.onmessage = (event) => {
        const data_received = JSON.parse(event.data)
        console.log('Received:', data_received);
        if (data_received.type == "session_created"){
            setSessionID(data_received.sessionId);
            setSessionStatus('WaitingForUsers');
        }

        if (data_received.type == "session_joined"){
          console.log('someone joined the session!  ');
        }

        if (data_received.type == "user_joined"){
          addUser(data_received.username);
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
  const handleCreateSession = () => {
    connectWebSocket();
  };

  const addUser = (user) => {
    setUsersJoinedList((prevUsersJoinedList) => [...prevUsersJoinedList, user]);
  };

  const startSession = () => {
    requestStartSession(ws,sessionId);
  };

  return (
    <div>
      {sessionStatus == 'SessionNotCreated' && (
      <div>
        <h2>Create a New Session</h2>
        <button onClick={handleCreateSession}>Create Session</button>
      </div>
      )}
      {sessionStatus == 'WaitingForUsers' && (
      <div>
        <h2>Session ID is: {sessionId}</h2>
        <ul>
        {usersJoinedList.map((item, index) => (
            <li key={index}>{item}</li>
        ))}
        </ul>
        <button onClick={startSession}>Start Game</button>
      </div>
      )}
    </div>
  );
};

export default CreateSessionPage;