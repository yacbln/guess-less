class Game {

    constructor() {
        this.randomNumber = Math.floor(Math.random() * 11);
        console.log("Game object instantiated and picked random number as: ", this.randomNumber)
        
        this.guessed = false
    }


    takeGuess(numberGuessed) {
        const guessedBool = (numberGuessed == this.randomNumber)

        if (guessedBool && !this.guessed){
            this.guessed = true
            return true
        }
        return false
      }

  }


module.exports = Game;