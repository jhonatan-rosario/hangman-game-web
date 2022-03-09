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
        const closeAlert = this.#alert.children['closeAlert'];

        this.#alert.textContent = text;
        this.#alert.appendChild(closeAlert);

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
        word = word.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
        word = word.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
        word = word.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
        word = word.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
        word = word.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
        word = word.replace(new RegExp('[Ç]','gi'), 'c');
        return word.toLowerCase();                 
    }

    static #addCategoryOnSelect(value) {
        const option = new Option(value, value);
        option.id = this.#removeAccents(value).trim();
        this.#categoriesSelect.add(option);
    }

    static #removeCategoryOnSelect(index) {
        // Não remove o primeiro elemento do select
        if(index === 0) return false;

        this.#categoriesSelect.remove(index);
    }

    static #addWordOnUl(value) {
        const listItem = document.createElement('li');
        const button = document.createElement('button');

        button.textContent = 'excluir';
        button.onclick = e => this.#removeWord(e);

        listItem.setAttribute('class', 'word');
        listItem.textContent = value;
        listItem.appendChild(button);

        this.#addedWords.appendChild(listItem);
    }

    static #removeWordOnUl(li) {
        this.#addedWords.removeChild(li);
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
        const category = this.#categoriesSelect.item(optionSelectedIndex).value;

        SessionStorageHangman.removeCategory(category);
        this.#removeCategoryOnSelect(optionSelectedIndex);

        this.#showAlert('Categoria removida.', true);

        this.#addedWords.innerHTML = '';
    }

    static #addNewWord(e) {
        e.preventDefault();

        const word = this.#newWordInput.value;
        const category = this.#categoriesSelect.selectedOptions[0].value;

        if (category === '') {
            this.#showAlert('Para adicionar uma nova palavra selecione uma categoria primeiro.', false);
            return false;
        }

        if (!this.#validateWord(word)) {
            this.#showAlert('Palavra inválida', false);
            return false;
        }
        console.log(this.#validateWord(word))
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
        const word = li.textContent;
        const category = this.#categoriesSelect.selectedOptions[0].value;

        SessionStorageHangman.removeWord(word, category);
        this.#removeWordOnUl(li);

        this.#showAlert('Palavra removida.', true);
    }

}

AddNewWord.startEvents();
AddNewWord.loadCategories();