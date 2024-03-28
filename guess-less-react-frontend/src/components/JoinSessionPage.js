import React, { useState } from 'react';
import {joinSession} from '../websocket/websocket';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import Usernames from './misc/Usernames';
import WaitingDots from './misc/WaitingDots';


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
          // console.log('Received:', data_received);

          if (data_received.type == "session_joined"){
            console.log('You joined the session');
            (data_received.listUsernames).map((username) => {
              addUser(username);
            });
            setSessionId(sessionIdToJoin);
            setSessionStatus('SessionJoined');
          }

          if (data_received.type == "session_started"){
            setHint(data_received.hint)
            setInitTurn(data_received.turn)
            navigate('/run-session');
          }

          if (data_received.type == "user_joined"){
            addUser(data_received.username);
          }

          if (data_received.type == "user_left"){
            removeUser(data_received.username);
          }
      };
  
      socket.onclose = () => {
          console.log('WebSocket disconnected');
          setWs(null);
          setSessionId(null);
          setUsersJoinedList((prevUsersJoinedList) => []);
          setSessionStatus('SessionNotJoined');

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

const handleLeaveSession = () => {
    ws.close();
  };
const addUser = (user) => {
    setUsersJoinedList((prevUsersJoinedList) => [...prevUsersJoinedList, user]);
};
const removeUser = (user) => {
  setUsersJoinedList((prevUsersJoinedList) => prevUsersJoinedList.filter(user_id => user_id !== user));
};

const emptyUsers =() => {
  setUsersJoinedList((prevUsersJoinedList) => []);
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
        <h3>You joined the session, Please hold tight until <span style={{ color: 'rgb(231, 76, 60)',fontWeight: 'bold' }}>{usersJoinedList[0]}</span> starts it.</h3>
        <Usernames usernames={usersJoinedList} />
        <WaitingDots />
        <button onClick={handleLeaveSession} className="btn btn-primary fixed-bottom-button">Leave Session</button>
      </div>
      )}
    </div>

  );
};

export default JoinSessionPage;