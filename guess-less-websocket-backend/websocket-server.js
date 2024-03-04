const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const sessions = {};
const sessions_owners = {}

wss.on('connection', function connection(ws) {
    console.log('A new client connected');

    ws.on('message', function incoming(message) {
        console.log('Received:', message);

        const data = JSON.parse(message);

        switch (data.type) {
            case 'create_session':
                const sessionId = generateSessionId();

                sessions[sessionId] = [ws];
                sessions_owners[sessionId] = ws

                ws.send(JSON.stringify({ type: 'session_created', sessionId }));
                break;
            case 'join_session':
                const joinSessionId = data.sessionId;
                const username = data.username

                if (sessions[joinSessionId]) {
                    sessions[joinSessionId].push(ws);
                    message_tosend_tojoiner = JSON.stringify({ type: 'session_joined', sessionId: joinSessionId, username:username }) 
                    message_tosend_toowner = JSON.stringify({ type: 'user_joined', sessionId: joinSessionId, username:username })
                    ws.send(message_tosend_tojoiner);
                    // send message to session owner
                    sessions_owners[joinSessionId].send(message_tosend_toowner);
                } else {
                    // Send an error message to the client if the session does not exist
                    ws.send(JSON.stringify({ type: 'session_not_found', sessionId: joinSessionId }));
                }
                break;
            case 'start_session':
                // Send the session ID back to the client
                console.log("request to start session is received, sending back to each user in session")

                sessions[data.sessionId].forEach(function each(client){
                    client.send(JSON.stringify({ type: 'session_started'}));
                });
                break;
            default:
                break; 
        }
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});

function generateSessionId() {
    return Math.random().toString(36).substr(2, 8);
}