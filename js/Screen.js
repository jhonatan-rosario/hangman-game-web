export default class Screen {
    #id = '01';
    canvas;
    context;
    resolution;

    constructor(canvasId, resolution) {
        this.canvas = document.getElementById(canvasId);
        this.context = canvas.getContext('2d');
        this.resolution = resolution
        this.canvas.height = resolution;
        this.canvas.width = resolution;
    }
}