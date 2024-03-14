import {React,useState} from 'react';
import {sendInSessionMessage} from '../websocket/websocket';

const RunningSessionPage = ({setWs,ws,sessionId}) => {
  const [message, setMessage] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [messagesList, setMessagesList] = useState([]);

  ws.onmessage = (event) => {
    const data_received = JSON.parse(event.data)
    console.log('Received:', data_received);
    console.log('Message received is: ', data_received.message)

    
    if (data_received.hasOwnProperty('user')){
      addMessage(data_received.message,data_received.user)
    }
    else if (data_received.message === 'lose' || data_received.message === 'win'){
      setGameStatus(data_received.message);
    }
    else {
      addMessage(data_received.message,"Moderator")

      if
    }

};
  ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
  };

  const handleSendingMessage = () => {
    //send message to server (backend)
    sendInSessionMessage(ws,sessionId,message);
    //post message here (frontend)
    addMessage(message,"You")
  };

  const handleInputChangeMessage = event => {
    setMessage(event.target.value);
  };

  const addMessage = (message, speaker) => {
    setMessagesList((prevMessagesList) => [...prevMessagesList, `${speaker} : ${message}`]);
  };

  return (
    <div >
      <input
        type="text"
        placeholder="Take a Guess"
        value={message}
        onChange={handleInputChangeMessage}
      />
      { gameStatus == 'turn' && 
      (<button onClick={handleSendingMessage}>Broadcast</button>
      )}
      <div>
      <h2>Session ID is: {sessionId}</h2>
      <ul>
      {messagesList.map((item, index) => (
          <li key={index}>{item}</li>
      ))}
      </ul>
    </div>
    {gameStatus == 'win' && (
      <h2>You Guessed it right !!! </h2>
    )}
    {gameStatus == 'lose' && (
      <h2>Someone guessed it right. Better luck next time </h2>
    )}
    </div>

  );
};

export default RunningSessionPage;