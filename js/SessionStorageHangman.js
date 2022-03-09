export default class SessionStorageHangman {
    static #key = 'categories-and-words';

    static #save(value) {
        sessionStorage.setItem(this.#key, JSON.stringify(value));
    }

    static getAll() {
        const result = sessionStorage.getItem(this.#key)
        
        if (!result) return {};
        return JSON.parse(result);
    }

    static hasCategories() {
        const result = this.getAll();

        if (!result) return false;
        if (Object.keys(result).length === 0) return false;

        return true;
    }

    static addCategory(category) {
        if (!category) throw new Error('O parâmentro [category] não pode ser undefined.');

        const categoriesAndWords = this.getAll();
        categoriesAndWords[category] = [];

        this.#save(categoriesAndWords);
    }

    static addWord(word, category) {
        if (!word) throw new Error('O parâmentro [word] não pode ser undefined.');
        if (!category) throw new Error('O parâmentro [category] não pode ser undefined.');

        const categoriesAndWords = this.getAll();
        categoriesAndWords[category].push(word);

        this.#save(categoriesAndWords);
    }

    static getCategories() {
        const categoriesAndWords = this.getAll();

        if (!categoriesAndWords) return null;

        return Object.keys(categoriesAndWords);
    }

    static getWords(category) {
        if (!category) throw new Error('O parâmentro [category] não pode ser undefined.');

        const categoriesAndWords = this.getAll();

        return categoriesAndWords[category];
    }

    static removeCategory(category) {
        const categoriesAndWords = this.getAll();

        delete categoriesAndWords[category];

        this.#save(categoriesAndWords);
    }

    static removeWord(word, category) {
        const categoriesAndWords = this.getAll();
        const index = categoriesAndWords[category].indexOf(word);
        categoriesAndWords[category].splice(index, 1);
        this.#save(categoriesAndWords);
    }
}