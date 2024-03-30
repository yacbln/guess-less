import {React,useState} from 'react';
import {sendInSessionMessage} from '../websocket/websocket';
import CountdownTimer from './misc/Timer'
import Message from './misc/Message';
import './RunningSessionPage.css';
import Usernames from './misc/Usernames';
import logo from '../images/logo.png';

const RunningSessionPage = ({setWs,ws,sessionId,initTurn,username}) => {
  const [message, setMessage] = useState('');
  const [gameStatus, setGameStatus] = useState(initTurn);
  const [messagesList, setMessagesList] = useState([['How are you','Yacine',0,true,false],['How are you','Lounes',1,false,true], ['No','Lounes',-1,false,false]]);
  //to style the page 
  const hint = 'Come here for an extra'
  const usersJoinedList = ['Yacine', 'Lounes','Araceli'];
  const usernameIndex = usersJoinedList.indexOf(username)
//   ws.onmessage = (event) => {
//     const data_received = JSON.parse(event.data)
//     console.log('Received:', data_received);
//     console.log('Message received is: ', data_received.message)

//     if (data_received.hasOwnProperty('user')){
//       addMessage(data_received.message,data_received.user)
//     }
//     else if (data_received.message === 'lose' || data_received.message === 'win'){
//       setGameStatus(data_received.message);
//     }
//     else {
//       addMessage(data_received.message,"Moderator")
//     }

//     if (data_received.hasOwnProperty('turn')){
//       setGameStatus(data_received.turn)
    
//     }


// };
//   ws.onclose = () => {
//       console.log('WebSocket disconnected');
//       setWs(null);
//   };

  
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
    <div className="chat-container">

      <div className="chat-header">   
        <CountdownTimer></CountdownTimer>
        {/* <div className="participants-list">
          <ul>
          {usersJoinedList.map((item, index) => (
              <li key={index}>{item}</li>
          ))}
          </ul> 
        </div> */}
        <Usernames usernames={usersJoinedList} showIndex ={usernameIndex} />
        {/* <div class="status-message">Online</div> */}
        <div class="announcement-board">
  <div class="board-content">
   Hello
  </div>
</div>
        {gameStatus == 'win' && (
        <h2>You Guessed it right !!! </h2>
        )}
        {gameStatus == 'lose' && (
        <h2>Someone guessed it right. Better luck next time </h2>
        )}
      </div>

      <div class="chat-hint">
      <i class="fas fa-info-circle"></i> <span>Hint:</span> <span class="hint-text">{hint} </span>
      </div>
      
      <div className="chat-messages">
      {messagesList.map((msg,idx) => (
        <Message key={idx} textMsg={msg[0]} usernameChar={msg[1].charAt(0)} colorIndex={msg[2]} isCurrentUser={msg[3]} hidden={msg[4]} />
      ))}
    </div>

      {/* <div>
        <ul className="chat-messages">
        {messagesList.map((item, index) => (
            <li key={index}>{item}</li>
        ))}
        </ul>
      </div> */}
    

      <div className="chat-input">
        <input
        type="text"
        placeholder="Take a Guess"
        value={message}
        onChange={handleInputChangeMessage}
        />
        { gameStatus == 'y' && 
        (<button onClick={handleSendingMessage}>S</button>
        )}
      </div>
    </div>

  );
};

export default RunningSessionPage;