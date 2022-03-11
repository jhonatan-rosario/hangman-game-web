import Screen from './Screen.js';
import Pen from './Pen.js';
import Keyboard from './Keyboard.js';
import ModalEndgame from './ModalEndgame.js';
import data from '../db/data.js';
import SessionStorageHangman from './SessionStorageHangman.js';

export default class Hangman {
    #category
    #word;
    #stripes;
    #hit;
    #error;
    #screen = new Screen('canvas', 1000);
    #pen = new Pen(this.#screen, { color: '#0A3871'});
    #modalEndgame = new ModalEndgame(this.newGame.bind(this), this.tryAgain.bind(this));
    #categoriesAndWords;
    #clueSpanElement = document.getElementById('clue');

    #randomItem(arr) {
        const number = Math.floor(Math.random() * arr.length);
        return arr[number];
    }

    #randomCategoryAndWord(obj) {
        const category = this.#randomItem(Object.keys(obj));
        const word = this.#randomItem(obj[category]);
        return {category, word};
    }

    #createElement(tagName, className) {
        const element = document.createElement(tagName);
        element.classList.add(className);
        return element;
    }

    #createStripeElement(amount) {
        const arr = Array.of(...(new Array(amount)));
        
        arr.forEach((elem, index, arr) => {
            arr[index] = this.#createElement('span', 'stripe');
        });

        return arr;
    }

    #addStripeOnScreen(word) {
        const letterContainer = document.getElementById('letterContainer');
        const stripes = this.#createStripeElement(word.length);
        
        letterContainer.innerHTML = '';
        stripes.forEach(elem => {
            this.#stripes.push(letterContainer.appendChild(elem));
        });
    }

    #youWin() {
        Keyboard.disableAllButtons();
        this.#modalEndgame.youWin();
    }

    #gameOver() {
        Keyboard.disableAllButtons();
        this.#modalEndgame.youLose();
    }

    #showLetter(letter, index) {
        this.#stripes[index].classList.remove('stripe');
        this.#stripes[index].classList.add('letter');
        this.#stripes[index].textContent = letter;
    }

    #showClue(clue) {
        this.#clueSpanElement.textContent = `Tema: ${clue}`;
    }   

    #correctLetter(letterAndIndex) {
        letterAndIndex.forEach(item => {
            const letter = item[0];
            const index = item[1];

            this.#showLetter(letter, index);
            this.#hit++;
        })

        if(this.#hit === this.#word.length) this.#youWin();
    }

    #wrongLetter() {
        this.#error++;

        switch (this.#error) {
            case 1:
                this.#pen.drawHead();
                break;
            case 2: 
                this.#pen.drawBody();
                break;
            case 3: 
                this.#pen.drawArm('left');
                break;
            case 4: 
                this.#pen.drawArm('right');
                break;
            case 5: 
                this.#pen.drawLeg('left');
                break;
            case 6: 
                this.#pen.drawLeg('right');
                this.#gameOver();
                break;
        }

    }

    #checkLetter(letter) {
        letter = letter === 'a' ? '[aáàâã]' : letter;
        letter = letter === 'e' ? '[eéèê]' : letter;
        letter = letter === 'i' ? '[iíìî]' : letter;
        letter = letter === 'o' ? '[oóòôõ]' : letter;
        letter = letter === 'u' ? '[uúùû]' : letter;
        letter = letter === 'c' ? '[cç]' : letter;

        const regexp = new RegExp(letter, 'gi');
        const matches = this.#word.matchAll(regexp);
        const lettersList = [...matches];

        if (lettersList.length === 0) {
            return null;
        };
        
        lettersList.forEach((elem, index, arr) => {
            arr[index] = [elem[0], elem.index];
        });
        
        return lettersList;
    }

    #onclickKeyboardButton(event) {
        const button = event.target;
        const letter = button.textContent;
        
        // Verifica se a letra está correta ou errada;
        let letterAndIndex;
        if(letterAndIndex = this.#checkLetter(letter)) {
            Keyboard.showCorrectButton(button);
            this.#correctLetter(letterAndIndex);
        } else {
            Keyboard.showWrongButton(button);
            this.#wrongLetter();
        };
    }

    tryAgain() {
        this.#stripes = [];
        this.#hit = 0;
        this.#error = 0;

        Keyboard.resetKeyboard();
        this.#screen.clearScreen();
        this.#pen.drawGallows();
        this.#addStripeOnScreen(this.#word);
    }

    newGame() {
        const { category, word } = this.#randomCategoryAndWord(this.#categoriesAndWords);

        this.#category = category;
        this.#word = word;
        this.#stripes = [];
        this.#hit = 0;
        this.#error = 0;

        Keyboard.resetKeyboard();
        this.#screen.clearScreen();
        this.#pen.drawGallows();
        this.#addStripeOnScreen(this.#word);
        this.#showClue(this.#category);
    }

    start() {     
        Keyboard.onclick = this.#onclickKeyboardButton.bind(this);

        if (SessionStorageHangman.hasCategoriesAndWords()) {
            this.#categoriesAndWords = SessionStorageHangman.getCategoriesWithWords();
            console.log(SessionStorageHangman.getCategoriesWithWords());
        } else {
            this.#categoriesAndWords = JSON.parse(data);
        }

        this.newGame();
    }
}