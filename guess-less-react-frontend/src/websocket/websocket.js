function sendMessage(ws,message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error('WebSocket connection is not open.');
    }
}

function createSession (ws,username_val) {
    sendMessage(ws,{ type: 'create_session',username:username_val });
  };

function joinSession (ws,sessionId_val,username_val) {
    sendMessage(ws,{ type: 'join_session', sessionId:sessionId_val, username:username_val});
};

function requestStartSession (ws,sessionId_val) {
    sendMessage(ws,{ type: 'start_session',sessionId:sessionId_val});
};

function requestLeaveSession (ws,sessionId_val) {
    sendMessage(ws,{ type: 'start_session',sessionId:sessionId_val});
};

function sendInSessionMessage(ws,sessionId_val,message){
    sendMessage(ws,{ type:'in_session',sessionId:sessionId_val,message:message});
    
}

function sendInSessionPenalized (ws,sessionId_val){
    sendMessage(ws,{ type:'in_session_penalized',sessionId:sessionId_val});
    
}

module.exports = {
    createSession,
    joinSession, 
    requestStartSession,
    requestLeaveSession,
    sendInSessionMessage,
    sendInSessionPenalized
};