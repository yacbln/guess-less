import React, { useState, useEffect } from 'react';
import {createSession} from '../websocket/websocket';

const CreateSessionPage = () => {
  const [ws, setWs] = useState(null);
  const [usersJoinedList, setUsersJoinedList] = useState([]);
  const [sessionId, setSessionID] = useState(null)
  const [sessionStatus, setSessionStatus] = useState('SessionNotCreated');

  useEffect( () => 
  console.log(usersJoinedList)
  ,[usersJoinedList]);
  const connectWebSocket = () => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        console.log('WebSocket connected');
        setWs(socket);
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
          console.log('you joined session!  ');
        }

        if (data_received.type == "user_joined"){
          addUser(data_received.username);
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
      </div>
      )}
    </div>
  );
};

export default CreateSessionPage;