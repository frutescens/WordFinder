import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { WordData } from "../types/word-data";
import { getWordsFound } from "../utils";


export class WordTextBox extends Phaser.GameObjects.Container {
    public word: string;
    public wordData: WordData;
    public scene: Phaser.Scene;
    public textObject: BBCodeText;

    constructor(scene: Phaser.Scene, x: number, y: number, word: string, data: WordData) {
        super(scene, x, y);
        this.word = word;
        this.wordData = data;
        this.scene = scene;
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
        if (this.wordData.synonynms.length > 0) {
            const synonynms = '\n\n[b]synonyms:[/b] '+ this.wordData.synonynms.join();
            this.textObject.text = this.textObject.text + synonynms;
        }
        if (this.wordData.antonyms.length > 0) {
            const antonyms = '\n[b]antonyms:[/b] '+this.wordData.antonyms.join();
            this.textObject.text = this.textObject.text + antonyms;
        }
        console.log(this.wordData);
        this.add(this.textObject);
    }


}