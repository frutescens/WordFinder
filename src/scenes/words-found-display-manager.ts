import eventsCenter from "../events-center";
import { WordDisplay } from "../ui/word-display";
import { MainGame } from "./main-game";

export class WordsFoundDisplayManager extends Phaser.Scene {
    private scope: MainGame;
    private wordsToDisplay: string[];
    private wordsDisplayed: WordDisplay[];
    private isReady: boolean;

    constructor() {
        super({key: 'WordsFoundDisplay'});
    }

    init(data) {
        this.scope = data.scope;
        this.wordsToDisplay = data.wordsToDisplay ?? [];
        this.wordsDisplayed = [];
    }

    create() {
        this.wordsToDisplay.forEach(w => {
            const word = new WordDisplay(this.scope, 0, 0, w, {});
            this.scope.add.existing(word);
            this.wordsDisplayed.push(word);
        });
        eventsCenter.addListener('DESTROY_WORD', (word: WordDisplay) => {
            word.destroy();
        });
        this.isReady = true;
    }

    update() {
        if (this.isReady) {
            eventsCenter.emit('WORDS_FOUND_DISPLAYED');
        }
    }
}