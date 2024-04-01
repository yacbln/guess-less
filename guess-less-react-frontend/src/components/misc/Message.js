import React from 'react';
import './Message.css'; 
import { AiFillRobot } from "react-icons/ai";
import { BiHide } from "react-icons/bi";
// import TypewriterEffect from './TypewriterEffect';
import { useTypingEffect } from "../../hooks/typingEfffect";

const Message = ({ textMsg, usernameChar, colorIndex, isCurrentUser,hidden,animatedText=false}) => {
  const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5','color-6'];
  const char = colorIndex == -1? <AiFillRobot /> : usernameChar;
  const charClass = colorIndex == -1? "color-robot" : colorClasses[colorIndex % colorClasses.length];
  const textEffect = useTypingEffect(textMsg, 75);
  // const text = hidden? <BiHide/>:(animatedText?<TypewriterEffect sentence={textMsg} />:<p className="text">{textMsg}</p>);
  const text = hidden? <BiHide/>:(animatedText? <p className="text">{textEffect}</p>:<p className="text">{textMsg}</p>);  
  const textClass = hidden ? 'color-hidden': charClass;
  return (
    <div className={`message ${isCurrentUser ? 'current-user' : ''}`}>
      <div className={`avatar ${charClass}`}>
        {char} 
        </div>  
      <div className={`message-content ${textClass}`}>
        {text}
      </div>
    </div>
  );
};

export default Message;