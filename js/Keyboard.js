export default class keyboard {
    static #buttons = document.querySelectorAll('div.keyboard > div > button.key');

    static get buttons() { return this.#buttons }

    static enableButton(button) {
        button.removeAttribute('disabled');
    }

    static enableAllButtons() {
        this.#buttons.forEach(button => {
            this.enableButton(button);
        });
    }

    static disableButton(button) {
        button.setAttribute('disabled', '');
    }

    static disableAllButtons() {
        this.#buttons.forEach(button => {
            this.disableButton(button);
        });
    }

    static resetKeyboard() {
        this.#buttons.forEach(button => {
            this.enableButton(button);
            button.classList.remove('correct', 'wrong');
        });
    }

    static showWrongButton(button) {
        button.classList.add('wrong');
    }

    static showCorrectButton(button) {
        button.classList.add('correct');
    }

    static set onclick(callback) {
        this.#buttons.forEach(button => button.onclick = callback);
    }
}