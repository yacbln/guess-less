const WebSocket = require('ws');
const Game = require('./Game.js');

const wss = new WebSocket.Server({ port: 8080 });

let sessions_owners = {}
let sessions_uids = {}
let uids_ws = {}
let uids_usernames = {}
let game_objects = {}

wss.on('connection', function connection(ws) {
    console.log('A new client connected');
    //make use of this space to declare commong things
    const uid = generateUniqueID();
    let session_id = null;
    uids_ws[uid] = ws;

    ws.on('message', async function incoming(message) {
        console.log('Received:', message);
        const data = JSON.parse(message);

        switch (data.type) {
            case 'create_session':
                session_id = generatesession_id();
                sessions_uids[session_id] = [uid];
                sessions_owners[session_id] = uid;
                uids_usernames[uid] = data.username;

                ws.send(JSON.stringify({ type: 'session_created', sessionId:session_id }));
                break;
            case 'join_session':
                const joinsession_id = data.sessionId;
                const username = data.username;

                if (sessions_uids.hasOwnProperty(joinsession_id)) {
                    sessions_uids[joinsession_id].push(uid);
                    session_id = joinsession_id;
                    uids_usernames[uid] = username;

                    const list_usernames = (sessions_uids[joinsession_id]).map(user_id => uids_usernames[user_id]);
                    console.log("list usernames: ",list_usernames);
                    ws.send(JSON.stringify({ type: 'session_joined',listUsernames:list_usernames}));
                    // send message to session owner
                    uids_ws[sessions_owners[joinsession_id]].send(JSON.stringify({ type: 'user_joined', sessionId: joinsession_id, username:username }));
                } else {
                    ws.send(JSON.stringify({ type: 'session_not_found', sessionId: joinsession_id }));
                }
                break;

            case 'start_session':
                console.log("request to start session is received, sending back to each user in session")
                //instantiate a game object specific to the session ID
                const gameObject = new Game(sessions_uids[data.sessionId].length);
                game_objects[data.sessionId] = gameObject;
                const first_turn = game_objects[data.sessionId].updateTurn() 
                console.log("first turn is: ", first_turn)
                const hint = await game_objects[data.sessionId].getHint() 
                console.log("====the hint is: ", hint)
                //Let the clients know that the game session was started
                sessions_uids[data.sessionId].forEach(function each(user_id,index){

                    if (index == first_turn){
                        uids_ws[user_id].send(JSON.stringify({ type: 'session_started',turn:'y',hint:hint}));
                    }
                    else {
                        uids_ws[user_id].send(JSON.stringify({ type: 'session_started',turn:'n',hint:hint}));
                    }
                });
                break;
            case 'in_session':
                // Send the session ID back to the client
                // console.log("In-session message received.")
                // console.log("printing session ID: ",data.session_id)
                // console.log("pritinting message: ",data.message)
                // first broadcast message to others in session 
                sessions_uids[data.sessionId].forEach(function each(user_id,index){
                    if (user_id != uid){
                        // console.log("to be sent to: ", sessions_uids[joinsession_id][index])
                        uids_ws[user_id].send(JSON.stringify({ message: data.message, user:sessions_uids[data.sessionId][index]}));
                    }
                });

                const ans= await game_objects[data.sessionId].sendChat(data.message)

                if ( ans == 'win'){
                    // end the game, notify accordingly
                    ws.send(JSON.stringify({ message: 'win'}));
                    sessions_uids[data.sessionId].forEach(function each(user_id){
                    if (user_id != uid){
                        uids_ws[user_id].send(JSON.stringify({ message: 'lose'}));
                    }
                    // kill the game object 
                    game_objects[data.sessionId] = null;
                    });

                } else {
                    // send the message, update the turn
                    console.log("got a no-win message..");

                    const new_turn = game_objects[data.sessionId].updateTurn();

                    console.log("new turn is: ", new_turn);
                    sessions_uids[data.sessionId].forEach(function each(user_id,index){
                        if (index == new_turn){
                            uids_ws[user_id].send(JSON.stringify({ message: ans, turn:'y'}));
                        }
                        else {
                            uids_ws[user_id].send(JSON.stringify({ message: ans, turn:'n'}));
                        }
                    });
                }

                // sessions[data.session_id].forEach(function each(client){
                //     client.send(JSON.stringify({ message:data.message}));
                // });
                break;
            default:
                break; 
        }
    });

    ws.on('close', function close() {
        console.log(`Client uid: ${uid} session_id: ${session_id} disconnected`);
        
        //case: session not started, owner left ==> make everyone leave
        if (game_objects.hasOwnProperty(session_id)){
        
            sessions_owners = {}
        // sessions_uids = {}   
        // uids_ws = {}
        // uids_usernames = {}
        // game_objects = {}

        // delete object['property'];

        }
        //case: else, anyone leave ==> only that person leaves
        else{
            sessions_uids[session_id] = (sessions_uids[session_id]).filter(user_id => user_id !== uid);

            console.log("new users list: ", sessions_uids[session_id]);
            console.log("user left is: ", uids_usernames[uid]);
            //notify others in sessions of user leaving
            sessions_uids[session_id].forEach(function each(user_id){
                uids_ws[user_id].send(JSON.stringify({ type: 'user_left',username:uids_usernames[uid]}));
            });

            //cleanup 
            delete uids_ws[uid];
            delete uids_usernames[uid];
        }
        
        // const leavesession_id = data.session_id;
        // const usernameLeaving = data.username
        // if (sessions[leavesession_id]) {
        //     const indexToRemove = sessions_uids[leavesession_id].indexOf(usernameLeaving);
        //     sessions[leavesession_id].splice(indexToRemove, 1);
        //     sessions_uids[leavesession_id].splice(indexToRemove, 1);
        //     sessions[leavesession_id].forEach(function each(client){
        //         client.send(JSON.stringify({type: "user_left", username:usernameLeaving}));
        //     });     
        //     ws.send(JSON.stringify({type:'you_left'}));
        // } else {
        //     ws.send(JSON.stringify({ type: 'session_not_found', session_id: leavesession_id }));
        // }
        // break;
    });
});

function generatesession_id() {
    return Math.random().toString(36).substr(2, 8);
}

function generateUniqueID() {
    return Math.random().toString(36).substring(2, 15);
  }
