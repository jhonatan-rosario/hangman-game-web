import Hangman from './Hangman.js';

(function() {
    const hangman = new Hangman();
    const newGameButton = document.getElementById('newGame');
    
    hangman.start();
    newGameButton.onclick = () => hangman.newGame();
})();