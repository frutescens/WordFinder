import { BasicChildData, MainGame } from "./main-game";

export class UpgradeManager extends Phaser.Scene {
    private scope: MainGame;

    constructor() {
        super({key: 'UpgradeManager'});
    }

    init(data: BasicChildData) {
        this.scope = data.scope;
    }

    create() {
        this.addUpgradeListeners();
    }

    private addUpgradeListeners() {

    }
}