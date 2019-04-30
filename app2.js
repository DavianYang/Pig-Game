/*
GAME RULES;

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he wishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/
var scores, roundScore, activePlaying, gamePlaying, winnerScore, lastDice;

// GameCtrl ────────────────────────────────────────────────────────────────────────────────
const GameCtrl = (function(){

    // Public Methods
    return {
        generateRandomNumber: function() {
            // Generate two different dice numbers
            var dice1 = Math.floor(Math.random()*6) + 1;
            var dice2 = Math.floor(Math.random()*6) + 1;

            // Push into array
            var dices = [dice1, dice2];

            return dices;
        },
        nextPlayer: function(){
            activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

            // Initalize the round score
            roundScore = 0;
        },
        addGlobalScore: function(){
            return scores[activePlayer] += roundScore;
        }
    }
})();

// UICtrl ────────────────────────────────────────────────────────────────────────────────
const UICtrl = (function() {
    const UISelectors = {
        p0Panel: '.player-0-panel',
        p0Name: '#name-0',
        p0Score: '#score-0',
        cur0: '#current-0',
        cur1: '#current-1',
        p1Panel: '.player-1-panel',
        p1Name: '#name-1',
        p1Score: '#score-1',
        dice: '.dice',
        dice1: '#dice-1',
        dice2: '#dice-2',
        btnRoll: '.btn-roll',
        btnNew: '.btn-new',
        btnHold: '.btn-hold',
        finalScore: '.final-score'
    }

    // Public Methods
    return {
        getSelectors: function(){
            return UISelectors;
        },
        gameStart: function(){
            document.querySelector(UISelectors.dice1).style.display = 'none';
            document.querySelector(UISelectors.dice2).style.display = 'none';
            document.querySelector(UISelectors.p0Name).textContent = 'Player 1';
            document.querySelector(UISelectors.p1Name).textContent = 'Player 2';
            document.querySelector(UISelectors.p0Score).textContent = '0';
            document.querySelector(UISelectors.p1Score).textContent = '0';
            document.querySelector(UISelectors.cur0).textContent = '0';
            document.querySelector(UISelectors.cur1).textContent = '0';
            document.querySelector(UISelectors.p0Panel).classList.remove('winner');
            document.querySelector(UISelectors.p1Panel).classList.remove('winner');
            document.querySelector(UISelectors.p0Panel).classList.add('active');
            document.querySelector(UISelectors.p1Panel).classList.remove('active');
        },
        displayDiceNum: function(dices) {
            var dice1 = document.querySelector(UISelectors.dice1);
            var dice2 = document.querySelector(UISelectors.dice2);
            dice1.style.display = 'block';
            dice1.src = `dice-${dices[0]}.png`;
            dice2.style.display = 'block';
            dice2.src = `dice-${dices[1]}.png`;
        },
        displayRoundScore: function(roundScore){
            document.querySelector(`#current-${activePlayer}`).textContent = roundScore;
        },
        displayNextPlayer: function(){
            document.querySelector(UISelectors.cur0).textContent = 0;
            document.querySelector(UISelectors.cur1).textContent = 0;

            document.querySelector(UISelectors.p0Panel).classList.toggle('active');
            document.querySelector(UISelectors.p1Panel).classList.toggle('active');

            document.querySelector(UISelectors.dice1).style.display = 'none';
            document.querySelector(UISelectors.dice2).style.display = 'none';
        },
        displayGlobalScore: function(globalscore){
            document.querySelector(`#score-${activePlayer}`).textContent = globalscore;
        },
        getFinalScoreInput: function(){
            return document.querySelector(UISelectors.finalScore).value;
        }
        
    }
})();

// AppCtrl ────────────────────────────────────────────────────────────────────────────────
const AppCtrl = (function(GameCtrl, UICtrl) {

    const UISelectors = UICtrl.getSelectors();

    const loadEventListener = function(){

        document.querySelector(UISelectors.btnNew).addEventListener('click', gameInit);
        document.querySelector(UISelectors.btnRoll).addEventListener('click', diceRolling);
        document.querySelector(UISelectors.btnHold).addEventListener('click', diceHolding);
    }

    const diceRolling = function(e){

        if(gamePlaying){
            // Get Two Random Dice
            var dices = GameCtrl.generateRandomNumber();

            // Display Dice Number
            UICtrl.displayDiceNum(dices);

            // Check whether the player got 1
            if(dices[0] === 1 || dices[1] === 1) {
                // Next Player
                GameCtrl.nextPlayer();
                UICtrl.displayNextPlayer();
                console.log('Player roll one')
            } else {
                // Round Scores Added
                roundScore += dices[0] + dices[1];

                // Display Round Score
                UICtrl.displayRoundScore(roundScore);
            }
        }
        e.preventDefault();
    }

    const diceHolding = function(e){
        if(gamePlaying) {
            // Add round score to Global score
            var globalscore = GameCtrl.addGlobalScore();

            // Display Global Score
            UICtrl.displayGlobalScore(globalscore);

            // GET Input Winning Score
            var input = UICtrl.getFinalScoreInput();

            if(input){
                winnerScore = input;
            } else {
                winnerScore = 100;
            }

            // Check wether there is a winner or not
            if(globalscore >= winnerScore) {
                // Display Winner
                document.querySelector(`#name-${activePlayer}`).textContent = 'Winner!';
                document.querySelector(UISelectors.dice1).style.display = 'none';
                document.querySelector(UISelectors.dice2).style.display = 'none';
                document.querySelector(`.player-${activePlayer}-panel`).classList.add('winner');
                document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
                // Game Over
                gamePlaying = false;
            } else {
                // Game Continue
                GameCtrl.nextPlayer();
                UICtrl.displayNextPlayer();
            }
        }

        e.preventDefault();
    }

    const gameInit = function() {
        scores = [0, 0];
        roundScore = 0;
        activePlayer = 0;
        gamePlaying = true;
        
        UICtrl.gameStart();
    }

    // Public Methods
    return {
        init: function() {
            gameInit();

            console.log('Initalizing App...');

            loadEventListener();
        }

    }
})(GameCtrl, UICtrl);

AppCtrl.init();



/*
YOUR 3 CHALLENGES
Change the game to follow these rules:

1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, it's the next player's turn. (Hint: Always save the previous dice roll in a separate variable)
2. Add an input field to the HTML where players can set the winning score, so that they can change the predefined score of 100. (Hint: you can read that value with the .value property in JavaScript. This is a good oportunity to use google to figure this out :)
3. Add another dice to the game, so that there are two dices now. The player looses his current score when one of them is a 1. (Hint: you will need CSS to position the second dice, so take a look at the CSS code for the first one.)
*/