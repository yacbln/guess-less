import React, { createContext, useContext, useState } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [webSocket, setWebSocket] = useState(null);

  return (
    <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};