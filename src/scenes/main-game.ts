import { Scene } from "phaser";
import { Unlocks } from "../enums/unlocks";
import { PlayerProgress } from "../types/player-data";

export class MainGame extends Scene {
    public DICTIONARY;
    public DICTIONARY_SIZE: number;
    public WORDS_FOUND: string[];
    public UNLOCKS: Unlocks[];
    private inputKey: Phaser.Input.Keyboard.Key;
    private playerInput: Phaser.GameObjects.Text;

    constructor() {
        super({key: 'MainGame'});
    }

    init(data: any) {
        this.DICTIONARY = data.dictionary;
        this.DICTIONARY_SIZE = Object.keys(this.DICTIONARY).length;
        this.WORDS_FOUND = data.wordsFound;
        this.UNLOCKS = data.unlocks;
        this.inputKey = this.input.keyboard!.addKey('ENTER')!;
    }

    create() {
        this.scene.sendToBack('UnlockManager');
        this.scene.resume('UnlockManager', { wordsFound: this.WORDS_FOUND, unlocks: this.UNLOCKS });
        this.playerInput = this.add.text(300, 400, 'Input a Word!', { fontSize: 40 });
        this.playerInput.setOrigin(0.5, 0.5);
        this.playerInput.setSize(500, 50);
        this.playerInput.setInteractive().on('pointerdown', () => {
            this.rexUI.edit(this.playerInput);
        })
    }

    update() {
        this.events.once('ENTER', () => {
            this.processWord(this.playerInput.text);
            console.log(this.playerInput.text);
            this.events.off('ENTER');
        })
        if (this.inputKey.isDown) {
            this.events.emit('ENTER');
        }
    }

    private processWord(input: string): void {
        const processedInput = encodeURIComponent(input.toUpperCase());
        const dictionaryEntry = this.DICTIONARY[processedInput];
        if (!dictionaryEntry) {
            this.playerInput.setColor('RED');
            return;
        }
        else {
            if (!this.updateSaveData(processedInput)) {
                this.playerInput.setColor('RED');
                return;
            } else {
                console.log(dictionaryEntry);
            }
        }
    }

    private updateSaveData(input: string): boolean {
        if (this.WORDS_FOUND.includes(input)) {
            return false;
        }
        this.WORDS_FOUND.push(input);
        const newPlayerProgress: PlayerProgress = {
            wordsFound: this.WORDS_FOUND,
            unlocks: this.UNLOCKS
        }
        localStorage.setItem('playerProgress', JSON.stringify(newPlayerProgress));
        return true;
    }
}