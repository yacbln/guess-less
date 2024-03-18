const WebSocket = require('ws');
const Game = require('./Game.js');

const wss = new WebSocket.Server({ port: 8080 });

const sessions = {};
const sessions_owners = {}
const sessions_usernames = {}
const game_objects = {}

wss.on('connection', function connection(ws) {
    console.log('A new client connected');

    ws.on('message', async function incoming(message) {
        console.log('Received:', message);

        const data = JSON.parse(message);

        switch (data.type) {
            case 'create_session':
                const sessionId = generateSessionId();

                sessions[sessionId] = [ws];
                sessions_owners[sessionId] = ws
                sessions_usernames[sessionId] = [data.username]
                console.log("---------- starting session username list: ",sessions_usernames[sessionId])
                ws.send(JSON.stringify({ type: 'session_created', sessionId }));
                break;
            case 'join_session':
                const joinSessionId = data.sessionId;
                const username = data.username

                if (sessions[joinSessionId]) {
                    sessions[joinSessionId].push(ws);
                    sessions_usernames[joinSessionId].push(username);
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
                const gameObject = new Game(sessions[data.sessionId].length);
                game_objects[data.sessionId] = gameObject;
                const first_turn = game_objects[data.sessionId].updateTurn() 
                console.log("first turn is: ", first_turn)
                const hint = await game_objects[data.sessionId].getHint() 
                console.log("====the hint is: ", hint)
                //Let the clients know that the game session was started
                sessions[data.sessionId].forEach(function each(client,index){

                    if (index == first_turn){
                        client.send(JSON.stringify({ type: 'session_started',turn:'y',hint:hint}));
                    }
                    else {
                        client.send(JSON.stringify({ type: 'session_started',turn:'n',hint:hint}));
                    }
                });
                break;
            case 'in_session':
                // Send the session ID back to the client
                console.log("In-session message received.")
                console.log("printing session ID: ",data.sessionId)
                console.log("pritinting message: ",data.message)
                
                // first broadcast message to others in session 
                sessions[data.sessionId].forEach(function each(client,index){
                    if (ws != client){
                        // console.log("to be sent to: ", sessions_usernames[joinSessionId][index])
                        client.send(JSON.stringify({ message: data.message, user:sessions_usernames[data.sessionId][index]}));
                    }
                });

                const ans= await game_objects[data.sessionId].sendChat(data.message)

                if ( ans == 'win'){
                    // end the game, notify accordingly
                    ws.send(JSON.stringify({ message: 'win'}));
                    sessions[data.sessionId].forEach(function each(client){
                    if (client != ws){
                        client.send(JSON.stringify({ message: 'lose'}));
                    }
                    // kill the game object 
                    game_objects[data.sessionId] = null;
                    });

                } else {
                    // send the message, update the turn
                    console.log("got a no-win message..");

                    const new_turn = game_objects[data.sessionId].updateTurn();

                    console.log("new turn is: ", new_turn);
                    sessions[data.sessionId].forEach(function each(client,index){
                        if (index == new_turn){
                            client.send(JSON.stringify({ message: ans, turn:'y'}));
                        }
                        else {
                            client.send(JSON.stringify({ message: ans, turn:'n'}));
                        }
                    });
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
