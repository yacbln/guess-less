import {React,useState} from 'react';
import {sendInSessionMessage} from '../websocket/websocket';

const RunningSessionPage = ({setWs,ws,sessionId}) => {
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState([]);

  ws.onmessage = (event) => {
    const data_received = JSON.parse(event.data)
    console.log('Received:', data_received);
    console.log('Message received is: ', data_received.message)
    addMessage(data_received.message);

};
  ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
  };

  const handleSendingMessage = () => {
    console.log("sending message, ", message)
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
        placeholder="Broadcast a message"
        value={message}
        onChange={handleInputChangeMessage}
      />
      <button onClick={handleSendingMessage}>Broadcast</button>
      <div>
      <h2>Session ID is: {sessionId}</h2>
      <ul>
      {messagesList.map((item, index) => (
          <li key={index}>{item}</li>
      ))}
      </ul>
    </div>

    </div>

  );
};

export default RunningSessionPage;