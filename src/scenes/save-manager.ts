import { Scene } from "phaser";
import { PlayerProgress } from "../types/player-data";
import { Fonts } from "../enums/fonts";
import { InputUpgrades } from "../enums/input-upgrades";
import { OtherUpgrades } from "../enums/other-upgrades";
import eventsCenter from "../events-center";
import { UpgradeCategories } from "../enums/upgrade-categories";

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
    eventsCenter.addListener('UNLOCK_UPGRADE', (upgrade: InputUpgrades | OtherUpgrades, upgradeCategory: UpgradeCategories) => {
      const upgradeKey = upgradeCategory === UpgradeCategories.INPUT ? 'inputUpgrades' : 'otherUpgrades';
      const upgradeProgress = this.dataManager.getItem(upgradeKey, 'playerProgress');
      upgradeProgress.push(upgrade);
      this.dataManager.setItem(upgradeKey, 'playerProgress', upgradeProgress);
      this.loadPlayerProgress(true);
    });
    eventsCenter.addListener('ADD_NEW_WORDS', (words: string[]) => {
      console.log(words);
      const wordsFound = this.dataManager.getItem('wordsFound', 'playerProgress').concat(...words); 
      this.dataManager.setItem('wordsFound', 'playerProgress', wordsFound);
      this.loadPlayerProgress(true);
    });
  }

  update() {
    this.loadPlayerProgress();
  }

  loadPlayerProgress(hasChange: boolean = false): void {
    this.registry.set('playerProgress', { 
      wordsFound: this.dataManager.getItem('wordsFound', 'playerProgress') ?? [] as string[],
      inputUpgrades: this.dataManager.getItem('inputUpgrades', 'playerProgress') ?? [] as InputUpgrades[],
      otherUpgrades: this.dataManager.getItem('otherUpgrades', 'playerProgress') ?? [] as OtherUpgrades[]
    } as PlayerProgress);
    if (hasChange) {
      eventsCenter.emit('PLAYER_DATA_CHANGED');
    }
  }
}
