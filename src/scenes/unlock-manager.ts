import { Scene } from "phaser";
import { InputUpgrades } from "../enums/input-upgrades";
import { OtherUpgrades } from "../enums/other-upgrades";
import { MainGame } from "./main-game";
import eventsCenter from "../events-center";
import { UnlockBanner } from "../ui/unlock-box";
import { UpgradeCategories } from "../enums/upgrade-categories";

export type UnlockManagerData = {
    scope: MainGame,
    inputUpgrades: InputUpgrades[],
    otherUpgrades: OtherUpgrades[]
}

export class UnlockManager extends Scene {
    private scope: MainGame;
    private inputUpgrades: InputUpgrades[];
    private otherUpgrades: OtherUpgrades[];

    constructor() {
        super({key: 'UnlockManager'});
    }

    init(data: UnlockManagerData) {
        this.scope = data.scope;
        this.inputUpgrades = data.inputUpgrades;
        this.otherUpgrades = data.otherUpgrades;
    }

    create() {
        eventsCenter.on('UNLOCK_INPUT_UPGRADE', (upgrade: InputUpgrades) => {
            this.scope.INPUT_UPGRADES.push(upgrade);
            const bannerContainer = new UnlockBanner(this.scope, 0, 0, upgrade, UpgradeCategories.INPUT);
            bannerContainer.createBanner();
        }, this);
        eventsCenter.on('UNLOCK_OTHER_UPGRADE', (upgrade: OtherUpgrades) => {
            this.scope.OTHER_UPGRADES.push(upgrade);
            const bannerContainer = new UnlockBanner(this.scope, 0, 0, upgrade, UpgradeCategories.OTHER);
            bannerContainer.createBanner();
        }, this);
    }
}