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
  private childSceneData: BasicChildData;

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
      eventsCenter.emit('ADD_TO_BUS', playerInput);
      eventsCenter.emit('UPDATE_STREAK_TRACKER', playerInput[0]);
      eventsCenter.emit('APPLY_UPGRADES', this.newWordBus);
      eventsCenter.emit('UPDATE_PLAYER_PROGRESS');
    });
    eventsCenter.on('ADD_TO_BUS', (words: string | string[]) => {
      if (!Array.isArray(words)) {
        words = [words];
      };
      words.forEach(w => {
        if (!this.newWordBus.includes(w)) {
          this.newWordBus.push(w);
        }
      });
    });
    eventsCenter.on('UPDATE_PLAYER_PROGRESS', () => {
      this.updatePlayerProgress();
    });
    this.childSceneData = { scope: this };
  }

  create() {
    this.add.image(0, 0, "background");
    this.scene.launch("UnlockManager", this.childSceneData);
    this.scene.launch('ProgressDisplay',this.childSceneData);
    this.scene.launch('InputManager', this.childSceneData);
    this.scene.launch('StreakTracker', this.childSceneData);
    this.setPlayerProgress();
  }

  private setPlayerProgress(): void {
    this.PLAYER_PROGRESS = this.registry.get('playerProgress') as PlayerProgress;
    eventsCenter.emit('UPDATE_PROGRESS_DISPLAY', this.PLAYER_PROGRESS);
  }

  private updatePlayerProgress(): void {
    eventsCenter.emit('ADD_NEW_WORDS', this.newWordBus);
    eventsCenter.emit('CHECK_FOR_UNLOCKS', this.PLAYER_PROGRESS);
    //this.scene.launch('WordDisplay', this.childSceneData);
    this.newWordBus = [];
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
