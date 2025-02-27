import { Scene } from "phaser";
import { PlayerProgress } from "../types/player-data";
import { Definition, JSONEntry, WordData } from "../types/word-data";
import { uppercaseList } from "../utils";
import { WordTextBox } from "../ui/word-text-box";
import WordDict from "../word_list.json" assert {type: 'json'};
import eventsCenter from "../events-center";

export type MainGameData = {
  playerProgress: PlayerProgress
}

export type BasicChildData = {
  scope: MainGame
}

export class MainGame extends Scene {
  public DICTIONARY_WORDS: string[];
  public DICTIONARY_SIZE: number;
  public PLAYER_PROGRESS: PlayerProgress;
  private newWordBus: string[];
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
    this.newWordBus = [];
    eventsCenter.on('PLAYER_DATA_CHANGED', () => {
      this.setPlayerProgress();
    });
    eventsCenter.on('NEW_INPUT_RECEIVED', (playerInput: string) => {
      this.newWordBus.push(playerInput);
      eventsCenter.emit('APPLY_STREAK', this.newWordBus);
      eventsCenter.emit('APPLY_UPGRADES', this.newWordBus);
      eventsCenter.emit('STORE_ADDITIONAL_WORDS', this.newWordBus);
    });
    eventsCenter.on('STORE_ADDITIONAL_WORDS', (addedWords: string[]) => {
      this.newWordBus = ([] as string[]).concat(addedWords);
      this.updatePlayerProgress();
    });
  }

  create() {
    this.add.image(0, 0, "background");
    this.scene.launch("UnlockManager", {
      scope: this
    });
    this.scene.launch('ProgressDisplay', {
      scope: this
    });
    this.scene.launch('InputManager', {
      scope: this
    });
    this.createWordBox();
    this.setPlayerProgress();
  }

  private setPlayerProgress(): void {
    this.PLAYER_PROGRESS = this.registry.get('playerProgress') as PlayerProgress;
    eventsCenter.emit('UPDATE_PROGRESS_DISPLAY', this.PLAYER_PROGRESS);
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

  private updatePlayerProgress(): void {
    eventsCenter.emit('ADD_NEW_WORDS', this.newWordBus);
    eventsCenter.emit('CHECK_FOR_UNLOCKS', this.PLAYER_PROGRESS);
    this.newWordBus = [];
  }

  private updateDisplay() {
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
