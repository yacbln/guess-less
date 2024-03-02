// Function to send a message
function sendMessage(ws,message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error('WebSocket connection is not open.');
    }
}

function createSession (ws) {
    sendMessage(ws,{ type: 'create_session' });
  };

function joinSession (ws,sessionId_val,username_val) {
    sendMessage(ws,{ type: 'join_session', sessionId:sessionId_val, username:username_val});
};


// Export WebSocket instance and functions
module.exports = {
    createSession,
    joinSession
};