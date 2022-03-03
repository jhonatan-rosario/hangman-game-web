export default class Screen {
    #canvas;
    #context;
    #resolution;

    constructor(canvasId, resolution) {
        this.#canvas = document.getElementById(canvasId);
        this.#context = this.#canvas.getContext('2d');
        this.#resolution = resolution
        this.#canvas.height = resolution;
        this.#canvas.width = resolution;
    }

    get canvas() { return this.#canvas}
    get context() { return this.#context}
    get resolution() { return this.#resolution}

    clearScreen() {
        this.#context.clearRect(0, 0, this.#resolution, this.#resolution);
    }
}