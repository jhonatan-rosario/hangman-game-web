export default class Pen {
    #ctx;
    #resolution;
    #color;

    constructor(screen, options) {
        this.#ctx = screen.context;
        this.#resolution = screen.resolution;
        this.color = options.color || 'black';
    }

    set color(color) { 
        this.#color = color;
        this.#ctx.strokeStyle = color;
     }

     get color() { return this.#color }

    #drawLine(x, y, length, thickness, angle = 0) {  
        try {
            const radians = angle * (Math.PI/180);     
            const x2 = x + Math.cos(radians) * length; 
            const y2 = y + Math.sin(radians) * length; 
            
            this.#ctx.beginPath();
            this.#ctx.lineWidth = thickness;
            this.#ctx.moveTo(x, y);
            this.#ctx.lineTo(x2, y2);
            this.#ctx.stroke();
        } catch(e) {
            console.log(`
                Erro ao desenhar a linha.
                Motivo: ${e}
            `)                                     }
    }

    #drawCircle(x, y, thickness, radius) {
        try {
            this.#ctx.beginPath();
            this.#ctx.lineWidth = thickness;
            this.#ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.#ctx.stroke();
        } catch(e) {
            console.log(`
            Erro ao desenhar o círculo.
            Motivo: ${e}
        `)
        }
    }

    drawGallows() {
        const thickness = this.#resolution * 0.02;
        const margin = thickness / 2;
        const baseSize = this.#resolution * 0.8;
        const supportSize = baseSize * 0.6;

        this.#drawLine(0, (this.#resolution - margin), baseSize, thickness, 0);
        this.#drawLine((baseSize * 0.2), 0, (this.#resolution - margin), thickness, 90);
        this.#drawLine(((baseSize * 0.2)), margin, supportSize, thickness, 0);
        this.#drawLine((baseSize * 0.8), 0, (supportSize * 0.2), thickness, 90);
    }

    drawHead() {
        const radius = this.#resolution * 0.08;
        const thickness = (this.#resolution * 0.02) * 0.6;
        const baseSize = this.#resolution * 0.8;
        const supportSize = baseSize * 0.6;

        this.#drawCircle(baseSize * 0.8, (supportSize * 0.2) + radius, thickness, radius);
    }

    drawBody() {
        const radius = this.#resolution * 0.08;
        const thickness = (this.#resolution * 0.02) * 0.6;
        const baseSize = this.#resolution * 0.8;
        const supportSize = baseSize * 0.6;

        this.#drawLine(baseSize * 0.8, (supportSize * 0.2) + (radius * 2), (baseSize * 0.5), thickness, 90)
    }

    drawArm(side) {
        const radius = this.#resolution * 0.08;
        const thickness = (this.#resolution * 0.02) * 0.6;
        const baseSize = this.#resolution * 0.8;
        const supportSize = baseSize * 0.6;

        let angle;
        switch (side) {
            case 'right':
                angle = 60;
                break;
            case 'left':
                angle = 120;
                break;
        }
        this.#drawLine(baseSize * 0.8, (supportSize * 0.2) + (radius * 2), (baseSize * 0.25), thickness, angle);
    }

    drawLeg(side) {
        const radius = this.#resolution * 0.08;
        const thickness = (this.#resolution * 0.02) * 0.6;
        const baseSize = this.#resolution * 0.8;
        const supportSize = baseSize * 0.6;

        let angle;
        switch (side) {
            case 'right':
                angle = 60;
                break;
            case 'left':
                angle = 120;
                break;
        }
        this.#drawLine(baseSize * 0.8, (supportSize * 0.2) + (radius * 2) + (baseSize * 0.5), (baseSize * 0.25), thickness, angle);
    }
}