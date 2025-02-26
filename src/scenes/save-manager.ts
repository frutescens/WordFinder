import { Scene } from "phaser";
import { PlayerProgress } from "../types/player-data";
import { Fonts } from "../enums/fonts";
import { InputUpgrades } from "../enums/input-upgrades";
import { OtherUpgrades } from "../enums/other-upgrades";
import eventsCenter from "../events-center";

export class SaveManager extends Scene {

  constructor() {
    super({ key: "SaveManager" });
  }

  preload(): void {
    this.dataManager.add({
      name: "playerProgress",
      load: true,
      default: {
        wordsFound: [] as string[],
        inputUpgrades: [] as InputUpgrades[],
        otherUpgrades: [] as OtherUpgrades[],
      },
      parent: this,
    });
    this.dataManager.add({
      name: "playerData",
      load: true,
      default: {
        playerId: Math.floor(Math.random() * 10000),
        startTime: this.game.getTime(),
        font: Fonts.DEFAULT,
      },
      parent: this,
    });
  }

  create(): void {
    eventsCenter.addListener(
      "UPDATE_PLAYER_PROGRESS",
      (playerProgress: PlayerProgress) => {
        this.dataManager.setItem('wordsFound', 'playerProgress', playerProgress.wordsFound);
        this.dataManager.setItem('inputUpgrades', 'playerProgress', playerProgress.inputUpgrades);
        this.dataManager.setItem('otherUpgrades', 'playerProgress', playerProgress.otherUpgrades);
        this.loadPlayerProgress();
      }
    );
  }

  update() {
    this.loadPlayerProgress();
  }

  loadPlayerProgress(): void {
    this.registry.set('playerProgress', { 
      wordsFound: this.dataManager.getItem('wordsFound', 'playerProgress') ?? [] as string[],
      inputUpgrades: this.dataManager.getItem('inputUpgrades', 'playerProgress') ?? [] as InputUpgrades[],
      otherUpgrades: this.dataManager.getItem('otherUpgrades', 'playerProgress') ?? [] as OtherUpgrades[]
    } as PlayerProgress);
  }
}
