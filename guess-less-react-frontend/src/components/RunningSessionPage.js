import {React,useState} from 'react';
import {sendInSessionMessage} from '../websocket/websocket';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from './misc/Timer'
import Message from './misc/Message';
import './RunningSessionPage.css';
import Usernames from './misc/Usernames';
import logo from '../images/logo.png';
import { IoMdSend } from "react-icons/io";
import SessionOverModal from './SessionOverModal';


const RunningSessionPage = ({setWs,ws,sessionId,initTurn,username}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  //for dynamic stuff
  // const [gameStatus, setGameStatus] = useState(initTurn);
  const [gameStatus, setGameStatus] = useState('y');

  const [penalized,setPenalized] = useState(false);
  const [messagesList, setMessagesList] = useState([['How are you','Yacine',0,true,false],['How are you','Lounes',1,false,true], ['No','Lounes',-1,false,false]]);
  //to style the page 
  const hint = 'Come here for an extra'
  const usersJoinedList = ['Yacine', 'Lounes','Araceli'];
  const usernameIndex = usersJoinedList.indexOf('Araceli');
  //to reset timer
  const [timerReset, setTimerReset] = useState(false);

  //for the Modal
  const [isGameOver, setIsGameOver] = useState(false);
  const endGame = () => setIsGameOver(true);
  const closeModal = () => setIsGameOver(false);
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

  console.log("run page getting reendered again");

  const handleRejoinSession = () => {
    
  }

  const handleGoingHome = () => {
    // do cleanup
    
    navigate('/');
  }
    

  return (
    <div className="chat-container">

      <div className="chat-header">   
        <CountdownTimer resetFlag={timerReset} setPenalized={setPenalized}></CountdownTimer>
        {/* <div className="participants-list">
          <ul>
          {usersJoinedList.map((item, index) => (
              <li key={index}>{item}</li>
          ))}
          </ul> 
        </div> */}
        <button onClick={endGame}>End Game</button>
        <Usernames usernames={usersJoinedList} indexShow ={usernameIndex} />
        <Message textMsg="It is Yacine's turn." usernameChar={'A'} colorIndex={-1} isCurrentUser={false} hidden={false} animatedText={true} />
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
        (<button onClick={handleSendingMessage}><IoMdSend/></button>
        )}
      </div>
      <SessionOverModal isVisible={isGameOver} onClose={closeModal} handleRejoinSession={handleRejoinSession} handleGoingHome={handleGoingHome}/>
    </div>

  );
};

export default RunningSessionPage;