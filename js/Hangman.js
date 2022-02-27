import Screen from './Screen.js';
import Pen from './Pen.js';

export default function Hangman() {

    this.start = () => {
        const pen = new Pen(new Screen('canvas', 1000), { color: '#0A3871'});
        pen.drawGibbet();
    }
}