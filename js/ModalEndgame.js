export default class ModalEndgame {
    #modalContainer = document.getElementById('modalEndgameContainer');
    #closeButton = document.getElementById('closeModalEndgame');
    #newGameButton = document.getElementById('newGameModalEndgame');
    #tryAgainButton = document.getElementById('tryAgainModalEndgame');
    #imageModal = document.querySelector('.image-modal-endgame');
    #textModal = document.querySelector('.text-modal-endgame');
    #youWinText = 'Parabéns, você ganhou!';
    #youLoseText = 'Ainda não foi dessa vez :(';
    #pathTrophyImage = './assets/trophy.svg';
    #pathTombstoneImage = './assets/tombstone.svg';
    
    constructor(newGameCallback, tryAgainCallback) {
        this.#closeButton.onclick = this.#closeModal.bind(this);

        this.#newGameButton.onclick = () => {
            newGameCallback();
            this.#closeModal();
        }

        this.#tryAgainButton.onclick = () => {
            tryAgainCallback();
            this.#closeModal();
        }
    }

    #closeModal() {
        this.#modalContainer.style.display = 'none';
        this.#newGameButton.style.display = 'none';
        this.#tryAgainButton.style.display = 'none';
    }

    youWin() {
        this.#modalContainer.style.display = 'flex';
        this.#imageModal.setAttribute('src', this.#pathTrophyImage);
        this.#textModal.textContent = this.#youWinText;
        this.#newGameButton.style.display = 'block';
    }

    youLose() {
        this.#modalContainer.style.display = 'flex';
        this.#imageModal.setAttribute('src', this.#pathTombstoneImage);
        this.#textModal.textContent = this.#youLoseText;
        this.#newGameButton.style.display = 'block';
        this.#tryAgainButton.style.display = 'block';
    }

}