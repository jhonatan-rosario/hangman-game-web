import SessionStorageHangman from "./SessionStorageHangman.js";

class AddNewWord {
    static #form = document.forms[0];
    static #categoriesSelect = this.#form.categories;
    static #removeCategoryButton = this.#form.removeCategoryButton;
    static #newCategoryInput = this.#form.newCategoryInput;
    static #newWordInput = this.#form.newWordInput;
    static #addNewCategoryButton = this.#form.addNewCategoryButton;
    static #addNewWordButton = this.#form.addNewWordButton;
    static #addedWords = document.querySelector('.added-words');
    static #alert = document.querySelector('.alert');

    static loadCategories() {
        if (SessionStorageHangman.hasCategories()) {
            const categories = SessionStorageHangman.getCategories();
            
            // Adiciona todas as categorias no <select> em ordem alfabética.
            categories.sort().forEach(category => {
                this.#addCategoryOnSelect(category);
            });
        }
        
    }

    static #updateWords() {
        this.#addedWords.innerHTML = '';
            const category = this.#categoriesSelect.selectedOptions[0].value;
            
            if (category === '') return false;
    
            SessionStorageHangman.getWords(category).forEach(word => {
                this.#addWordOnUl(word);
            })
    }

    static startEvents() {
        this.#addNewCategoryButton.onclick = e => this.#addNewCategory(e);
        this.#removeCategoryButton.onclick = e => this.#removeCategory(e);
        this.#addNewWordButton.onclick = e => this.#addNewWord(e);
        this.#categoriesSelect.onchange = () => this.#updateWords();

        this.#alert.children['closeAlert'].onclick = () => this.#closeAlert();
    }

    static #showAlert(text, success = true) {
        const span = this.#alert.childNodes[0];

        span.textContent = text;

        this.#alert.classList.remove('success');

        // Se a variavel 'success' for verdadeira será adicionada a classe ao alerta
        !success || this.#alert.classList.add('success');

        this.#alert.style.display = 'flex';
    }

    static #closeAlert() {
        this.#alert.style.display = 'none';
    }

    static #validateCategory(category) {
        const regex = new RegExp(`^[a-záãâéêíóõôúç]{1,30}([ ]?[a-záãâéêíóõôúç]){1,30}\\1{0,30}$`, 'i');
        return regex.test(category);
    }

    static #validateWord(word) {
        const regexp = new RegExp('^[a-záãâéêíóõôúç]{3,25}$');
        return regexp.test(word);
    }

    static #removeAccents(word) {                                                       
        word = word.replace(new RegExp('[áàâã]','gi'), 'a');
        word = word.replace(new RegExp('[éèê]','gi'), 'e');
        word = word.replace(new RegExp('[íìî]','gi'), 'i');
        word = word.replace(new RegExp('[óòôõ]','gi'), 'o');
        word = word.replace(new RegExp('[úùû]','gi'), 'u');
        word = word.replace(new RegExp('[ç]','gi'), 'c');
        return word.toLowerCase();                 
    }

    static #addCategoryOnSelect(value) {
        const option = new Option(value, value);
        option.id = this.#removeAccents(value).trim();
        option.selected = true;
        this.#categoriesSelect.add(option);
    }

    static #addWordOnUl(word) {
        const listItem = document.createElement('li');
        const span = document.createElement('span');
        const button = document.createElement('button');

        span.textContent = word;

        button.textContent = 'excluir';
        button.onclick = e => this.#removeWord(e);

        listItem.setAttribute('class', 'word');
        listItem.appendChild(span);
        listItem.appendChild(button);

        this.#addedWords.appendChild(listItem);
    }

    static #addNewCategory(e) {
        e.preventDefault();

        const category = this.#newCategoryInput.value;

        if (!category) {
            this.#showAlert(`Digite alguma categoria!`, false);
            return false;
        }

        // Verifica se já existe uma categoria com o mesmo id
        if (this.#categoriesSelect.namedItem(this.#removeAccents(category).trim())) {
            this.#showAlert('Essa categoria já foi adicionada.', false);
            return false;
        }

        if (!this.#validateCategory(category)) {
            this.#showAlert('Categoria digitada é inválida.', false);
            return false;
        }

        const categoryLowerCase = category.toLowerCase();

        SessionStorageHangman.addCategory(categoryLowerCase);
        this.#addCategoryOnSelect(categoryLowerCase);

        this.#showAlert('Nova categoria adicionada.', true);

        this.#newCategoryInput.value = '';
        this.#newCategoryInput.focus();
    }

    static #removeCategory(e) {
        e.preventDefault();

        const optionSelectedIndex = this.#categoriesSelect.selectedIndex;

        // Não remove o primeiro elemento do select
        if (optionSelectedIndex === 0) return false;

        const option = this.#categoriesSelect.item(optionSelectedIndex);
        const category = option.value;

        SessionStorageHangman.removeCategory(category);
        option.remove();

        this.#showAlert('Categoria removida.', true);

        this.#addedWords.innerHTML = '';
    }

    static #addNewWord(e) {
        e.preventDefault();

        const word = this.#newWordInput.value;
        const category = this.#categoriesSelect.selectedOptions[0].value;

        if (category === '') {
            this.#showAlert('Para adicionar uma nova palavra primeiro selecione uma categoria.', false);
            return false;
        }

        if (!this.#validateWord(word)) {
            this.#showAlert('Palavra inválida', false);
            return false;
        }

        SessionStorageHangman.addWord(word, category);
        this.#addWordOnUl(word);

        this.#showAlert('Nova palavra adicionada.')

        this.#newWordInput.value = '';
        this.#newWordInput.focus();
    }

    static #removeWord(e) {
        e.preventDefault();

        const button = e.target;
        const li = button.parentNode;
        const span = button.previousElementSibling;
        const word = span.textContent;
        const category = this.#categoriesSelect.selectedOptions[0].value;

        SessionStorageHangman.removeWord(word, category);

        li.remove();

        this.#showAlert('Palavra removida.', true);
    }

}

AddNewWord.startEvents();
AddNewWord.loadCategories();