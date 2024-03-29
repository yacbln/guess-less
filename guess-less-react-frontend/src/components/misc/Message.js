import React from 'react';
import './Message.css'; 
import { AiFillRobot } from "react-icons/ai";
import { BiHide } from "react-icons/bi";

const Message = ({ textMsg, usernameChar, colorIndex, isCurrentUser,hidden}) => {
  const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5','color-6'];
  const char = colorIndex == -1? <AiFillRobot /> : usernameChar;
  const charClass = colorIndex == -1? "color-robot" : colorClasses[colorIndex % colorClasses.length];
  const text = hidden? <BiHide/>: <p className="text">{textMsg}</p>; 
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