import { Scene } from "phaser";
import { PlayerProgress } from "../types/player-data";
import eventsCenter from "../events-center";

export type MainGameData = {
  playerProgress: PlayerProgress
}

export type BasicChildData = {
  scope: MainGame
}

export class MainGame extends Scene {
  public PLAYER_PROGRESS: PlayerProgress;
  private newWordBus: string[];
  private childSceneData: BasicChildData;

  constructor() {
    super({ key: "MainGame" });
  }

  preload() {
    this.load.image("background", "./assets/background.png");
  }

  init() {
    this.newWordBus = [];
    eventsCenter.on('PLAYER_DATA_CHANGED', () => {
      this.setPlayerProgress();
    });
    eventsCenter.on('NEW_INPUT_RECEIVED', (playerInput: string) => {
      console.log(this.newWordBus);
      eventsCenter.emit('ADD_TO_BUS', playerInput);
      eventsCenter.emit('UPDATE_STREAK_TRACKER', playerInput[0]);
      eventsCenter.emit('APPLY_UPGRADES', playerInput[0]);
      eventsCenter.emit('UPDATE_PLAYER_PROGRESS');
      eventsCenter.emit('SHOW_NEW_WORDS');
    });
    eventsCenter.on('ADD_TO_BUS', (words: string | string[]) => {
      if (!Array.isArray(words)) {
        words = [words];
      };
      words.forEach(w => {
        if (!this.newWordBus.includes(w) && !this.PLAYER_PROGRESS.wordsFound.includes(w)) {
          this.newWordBus.push(w);
        }
      });
    });
    eventsCenter.on('SHOW_NEW_WORDS', () => {
      this.scene.sleep('InputManager');
      this.scene.launch('WordsFoundDisplay', {scope: this, wordsToDisplay: this.newWordBus});
    });
    eventsCenter.on('WORDS_FOUND_DISPLAYED', () => {
      this.scene.wake('InputManager');
      this.scene.stop('WordsFoundDisplayManager');
      this.newWordBus = [];
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
    this.scene.launch('UpgradeManager', this.childSceneData);
    this.setPlayerProgress();
  }

  private setPlayerProgress(): void {
    this.PLAYER_PROGRESS = this.registry.get('playerProgress') as PlayerProgress;
    eventsCenter.emit('UPDATE_PROGRESS_DISPLAY', this.PLAYER_PROGRESS);
  }

  private updatePlayerProgress(): void {
    eventsCenter.emit('ADD_NEW_WORDS', this.newWordBus);
    eventsCenter.emit('CHECK_FOR_UNLOCKS', this.PLAYER_PROGRESS);
  }
}
