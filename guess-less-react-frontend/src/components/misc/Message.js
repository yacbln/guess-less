import React from 'react';
import './Message.css'; 

const Message = ({ text, user, isCurrentUser }) => {
  return (
    <div className={`message ${isCurrentUser ? 'current-user' : ''}`}>
      <img src={user.avatar} alt={user.name} className="avatar" />
      <div className="message-content">
        <span className="username">{user.name}</span>
        <p className="text">{text}</p>
      </div>
    </div>
  );
};

export default Message;