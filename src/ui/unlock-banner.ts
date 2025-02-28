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
        const bannerText = new Phaser.GameObjects.Text(this.scene, 0, 0, this.getUnlockText(this.unlock), { fontSize: 20, wordWrap: { width: 200 }});
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

    private getUnlockText(upgrade: InputUpgrades): string {
        switch (upgrade) {
            case InputUpgrades.ALPHABET_SOUP:
                return "Alphabet Soup! Adds a random bonus word after an input.";
            case InputUpgrades.ALPHABET_CITY:
                return "Alphabet City! Adds a bonus word for each letter in an input!";
            case InputUpgrades.FOUR_LETTERS:
                return "Adds a randomly selected four letter word with every input!";
            case InputUpgrades.FIVE_LETTERS:
                return "This isn't Wordle!";
            case InputUpgrades.SIX_LETTERS:
                return "Adds a randonly selected six letter word with every input!";
            case InputUpgrades.SEVEN_LETTERS:
                return "Lucky 7! Adds a randomly selected seven-letter word to bomus words!";
            case InputUpgrades.SYNONYMS:
                return "Adds an input word's synonyms to bonus words!";
            case InputUpgrades.ANTONYMS:
                return "Adds an input word's antonyms to bonus words!";
            case InputUpgrades.CAT:
                return "Meow Meow Meow Meow Meow";
            case InputUpgrades.TEST:
            default:
                return "New Unlock!";
        }
    }
}