import { InputUpgrades } from "../enums/input-upgrades";
import eventsCenter from "../events-center";

export class UnlockBanner extends Phaser.GameObjects.Container {
    private unlock: InputUpgrades;

    constructor(scene: Phaser.Scene, x: number, y: number, unlock: InputUpgrades) {
        super(scene, x, y);
        this.unlock = unlock;
        this.createBanner();
    }

    private createBanner(): void {
        this.setPosition(225, 550);
        const eventBannerBg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 350, 300, 0x3f832f1);
        const bannerText = new Phaser.GameObjects.Text(this.scene, 0, 0, 'New Unlock!', { fontSize: 20});
        bannerText.setPosition(-60, -60);
        this.add(eventBannerBg);
        this.add(bannerText);
        this.scene.tweens.add({
            targets: this,
            key: { start: 1, to: 0 },
            paused: false,
            ease: 'Power1',
            loop: 0,
            delay: 5000,
            duration: 1750,
            onUpdate: (t) => {
                this.setAlpha(t.getValue());
            },
            onComplete: () => {
                eventsCenter.emit('DESTROY_UNLOCK_BANNER');
            }
        });
        this.update();
    }
}