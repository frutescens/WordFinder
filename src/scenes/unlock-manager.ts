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
    private bannerContainer: UnlockBanner;

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
            this.bannerContainer = new UnlockBanner(this.scope, 0, 0, upgrade, UpgradeCategories.INPUT);
            this.bannerContainer.createBanner();
            this.scope.add.existing(this.bannerContainer);
        }, this);
        eventsCenter.on('UNLOCK_OTHER_UPGRADE', (upgrade: OtherUpgrades) => {
            this.scope.OTHER_UPGRADES.push(upgrade);
            this.bannerContainer = new UnlockBanner(this.scope, 0, 0, upgrade, UpgradeCategories.OTHER);
            this.bannerContainer.createBanner();
            this.scope.add.existing(this.bannerContainer);
        }, this);
        eventsCenter.on('DESTROY_EVENT_BANNER', () => {
            if (this.bannerContainer) {
                this.bannerContainer.destroy();
            }
        })
    }
}