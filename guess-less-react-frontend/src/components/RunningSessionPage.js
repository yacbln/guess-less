import {React,useState} from 'react';
import {sendInSessionMessage,sendInSessionPenalized} from '../websocket/websocket';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from './misc/Timer'
import Message from './misc/Message';
import './RunningSessionPage.css';
import Usernames from './misc/Usernames';
import logo from '../images/logo.png';
import { IoMdSend } from "react-icons/io";
import SessionOverModal from './SessionOverModal';


const RunningSessionPage = ({setWs,ws,sessionId,initTurnIdx,username,usersJoinedList,hint}) => {
  const navigate = useNavigate();
  const usernameIndexDict = {};
  usersJoinedList.forEach((str, index) => {
    usernameIndexDict[str] = index;
  });
  const usernameIdx = usernameIndexDict[username];
  const [message, setMessage] = useState('');
  const initTurn = (username ==usersJoinedList[initTurnIdx])? 'y': 'n';
  const [sessionStatus, setSessionStatus] = useState(initTurn);
  const [penalized,setPenalized] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [usernameShowIndex,setUsernameShowIndex] = useState(initTurnIdx);

  //to reset timer
  const [timerReset, setTimerReset] = useState(false);

  //for the Modal
  const [isSessionOver, setIsSessionOver] = useState(false);
  const endSession = () =>{
    console.log("about to set session to win.")
    setSessionStatus('win');
    setIsSessionOver(true);
  
  };
  const closeModal = () => setIsSessionOver(false);

  //for end game
  const [wordWinner,setWordWinner] = useState('');
  const [usernameWinner,setUsernameWinner] = useState('');

  ws.onmessage = (event) => {
    const data_received = JSON.parse(event.data)
    console.log('Received:', data_received);
    console.log('Message received is: ', data_received.message)

    if (data_received.hasOwnProperty('user')){
      addMessage(data_received.message,data_received.user)
    }
    else if (data_received.hasOwnProperty('message')) {
      addMessage(data_received.message,"");
    }
    else if (data_received.hasOwnProperty('end_message')){
      setSessionStatus(data_received.end_message);
      setWordWinner(data_received.word);
      setUsernameWinner(data_received.winner);
      setIsSessionOver(true);
    }

    if (data_received.hasOwnProperty('turn')) {
      setUsernameShowIndex(data_received.turn); 
      if ((data_received.turn) == usernameIdx){
        setSessionStatus('y');
      } else {
        setSessionStatus('n');
      }
      //reset timer after every turn
      const resetValue = timerReset ==true ? false:true; 
      setTimerReset(resetValue);
    }

};
  ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
  };

  const handleSendingMessage = () => {
    setSessionStatus('n'); //disable sending now
    //send message to server (backend)
    sendInSessionMessage(ws,sessionId,message);
    //post message here (frontend)
    addMessage(message,username);
  };

  const handleInputChangeMessage = event => {
    setMessage(event.target.value);
  };

  const addMessage = (message, author) => {
    let colorIndex = usernameShowIndex;
    let authorDisp = author;
    if (author===""){
      colorIndex = -1;
      authorDisp = "M";
    } 

    const currentUserDisp = (author==username)? true: false;

    const msgDisp = [message,authorDisp,colorIndex,currentUserDisp,penalized];
    setMessagesList((prevMessagesList) => [...prevMessagesList, msgDisp]);

    if (penalized){
      setPenalized(false);
    }
  };

  // console.log("run page getting reendered again");

  const handlePenalized = () => {
    if (sessionStatus =='y'){
    setPenalized(true);
    //communicate with server to update the turn
    sendInSessionPenalized(ws,sessionId);
    }
  }
  const handleRejoinSession = () => {
    
  }

  const handleGoingHome = () => {
    // do cleanup
  
    navigate('/');
  }
    

  return (
    <div className="chat-container">

      <div className="chat-header">   
        <CountdownTimer resetFlag={timerReset} handlePenalized={handlePenalized} stopFlag={isSessionOver}></CountdownTimer>
        {/* <div className="participants-list">
          <ul>
          {usersJoinedList.map((item, index) => (
              <li key={index}>{item}</li>
          ))}
          </ul> 
        </div> */}
        <button onClick={endSession}>End Session</button>
        <Usernames usernames={usersJoinedList} indexShow ={usernameShowIndex} />
        <Message textMsg={usersJoinedList[usernameShowIndex]==username? "It is YOUR turn." :`It is ${usersJoinedList[usernameShowIndex]}'s turn.`} usernameChar={'A'} colorIndex={-1} isCurrentUser={false} hidden={false} animatedText={true} />
        {/* {SessionStatus == 'win' && (
        <h2>You Guessed it right !!! </h2>
        )}
        {SessionStatus == 'lose' && (
        <h2>Someone guessed it right. Better luck next time </h2>
        )} */}
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
        { sessionStatus == 'y' && 
        (<button onClick={handleSendingMessage}><IoMdSend/></button>
        )}
      </div>
      <SessionOverModal isVisible={isSessionOver} onClose={closeModal} handleRejoinSession={handleRejoinSession} handleGoingHome={handleGoingHome} sessionStatus={sessionStatus} wordWinner={wordWinner} usernameWinner={usernameWinner}/>
    </div>

  );
};

export default RunningSessionPage;