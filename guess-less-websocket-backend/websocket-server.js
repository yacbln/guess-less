const WebSocket = require('ws');
const Game = require('./Game.js');

const wss = new WebSocket.Server({ port: 8080 });

const sessions = {};
const sessions_owners = {}
const game_objects = {}

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
                console.log("request to start session is received, sending back to each user in session")
                //instantiate a game object specific to the session ID
                const gameObject = new Game();
                game_objects[data.sessionId] = gameObject;
                //Let the clients know that the game session was started
                sessions[data.sessionId].forEach(function each(client){
                    client.send(JSON.stringify({ type: 'session_started'}));
                });
                break;
            case 'in_session':
                // Send the session ID back to the client
                // console.log("In-session message received.")
                // console.log("printing session ID: ",data.sessionId)
                // console.log("pritinting message: ",data.message)
                try{
                    // if(game_objects[data.sessionId].se(data.message)){
                    //     //anounce a winner
                    //     ws.send(JSON.stringify({ message: 'win'}));
                    //     //anounce to other players that they lost the game 
                    //     sessions[data.sessionId].forEach(function each(client){
                    //     if (client != ws){
                    //         client.send(JSON.stringify({ message: 'lose'}));
                    //     }
                    //     // kill the game object 
                    //     game_objects[data.sessionId] = null;
                    // });
                    // }

                    const ans= game_objects[data.sessionId].sendChat(data.message)

                } catch (error) {
                    console.error('An error occurred:', error.message);
                }
                // sessions[data.sessionId].forEach(function each(client){
                //     client.send(JSON.stringify({ message:data.message}));
                // });
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