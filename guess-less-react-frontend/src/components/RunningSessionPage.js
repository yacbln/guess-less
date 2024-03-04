import React, {useEffect} from 'react';

import { useWebSocket } from '../websocket/WebSocketContext';
const RunningSessionPage = () => {
  const { ws } = useWebSocket();
  useEffect(() => {
    // Use ws connection
    console.log('WebSocket connection:', ws);
  }, [ws]);

  return (
    <div >
      <p>You are at the game screen =</p>
    </div>
  );
};

export default RunningSessionPage;