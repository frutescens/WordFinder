import { InputUpgrades } from "../enums/input-upgrades";
import { OtherUpgrades } from "../enums/other-upgrades";
import { UpgradeCategories } from "../enums/upgrade-categories";

export class UnlockBanner extends Phaser.GameObjects.Container {
    private unlock: InputUpgrades | OtherUpgrades;
    private unlockCategory: UpgradeCategories;

    constructor(scene: Phaser.Scene, x: number, y: number, unlock: InputUpgrades | OtherUpgrades, unlockCategory: UpgradeCategories) {
        super(scene, x, y);
        this.unlock = unlock;
        this.unlockCategory = unlockCategory;
    }

    public createBanner(): void {
        this.setPosition(0, 750);
        const bannerColor = this.unlockCategory === UpgradeCategories.INPUT ? 0xff832f1 : 0xd2832f6
        const eventBannerBg = new Phaser.GameObjects.Rectangle(this.scene, 550.5, 510, 350, 250, bannerColor);
        const bannerText = new Phaser.GameObjects.Text(this.scene, 0, 0, 'New Unlock!', { fontSize: 20});
        this.add(eventBannerBg);
        this.add(bannerText);
        this.update();
    }
}