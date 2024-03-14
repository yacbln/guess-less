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
    //could be 'win' or 'lose'
    setGameStatus(data_received.message)

};
  ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
  };

  const handleSendingMessage = () => {

    sendInSessionMessage(ws,sessionId,message);
  };

  const handleInputChangeMessage = event => {
    setMessage(event.target.value);
  };

  const addMessage = (message) => {
    setMessagesList((prevMessagesList) => [...prevMessagesList, message]);
  };

  return (
    <div >
      <input
        type="text"
        placeholder="Take a Guess"
        value={message}
        onChange={handleInputChangeMessage}
      />
      { gameStatus == '' && 
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