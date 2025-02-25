import { Scene } from "phaser";
import { Unlocks } from "../enums/unlocks";
import { PlayerProgress } from "../types/player-data";
import { Definition, WordData } from "../types/word-data";
import { uppercaseList } from "../utils";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import { UNLOCKS_FOUND_LABEL, WORDS_FOUND_LABEL } from "../ui/labels";
import { WordTextBox } from "../ui/text-container";

export class MainGame extends Scene {
  public DICTIONARY;
  public DICTIONARY_SIZE: number;
  public WORDS_FOUND: string[];
  public UNLOCKS: Unlocks[];
  private inputKey: Phaser.Input.Keyboard.Key;
  private playerInput: Phaser.GameObjects.Text;
  private editor: TextEdit;
  private progressZone: Phaser.GameObjects.Container;
  private wordBox: Phaser.GameObjects.Container;
  private wordList: WordTextBox[];

  constructor() {
    super({ key: "MainGame" });
  }

  preload() {
    this.load.image("background", "./assets/background.png");
  }

  init(data: any) {
    this.DICTIONARY = data.dictionary;
    this.DICTIONARY_SIZE = Object.keys(this.DICTIONARY).length;
    this.WORDS_FOUND = data.wordsFound;
    this.UNLOCKS = data.unlocks;
    this.inputKey = this.input.keyboard!.addKey("ENTER")!;
  }

  create() {
    this.add.image(0, 0, "background");
    this.scene.sendToBack("UnlockManager");
    this.scene.launch("UnlockManager", {
      wordsFound: this.WORDS_FOUND,
      unlocks: this.UNLOCKS,
    });
    this.createPlayerInput();
    this.createPlayerProgress();
    this.createWordBox();
    this.input.keyboard?.on('keyup-ENTER', () => {
      this.processWord(this.playerInput.text);
    });
  }

  private createPlayerInput(): void {
    const inputZone = this.add.container(0, 0);
    const textHeader = this.add.text(10, 15, "Input a Word!");
    textHeader.setFontSize(50);
    this.playerInput = this.add.text(10, 80, "");
    this.playerInput.setInteractive().on("pointerdown", () => {
      this.editor = this.rexUI.edit(this.playerInput);
      this.editor.inputText.selectAll();
    });
    this.playerInput.setFixedSize(430, 60);
    this.playerInput.setFontSize(50);
    this.playerInput.setBackgroundColor("RED");
    inputZone.add(textHeader);
    inputZone.add(this.playerInput);
  }

  private createPlayerProgress(): void {
    this.progressZone = this.add.container(0, 0);
    this.progressZone.setPosition(0, 850);
    this.progressZone.add(
      this.add.text(10, 0.5, WORDS_FOUND_LABEL, { fontSize: 50 })
    );
    this.progressZone.add(
      this.add.text(10, 105, UNLOCKS_FOUND_LABEL, { fontSize: 50 })
    );
    this.updateDisplay();
  }

  private createWordBox(): void {
    this.wordBox = this.add.container(0, 0);
    this.wordBox.setPosition(800, 10);
    this.wordBox.add(
      new Phaser.GameObjects.Rectangle(this, 155.5, 525, 800, 950, 0xff83ff)
    );
    this.wordList = [];
    this.wordList.forEach((element) => {
      this.wordBox.add(element);
    });
  }

  private processWord(input: string): void {
    const processedInput = encodeURIComponent(input.toUpperCase());
    const dictionaryEntry = this.DICTIONARY[processedInput];
    if (!dictionaryEntry) {
      this.playerInput.setColor("RED");
      return;
    } else {
      const processedEntry = this.processDictionaryEntry(dictionaryEntry);
      this.updateSaveData(processedInput);
      this.wordList.push(new WordTextBox(this, 0.5, 0.5, input, processedEntry));
      this.updateDisplay();
    }
  }

  private updateSaveData(input: string): boolean {
    if (this.WORDS_FOUND.includes(input)) {
      return false;
    }
    this.WORDS_FOUND.push(input);
    const newPlayerProgress: PlayerProgress = {
      wordsFound: this.WORDS_FOUND,
      unlocks: this.UNLOCKS,
    };
    localStorage.setItem("playerProgress", JSON.stringify(newPlayerProgress));
    return true;
  }

  private updateDisplay() {
    const textObjects = this.progressZone.getAll(
      "visible",
      true
    ) as Phaser.GameObjects.Text[];
    const wordsFoundCount =
      this.WORDS_FOUND.length.toString() +
      "/" +
      this.DICTIONARY_SIZE.toString();
    textObjects[0].setText(WORDS_FOUND_LABEL + "\n" + wordsFoundCount);
    textObjects[1].setText(UNLOCKS_FOUND_LABEL);
    let prevHeight = 0;
    if (this.wordList) {
      this.wordList.forEach((x, i) => {
        x.processText();
        x.setPosition(-225, 65 + prevHeight + 5);
        prevHeight = x.height;
        this.wordBox.add(x);
      });
    }
  }

  private processDictionaryEntry(dictionaryEntry) {
    const newEntry: WordData = {
      definitions: [],
      synonynms: [],
      antonyms: [],
    };
    newEntry.synonynms = uppercaseList(dictionaryEntry.SYNONYMS as string[]);
    newEntry.antonyms = uppercaseList(dictionaryEntry.ANTONYMS as string[]);
    dictionaryEntry.MEANINGS.forEach((element) => {
      const newMeaning: Definition = {
        partOfSpeech: element[0],
        meaning: element[1],
        categories: element[2],
        examples: element[3],
      };
      newEntry.definitions.push(newMeaning);
    });
    return newEntry;
  }
}
