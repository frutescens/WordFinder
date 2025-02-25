import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { WordData } from "../types/word-data";

export class WordTextBox extends Phaser.GameObjects.Container {
    public textObject: BBCodeText;
    private word: string;
    private wordData: WordData;
    private isNew: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, word: string, data: WordData, isNewWord: boolean) {
        super(scene, x, y);
        this.word = word;
        this.wordData = data;
        this.isNew = isNewWord;
    }

    processText(): void {
        if (!this.textObject) {
            this.textObject = new BBCodeText(this.scene, 0, 0, '', { fontSize: 20, backgroundColor: '#f423ff', fixedWidth: 760, wrap: {mode: 'word', width: 680}, padding: {top: 8, left: 5}});
        }
        const headerLine = '[b][size=25]'+ this.word+'[/b][/size]\n';
        const definitions: string[] = [];
        this.wordData.definitions.forEach(element => {
            const def = '[i]- '+element.partOfSpeech+"[/i], "+element.meaning+'\n';
            definitions.push(def);
        });
        this.textObject.text = headerLine + definitions.join('');
        if (this.isNew) {
            this.textObject.setColor('GREEN');
        }
        this.add(this.textObject);
    }


}