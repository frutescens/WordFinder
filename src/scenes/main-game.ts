import { Scene } from "phaser";
import { PlayerProgress } from "../types/player-data";
import { Definition, JSONEntry, WordData } from "../types/word-data";
import { uppercaseList } from "../utils";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import { UNLOCKS_FOUND_LABEL, WORDS_FOUND_LABEL } from "../ui/labels";
import { WordTextBox } from "../ui/word-text-box";
import WordDict from "../word_list.json" assert {type: 'json'};
import eventsCenter from "../events-center";
import { NUMBER_OF_UPGRADES } from "../enums/upgrade-categories";

export type MainGameData = {
  playerProgress: PlayerProgress
}

export class MainGame extends Scene {
  public DICTIONARY_WORDS: string[];
  public DICTIONARY_SIZE: number;
  public PLAYER_PROGRESS: PlayerProgress;
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

  init() {
    this.DICTIONARY_WORDS = Object.keys(WordDict);
    this.DICTIONARY_SIZE = this.DICTIONARY_WORDS.length;
    this.PLAYER_PROGRESS = this.getPlayerProgress();
    eventsCenter.on('PLAYER_DATA_CHANGED', () => {
      this.PLAYER_PROGRESS = this.getPlayerProgress();
    });
  }

  create() {
    this.add.image(0, 0, "background");
    this.scene.launch("UnlockManager", {
      scope: this
    });
    this.createPlayerInput();
    this.createPlayerProgress();
    this.createWordBox();
    this.input.keyboard?.on('keyup-ENTER', () => {
      this.processWord(this.playerInput.text);
    });
  }

  private getPlayerProgress(): PlayerProgress {
    return this.registry.get('playerProgress') as PlayerProgress;
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
    const dictionaryEntry = WordDict[processedInput];
    if (!dictionaryEntry) {
      return;
    } else {
      const processedEntry = this.processDictionaryEntry(dictionaryEntry);
      const isNewWord = !this.PLAYER_PROGRESS.wordsFound.includes(processedInput);
      this.updatePlayerProgress(processedInput);
      this.wordList.push(new WordTextBox(this, 0.5, 0.5, input, processedEntry, isNewWord));
      this.updateDisplay();
    }
  }

  private updatePlayerProgress(input: string): void {
    if (this.PLAYER_PROGRESS.wordsFound.includes(input)) {
      return;
    }
    eventsCenter.emit('ADD_NEW_WORD', input);
    eventsCenter.emit('CHECK_FOR_UNLOCKS', this.PLAYER_PROGRESS);
  }

  private updateDisplay() {
    const textObjects = this.progressZone.getAll(
      "visible",
      true
    ) as Phaser.GameObjects.Text[];
    const wordsFoundCount =
      this.PLAYER_PROGRESS.wordsFound.length.toString() +
      "/" +
      this.DICTIONARY_SIZE.toString();
    textObjects[0].setText(WORDS_FOUND_LABEL + "\n" + wordsFoundCount);
    const upgradesCount = (this.PLAYER_PROGRESS.inputUpgrades.length + this.PLAYER_PROGRESS.otherUpgrades.length).toString() + "/" + NUMBER_OF_UPGRADES.toString();
    textObjects[1].setText(UNLOCKS_FOUND_LABEL + "\n" + upgradesCount);
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

  private processDictionaryEntry(dictionaryEntry: JSONEntry) {
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
