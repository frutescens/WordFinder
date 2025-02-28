export class WordsFoundDisplayManager extends Phaser.Scene {
    private scope: Phaser.Scene;
    private wordsToDisplay: string[];

    constructor() {
        super({key: 'WordsFoundDisplay'});
    }

    init(data) {
        this.scope = data.scope;
        this.wordsToDisplay = data.wordsToDisplay;
    }

    create() {
        this.wordsToDisplay.forEach(w => {

        });
    }

    stop() {
        
    }
}