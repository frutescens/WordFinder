import { Scene } from "phaser";

export class UnlockManager extends Scene {
    private scope: Scene;

    constructor() {
        super({key: 'UnlockManager'});
    }

    create() {
        this.scene.resume('MainGame');
    }
}