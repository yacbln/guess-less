import React from 'react';
import './Message.css'; 
import { FaRobot } from 'react-icons/fa'

const Message = ({ text, usernameChar, colorIndex, isCurrentUser }) => {
  const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5','color-6'];
  const char = colorIndex == -1? <FaRobot /> : usernameChar;
  const charClass = colorIndex == -1? "color-robot" : colorClasses[colorIndex % colorClasses.length];
  return (
    <div className={`message ${isCurrentUser ? 'current-user' : ''}`}>
      <div className={`avatar ${charClass}`}>
        {char}
        </div>
      <div className={`message-content ${charClass}`}>
        {/* <span className="username">{user.name}</span> */}
        <p className="text">{text}</p>
      </div>
    </div>
  );
};

export default Message;