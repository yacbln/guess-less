import React, { useState, useEffect } from 'react';
import {createSession,requestStartSession} from '../websocket/websocket';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import logo from '../images/logo.png';
import Usernames from './misc/Usernames';


const CreateSessionPage = ({setWs,setSessionId,ws,sessionId,setHint, setInitTurn}) => {
  const [username, setUsername] = useState('');
  const [usersJoinedList, setUsersJoinedList] = useState([]);
  const [sessionStatus, setSessionStatus] = useState('SessionNotCreated');
  const navigate = useNavigate();

  // useEffect(() => {

  //   console.log("use effect ==> ", usersJoinedList);
  // });

  const connectWebSocket = () => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
        console.log('WebSocket connected');
        setWs(socket);
        createSession(socket,username);
    };
    socket.onmessage = (event) => {
        const data_received = JSON.parse(event.data)
        console.log('Received:', data_received);
        if (data_received.type == "session_created"){
            setSessionId(data_received.sessionId);
            setSessionStatus('WaitingForUsers');
        }

        if (data_received.type == "session_joined"){
          console.log('someone joined the session! ');
          
        }

        if (data_received.type == "user_joined"){
          addUser(data_received.username);
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
  const handleCreateSession = () => {
    connectWebSocket();
    // console.log("adding myself: ", username);
    addUser(username);

  };

  const addUser = (user) => {
    setUsersJoinedList((prevUsersJoinedList) => [...prevUsersJoinedList, user]);
  };

  const startSession = () => {
    requestStartSession(ws,sessionId);
  };

  const handleInputChangeUsername = event => {
    setUsername(event.target.value);
  };

  return (

    // <div className="home-container">
    // <img src={logo} alt="Logo" className="logo" />
    //   <h1>Welcome to Guess Less</h1>
    //   <p>Start or join a session with friends!</p>
    //   <div className="buttons">
    //     <Link to="/create-session" className="btn btn-primary" style={{ marginRight: '20px' }}>Create New Session</Link>
    //     <Link to="/join-session" className="btn btn-primary">Join Existing Session</Link>
    //   </div>
    // </div>


    <div className="home-container">

      {/* <div className="mb-3">
        <button className="btn btn-primary"> Home </button>
      </div> */}
      <img src={logo} alt="Logo" className="logo" />
      {sessionStatus == 'SessionNotCreated' && (
      <div>
        <h3>Create a Session</h3>
      <div className="row">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Username"
            value={username}
            onChange={handleInputChangeUsername}
          />
          <button onClick={handleCreateSession} className="btn btn-primary">Create Session</button>
        </div>
      </div>
      </div>
      )}
      {sessionStatus == 'WaitingForUsers' && (
      <div>
        <h3>Session ID is: {sessionId}</h3>

        <Usernames usernames={usersJoinedList} />
        {/* <ul>
        {usersJoinedList.map((item, index) => (
            <li key={index}>{item}</li>
        ))}
        </ul> */}
        <button onClick={startSession} className="btn btn-primary fixed-bottom-button">Start Session</button>
      </div>
      )}

    </div>
  );
};

export default CreateSessionPage;