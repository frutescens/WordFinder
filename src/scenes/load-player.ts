import { Scene } from "phaser";
import { PlayerData, PlayerProgress } from "../types/player-data";
import { Fonts } from "../enums/fonts";
import { Unlocks } from "../enums/unlocks";
import { BaseScene } from "./base-scene";

export class LoadPlayer extends Scene {
  constructor() {
    super({ key: "LoadPlayer" });
  }

  create() {
    if (!localStorage.getItem("playerData")) {
      const playerId = Math.floor(Math.random() * 10000);
      const playerData: PlayerData = {
        playerId: playerId,
        startTime: this.game.getTime(),
        font: Fonts.DEFAULT,
      };
      localStorage.setItem("playerData", JSON.stringify(playerData));
      console.log('Player Data created');
    }
    if (!localStorage.getItem("playerProgress")) {
      const playerProgress: PlayerProgress = {
        wordsFound: [] as string[],
        unlocks: [] as Unlocks[],
      };
      localStorage.setItem("playerProgress", JSON.stringify(playerProgress));
      console.log('Player Progress created.');
    }
  }

  update() {
    this.events.addListener('Player Loaded', () => {
        const baseScene = this.scene.get('BaseScene') as BaseScene;
        const playerProgress: PlayerProgress = JSON.parse(localStorage.getItem('playerProgress')!);
        baseScene.WORDS_FOUND = playerProgress.wordsFound;
        baseScene.UNLOCKS = playerProgress.unlocks;
        console.log('hello');
        baseScene.update();
        this.scene.resume('BaseScene');
    });

    if (localStorage.getItem('playerData') && localStorage.getItem('playerProgress')) {
        this.events.emit('Player Loaded');
    }
  }
}
