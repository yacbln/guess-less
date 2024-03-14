
const openai = require('openai'); // Assuming you have the OpenAI library installed
require('dotenv').config();

class Game {

    constructor(nbr_players) {
        this.openaiInstance = new openai.OpenAI({apiKey:process.env.API_KEY});
        console.log("Game object instantiated and new chat object is created.");
        this.nbr_players = nbr_players
        this.cur_turn = Math.floor(Math.random() * (nbr_players-1));
        this.initializeChat();

    }

    async initializeChat() {
        // tell the chat bot to pick a random word
        const wrd = await this.getResponse(
            'Pick a random word. Answer in one word only.',
            'You are a helpful assistant.'
            );
        console.log("the word generated is: ", wrd);
        if (wrd[wrd.length -1] == '.'){
            this.word = wrd.slice(0, -1);  //getting rid of end dot.
        }
        else{
            this.word = wrd;
        }

                // the rest will be the users taking guesses...
        this.system_prompt = `You are an assistant receiving questions to guess the word '${this.word}'.Answer 'win' if the guess is right. Answer with 'yes' or 'no' to only questions of that type. Answer 'invalid' to other types of questions.`;
        
        console.log(`You are a helpful assistant helping me guess the word ${this.word}`);

        // tell the chat bot to give a hint about the word
        this.hint = await this.getResponse(
            'Give me a hint about the word. Keep it short.',
            `You are a helpful assistant helping me guess the word ${this.word}`
            );


        // Say invalid for questions that are not yes/no type.
    }

    async getResponse(user_prompt,sys_prompt) {
        console.log("message to be sent (user): ",user_prompt);
        console.log("message to be sent (system): ",sys_prompt);
        /* Returns the response for the given prompt using the OpenAI API. */
        const completion = await this.openaiInstance.chat.completions.create({
            messages: [
            { role: "system", content: sys_prompt },
            { role: "user", content:user_prompt}],
            model: "gpt-3.5-turbo",
          });
        const message = completion.choices[0].message.content;
        console.log("====== message generated is: ",message);
        return message;
    }

    updateTurn(){
        this.cur_turn = (this.cur_turn +1)% this.nbr_players;
        return this.cur_turn;
    }

    sendChat(user_prompt)  {
        console.log(`user asked: ${user_prompt}`);
        const resp = this.getResponse(user_prompt,this.system_prompt);
        return resp;
    }
  }


module.exports = Game;
