import { Scene } from "phaser";
import { InputUpgrades } from "../enums/input-upgrades";
import { BasicChildData, MainGame } from "./main-game";
import eventsCenter from "../events-center";
import { UnlockBanner } from "../ui/unlock-banner";
import { ALL_INPUT_UPGRADES } from "../enums/input-upgrades";
import { PlayerProgress } from "../types/player-data";
import { INPUT_UPGRADES_CONDITIONS, UnlockConditionFunc } from "../upgrades/unlock-conditions";

export type UnlockManagerData = {
  scope: MainGame;
};

export class UnlockManager extends Scene {
  private scope: MainGame; 
  private bannerContainer: UnlockBanner;

  constructor() {
    super({ key: "UnlockManager" });
  }

  init(data: BasicChildData) {
    this.scope = data.scope;
  }

  create() {
    eventsCenter.on("CHECK_FOR_UNLOCKS", (currentPlayerProgress: PlayerProgress) => {
      ALL_INPUT_UPGRADES.filter(
        (x) => !currentPlayerProgress.inputUpgrades.includes(x)
      ).forEach((upgrade) => {
        const unlockCondition = INPUT_UPGRADES_CONDITIONS[
          upgrade
        ] as UnlockConditionFunc;
        if (unlockCondition(currentPlayerProgress.wordsFound)) {
          eventsCenter.emit("UNLOCK_UPGRADE", upgrade);
          this.events.emit('SHOW_UNLOCK_BANNER', upgrade);
        }
      });
    });
    this.events.on(
      "SHOW_UNLOCK_BANNER",
      (upgrade: InputUpgrades) => {
        this.bannerContainer = new UnlockBanner(
          this.scope,
          0,
          0,
          upgrade
        );
        this.scope.add.existing(this.bannerContainer);
      },
      this
    );
    eventsCenter.on("DESTROY_EVENT_BANNER", () => {
      if (this.bannerContainer) {
        this.bannerContainer.destroy();
      }
    });
  }
}
