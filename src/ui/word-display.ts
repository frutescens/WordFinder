import eventsCenter from "../events-center";
import { MainGame } from "../scenes/main-game";
import { randInt } from "../utils";

export class WordDisplay extends Phaser.GameObjects.Text {
    constructor(scene: MainGame, x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) {
        const textColor = new Phaser.Display.Color();
        textColor.random();
        style.color = textColor.rgba;
        style.fontSize = randInt(65, 100);
        super(scene, x, y, text, style);
        this.setRandomPosition();
        this.scene.add.tween({
            targets: this,
            key: {start: 0, end: 1},
            paused: false,
            loop: 0,
            yoyo: true,
            ease: 'Linear',
            delay: randInt(1000, 2000),
            completeDelay: 1,
            duration: randInt(5500, 4000),
            onUpdate: (t) => {
                this.setAlpha(t.getValue());
            },
            onComplete: () => {
                eventsCenter.emit('DESTROY_WORD', this);
            }
        });
        this.update();
    }
}